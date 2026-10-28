import { createHash } from "node:crypto";
import { Router, type IRouter } from "express";
import { and, count, eq, gt } from "drizzle-orm";
import { db, demoRequestsTable } from "@workspace/db";
import {
  SubmitContactRequestBody,
  SubmitContactRequestResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const recipient = process.env.Q4C_CONTACT_EMAIL ?? "oussamakarma099@gmail.com";
// Resend only accepts senders on a verified domain; onboarding@resend.dev
// works for tests but can only deliver to the Resend account owner.
const sender = process.env.RESEND_FROM ?? "Q4C Systèmes <onboarding@resend.dev>";
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;

const interestLabels: Record<string, string> = {
  comptabilite: "Automatisation comptable",
  finance: "Pilotage financier",
  audit: "Audit & contrôle",
  autre: "Autre / plusieurs domaines",
};

function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

// Resend explains a refusal in the response body (unverified sender domain,
// recipient not allowed in test mode, invalid key...): keep it for the logs.
type EmailResult = { ok: true } | { ok: false; reason: string };

async function sendNotificationEmail(
  replyTo: string,
  text: string,
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY is not set" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: replyTo,
      subject: "Q4C Systèmes - demande de démonstration",
      text,
    }),
  });

  if (response.ok) return { ok: true };
  const detail = await response.text().catch(() => "");
  return { ok: false, reason: `Resend HTTP ${response.status}: ${detail.slice(0, 300)}` };
}

router.post("/contact/demo", async (req, res): Promise<void> => {
  const parsed = SubmitContactRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Veuillez vérifier les informations saisies." });
    return;
  }

  const request = parsed.data;

  // Quietly accept the submission without sending when the hidden anti-spam
  // field is populated.
  if (request.website?.trim()) {
    res.status(202).json(SubmitContactRequestResponse.parse({ success: true }));
    return;
  }

  const ipHash = hashIp(req.ip || "unknown");

  // The limit is shared by every serverless instance through the database.
  // If the database is unreachable we still try to deliver the email.
  try {
    const since = new Date(Date.now() - RATE_WINDOW_MS);
    const [{ recent }] = await db
      .select({ recent: count() })
      .from(demoRequestsTable)
      .where(
        and(
          eq(demoRequestsTable.ipHash, ipHash),
          gt(demoRequestsTable.createdAt, since),
        ),
      );

    if (recent >= RATE_LIMIT) {
      res.status(429).json({ error: "Trop de demandes ont été envoyées. Réessayez plus tard." });
      return;
    }
  } catch (error) {
    req.log.error(
      { errorType: error instanceof Error ? error.name : "UnknownError" },
      "Could not check the Q4C contact rate limit",
    );
  }

  const name = request.name.trim();
  const email = request.email.trim();
  const organization = request.organization.trim();
  const message = request.message?.trim() || null;
  const interest = request.interest ?? null;

  let savedId: number | null = null;
  try {
    const [saved] = await db
      .insert(demoRequestsTable)
      .values({ name, email, organization, interest, message, ipHash })
      .returning({ id: demoRequestsTable.id });
    savedId = saved.id;
  } catch (error) {
    req.log.error(
      { errorType: error instanceof Error ? error.name : "UnknownError" },
      "Could not store a Q4C contact request",
    );
  }

  const body = [
    "Nouvelle demande de démonstration reçue depuis le site Q4C Systèmes.",
    "",
    `Nom et prénom : ${name}`,
    `E-mail : ${email}`,
    `Cabinet ou entreprise : ${organization}`,
    `Domaine : ${interest ? interestLabels[interest] ?? interest : "Non précisé"}`,
    "",
    "Besoin / contexte :",
    message ?? "Non précisé",
  ].join("\n");

  let emailSent = false;
  try {
    const result = await sendNotificationEmail(email, body);
    emailSent = result.ok;
    if (!result.ok) {
      req.log.error(
        { reason: result.reason, from: sender, to: recipient },
        "No notification email was sent for a Q4C contact request",
      );
    }
  } catch (error) {
    req.log.error(
      { errorType: error instanceof Error ? error.name : "UnknownError" },
      "Could not send a Q4C contact request through Resend",
    );
  }

  if (savedId !== null && emailSent) {
    await db
      .update(demoRequestsTable)
      .set({ emailSent: true })
      .where(eq(demoRequestsTable.id, savedId))
      .catch(() => undefined);
  }

  if (savedId === null && !emailSent) {
    res.status(502).json({
      error: "L’envoi a échoué. Veuillez réessayer dans quelques instants.",
    });
    return;
  }

  res.status(202).json(SubmitContactRequestResponse.parse({ success: true }));
});

export default router;

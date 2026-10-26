import { Router, type IRouter } from "express";
import { ReplitConnectors } from "@replit/connectors-sdk";
import {
  SubmitContactRequestBody,
  SubmitContactRequestResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();
const connectors = new ReplitConnectors();
const recipient = process.env.Q4C_CONTACT_EMAIL ?? "oussamakarma099@gmail.com";
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT = 5;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function takeRateLimitSlot(clientIp: string, now: number): boolean {
  const current = requestCounts.get(clientIp);

  if (!current || current.resetAt <= now) {
    requestCounts.set(clientIp, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT) return false;

  current.count += 1;
  return true;
}

function encodeMimeMessage(message: string): string {
  return Buffer.from(message, "utf8").toString("base64url");
}

function encodeMimeBody(body: string): string {
  const encoded = Buffer.from(body, "utf8").toString("base64");
  return encoded.match(/.{1,76}/g)?.join("\r\n") ?? "";
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

  const now = Date.now();
  if (requestCounts.size > 1000) {
    for (const [ip, entry] of requestCounts) {
      if (entry.resetAt <= now) requestCounts.delete(ip);
    }
  }

  if (!takeRateLimitSlot(req.ip || "unknown", now)) {
    res.status(429).json({ error: "Trop de demandes ont été envoyées. Réessayez plus tard." });
    return;
  }

  const interestLabels: Record<string, string> = {
    "Lexpia-Pro": "Lexpia-Pro",
    HisabPro: "HisabPro",
    Mizane: "Mizane",
    ecosysteme: "Écosystème Q4C",
  };
  const interest = request.interest
    ? interestLabels[request.interest] ?? request.interest
    : "Non précisée";
  const body = [
    "Nouvelle demande de démonstration reçue depuis le site Q4C Systèmes.",
    "",
    `Nom et prénom : ${request.name.trim()}`,
    `E-mail : ${request.email.trim()}`,
    `Cabinet ou entreprise : ${request.organization.trim()}`,
    `Solution : ${interest}`,
    "",
    "Besoin / contexte :",
    request.message?.trim() || "Non précisé",
  ].join("\r\n");
  const rawMessage = [
    `To: ${recipient}`,
    `Reply-To: ${request.email.trim()}`,
    "Subject: Q4C Systemes - demande de demonstration",
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeMimeBody(body),
  ].join("\r\n");

  try {
    const response = await connectors.proxy(
      "google-mail",
      "/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw: encodeMimeMessage(rawMessage) }),
      },
    );

    if (!response.ok) {
      req.log.error(
        { statusCode: response.status },
        "Gmail rejected a Q4C contact request",
      );
      res.status(502).json({
        error: "L’envoi a échoué. Veuillez réessayer dans quelques instants.",
      });
      return;
    }

    res.status(202).json(SubmitContactRequestResponse.parse({ success: true }));
  } catch (error) {
    req.log.error(
      { errorType: error instanceof Error ? error.name : "UnknownError" },
      "Could not send a Q4C contact request through Gmail",
    );
    res.status(502).json({
      error: "L’envoi a échoué. Veuillez réessayer dans quelques instants.",
    });
  }
});

export default router;

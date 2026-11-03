// Q4C symbol (cubes around "4C"), cleaned from public/screenshots/logo_q4c.png.
// `light` is the version for dark backgrounds. `size` is the rendered height in px.
export function Q4CMark({ size = 36, light = false, className }: { size?: number; light?: boolean; className?: string }) {
  return (
    <img
      src={light ? '/logo/q4c-symbole-clair.png' : '/logo/q4c-symbole.png'}
      alt=""
      aria-hidden="true"
      height={size}
      width={Math.round((size * 118) / 127)}
      className={className}
      style={{ height: size, width: 'auto' }}
    />
  );
}

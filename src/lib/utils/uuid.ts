/**
 * UUID generation utilities. No dependencies — uses the built-in
 * `crypto.randomUUID()` for v4 and a hand-rolled implementation for v7
 * (RFC 9562) based on `crypto.getRandomValues()`.
 */

/** Generate a UUID v4 (random). */
export function generateUuidV4(): string {
  return crypto.randomUUID();
}

/**
 * Generate a UUID v7 (Unix timestamp + random, monotonically ordered).
 * Format: `unix_ts_ms(48) | ver(4) | rand_a(12) | var(2) | rand_b(62)`
 */
export function generateUuidV7(): string {
  const ms = Date.now();
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);

  // Encode 48-bit millisecond timestamp into bytes 0-5.
  buf[0] = (ms / 0x10000000000) & 0xff;
  buf[1] = (ms / 0x100000000) & 0xff;
  buf[2] = (ms / 0x1000000) & 0xff;
  buf[3] = (ms / 0x10000) & 0xff;
  buf[4] = (ms / 0x100) & 0xff;
  buf[5] = ms & 0xff;

  // Set version nibble = 7 (bits 48-51).
  buf[6] = (buf[6] & 0x0f) | 0x70;

  // Set variant bits = 0b10 (bits 64-65).
  buf[8] = (buf[8] & 0x3f) | 0x80;

  const h = Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Generate `count` UUIDs of the given version. */
export function generateUuids(version: 4 | 7, count: number): string[] {
  const gen = version === 7 ? generateUuidV7 : generateUuidV4;
  return Array.from({ length: count }, gen);
}

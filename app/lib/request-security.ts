import type { NextRequest } from "next/server";

/** Browser writes must originate from this site, not another website. */
export function isCrossOriginWrite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin !== request.nextUrl.origin; }
  catch { return true; }
}

/** Reject oversized/invalid JSON without buffering an unbounded request body. */
export async function readBoundedJson(request: NextRequest, maxBytes: number): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maxBytes) return null;
  if (!request.body) return null;
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) { await reader.cancel(); return null; }
      parts.push(value);
    }
    const buffer = new Uint8Array(bytes);
    let offset = 0;
    for (const part of parts) { buffer.set(part, offset); offset += part.byteLength; }
    const data: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(buffer));
    return data && typeof data === "object" && !Array.isArray(data) ? data as Record<string, unknown> : null;
  } catch { return null; }
  finally { reader.releaseLock(); }
}

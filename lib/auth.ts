// 관리자 비밀번호 게이트.
// 비밀번호 자체는 쿠키에 넣지 않고 SHA-256 해시 토큰만 저장/비교한다.

export const ADMIN_COOKIE = "aiw_admin";
export const ADMIN_MAX_AGE = 60 * 60 * 24 * 30; // 30일

// Web Crypto 기반 (Edge 미들웨어 / Node 런타임 모두 동작)
export async function adminToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`aiw::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedToken(): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD || "";
  return pw ? adminToken(pw) : "";
}

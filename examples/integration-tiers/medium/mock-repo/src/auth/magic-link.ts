/** Mock AUTH-88 — opaque token hashed before Postgres insert */
export async function requestMagicLink(email: string): Promise<{ status: 202 }> {
  void email;
  return { status: 202 };
}

export async function consumeMagicLink(token: string): Promise<{ sessionId: string }> {
  void token;
  return { sessionId: "mock" };
}

import crypto from "crypto";
import { cookies } from "next/headers";

export async function generateCsrfToken() {
  const token = crypto.randomBytes(32).toString("hex");

  (await cookies()).set("csrf_token", token, {
    httpOnly: false,
    sameSite: "strict",
    path: "/",
  });

  return token;
}

export async function validateCsrfToken(requestToken: string) {
  const cookieToken = (await cookies()).get("csrf_token")?.value;

  if (!cookieToken || cookieToken !== requestToken) {
    throw new Error("Invalid CSRF token");
  }
}

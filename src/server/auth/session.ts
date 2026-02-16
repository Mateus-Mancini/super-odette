import { getAccessToken } from "./cookies";

export async function requireSession() {
  const token = getAccessToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  return { accessToken: token };
}

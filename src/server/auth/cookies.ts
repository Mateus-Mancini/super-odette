import { cookies } from "next/headers";

const isProd = process.env.NODE_ENV === "production";

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 15,
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}

export async function getRefreshToken() {
  const cookieStore = await cookies();

  return cookieStore.get("refresh_token")?.value;
}

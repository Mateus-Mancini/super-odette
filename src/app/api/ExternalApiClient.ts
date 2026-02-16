import { env } from "@/server/config/env";
import {
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
} from "@/server/auth/cookies";

export class ExternalApiClient {
  static async request(path: string, options: RequestInit = {}) {
    let accessToken = getAccessToken();

    const response = await fetch(`${env.API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.status !== 401) {
      return response;
    }

    const refreshed = await this.refreshToken();

    if (!refreshed) {
      throw new Error("Unauthorized");
    }

    accessToken = getAccessToken();

    return fetch(`${env.API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
  }

  private static async refreshToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const res = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) return false;

    const data = await res.json();

    setAuthCookies(data.accessToken, data.refreshToken);

    return true;
  }
}

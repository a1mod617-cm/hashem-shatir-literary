import "server-only";
import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../chatgpt-auth";
export async function checkAdmin() {
  const user = await getChatGPTUser();
  const addresses = String((env as unknown as Record<string,string|undefined>).SITE_ADMIN_EMAILS ?? "").split(",").map(e=>e.trim().toLowerCase()).filter(Boolean);
  return { user, isAdmin: Boolean(user && addresses.includes(user.email.toLowerCase())), configured: addresses.length>0 };
}

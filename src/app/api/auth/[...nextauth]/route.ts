import { handlers } from "@/lib/auth/authConfig";

export const { GET, POST } = handlers;
export const runtime = "nodejs"; // Required for cryptography libs used by SIWE/Viem

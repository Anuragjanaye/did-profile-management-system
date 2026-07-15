"use server";

import { env } from "@/config/env";

export async function getContractAddress() {
  return env.server.CONTRACT_ADDRESS as `0x${string}`;
}

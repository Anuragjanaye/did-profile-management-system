import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { env } from "@/config/env";

const projectId = env.client.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "placeholder_project_id";
const rpcUrl = env.client.NEXT_PUBLIC_RPC_URL ?? "https://ethereum-sepolia-rpc.publicnode.com";

/**
 * RainbowKit and Wagmi v2 client configuration.
 * Configured specifically for Ethereum Sepolia (testnet) as per project requirements.
 */
export const config = getDefaultConfig({
  appName: "DID Profile Management System",
  projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
  ssr: true,
});

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useSession, signIn, signOut } from "next-auth/react";
import { SiweMessage } from "siwe";
import { toast } from "sonner";
import { getSiweNonce } from "@/features/auth/actions/authActions";

/**
 * Custom hook to manage SIWE + Auth.js v5 session sync.
 * Reactively signs in when wallet connects, and signs out when wallet disconnects.
 */
export function useAuth() {
  const { address, isConnected, chainId } = useAccount();
  const { data: session, status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Prevent multiple overlapping sign-in triggers for the same address
  const signTriggeredRef = useRef<string | null>(null);

  const handleSignIn = useCallback(async () => {
    if (!address || !chainId || isSigningIn) return;

    // Prevent duplicated sign-in runs on mount/rerenders
    if (signTriggeredRef.current === address) return;
    signTriggeredRef.current = address;

    setIsSigningIn(true);
    const toastId = toast.loading("Verifying wallet ownership...");

    try {
      // 1. Fetch the challenge nonce from the secure HTTP-only cookie store
      const nonce = await getSiweNonce();

      // 2. Build the SIWE message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the DID Profile Management System.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });

      const preparedMessage = message.prepareMessage();

      // 3. Prompt user for signature via crypto wallet
      const signature = await signMessageAsync({
        message: preparedMessage,
      });

      // 4. Authenticate session with Auth.js Credentials Provider
      const result = await signIn("credentials", {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Authenticated successfully", { id: toastId });
    } catch (error: unknown) {
      console.error("SIWE sign-in failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to verify wallet ownership", {
        id: toastId,
      });
      // Reset trigger tracker on failure to allow retry
      signTriggeredRef.current = null;
      disconnect();
    } finally {
      setIsSigningIn(false);
    }
  }, [address, chainId, isSigningIn, signMessageAsync, disconnect]);

  const handleSignOut = useCallback(async () => {
    const toastId = toast.loading("Disconnecting session...");
    try {
      await signOut({ redirect: false });
      disconnect();
      signTriggeredRef.current = null;
      toast.success("Disconnected wallet and session", { id: toastId });
    } catch (error) {
      console.error("Sign-out error:", error);
      toast.error("Failed to disconnect cleanly", { id: toastId });
    }
  }, [disconnect]);

  // Synchronize Wagmi wallet state with Auth.js session
  useEffect(() => {
    const isSessionUserAddress =
      session?.user?.walletAddress?.toLowerCase() === address?.toLowerCase();

    // Trigger SIWE sign-in if wallet is connected but session is unauthenticated/mismatched
    if (isConnected && address && status === "unauthenticated" && !isSigningIn) {
      handleSignIn();
    } else if (isConnected && address && session && !isSessionUserAddress && !isSigningIn) {
      // Wallet switched addresses: force re-authentication
      handleSignIn();
    } else if (!isConnected && status === "authenticated") {
      // Wallet disconnected: kill Auth.js session cookie
      handleSignOut();
    }
  }, [isConnected, address, session, status, isSigningIn, handleSignIn, handleSignOut]);

  return {
    address,
    isConnected,
    session,
    isAuthenticated: status === "authenticated",
    isAuthenticating: status === "loading" || isSigningIn,
    login: handleSignIn,
    logout: handleSignOut,
  };
}

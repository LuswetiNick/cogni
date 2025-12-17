"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { TextShimmerWave } from "@workspace/ui/components/text-shimmer-wave";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
}

export function AuthGuard({ children, loadingMessage }: AuthGuardProps) {
  return (
    <>
      <AuthLoading>
        <div className="flex items-center justify-center min-h-svh">
          <TextShimmerWave duration={1} className="font-medium">
            {loadingMessage || "Loading..."}
          </TextShimmerWave>
        </div>
      </AuthLoading>
      <Authenticated>{children}</Authenticated>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div>
            <p>Please sign in to continue.</p>
            <SignInButton>
              <Button size="sm">Sign in</Button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}

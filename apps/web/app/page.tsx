"use client";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Authenticated,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";

export default function Page() {
  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.addUser);
  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Apps/web</h1>
            <UserButton />
            <Button size="sm" onClick={() => addUser()}>
              Add User
            </Button>
            {JSON.stringify(users, null, 2)}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <SignInButton>
          <Button size="sm">Sign In</Button>
        </SignInButton>
      </Unauthenticated>
    </>
  );
}

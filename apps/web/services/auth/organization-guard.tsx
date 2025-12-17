"use client";
import { CreateOrganization, useOrganization } from "@clerk/nextjs";

export const OrganizationGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { organization } = useOrganization();
  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <CreateOrganization />
      </div>
    );
  }
  return <>{children}</>;
};

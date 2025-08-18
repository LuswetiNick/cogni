'use client';

import { ErrorState } from '@/components/error-state';

const ErrorPage = () => {
  return (
    <ErrorState
      description="An error occurred while loading the agents"
      title="Error"
    />
  );
};
export default ErrorPage;

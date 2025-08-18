'use clietn';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

const GoogleAuthBtn = () => {
  const [loading, startTransition] = useTransition();
  const googleSignIn = () => {
    startTransition(async () => {
      await authClient.signIn.social(
        {
          provider: 'google',
          callbackURL: '/dashboard',
        },
        {
          onSuccess: () => {
            toast.success('Login successful.');
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        }
      );
    });
  };
  return (
    <Button
      className="w-full"
      disabled={loading}
      onClick={googleSignIn}
      variant="outline"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Image alt="Google" height={16} src="/google.svg" width={16} />
          Continue with Google
        </>
      )}
    </Button>
  );
};
export default GoogleAuthBtn;

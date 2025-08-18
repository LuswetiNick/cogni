/** biome-ignore-all lint/suspicious/noImplicitAnyLet: <explanation> */
/** biome-ignore-all lint/suspicious/noEvolvingTypes: <explanation> */
import { bottts, initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage } from './ui/avatar';

interface GenerateAvatarProps {
  seed: string;
  className?: string;
  variant: 'bottts' | 'initials';
}

export const GenerateAvatar = ({
  seed,
  className,
  variant,
}: GenerateAvatarProps) => {
  let avatar;
  if (variant === 'bottts') {
    avatar = createAvatar(bottts, {
      seed,
    });
  } else {
    avatar = createAvatar(initials, {
      seed,
      fontWeight: 500,
      fontSize: 42,
    });
  }
  return (
    <Avatar className={cn(className)}>
      <AvatarImage alt="Avatar" src={avatar.toDataUri()} />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

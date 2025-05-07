import { cn } from '@/lib/utils';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  name: string;
  userId?: string | null;
  className?: string;
  fallbackClassName?: string;
  imageSrc?: string;
}

export const UserAvatar = ({
  name,
  userId,
  className,
  imageSrc,
  fallbackClassName,
}: Props) => {
  const getStringAvatarProps = () => {
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(userId ?? name);
    const color = chroma(baseColor).brighten(1.5).hex();
    const backgroundColor = chroma(baseColor).darken(1.35).hex();

    return {
      style: { color, backgroundColor },
    };
  };

  return (
    <Avatar className={cn(className)} title={name}>
      <AvatarImage src={imageSrc} alt={name} />

      <AvatarFallback
        className={cn('text-lg font-medium', fallbackClassName)}
        {...getStringAvatarProps()}
      >
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

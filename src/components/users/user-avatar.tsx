import { cn } from '@/lib/utils';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  name: string;
  className?: string;
  fallbackClassName?: string;
  imageSrc?: string;
}

export const UserAvatar = ({
  name,
  className,
  imageSrc,
  fallbackClassName,
}: Props) => {
  const getStringAvatarProps = () => {
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(name);
    const color = chroma(baseColor).darken(1.4).hex();
    const backgroundColor = chroma(baseColor).brighten(1.1).hex();

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

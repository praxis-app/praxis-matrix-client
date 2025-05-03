import { cn } from '@/lib/utils';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface Props {
  name: string;
  className?: string;
  imageSrc?: string;
}

export const UserAvatar = ({ name, className, imageSrc }: Props) => {
  const getStringAvatarProps = () => {
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(name);
    const color = chroma(baseColor).darken(1.2).hex();
    const backgroundColor = chroma(baseColor).brighten(1.4).hex();

    return {
      style: { color, backgroundColor },
    };
  };

  return (
    <Avatar className={cn(className)} title={name}>
      <AvatarImage src={imageSrc} alt={name} />

      <AvatarFallback
        className="text-lg font-medium"
        {...getStringAvatarProps()}
      >
        {name[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

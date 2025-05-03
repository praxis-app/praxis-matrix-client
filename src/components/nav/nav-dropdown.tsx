import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { MdExitToApp } from 'react-icons/md';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  trigger: ReactNode;
  displayName: string;
}

export const NavDropdown = ({ trigger, displayName }: Props) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={12}
        className="mr-2.5 flex flex-col gap-2 p-3"
      >
        <DropdownMenuItem className="text-md">
          <UserAvatar
            name={displayName}
            className="size-5"
            fallbackClassName="text-[0.7rem]"
          />
          {displayName}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-md">
          <MdExitToApp className="text-foreground size-5" />
          {t('auth.actions.logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

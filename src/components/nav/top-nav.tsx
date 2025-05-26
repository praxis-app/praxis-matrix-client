import {
  BrowserEvents,
  KeyCodes,
  NavigationPaths,
} from '@/constants/shared.constants';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { NavSheet } from '../nav/nav-sheet';
import { Button } from '../ui/button';

interface Props {
  header?: string;
  onBackClick?: () => void;
  backBtnIcon?: ReactNode;
}

export const TopNav = ({ header, onBackClick, backBtnIcon }: Props) => {
  const [navSheetOpen, setNavSheetOpen] = useState(false);

  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleBackClick = useCallback(() => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    if (!isMobile) {
      navigate(NavigationPaths.Home);
      return;
    }
    // Show nav drawer as default behavior
    setNavSheetOpen(true);
  }, [isMobile, navigate, onBackClick, setNavSheetOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === KeyCodes.Escape) {
        handleBackClick();
      }
    };
    window.addEventListener(BrowserEvents.Keydown, handleKeyDown);
    return () => {
      window.removeEventListener(BrowserEvents.Keydown, handleKeyDown);
    };
  }, [handleBackClick]);

  const renderBackBtn = () => (
    <Button variant="ghost" size="icon" onClick={handleBackClick}>
      {backBtnIcon || <LuArrowLeft className="size-6" />}
    </Button>
  );

  return (
    <header className="bg-card flex h-[55px] items-center justify-between border-b border-[--color-border] px-2">
      <div className="mr-1 flex flex-1 items-center gap-2.5">
        {isMobile ? (
          <NavSheet
            trigger={renderBackBtn()}
            setOpen={setNavSheetOpen}
            open={navSheetOpen}
          />
        ) : (
          renderBackBtn()
        )}

        <div className="flex flex-1 items-center text-[1.05rem] font-medium select-none">
          {header}
        </div>
      </div>

      <Button
        onClick={() => toast(t('prompts.inDev'))}
        variant="ghost"
        size="icon"
      >
        <MdSearch className="size-6" />
      </Button>
    </header>
  );
};

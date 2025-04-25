import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import appIconImg from '../../assets/images/app-icon.png';
import { Button } from '../ui/button/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';

interface Props {
  trigger?: React.ReactNode;
}

export const NavDrawer = ({ trigger }: Props) => {
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-6" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent
        side="left"
        className="min-w-[100%] border-r-0 px-0 pt-4"
        hideCloseButton
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 px-6 pb-2 font-medium tracking-[0.02em]">
            <img src={appIconImg} alt={t('brand')} className="size-9" />
            {t('brand')}
            <ChevronRight className="mt-0.5 ml-0.5 size-4 stroke-(--color-zinc-400)" />
          </SheetTitle>
          <SheetDescription className="text-left"></SheetDescription>
        </SheetHeader>
        <div className="h-full w-full rounded-t-2xl bg-(--accent) p-2"></div>
      </SheetContent>
    </Sheet>
  );
};

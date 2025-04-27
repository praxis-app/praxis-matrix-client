// TODO: Add remaining layout and functionality - below is a WIP

// Old message form styles:
// const formStyles: SxProps = {
//   borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}`,
//   transition: 'background-color 0.2s cubic-bezier(.4,0,.2,1)',
//   bgcolor: 'background.paper',
//   overflowY: 'auto',
//   paddingTop: 1,
//   paddingBottom: 2,
//   paddingX: 0.9,
//   width: '100%',
// };

// Old form inner styles:
// bgcolor="background.secondary"
// sx={{ transition: 'background-color 0.2s cubic-bezier(.4,0,.2,1)' }}
// borderRadius={4}
// paddingX={1.5}
// paddingY={0.2}
// flex={1}

import { Image, SendHorizonal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button/button';
import { Textarea } from '../ui/textarea';

export const MessageForm = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-y-auto border-t bg-(--card) p-1 px-1.5">
      <div className="rounded-md p-1 transition-colors duration-200">
        <Textarea
          placeholder={t('messages.placeholders.sendMessage')}
          className="resize-none border-none"
          rows={1}
        />

        <div className="flex justify-between">
          <Button variant="ghost">
            <Image />
          </Button>
          <Button variant="ghost">
            <SendHorizonal />
          </Button>
        </div>
      </div>
    </div>
  );
};

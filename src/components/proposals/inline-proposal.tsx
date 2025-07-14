import { timeAgo } from '@/lib/time.utils';
import { FaClipboard } from 'react-icons/fa';
import { M_POLL_START, MatrixEvent, Room } from 'matrix-js-sdk';
import { useTranslation } from 'react-i18next';
import FormattedText from '../shared/formatted-text';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardAction } from '../ui/card';
import { Separator } from '../ui/separator';
import { UserAvatar } from '../users/user-avatar';

interface Props {
  proposal: MatrixEvent;
  room: Room;
}

export const InlineProposal = ({ proposal, room }: Props) => {
  const { [M_POLL_START.name]: pollStart } = proposal.getContent();
  const { body } = pollStart.question;

  const userId = proposal.getSender() ?? '';
  const member = room?.getMember(userId);
  const name = member?.name ?? userId;

  const createdAt = proposal.getDate()?.toString() ?? '';
  const formattedDate = timeAgo(createdAt);

  const { t } = useTranslation();

  if (!body) {
    return null;
  }

  return (
    <div className="flex gap-4 pt-4">
      <UserAvatar name={name} userId={userId} className="mt-0.5" />

      <div className="w-full">
        <div className="flex items-center gap-1.5 pb-1">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground text-sm">{formattedDate}</div>
        </div>

        <Card className="before:border-l-border relative w-full gap-3.5 rounded-md px-3 py-3.5 before:absolute before:inset-0 before:mt-[-0.025rem] before:mb-[-0.025rem] before:rounded-md before:border-l-3">
          <div className="flex items-center gap-1.5 font-medium">
            <FaClipboard className="mb-0.5" />
            {t('proposals.labels.consensusProposal')}
          </div>

          <FormattedText text={body} />

          <CardAction className="flex flex-wrap gap-2">
            <Button variant="outline" size="lg" className="flex-1">
              {t('proposals.actions.agree')}
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              {t('proposals.actions.disagree')}
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              {t('proposals.actions.abstain')}
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              {t('proposals.actions.block')}
            </Button>
          </CardAction>

          <Separator className="my-1" />

          <div className="flex justify-between">
            <div className="text-muted-foreground flex gap-3.5 text-sm">
              <div>10/12 voted</div>
              <div>Ends in 2 days</div>
            </div>
            <Badge variant="outline">{t('proposals.labels.active')}</Badge>
          </div>
        </Card>
      </div>
    </div>
  );
};

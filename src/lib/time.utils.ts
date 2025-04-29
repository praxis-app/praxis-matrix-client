import { Time } from '@/constants/shared.constants';
import dayjs from 'dayjs';
import { translate } from './utils';

export const formatDate = (timeStamp: string) =>
  dayjs(timeStamp).format('MMMM D, YYYY');

export const timeMessage = (timeStamp: string, timeDifference: number) => {
  if (timeDifference < Time.Minute) {
    return translate('time.minutes', { minutes: 1 });
  }
  if (timeDifference < Time.Hour) {
    return translate('time.minutes', {
      minutes: Math.round(timeDifference / Time.Minute),
    });
  }
  if (timeDifference < Time.Day) {
    return translate('time.hours', {
      hours: Math.round(timeDifference / Time.Hour),
    });
  }
  if (timeDifference < Time.Month) {
    return translate('time.days', {
      days: Math.round(timeDifference / Time.Day),
    });
  }
  return formatDate(timeStamp);
};

export const timeAgo = (timeStamp: string) => {
  const now = new Date().getTime();
  const time = new Date(timeStamp).getTime();
  const secondsPast = (now - time) / 1000;
  return timeMessage(timeStamp, secondsPast);
};

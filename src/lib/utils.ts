// TODO: Rename this file to shared.utils.ts

import { clsx, type ClassValue } from 'clsx';
import { t } from 'i18next';
import { Namespace, TFunction } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getRandomString = (length: number) => {
  let result = '';
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// TODO: Rename to a shorter name, like `t`
export const translate: TFunction<Namespace<'ns1'>, undefined> = t;

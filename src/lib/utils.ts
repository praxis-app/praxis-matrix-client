import { clsx, type ClassValue } from 'clsx';
import { t } from 'i18next';
import { Namespace, TFunction } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: Rename to a shorter name
export const translate: TFunction<Namespace<'ns1'>, undefined> = t;

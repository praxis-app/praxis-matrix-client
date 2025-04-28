// TODO: Add remaining layout and functionality - below is a WIP

import { Button } from '@/components/ui/button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import * as sdk from 'matrix-js-sdk';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { t } = useTranslation();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const client = sdk.createClient({
        baseUrl: import.meta.env.VITE_SERVER_BASE_URL,
      });

      const { user_id, access_token, device_id } = await client.loginRequest({
        user: email,
        password: password,
        type: 'm.login.password',
      });

      localStorage.setItem('user_id', user_id);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('device_id', device_id);
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {t('auth.prompts.enterCredentials')}
        </CardTitle>
        <CardDescription>{t('auth.prompts.enterCredentials')}</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            {/* TODO: Determine whether email or username should be used */}
            <Label htmlFor="email">{t('auth.labels.email')}</Label>
            <Input
              id="email"
              // type="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.placeholders.email')}
              value={email}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('auth.labels.password')}</Label>
              {/* TODO: Uncomment when ready to add forgot password functionality
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Forgot password?
              </Link> */}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {/* TODO: Uncomment when ready to add remember me functionality
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm font-normal">
              Remember me
            </Label>
          </div> */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </CardContent>
      {/* TODO: Uncomment when ready to add signup functionality
      <CardFooter className="flex justify-center border-t p-4">
        <div className="text-muted-foreground text-sm">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter> */}
    </Card>
  );
};

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from '@/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CompleteSetupForm() {
  const t = useTranslations('CompleteSetupForm');
  const [isLoading, setIsLoading] = useState(false);
  const { user, completeInitialSetup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    firstName: z.string().min(1, { message: t('firstNameValidation') }),
    lastName: z.string().min(1, { message: t('lastNameValidation') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: t('errorTitle'), description: t('notLoggedInError') });
        return;
    }
    setIsLoading(true);
    const success = await completeInitialSetup(user.id, values);
    setIsLoading(false);
    if (success) {
      toast({
        title: t('successTitle'),
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: t('errorTitle'),
        description: t('genericError'),
      });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('firstNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('firstNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('lastNameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('lastNamePlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('submit')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

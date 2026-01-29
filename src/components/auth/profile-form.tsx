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
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ProfileForm() {
  const t = useTranslations('ProfileForm');
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();

  const formSchema = z.object({
    firstName: z.string().min(1, { message: t('firstNameValidation') }),
    lastName: z.string().min(1, { message: t('lastNameValidation') }),
    email: z.string().email({ message: t('emailValidation') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: t('errorTitle'), description: t('notLoggedInError') });
        return;
    }
    setIsLoading(true);
    const result = await updateUserProfile(user.id, values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: t('successTitle'),
        description: t('successDescription'),
      });
      form.reset(values); // to update the form's "dirty" state
    } else {
      toast({
        variant: 'destructive',
        title: t('errorTitle'),
        description: t(result.message as 'emailInUseError' | 'genericError'),
      });
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>{t('title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('emailLabel')}</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('submit')}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    </Form>
  );
}

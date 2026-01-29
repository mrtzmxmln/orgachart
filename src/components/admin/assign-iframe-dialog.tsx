'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import type { User } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function AssignIframeDialog({ user }: AssignIframeDialogProps) {
  const t = useTranslations('AssignIframeDialog');
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserIframe } = useAuth();
  const { toast } = useToast();

  const formSchema = z.object({
    iframeUrl: z
      .string()
      .url({ message: t('formValidation') })
      .or(z.literal('')),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      iframeUrl: user.iframeUrl || '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        iframeUrl: user.iframeUrl || '',
      });
    }
  }, [open, user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateUserIframe(user.id, values.iframeUrl || null);
    setIsLoading(false);
    setOpen(false);

    toast({
      title: t('successTitle'),
      description: t('successDescription', { email: user.email }),
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          {t('edit')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', {
              email: <span className="font-medium">{user.email}</span>,
            })}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <FormField
              control={form.control}
              name="iframeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('formLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

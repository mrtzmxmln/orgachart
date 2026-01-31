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
import { Loader2, Network } from 'lucide-react';

type AssignIframeDialogProps = {
  user: User;
}

export function AssignIframeDialog({ user }: AssignIframeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserIframe } = useAuth();
  const { toast } = useToast();

  const formSchema = z.object({
    iframeUrl: z
      .string()
      .url({ message: 'Bitte geben Sie eine gültige URL ein.' })
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
    const result = await updateUserIframe(user.id, values.iframeUrl || null);
    setIsLoading(false);

    if (result.success) {
      setOpen(false);
      toast({
        title: 'Erfolg',
        description: `OrgaChart-URL für ${user.firstName} ${user.lastName} wurde aktualisiert.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: result.message,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Network className="mr-2 h-4 w-4" />
          OrgaChart zuweisen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>OrgaChart zuweisen</DialogTitle>
          <DialogDescription>
            Legen Sie die OrgaChart-URL für <span className="font-medium">{user.firstName} {user.lastName}</span> fest oder aktualisieren Sie sie. Leer lassen, um sie zu entfernen.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-4">
            <FormField
              control={form.control}
              name="iframeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OrgaChart-URL</FormLabel>
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
                Änderungen speichern
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

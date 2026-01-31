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
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function CompleteSetupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, completeInitialSetup } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const formSchema = z.object({
    firstName: z.string().min(1, { message: 'Vorname ist erforderlich.' }),
    lastName: z.string().min(1, { message: 'Nachname ist erforderlich.' }),
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
        toast({ variant: 'destructive', title: 'Fehler', description: 'Sie müssen hierfür angemeldet sein.' });
        return;
    }
    setIsLoading(true);
    const result = await completeInitialSetup(user.id, values);
    setIsLoading(false);
    if (result.success) {
      toast({
        title: 'Einrichtung abgeschlossen',
      });
      router.push('/orgachart');
    } else {
      toast({
        variant: 'destructive',
        title: 'Fehler',
        description: result.message,
      });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Ein letzter Schritt</CardTitle>
        <CardDescription>Bitte geben Sie Ihren Namen ein, um Ihr Konto einzurichten.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vorname</FormLabel>
                  <FormControl>
                    <Input placeholder="Max" {...field} />
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
                  <FormLabel>Nachname</FormLabel>
                  <FormControl>
                    <Input placeholder="Mustermann" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Speichern und weiter
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

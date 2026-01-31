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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor" {...props}>
        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 76.2C307.4 102.4 279.8 88 248 88c-86.5 0-157.3 70.8-157.3 157.3S161.5 424 248 424c48.4 0 88.3-20.4 114.7-44.9l76.2 76.2C399.1 487.6 329.8 512 248 512z" />
    </svg>
)

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlinkAlertOpen, setIsUnlinkAlertOpen] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const { user, updateUserProfile, unlinkGoogleProvider, linkGoogleProvider } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = z.object({
    firstName: z.string().min(1, { message: 'Vorname ist erforderlich.' }),
    lastName: z.string().min(1, { message: 'Nachname ist erforderlich.' }),
    email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
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
        toast({ variant: 'destructive', title: 'Aktualisierung fehlgeschlagen', description: 'Sie müssen hierfür angemeldet sein.' });
        return;
    }
    setIsLoading(true);
    const result = await updateUserProfile(user.id, values);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Informationen wurden erfolgreich aktualisiert.',
      });
      form.reset(values); // to update the form's "dirty" state
    } else {
      toast({
        variant: 'destructive',
        title: 'Aktualisierung fehlgeschlagen',
        description: result.message,
      });
    }
  }

  const googleProvider = user?.providerData?.find(p => p.providerId === 'google.com');

  async function handleUnlinkGoogle() {
    setIsUnlinking(true);
    const result = await unlinkGoogleProvider();
    setIsUnlinkAlertOpen(false);

    if (result.success) {
      toast({
        title: 'Konto getrennt',
        description: 'Ihr Google-Konto wurde erfolgreich getrennt.',
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Aktualisierung fehlgeschlagen',
        description: result.message,
      });
    }
    setIsUnlinking(false);
  }

  async function handleLinkGoogle() {
    setIsLinking(true);
    const result = await linkGoogleProvider();

    if (result.success) {
      toast({
        title: 'Konto verknüpft',
        description: 'Ihr Google-Konto wurde erfolgreich verknüpft.',
      });
      router.refresh();
    } else {
      toast({
        variant: 'destructive',
        title: 'Aktualisierung fehlgeschlagen',
        description: result.message,
      });
    }
    setIsLinking(false);
  }

  return (
    <>
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Ihre Informationen</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid sm:grid-cols-2 gap-4">
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
                    </div>
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>E-Mail-Adresse</FormLabel>
                        <FormControl>
                            <Input placeholder="name@example.com" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Änderungen speichern
                    </Button>
                </CardFooter>
            </Card>
        </form>
    </Form>

    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Verknüpfte Konten</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4">
                    <GoogleIcon className="h-6 w-6 text-muted-foreground" />
                    {googleProvider ? (
                      <div className="flex flex-col">
                          <span className="font-medium">Google</span>
                          <span className="text-sm text-muted-foreground">{googleProvider.email}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="font-medium">Google</span>
                        <span className="text-sm text-muted-foreground">Nicht verknüpft</span>
                      </div>
                    )}
                </div>
                {googleProvider ? (
                  <Button variant="outline" onClick={() => setIsUnlinkAlertOpen(true)} disabled={isUnlinking}>
                      Trennen
                  </Button>
                ) : (
                  <Button variant="outline" onClick={handleLinkGoogle} disabled={isLinking}>
                      {isLinking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Konto verknüpfen
                  </Button>
                )}
            </div>
        </CardContent>
    </Card>

    <AlertDialog open={isUnlinkAlertOpen} onOpenChange={setIsUnlinkAlertOpen}>
      <AlertDialogContent>
          <AlertDialogHeader>
          <AlertDialogTitle>Google-Konto trennen?</AlertDialogTitle>
          <AlertDialogDescription>
              Dies entfernt Google als Anmeldemethode. Wenn Sie für dieses Konto kein Passwort festgelegt haben, müssen Sie den 'Passwort vergessen'-Vorgang verwenden, um sich anzumelden.
          </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel disabled={isUnlinking}>Abbrechen</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnlinkGoogle} disabled={isUnlinking}>
              {isUnlinking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Trennen
          </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

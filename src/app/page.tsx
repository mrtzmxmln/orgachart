'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter text-primary">
            Visualisieren Sie Ihre Organisation
          </h1>
          <p className="text-lg text-muted-foreground">OrgaChart bietet eine einfache und leistungsstarke Lösung zum Erstellen und Verwalten von Organigrammen für Ihr Team. Sicher, skalierbar und einfach zu bedienen.</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {user ? (
              <Button asChild size="lg">
                <Link href="/orgachart">Zum OrgaChart</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/signup">Kostenlos loslegen</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/login">Zum OrgaChart</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="relative">
          {heroImage && (
            <Card className="overflow-hidden shadow-2xl rounded-2xl transform hover:scale-105 transition-transform duration-300">
              <CardContent className="p-0">
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={1200}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

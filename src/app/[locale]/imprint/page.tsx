'use client';

export default function ImprintPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Impressum</h1>
        <div className="prose prose-lg text-muted-foreground max-w-none">
          <h2 className="text-xl font-semibold text-foreground">Angaben gemäß § 5 TMG</h2>
          <p>
            Organic Concepts GmbH
            <br />
            Kufsteiner Straße 1<br />
            83088 Kiefersfelden
            <br />
            Deutschland
          </p>

          <h2 className="text-xl font-semibold text-foreground">Kontakt</h2>
          <p>
            Telefon: +49 (0) 80 33 / 30 89 8 - 0<br />
            E-Mail: info@organicconcepts.de
          </p>

          <h2 className="text-xl font-semibold text-foreground">Vertreten durch</h2>
          <p>
            Vertreten durch: Moritz Bauer
          </p>

          <h2 className="text-xl font-semibold text-foreground">Registereintrag</h2>
          <p>
            Registergericht: Amtsgericht Traunstein
            <br />
            Registernummer: HRB 24850
          </p>

          <h2 className="text-xl font-semibold text-foreground">Umsatzsteuer-ID</h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz: DE305331654
          </p>
        </div>
      </div>
    </div>
  );
}

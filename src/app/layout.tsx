// This file is intentionally left almost empty.
// The main layout has been moved to src/app/[locale]/layout.tsx
// to support internationalized routing.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

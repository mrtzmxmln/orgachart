// All layout logic is now handled by the root layout in `src/app/layout.tsx`.
// This component simply passes its children through.
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

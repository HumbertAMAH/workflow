import { Logo } from "./logo";

/** En-tête affiché sur mobile et tablette, où la barre latérale est masquée. */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:hidden">
      <Logo />
    </header>
  );
}

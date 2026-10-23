import Link from "next/link";
import { LogoIcon } from "./ui/icons";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-500"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30">
        <LogoIcon className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-slate-900">TaskFlow</span>
    </Link>
  );
}

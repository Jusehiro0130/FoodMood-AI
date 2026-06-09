"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, Search, User } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/favorites", label: "Guardados", icon: Heart },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md border-t border-black/5 bg-white/90 px-3 pb-3 pt-2 shadow-[0_-12px_28px_rgba(37,22,17,0.08)] backdrop-blur lg:bottom-6 lg:rounded-b-[36px]">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold transition ${
                active ? "bg-[#251611] text-white" : "text-[#8a6b5e] hover:bg-[#fff1df]"
              }`}
              href={item.href}
              key={item.href}
            >
              <Icon size={20} strokeWidth={2.2} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

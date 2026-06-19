"use client";

import { Heart, Home, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/favorites", label: "Guardados", icon: Heart },
  { href: "/profile", label: "Perfil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-3 pb-3 pt-2 shadow-[0_-12px_28px_rgba(37,22,17,0.08)] backdrop-blur"><div className="mx-auto grid max-w-md grid-cols-4 gap-1">{items.map((item) => { const Icon = item.icon; const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href); return <Link aria-current={active ? "page" : undefined} className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-xs font-semibold transition ${active ? "bg-[#251611] text-white" : "text-[#7b5545] hover:bg-[#fff0df] hover:text-[#251611]"}`} href={item.href} key={item.href}><Icon size={20} strokeWidth={2.3} /><span>{item.label}</span></Link>; })}</div></nav>;
}

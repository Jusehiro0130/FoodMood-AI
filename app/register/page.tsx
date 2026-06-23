"use client";

import { UserPlus, Utensils } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(data.error ?? "No se pudo crear la cuenta.");
      return;
    }

    setSuccess(true);
    setMessage(data.message ?? "Revisa tu correo para activar la cuenta.");
  }

  return (
    <AppShell>
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-8">
        <section className="space-y-7 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-raised)] p-6 shadow-[var(--app-shadow)]">
          <div className="space-y-5 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-[var(--brand)] text-white shadow-lg shadow-[#fa5a2a33]">
              <Utensils size={30} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[var(--foreground)]">Crear cuenta</h1>
              <p className="mt-2 text-sm font-semibold leading-6 text-[var(--muted)]">Te enviaremos un correo para activar tu acceso.</p>
            </div>
          </div>

          <form className="space-y-3" onSubmit={register}>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Nombre" onChange={(value) => updateField("firstName", value)} value={form.firstName} />
              <TextField label="Apellido" onChange={(value) => updateField("lastName", value)} value={form.lastName} />
            </div>
            <TextField label="Usuario" onChange={(value) => updateField("username", value)} value={form.username} />
            <TextField label="Correo" onChange={(value) => updateField("email", value)} type="email" value={form.email} />
            <TextField label="Contrasena" minLength={8} onChange={(value) => updateField("password", value)} type="password" value={form.password} />
            <button className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--foreground)] px-5 text-base font-black text-[var(--background)] shadow-sm disabled:opacity-50" disabled={loading || success} type="submit">
              <UserPlus size={20} />
              {loading ? "Creando..." : success ? "Correo enviado" : "Crear cuenta"}
            </button>
          </form>

          {message ? <p className={`text-center text-xs font-black leading-5 ${success ? "text-[var(--accent)]" : "text-[var(--brand)]"}`}>{message}</p> : null}
          <p className="text-center text-xs font-semibold leading-5 text-[var(--muted)]">
            Ya tienes cuenta? <Link className="font-black text-[var(--brand)]" href="/login">Inicia sesion</Link>.
          </p>
        </section>
      </main>
    </AppShell>
  );
}

function TextField({ label, minLength, onChange, type = "text", value }: { label: string; minLength?: number; onChange: (value: string) => void; type?: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">{label}</span>
      <input
        className="min-h-13 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 text-sm font-bold outline-none"
        minLength={minLength}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

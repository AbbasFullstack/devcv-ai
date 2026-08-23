"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";
import { CarbonScene } from "./carbon-scene";

const initialState: AuthState = {};

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);
  const isSignup = mode === "signup";
  return <main className="relative min-h-screen overflow-hidden bg-[#06070a] px-4 py-8 text-white"><div className="carbon-grid absolute inset-0" /><div className="grain absolute inset-0" />
    <div className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <section className="order-2 lg:order-1"><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/70"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c8ff00] text-black">D</span> DevCV <span className="neon-text">AI</span></Link>
        <p className="mt-12 inline-flex items-center gap-2 rounded-full border border-[#c8ff00]/20 bg-[#c8ff00]/[.07] px-3 py-1.5 text-xs font-bold text-[#dfff7a]"><Sparkles className="h-3.5 w-3.5" /> Resume intelligence, with you in control</p>
        <h1 className="mt-5 max-w-xl text-4xl font-black tracking-[-.055em] sm:text-6xl">A sharper resume starts with a <span className="neon-text">clear signal.</span></h1>
        <p className="mt-5 max-w-lg leading-7 text-white/55">Securely access your resume workspace, choose the role you want, and turn feedback into stronger career stories.</p>
        <div className="mt-3 hidden lg:block"><CarbonScene /></div>
      </section>
      <section className="glass order-1 rounded-3xl p-6 sm:p-8 lg:order-2"><p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#c8ff00]">{isSignup ? "Create your workspace" : "Welcome back"}</p><h2 className="mt-3 text-3xl font-black tracking-tight">{isSignup ? "Create an account" : "Sign in to DevCV"}</h2><p className="mt-2 text-sm leading-6 text-white/50">{isSignup ? "Your resume history stays tied to your account." : "Continue improving the resume you own."}</p>
        <form action={formAction} className="mt-8 space-y-4"><label className="block text-sm font-semibold text-white/80">Email<div className="relative mt-2"><Mail className="absolute left-3 top-3.5 h-4 w-4 text-white/35" /><input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-xl border border-white/10 bg-black/25 px-10 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[#c8ff00]/60" /></div></label>
          <label className="block text-sm font-semibold text-white/80">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3.5 h-4 w-4 text-white/35" /><input name="password" type="password" minLength={8} required placeholder="At least 8 characters" className="w-full rounded-xl border border-white/10 bg-black/25 px-10 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-[#c8ff00]/60" /></div></label>
          {state.error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{state.error}</p>}{state.message && <p className="rounded-xl border border-[#c8ff00]/20 bg-[#c8ff00]/10 p-3 text-sm text-[#e4ff9b]">{state.message}</p>}
          <button disabled={pending} className="neon-button flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-black disabled:cursor-wait disabled:opacity-60">{pending ? "Working..." : isSignup ? "Create secure workspace" : "Sign in"}<ArrowRight className="h-4 w-4" /></button>
        </form>
        <p className="mt-6 text-center text-sm text-white/45">{isSignup ? "Already have an account?" : "New to DevCV AI?"} <Link href={isSignup ? "/signin" : "/signup"} className="font-bold text-[#dfff7a] hover:underline">{isSignup ? "Sign in" : "Create one"}</Link></p>
      </section>
    </div></main>;
}

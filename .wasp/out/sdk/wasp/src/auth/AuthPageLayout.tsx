import { ReactNode } from "react";
import { Logo } from "../client/components/Logo/Logo";

export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] flex-col justify-between p-12 text-white">
        <div>
          <Logo variant="dark" size="lg" className="mb-16" />
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-tight mb-6">Your home.<br/>Handled right.</h1>
            <p className="text-white/70 text-lg max-w-sm">Trusted local pros, real rewards, one platform.</p>
          </div>
          <a href="/" className="inline-block mt-4 text-white/50 hover:text-white text-sm transition-colors">← Back to homepage</a>
        </div>
        <div className="space-y-4">
          {[
            { check: true, title: 'Verified pros', desc: 'Every provider is background-checked and insured' },
            { check: true, title: 'Earn rewards', desc: 'Get points for every completed service' },
            { check: true, title: 'GTA coverage', desc: 'Milton, Oakville, Burlington and surrounding areas' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4 p-4 rounded-[14px] bg-white/5 border border-white/10">
              <span className="text-xl mt-0.5 text-[#22C55E] font-bold">✓</span>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-[#F8FAFC]">
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 shadow-2xl w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

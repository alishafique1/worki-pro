import { ReactNode } from "react";

export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 mesh-gradient-dark flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center font-black text-black text-lg">W</div>
            <span className="text-2xl font-black tracking-tight">TheHelper</span>
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight leading-tight mb-6">Your home.<br/>Handled.</h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-sm">Connect with verified local pros, earn rewards, and manage every job in one place.</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { icon: '🔧', title: 'Verified Pros', desc: 'Every provider is background-checked and insured' },
            { icon: '🏆', title: 'Earn Rewards', desc: 'Get points for every completed service' },
            { icon: '⚡', title: 'Fast Matching', desc: 'We find the right pro for your job in minutes' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4 p-4 rounded-[14px] bg-white/5 border border-white/10">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 bg-[var(--surface-base)]">
        <div className="bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-[24px] p-8 shadow-2xl w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}

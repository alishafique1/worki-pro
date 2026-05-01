import React from 'react';
import { Link, useNavigate } from 'react-router';
import heroImg from '../client/static/modern_home_service_hero_1777676793583.png';
import rewardsImg from '../client/static/rewards_and_points_visual_1777677025069.png';

export default function LandingPage() {
  const [zip, setZip] = React.useState('');
  const navigate = useNavigate();

  const handleQuickStart = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to request page with pre-filled postal code
    navigate(`/request-service?postalCode=${zip}`);
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient dark:mesh-gradient-dark selection:bg-[var(--accent)] selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
              </span>
              Now serving Milton, Oakville & Burlington
            </div>
            <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Home Services, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[#ff80b5]">Rewarded.</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-xl mb-10 leading-relaxed">
              The smartest way to maintain your home. Connect with top-tier HVAC and handyman pros while earning points for every dollar spent.
            </p>
            
            <form onSubmit={handleQuickStart} className="max-w-md glass dark:glass-dark p-2 rounded-[28px] border border-white/10 flex items-center gap-2 mb-10 group focus-within:border-[var(--accent)]/50 transition-all">
              <input 
                type="text" 
                placeholder="Enter Postal Code" 
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="flex-1 bg-transparent border-none focus:ring-0 px-6 py-2 text-lg outline-none"
              />
              <button 
                type="submit"
                className="px-6 py-3 bg-[var(--accent)] text-black font-black rounded-2xl hover:scale-105 transition-transform whitespace-nowrap"
              >
                Start Concierge
              </button>
            </form>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/request-service"
                className="px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-lg hover:shadow-[0_0_30px_rgba(242,181,215,0.4)] transition-all hover:-translate-y-1"
              >
                Request Service
              </Link>
              <Link
                to="/how-rewards-work"
                className="px-10 py-5 glass dark:glass-dark text-foreground font-bold rounded-3xl text-lg hover:bg-[var(--surface-overlay)] transition-all"
              >
                How it Works
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl border border-white/10 rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src={heroImg} alt="Modern Home" className="w-full h-auto" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                <p className="text-white font-bold text-lg">"The best HVAC service in Milton!"</p>
                <p className="text-white/60 text-sm">— Sarah J., Homeowner</p>
              </div>
            </div>
            {/* Abstract blobs for modern feel */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[var(--accent)]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 px-6 lg:px-8 bg-[var(--surface-base)]/50 backdrop-blur-sm border-y border-[var(--border-default)]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">Our Core Services</h2>
            <p className="text-[var(--text-secondary)] text-lg">Top-rated professionals, guaranteed results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'HVAC', desc: 'Heating, Cooling & Air Quality', link: '/hvac', icon: '❄️' },
              { title: 'Handyman', desc: 'Repairs, Mounting & Assembly', link: '/handyman', icon: '🔨' },
              { title: 'Appliance Repair', desc: 'Kitchen & Laundry Repairs', link: '/appliance-repair', icon: '⚡' }
            ].map((service) => (
              <Link 
                to={service.link} 
                key={service.title}
                className="group p-10 glass dark:glass-dark rounded-[40px] border border-[var(--border-default)] hover:border-[var(--accent)] transition-all hover-lift"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-2xl font-black mb-3">{service.title}</h3>
                <p className="text-[var(--text-secondary)] mb-8">{service.desc}</p>
                <div className="text-[var(--accent)] font-bold flex items-center gap-2">
                  Learn More <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Highlight */}
      <section className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="flex-1 text-left">
            <h2 className="text-5xl font-black tracking-tight mb-8">
              Collect Points. <br />
              <span className="text-[var(--accent)]">Spend on Rewards.</span>
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-10 leading-relaxed">
              Every job you book through Worki earns you points. 100 points = $1. Redeem for Amazon gift cards, Starbucks, or discounts on your next service.
            </p>
            <div className="space-y-6">
              {[
                '500 points for first HVAC job',
                '250 points for handyman referrals',
                'Manual verification for total security'
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 text-lg font-bold">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-black flex items-center justify-center text-xs">✓</div>
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
             <div className="p-4 glass dark:glass-dark rounded-[50px] shadow-2xl relative">
               <img src={rewardsImg} alt="Rewards Visual" className="w-full h-auto rounded-[40px]" />
               <div className="absolute -top-10 -left-10 p-6 glass rounded-3xl shadow-xl animate-bounce">
                 <p className="text-sm font-bold">Wallet: 2,500 pts</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Trust & CTA */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto glass dark:glass-dark p-16 sm:p-24 rounded-[60px] text-center border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent"></div>
          <h2 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 relative z-10">Ready to get <br /> <span className="text-[var(--accent)]">started?</span></h2>
          <p className="text-xl text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto relative z-10">
            Join thousands of GTA homeowners who are already earning rewards for their home maintenance.
          </p>
          <div className="relative z-10">
            <Link
              to="/signup"
              className="inline-block px-14 py-6 bg-foreground text-background font-black rounded-[30px] text-xl hover:scale-105 transition-transform"
            >
              Join Worki Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

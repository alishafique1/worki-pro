import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="bg-[var(--surface-base)] border-t border-[var(--border-default)] py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="text-2xl font-black text-foreground">Worki</Link>
          <p className="mt-4 text-[var(--text-secondary)] text-sm">
            Expert home services, managed for you — plus real cashback on every job. Serving the GTA.
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">Services</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/hvac" className="hover:text-[var(--accent)] transition-colors">HVAC Services</Link></li>
            <li><Link to="/handyman" className="hover:text-[var(--accent)] transition-colors">Handyman</Link></li>
            <li><Link to="/appliance-repair" className="hover:text-[var(--accent)] transition-colors">Appliance Repair</Link></li>
            <li><Link to="/plumbing" className="hover:text-[var(--accent)] transition-colors">Plumbing</Link></li>
            <li><Link to="/electrical" className="hover:text-[var(--accent)] transition-colors">Electrical</Link></li>
            <li><Link to="/smart-home" className="hover:text-[var(--accent)] transition-colors">Smart Home</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">Marketplace</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/how-it-works" className="hover:text-[var(--accent)] transition-colors">How Rewards Work</Link></li>
            <li><Link to="/providers" className="hover:text-[var(--accent)] transition-colors">Join as a Pro</Link></li>
            <li><Link to="/providers/apply" className="hover:text-[var(--accent)] transition-colors">Provider Application</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">Service Areas</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/areas/milton" className="hover:text-[var(--accent)] transition-colors">Milton</Link></li>
            <li><Link to="/areas/oakville" className="hover:text-[var(--accent)] transition-colors">Oakville</Link></li>
            <li><Link to="/areas/burlington" className="hover:text-[var(--accent)] transition-colors">Burlington</Link></li>
            <li><Link to="/areas/mississauga" className="hover:text-[var(--accent)] transition-colors">Mississauga</Link></li>
            <li><Link to="/areas/brampton" className="hover:text-[var(--accent)] transition-colors">Brampton</Link></li>
            <li><Link to="/areas/hamilton" className="hover:text-[var(--accent)] transition-colors">Hamilton</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-6">Legal</h3>
          <ul className="space-y-4 text-sm">
            <li><Link to="/terms" className="hover:text-[var(--accent)] transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-[var(--accent)] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[var(--border-default)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[var(--text-tertiary)]">
        <p>© 2026 Worki Home Services. All rights reserved.</p>
        <p>Built for Milton, Oakville, and Burlington homeowners.</p>
      </div>
    </footer>
  );
}

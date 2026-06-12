import { Link } from 'react-router';
import logo from '../../client/static/logo.webp';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B] py-16 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-white">
            <img src={logo} alt="The Helper" className="w-9 h-9 rounded-xl" />
            The Helper
          </Link>
          <p className="mt-4 text-[#94A3B8] text-sm">
            Expert home services, managed for you. Plus real cashback on every job. Serving the GTA.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#475569] mb-6">Services</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li><Link to="/hvac" className="hover:text-white transition-colors">HVAC Services</Link></li>
            <li><Link to="/handyman" className="hover:text-white transition-colors">Handyman</Link></li>
            <li><Link to="/appliance-repair" className="hover:text-white transition-colors">Appliance Repair</Link></li>
            <li><Link to="/plumbing" className="hover:text-white transition-colors">Plumbing</Link></li>
            <li><Link to="/electrical" className="hover:text-white transition-colors">Electrical</Link></li>
            <li><Link to="/smart-home" className="hover:text-white transition-colors">Smart Home</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#475569] mb-6">Marketplace</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How Rewards Work</Link></li>
            <li><Link to="/providers" className="hover:text-white transition-colors">Join as a Pro</Link></li>
            <li><Link to="/providers/apply" className="hover:text-white transition-colors">Provider Application</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#475569] mb-6">Service Areas</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li><Link to="/areas/milton" className="hover:text-white transition-colors">Milton</Link></li>
            <li><Link to="/areas/oakville" className="hover:text-white transition-colors">Oakville</Link></li>
            <li><Link to="/areas/burlington" className="hover:text-white transition-colors">Burlington</Link></li>
            <li><Link to="/areas/mississauga" className="hover:text-white transition-colors">Mississauga</Link></li>
            <li><Link to="/areas/brampton" className="hover:text-white transition-colors">Brampton</Link></li>
            <li><Link to="/areas/hamilton" className="hover:text-white transition-colors">Hamilton</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#475569] mb-6">Legal</h3>
          <ul className="space-y-4 text-sm text-[#94A3B8]">
            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#1E293B] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#475569]">
        <p>© 2026 The Helper Inc. All rights reserved.</p>
        <p>Built for Milton, Oakville, and Burlington homeowners.</p>
      </div>
    </footer>
  );
}

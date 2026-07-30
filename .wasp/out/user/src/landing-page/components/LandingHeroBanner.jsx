export default function LandingHeroBanner({ src, alt }) {
    return (<div className="relative h-64 sm:h-80 overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover" loading="eager"/>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F8FAFC]"/>
    </div>);
}

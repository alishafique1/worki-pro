export default function ProgressBar({ current, total }) {
    const pct = (current / total) * 100;
    return (<div>
      <div className="h-1.5 bg-[#E2E8F0] rounded-full mb-2 overflow-hidden">
        <div className="h-full bg-[#2563EB] transition-all duration-700 ease-out rounded-full" style={{ width: `${pct}%` }}/>
      </div>
      <p className="text-xs text-[#94A3B8] text-center">
        Step {current} of {total}
      </p>
    </div>);
}
//# sourceMappingURL=ProgressBar.jsx.map
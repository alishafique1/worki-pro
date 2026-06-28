import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

// Real 7-day service-request volume, fed by getAdminLiveCounts.requestsByDay.
// Replaces the old OpenSaaS Revenue/Profit chart, which plotted a hardcoded
// fake "Profit" series and revenue the marketplace does not actually track.

type Props = {
  data: { label: string; count: number }[] | undefined;
  isLoading: boolean;
};

const RequestVolumeChart = ({ data, isLoading }: Props) => {
  const labels = data?.map((d) => d.label) ?? [];
  const counts = data?.map((d) => d.count) ?? [];
  const max = Math.max(4, ...counts);

  const options: ApexOptions = {
    colors: ["#2563EB"],
    chart: {
      fontFamily: "DM Sans, system-ui, sans-serif",
      height: 300,
      type: "area",
      toolbar: { show: false },
    },
    stroke: { width: 2, curve: "smooth" },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.02 },
    },
    dataLabels: { enabled: false },
    markers: { size: 4, colors: ["#fff"], strokeColors: ["#2563EB"], strokeWidth: 2 },
    grid: { borderColor: "#E2E8F0", strokeDashArray: 4 },
    xaxis: {
      categories: labels,
      type: "category",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#475569" } },
    },
    yaxis: {
      min: 0,
      max: Math.ceil(max / 4) * 4,
      labels: { style: { colors: "#475569" }, formatter: (v) => `${Math.round(v)}` },
    },
    tooltip: { y: { formatter: (v) => `${v} request${v === 1 ? "" : "s"}` } },
  };

  if (isLoading) {
    return <div className="h-[300px] animate-pulse rounded-[16px] bg-[#F1F5F9]" />;
  }

  return (
    <div className="px-2 pb-2">
      <ReactApexChart
        options={options}
        series={[{ name: "Requests", data: counts }]}
        type="area"
        height={300}
      />
    </div>
  );
};

export default RequestVolumeChart;

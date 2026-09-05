import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Download,
  Filter,
  Layers,
  MapPin,
  RefreshCw,
  Search,
  Store,
  TrendingUp,
  Upload,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  INITIAL_MANDI_DATA,
  MandiRecord,
  exportRecordsToCSV,
  parseCSVToMandiRecords,
} from "../../lib/mandi-dataset";

interface MarketViewProps {
  onSelectMandi?: (mandi: MandiRecord) => void;
  notify?: (msg: string) => void;
}

export function MarketView({ notify }: MarketViewProps) {
  const [data, setData] = useState<MandiRecord[]>(INITIAL_MANDI_DATA);
  const [selectedState, setSelectedState] = useState<string>("All");
  const [selectedCommodity, setSelectedCommodity] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Unique filter values
  const states = useMemo(
    () => ["All", ...Array.from(new Set(data.map((d) => d.state)))],
    [data],
  );
  const commodities = useMemo(
    () => ["All", ...Array.from(new Set(data.map((d) => d.commodity)))],
    [data],
  );

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchState = selectedState === "All" || item.state === selectedState;
      const matchCommodity =
        selectedCommodity === "All" || item.commodity === selectedCommodity;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        item.market.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.variety.toLowerCase().includes(q) ||
        item.commodity.toLowerCase().includes(q);
      return matchState && matchCommodity && matchQuery;
    });
  }, [data, selectedState, selectedCommodity, searchQuery]);

  // Aggregate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { avgModal: 0, maxPrice: 0, minPrice: 0, totalArrivals: 0 };
    }
    const avgModal = Math.round(
      filteredData.reduce((acc, d) => acc + d.modalPrice, 0) / filteredData.length,
    );
    const maxPrice = Math.max(...filteredData.map((d) => d.maxPrice));
    const minPrice = Math.min(...filteredData.map((d) => d.minPrice));
    const totalArrivals = filteredData.reduce((acc, d) => acc + d.arrivalsTonnes, 0);

    return { avgModal, maxPrice, minPrice, totalArrivals };
  }, [filteredData]);

  // Chart data formatted
  const chartData = useMemo(() => {
    return filteredData
      .slice(0, 10)
      .map((item) => ({
        name: `${item.market.replace(" Mandi", "").replace(" APMC", "")}`,
        Modal: item.modalPrice,
        Min: item.minPrice,
        Max: item.maxPrice,
      }))
      .reverse();
  }, [filteredData]);

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseCSVToMandiRecords(content);
        if (parsed.length > 0) {
          setData(parsed);
          if (notify) notify(`Loaded ${parsed.length} mandi records from custom CSV`);
        } else {
          if (notify) notify("Could not parse valid Kaggle Mandi CSV records.");
        }
      }
    };
    reader.readAsText(file);
  };

  // Download filtered CSV
  const handleExportCSV = () => {
    const csvStr = exportRecordsToCSV(filteredData);
    const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kaggle-mandi-prices-${selectedCommodity.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    if (notify) notify("Dataset exported as CSV");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <Store className="size-4 text-leaf" /> Kaggle Mandi Dataset Intelligence
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Daily Wholesale Commodity Prices (India Mandis)
            </h2>
            <p className="mt-1 text-sm text-mute">
              Real-time AGMARKNET dataset tracking wholesale crop prices, mandi arrivals, min/max/modal price spreads across Indian states.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="action-secondary cursor-pointer text-xs">
              <Upload className="size-3.5 text-aqua" /> Load Custom CSV
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
            <button
              type="button"
              onClick={handleExportCSV}
              className="action-primary text-xs"
            >
              <Download className="size-3.5" /> Export Dataset CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="text-xs text-faint uppercase tracking-wider">Average Modal Price</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-leaf">
            ₹{stats.avgModal.toLocaleString("en-IN")}{" "}
            <span className="text-xs text-mute font-sans">/ Quintal</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-mute">
            <TrendingUp className="size-3 text-leaf" /> Calculated across {filteredData.length} mandis
          </div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="text-xs text-faint uppercase tracking-wider">Max Price Peak</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-gold">
            ₹{stats.maxPrice.toLocaleString("en-IN")}{" "}
            <span className="text-xs text-mute font-sans">/ Quintal</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-mute">
            <ArrowUpRight className="size-3 text-gold" /> Highest grade offer
          </div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="text-xs text-faint uppercase tracking-wider">Min Price Base</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-ink">
            ₹{stats.minPrice.toLocaleString("en-IN")}{" "}
            <span className="text-xs text-mute font-sans">/ Quintal</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-mute">
            <ArrowDownRight className="size-3 text-faint" /> Lower bound floor
          </div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="text-xs text-faint uppercase tracking-wider">Total Market Arrivals</div>
          <div className="mt-1 font-mono text-2xl font-semibold text-aqua">
            {stats.totalArrivals.toLocaleString("en-IN")}{" "}
            <span className="text-xs text-mute font-sans">Tonnes</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-mute">
            <Layers className="size-3 text-aqua" /> Aggregate daily volume
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-md bg-panel p-3.5 ring-1 ring-line">
        <div className="flex items-center gap-2 text-xs font-medium text-mute">
          <Filter className="size-3.5 text-leaf" /> Filter dataset:
        </div>

        <div className="flex-1 min-w-[140px]">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full rounded-md border border-line bg-panel2 px-3 py-1.5 text-xs text-ink focus:border-leaf focus:outline-none"
          >
            <option value="All">All States ({states.length - 1})</option>
            {states
              .filter((s) => s !== "All")
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>

        <div className="flex-1 min-w-[140px]">
          <select
            value={selectedCommodity}
            onChange={(e) => setSelectedCommodity(e.target.value)}
            className="w-full rounded-md border border-line bg-panel2 px-3 py-1.5 text-xs text-ink focus:border-leaf focus:outline-none"
          >
            <option value="All">All Commodities ({commodities.length - 1})</option>
            {commodities
              .filter((c) => c !== "All")
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </div>

        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
          <input
            type="text"
            placeholder="Search mandi, district, variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-faint focus:border-leaf focus:outline-none"
          />
        </div>

        {(selectedState !== "All" || selectedCommodity !== "All" || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              setSelectedState("All");
              setSelectedCommodity("All");
              setSearchQuery("");
            }}
            className="flex items-center gap-1 rounded-md bg-panel2 px-2.5 py-1.5 text-xs text-mute hover:text-ink ring-1 ring-line"
          >
            <RefreshCw className="size-3" /> Reset
          </button>
        )}
      </div>

      {/* Chart Section */}
      <div className="rounded-md bg-panel p-4 ring-1 ring-line">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-faint">
            <BarChart3 className="size-4 text-gold" /> Mandi Modal Price Comparison (₹ / Quintal)
          </div>
          <span className="text-xs text-mute">Top 10 Mandis</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="modalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.68 0.17 145)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.68 0.17 145)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.035 145)" />
              <XAxis dataKey="name" stroke="oklch(0.65 0.035 145)" fontSize={11} />
              <YAxis stroke="oklch(0.65 0.035 145)" fontSize={11} domain={["dataMin - 200", "dataMax + 200"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "oklch(0.24 0.028 145)",
                  borderColor: "oklch(0.32 0.035 145)",
                  borderRadius: "6px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="Modal" stroke="oklch(0.68 0.17 145)" strokeWidth={2} fillOpacity={1} fill="url(#modalGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="overflow-hidden rounded-md bg-panel ring-1 ring-line">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-mute">
            Kaggle AGMARKNET Records ({filteredData.length} results)
          </div>
          <div className="text-xs text-faint">Prices in INR (₹) per Quintal (100 kg)</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-panel2 text-faint uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">District</th>
                <th className="px-4 py-3 font-medium">Market Mandi</th>
                <th className="px-4 py-3 font-medium">Commodity</th>
                <th className="px-4 py-3 font-medium">Variety</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium text-right">Min (₹)</th>
                <th className="px-4 py-3 font-medium text-right">Max (₹)</th>
                <th className="px-4 py-3 font-medium text-right">Modal (₹)</th>
                <th className="px-4 py-3 font-medium text-right">Arrivals (t)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 text-ink">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-mute">
                    No mandi records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-panel2/60 transition-colors">
                    <td className="px-4 py-2.5 font-medium">{item.state}</td>
                    <td className="px-4 py-2.5 text-mute">{item.district}</td>
                    <td className="px-4 py-2.5 flex items-center gap-1.5 font-medium text-ink">
                      <MapPin className="size-3 text-leaf shrink-0" />
                      {item.market}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="rounded bg-leaf/10 px-2 py-0.5 text-[11px] font-medium text-leaf ring-1 ring-leaf/20">
                        {item.commodity}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-mute">{item.variety}</td>
                    <td className="px-4 py-2.5 font-mono text-faint">{item.arrivalDate}</td>
                    <td className="px-4 py-2.5 font-mono text-right text-mute">
                      ₹{item.minPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-right text-mute">
                      ₹{item.maxPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-right font-semibold text-leaf">
                      ₹{item.modalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-right text-aqua">
                      {item.arrivalsTonnes} t
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

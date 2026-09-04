import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Check,
  ChevronRight,
  CloudRain,
  Download,
  Droplets,
  Gauge,
  Leaf,
  MapPin,
  Menu,
  MessageSquareText,
  PackageCheck,
  PanelLeft,
  Search,
  ShieldCheck,
  Sprout,
  Store,
  SunMedium,
  Truck,
  Users,
  Wheat,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdant Agrideck | Farm-to-market intelligence" },
      {
        name: "description",
        content:
          "AI-powered crop planning, cultivation guidance, market intelligence, and buyer matching for farm-to-market decisions.",
      },
      { property: "og:title", content: "Verdant Agrideck | Farm-to-market intelligence" },
      {
        property: "og:description",
        content: "Turn soil, weather, and market signals into one confident farm-to-market plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "Overview", icon: PanelLeft },
  { label: "Grow plan", icon: Sprout },
  { label: "Advisory", icon: Activity },
  { label: "Market", icon: Store },
  { label: "Sell vs store", icon: PackageCheck },
  { label: "Storage", icon: ShieldCheck },
  { label: "Buyers", icon: Users },
  { label: "Profit", icon: Gauge },
];

const workflow = ["Grow", "Cultivate", "Harvest", "Sell / store", "Storage", "Buyer", "Profit"];
const priceBars = ["h-8", "h-11", "h-7", "h-14", "h-10", "h-12", "h-14"];

function Index() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [activeStep, setActiveStep] = useState(3);
  const [sellMode, setSellMode] = useState<"sell" | "store">("store");
  const [accepted, setAccepted] = useState(false);
  const [advisoryOpen, setAdvisoryOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [toast, setToast] = useState("");

  const decision = useMemo(
    () =>
      sellMode === "store"
        ? { value: "₹3.41 L", delta: "+₹39k net", title: "Store 30d", color: "text-leaf" }
        : { value: "₹3.02 L", delta: "today", title: "Sell now", color: "text-ink" },
    [sellMode],
  );

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const exportPlan = () => {
    const plan = [
      "VERDANT AGRIDECK · FARM-TO-MARKET PLAN",
      "Farm: Deshmukh Agro · Pune, Maharashtra · 6.4 acres",
      "Crop: Soybean (Vrindavan)",
      `Decision: ${decision.title} · ${decision.value}`,
      "Buyer: Krishna Oils Ltd · ₹4,350/t · Grade A",
      "Expected net profit: ₹3.41 L · Risk: Low",
    ].join("\n");
    const blob = new Blob([plan], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "verdant-season-plan.txt";
    link.click();
    URL.revokeObjectURL(url);
    notify("Season plan exported");
  };

  return (
    <div className="min-h-screen bg-ground font-sans text-ink antialiased">
      <div className="dashboard-aura pointer-events-none fixed inset-0 opacity-70" />
      <div className="relative flex min-h-screen">
        <aside className="hidden w-60 shrink-0 border-r border-line bg-panel/70 lg:flex lg:flex-col">
          <div className="flex h-14 items-center gap-2 border-b border-line px-5">
            <div className="grid size-7 place-items-center rounded-[5px] bg-leaf/15 ring-1 ring-leaf/40">
              <Leaf className="size-3.5 text-leaf" />
            </div>
            <div className="leading-none">
              <div className="text-sm font-semibold tracking-tight">Verdant</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-faint">
                Agrideck
              </div>
            </div>
          </div>
          <nav className="space-y-0.5 px-3 py-4" aria-label="Main navigation">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setActiveNav(label);
                  notify(`${label} view selected`);
                }}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  activeNav === label
                    ? "bg-leaf/10 text-ink ring-1 ring-leaf/20"
                    : "text-mute hover:bg-panel2 hover:text-ink"
                }`}
              >
                <Icon className={`size-4 ${activeNav === label ? "text-leaf" : "text-faint"}`} />
                <span className={activeNav === label ? "font-medium" : ""}>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto p-3">
            <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
              <div className="mb-2 flex items-center gap-2">
                <span className="pulse-dot size-2 rounded-full bg-leaf" />
                <span className="text-[11px] text-mute">Live data synced</span>
              </div>
              <div className="text-xs text-mute">Rains forecast in 4h</div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-auto">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-ground/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md bg-panel ring-1 ring-line lg:hidden"
                aria-label="Open navigation"
                onClick={() => notify("Use the section controls below to navigate")}
              >
                <Menu className="size-4 text-mute" />
              </button>
              <span className="text-mute">{activeNav}</span>
              <ChevronRight className="size-3 text-faint" />
              <span className="font-medium text-ink">Season plan · Kharif 2025</span>
            </div>
            <div className="hidden items-center gap-3 text-xs sm:flex">
              <div className="rounded-md bg-panel px-3 py-1.5 text-mute ring-1 ring-line">
                ₹ INR
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-panel px-3 py-1.5 text-mute ring-1 ring-line">
                <MapPin className="size-3.5 text-aqua" /> Pune, MH
              </div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-panel px-2.5 py-1.5 ring-1 ring-line"
                onClick={() => notify("Profile settings are ready for your next plan")}
              >
                <span className="pulse-dot size-2 rounded-full bg-gold" />
                <span className="text-ink">Ravi Deshmukh</span>
              </button>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md bg-panel text-mute ring-1 ring-line hover:text-ink"
                aria-label="Notifications"
                onClick={() => notify("No new alerts beyond the rain watch")}
              >
                <Bell className="size-4" />
              </button>
            </div>
          </header>

          <div className="relative z-10 space-y-5 p-4 sm:p-6">
            <section className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-faint">
                    <span className="pulse-dot size-1.5 rounded-full bg-leaf" /> Decision cockpit
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Grow to Profit cockpit
                  </h1>
                  <p className="mt-1 text-sm text-mute">
                    Your 7-step farm-to-market decision path for 6.4 acres.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAccepted(true);
                      notify("Recommendation accepted — plan is ready to execute");
                    }}
                    className={`action-primary ${accepted ? "bg-leaf/70" : ""}`}
                  >
                    {accepted ? <Check className="size-4" /> : <ShieldCheck className="size-4" />}
                    {accepted ? "Plan accepted" : "Accept recommendation"}
                  </button>
                  <button type="button" onClick={exportPlan} className="action-secondary">
                    <Download className="size-4" />{" "}
                    <span className="hidden sm:inline">Export plan</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <ContextCard
                  label="Farm"
                  value="Deshmukh Agro"
                  note="Pune · MH · 6.4 ac"
                  icon={Wheat}
                />
                <ContextCard
                  label="Soil"
                  value="Black cotton"
                  note="pH 7.1 · Loam rich"
                  icon={Sprout}
                />
                <ContextCard
                  label="Water"
                  value="Drip + monsoon"
                  note="Aqua 3.2 ac-in"
                  icon={Droplets}
                />
                <ContextCard label="Budget" value="₹2.1 L" note="Season cap set" icon={Gauge} />
              </div>

              <div className="overflow-hidden rounded-md bg-panel p-4 ring-1 ring-line">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-faint">
                    Farm-to-market workflow
                  </span>
                  <span className="font-mono text-[11px] text-mute">Step 04 / 07</span>
                </div>
                <div className="grid min-w-[680px] grid-cols-7 gap-2">
                  {workflow.map((step, index) => {
                    const done = index < activeStep;
                    const current = index === activeStep;
                    return (
                      <button
                        type="button"
                        key={step}
                        onClick={() => setActiveStep(index)}
                        className="text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`grid size-5 shrink-0 place-items-center rounded-full text-[10px] ${done ? "bg-leaf/20 text-leaf ring-1 ring-leaf/50" : current ? "bg-gold/20 text-gold ring-1 ring-gold/40" : "bg-panel2 text-faint ring-1 ring-line"}`}
                          >
                            {done ? <Check className="size-3" /> : index + 1}
                          </span>
                          <span
                            className={`truncate text-xs ${current ? "font-medium text-gold" : done ? "font-medium text-ink" : "text-faint"}`}
                          >
                            {step}
                          </span>
                        </div>
                        <div
                          className={`mt-2 h-1 rounded-full ${done ? "bg-leaf" : current ? "bg-line" : "bg-line"}`}
                        >
                          <div
                            className={`h-full rounded-full ${current ? "w-1/2 bg-gold" : "w-0"}`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-5">
              <div className="rounded-md bg-panel p-4 ring-1 ring-line xl:col-span-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                    Primary crop recommendation
                  </div>
                  <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[11px] text-leaf ring-1 ring-leaf/30">
                    High fit · 94%
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="text-xl font-semibold tracking-tight">
                      Soybean <span className="text-mute">(Vrindavan)</span>
                    </div>
                    <div className="mt-1 max-w-lg text-sm text-mute">
                      Best yield-to-cost for black cotton soil, monsoon timing, and your 3.2 ac-in
                      water availability.
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-faint">Expected profit</div>
                    <div className="font-mono text-2xl font-semibold text-leaf">₹3.14 L</div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MetricCard label="Yield" value="1.9 t/ac" note="12.2 t total" />
                  <MetricCard
                    label="Margin"
                    value="41%"
                    note="vs cost ₹5.9 L"
                    valueClass="text-gold"
                  />
                  <MetricCard
                    label="Risk score"
                    value="Moderate"
                    note="Weather-sensitive"
                    valueClass="text-risk"
                    progress
                  />
                </div>
                <div className="mt-3 flex flex-col gap-3 rounded-md bg-panel2 p-3 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2 text-sm text-mute">
                    <MessageSquareText className="mt-0.5 size-4 shrink-0 text-aqua" />
                    <span>
                      Cultivate: apply NPK 12-24-12 on day 20 · drip 8 min/plot · watch for yellow
                      mosaic.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdvisoryOpen((value) => !value)}
                    className="action-secondary shrink-0 px-3 py-1.5 text-xs"
                  >
                    {advisoryOpen ? "Close advisory" : "Open advisory"}
                  </button>
                </div>
                {advisoryOpen && (
                  <div className="mt-3 grid gap-2 rounded-md bg-aqua/10 p-3 text-xs text-mute ring-1 ring-aqua/20 sm:grid-cols-3">
                    <span>
                      <b className="text-ink">Next action:</b> soil test before day 18
                    </span>
                    <span>
                      <b className="text-ink">Irrigation:</b> 8 min at sunrise
                    </span>
                    <span>
                      <b className="text-ink">Watch:</b> yellow mosaic after rain
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col rounded-md bg-panel p-4 ring-1 ring-line xl:col-span-2">
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  Weather & soil context
                </div>
                <div className="mt-3 flex flex-1 flex-col gap-3">
                  <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <SunMedium className="size-4 text-gold" /> Next 72h · Pune
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-aqua">
                        <CloudRain className="size-3.5" /> Rains in 4h
                      </span>
                    </div>
                    <div className="mt-3 flex h-20 items-end justify-between gap-2">
                      {[
                        "h-10 bg-aqua/40",
                        "h-16 bg-aqua/70",
                        "h-6 bg-aqua/30",
                        "h-12 bg-gold/40",
                        "h-4 bg-gold/30",
                      ].map((bar, index) => (
                        <div key={bar} className="flex flex-1 flex-col items-center">
                          <div className={`weather-bar w-full rounded-sm ${bar}`} />
                          <span className="mt-1 text-[10px] text-mute">
                            {["Tue", "Wed", "Thu", "Fri", "Sat"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
                      <div className="text-[11px] text-faint">Soil moisture</div>
                      <div className="font-mono text-lg font-semibold">38%</div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                        <div className="h-full w-[38%] bg-leaf" />
                      </div>
                    </div>
                    <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
                      <div className="text-[11px] text-faint">Nitrogen</div>
                      <div className="font-mono text-lg font-semibold">Low</div>
                      <div className="text-[11px] text-mute">Top-up advised</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-md bg-panel p-4 ring-1 ring-line">
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  Market price trend
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="font-mono text-xl font-semibold">₹4,180</div>
                  <div className="flex items-center gap-1 text-xs text-leaf">
                    <ArrowUpRight className="size-3" /> 6.2% wk
                  </div>
                </div>
                <div className="mt-3 flex h-16 items-end justify-between gap-1">
                  {priceBars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className={`price-bar flex-1 rounded-sm ${height} ${index === 6 ? "bg-gold/70" : index > 3 ? "bg-leaf/80" : "bg-leaf/50"}`}
                    />
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-mute">
                  Soybean mandal average · Nashik, Pune, Aurangabad
                </div>
              </div>
              <div className="rounded-md bg-panel p-4 ring-1 ring-line">
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  Sell vs store
                </div>
                <div className="mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => setSellMode("sell")}
                    className={`flex w-full items-center justify-between rounded-md p-3 text-left ring-1 ${sellMode === "sell" ? "bg-leaf/10 ring-leaf/40" : "bg-panel2 ring-line"}`}
                  >
                    <span className="text-sm font-medium">Sell now</span>
                    <span
                      className={`font-mono text-sm ${sellMode === "sell" ? "text-leaf" : "text-ink"}`}
                    >
                      ₹3.02 L
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSellMode("store")}
                    className={`flex w-full items-center justify-between rounded-md p-3 text-left ring-1 ${sellMode === "store" ? "bg-leaf/10 ring-leaf/40" : "bg-panel2 ring-line"}`}
                  >
                    <span className="text-sm font-medium text-leaf">
                      Store 30d <span className="text-[11px]">· rec</span>
                    </span>
                    <span className="font-mono text-sm text-leaf">₹3.41 L</span>
                    <span className="sr-only">Recommended</span>
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-mute">
                  Storage cost ₹42k · spoilage 3% ·{" "}
                  {sellMode === "store" ? "+₹39k net advantage" : "immediate liquidity"}
                </div>
              </div>
              <div className="rounded-md bg-panel p-4 ring-1 ring-line">
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  Nearby cold storage
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <StorageRow name="AgroFrost Nashik" price="₹3.5/kilo" />
                  <StorageRow name="Khed Cold Works" price="₹2.8/kilo" active />
                  <StorageRow name="Pune AgroStore" price="₹4.1/kilo" />
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-mute">
                  <MapPin className="size-3.5 text-aqua" /> Khed is 14 km · 620 kilo capacity
                </div>
              </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-5">
              <div className="rounded-md bg-panel p-4 ring-1 ring-line xl:col-span-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                    Buyer matches
                  </div>
                  <span className="text-[11px] text-mute">3 of 8 · sorted by net offer</span>
                </div>
                <div className="mt-3 divide-y divide-line/70">
                  <BuyerRow
                    name="Krishna Oils Ltd"
                    detail="Nashik · 12.2 t · Grade A"
                    price="₹4,350/t"
                    note="Best net"
                    best
                  />
                  <BuyerRow
                    name="Ganesh Feed Mills"
                    detail="Aurangabad · 10 t · Bulk"
                    price="₹4,120/t"
                    note="Instant PO"
                  />
                  <BuyerRow
                    name="Pune Wholesale Mandi"
                    detail="Pune · 12.2 t · Open"
                    price="₹4,080/t"
                    note="Market avg"
                  />
                </div>
              </div>
              <div className="flex flex-col rounded-md bg-panel2 p-4 ring-1 ring-gold/30 xl:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="pulse-dot size-2 rounded-full bg-gold" />
                  <div className="text-[11px] uppercase tracking-[0.14em] text-gold">
                    Best option · live
                  </div>
                </div>
                <div className="mt-3 text-sm leading-relaxed text-mute">
                  Store 12.2 t at <span className="font-medium text-ink">Khed Cold Works</span> for
                  30 days, then sell to <span className="font-medium text-ink">Krishna Oils</span>.
                </div>
                <div className="mt-4 rounded-md bg-ground/50 p-3 ring-1 ring-line">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-faint">Expected net profit</span>
                    <span className="text-[11px] text-leaf">Risk · Low</span>
                  </div>
                  <div className={`mt-1 font-mono text-3xl font-semibold ${decision.color}`}>
                    {decision.value}
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-mute">
                  <div className="flex justify-between">
                    <span>Decision</span>
                    <span className="text-ink">{decision.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sell window</span>
                    <span className="text-ink">Nov 12 – Nov 18</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport</span>
                    <span className="text-ink">₹9,400</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLocked(true);
                    notify("Plan locked — your storage and buyer path is saved");
                  }}
                  className={`action-primary mt-4 w-full justify-center ${locked ? "bg-gold text-ground ring-gold/50" : ""}`}
                >
                  {locked ? <Check className="size-4" /> : <PackageCheck className="size-4" />}
                  {locked ? "Plan locked" : "Lock in plan"}
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setShowFarmForm(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-md bg-leaf px-4 py-3 text-sm font-medium text-ground shadow-xl shadow-leaf/15 ring-1 ring-leaf/50 transition hover:bg-leaf/90"
      >
        <Sprout className="size-4" /> New farm plan
      </button>

      {showFarmForm && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-panel p-5 shadow-2xl ring-1 ring-line">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  New planning scenario
                </div>
                <h2 className="mt-1 text-xl font-semibold">Model another farm season</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowFarmForm(false)}
                className="grid size-8 place-items-center rounded-md bg-panel2 text-mute ring-1 ring-line hover:text-ink"
                aria-label="Close new farm plan"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-mute">
                Location
                <input className="field-control" defaultValue="Pune, Maharashtra" />
              </label>
              <label className="text-xs text-mute">
                Land area
                <input className="field-control" defaultValue="6.4 acres" />
              </label>
              <label className="text-xs text-mute">
                Soil condition
                <select className="field-control" defaultValue="Black cotton">
                  <option>Black cotton</option>
                  <option>Red loam</option>
                  <option>Alluvial</option>
                </select>
              </label>
              <label className="text-xs text-mute">
                Season
                <select className="field-control" defaultValue="Kharif">
                  <option>Kharif</option>
                  <option>Rabi</option>
                  <option>Summer</option>
                </select>
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFarmForm(false)}
                className="action-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFarmForm(false);
                  notify("New scenario modeled with your farm context");
                }}
                className="action-primary"
              >
                Run recommendation <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-md bg-panel2 px-4 py-3 text-sm text-ink shadow-xl ring-1 ring-line">
          <Check className="size-4 text-leaf" /> {toast}
        </div>
      )}
    </div>
  );
}

function ContextCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Sprout;
}) {
  return (
    <div className="rounded-md bg-panel p-3 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.14em] text-faint">{label}</div>
        <Icon className="size-3.5 text-faint" />
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
      <div className="text-xs text-mute">{note}</div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  valueClass = "",
  progress = false,
}: {
  label: string;
  value: string;
  note: string;
  valueClass?: string;
  progress?: boolean;
}) {
  return (
    <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
      <div className="text-[11px] text-faint">{label}</div>
      <div className={`mt-1 font-mono text-lg font-semibold ${valueClass}`}>{value}</div>
      <div className="text-[11px] text-mute">{note}</div>
      {progress && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full w-2/5 bg-risk" />
        </div>
      )}
    </div>
  );
}

function StorageRow({
  name,
  price,
  active = false,
}: {
  name: string;
  price: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={active ? "text-ink" : "text-mute"}>{name}</span>
      <span className={`font-mono text-xs ${active ? "text-leaf" : "text-mute"}`}>{price}</span>
    </div>
  );
}

function BuyerRow({
  name,
  detail,
  price,
  note,
  best = false,
}: {
  name: string;
  detail: string;
  price: string;
  note: string;
  best?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-mute">{detail}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm">{price}</div>
        <div className={`text-[11px] ${best ? "text-leaf" : "text-mute"}`}>
          {best && <ArrowUpRight className="mr-0.5 inline size-3" />}
          {note}
        </div>
      </div>
    </div>
  );
}

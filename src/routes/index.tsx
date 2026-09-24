import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
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
  ShieldCheck,
  Sprout,
  SunMedium,
  Users,
  Wheat,
  X,
  EyeOff,
  Eye,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GrowPlanView } from "../components/views/GrowPlanView";
import { AdvisoryView } from "../components/views/AdvisoryView";
import { SellVsStoreView } from "../components/views/SellVsStoreView";
import { StorageView } from "../components/views/StorageView";
import { BuyersView } from "../components/views/BuyersView";
import { ProfitView } from "../components/views/ProfitView";
import { LanguageSelector } from "../components/LanguageSelector";
import { ThemeToggle } from "../components/ThemeToggle";
import { FarmerProfileModal, FarmerProfile } from "../components/FarmerProfileModal";

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

const navItemDefs = [
  { id: "Overview", translationKey: "nav.overview", icon: PanelLeft },
  { id: "Grow plan", translationKey: "nav.growPlan", icon: Sprout },
  { id: "Advisory", translationKey: "nav.advisory", icon: Activity },
  { id: "Sell vs store", translationKey: "nav.sellVsStore", icon: PackageCheck },
  { id: "Storage", translationKey: "nav.storage", icon: ShieldCheck },
  { id: "Buyers", translationKey: "nav.buyers", icon: Users },
  { id: "Profit", translationKey: "nav.profit", icon: Gauge },
];

const workflowSteps = [
  { id: "Grow plan", translationKey: "nav.growPlan", stepNum: "01" },
  { id: "Advisory", translationKey: "nav.advisory", stepNum: "02" },
  { id: "Sell vs store", translationKey: "nav.sellVsStore", stepNum: "03" },
  { id: "Storage", translationKey: "nav.storage", stepNum: "04" },
  { id: "Buyers", translationKey: "nav.buyers", stepNum: "05" },
  { id: "Profit", translationKey: "nav.profit", stepNum: "06" },
];

const priceBars = ["h-8", "h-11", "h-7", "h-14", "h-10", "h-12", "h-14"];

function Index() {
  const { t } = useTranslation();
  const [activeNav, setActiveNav] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sellMode, setSellMode] = useState<"sell" | "store">("store");
  const [accepted, setAccepted] = useState(false);
  const [advisoryOpen, setAdvisoryOpen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [showWorkflowBar, setShowWorkflowBar] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [toast, setToast] = useState("");

  // Farmer & Farm Profile state with local persistence
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("farmer_profile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      name: "Ravi Deshmukh",
      phone: "+91 98230 41102",
      location: "Pune, Maharashtra",
      farmName: "Deshmukh Agro",
      landArea: "6.4 acres",
      soilType: "Black cotton",
      soilPh: "7.1",
      waterSource: "Drip + monsoon",
      budget: "₹2,10,000",
      targetCrop: "Soybean (Vrindavan)",
    };
  });

  const handleSaveProfile = (updatedProfile: FarmerProfile) => {
    setFarmerProfile(updatedProfile);
    if (typeof window !== "undefined") {
      localStorage.setItem("farmer_profile", JSON.stringify(updatedProfile));
    }
  };

  // Determine current active step index dynamically
  const activeStepIndex = useMemo(() => {
    const idx = workflowSteps.findIndex((s) => s.id === activeNav);
    return idx >= 0 ? idx : 0; // Default to Step 01 if on Overview
  }, [activeNav]);

  const decision = useMemo(
    () =>
      sellMode === "store"
        ? { value: "₹3.41 L", delta: "+₹39k net", title: t("overview.store30dRec"), color: "text-leaf" }
        : { value: "₹3.02 L", delta: "today", title: t("overview.sellNow"), color: "text-ink" },
    [sellMode, t],
  );

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const exportPlan = () => {
    const plan = [
      "VERDANT AGRIDECK · FARM-TO-MARKET PLAN",
      `Farmer: ${farmerProfile.name} (${farmerProfile.phone})`,
      `Farm: ${farmerProfile.farmName} · ${farmerProfile.location} · ${farmerProfile.landArea}`,
      `Soil: ${farmerProfile.soilType} (pH ${farmerProfile.soilPh}) · Water: ${farmerProfile.waterSource}`,
      `Crop: ${farmerProfile.targetCrop}`,
      `Decision: ${decision.title} · ${decision.value}`,
      "Buyer: Krishna Oils Ltd · ₹4,350/t · Grade A",
      `Expected net profit: ₹3.41 L · Season Budget: ${farmerProfile.budget}`,
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
      <div className="dashboard-aura pointer-events-none fixed inset-0" />
      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-line bg-panel/80 backdrop-blur-md lg:flex lg:flex-col">
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
            {navItemDefs.map(({ id, translationKey, icon: Icon }) => {
              const label = t(translationKey);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveNav(id);
                    notify(`${label} view selected`);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    activeNav === id
                      ? "bg-leaf/15 text-ink ring-1 ring-leaf/30 font-medium"
                      : "text-mute hover:bg-panel2 hover:text-ink"
                  }`}
                >
                  <Icon className={`size-4 ${activeNav === id ? "text-leaf" : "text-faint"}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
          <div className="mt-auto p-3">
            <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
              <div className="mb-2 flex items-center gap-2">
                <span className="pulse-dot size-2 rounded-full bg-leaf" />
                <span className="text-[11px] text-mute">{t("header.liveDataSynced")}</span>
              </div>
              <div className="text-xs text-mute">{t("header.rainsForecast")}</div>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-ground/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex w-64 flex-col border-r border-line bg-panel p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <Leaf className="size-4 text-leaf" />
                  <span className="font-semibold text-sm">Verdant Agrideck</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="grid size-7 place-items-center rounded bg-panel2 text-mute hover:text-ink"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <LanguageSelector />
                <ThemeToggle />
              </div>

              <nav className="space-y-1">
                {navItemDefs.map(({ id, translationKey, icon: Icon }) => {
                  const label = t(translationKey);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setActiveNav(id);
                        setMobileMenuOpen(false);
                        notify(`${label} view selected`);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                        activeNav === id
                          ? "bg-leaf/15 text-ink ring-1 ring-leaf/30 font-medium"
                          : "text-mute hover:bg-panel2 hover:text-ink"
                      }`}
                    >
                      <Icon className={`size-4 ${activeNav === id ? "text-leaf" : "text-faint"}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1 overflow-auto">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-ground/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md bg-panel ring-1 ring-line lg:hidden"
                aria-label="Open navigation"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="size-4 text-mute" />
              </button>
              <span className="text-mute">
                {t(navItemDefs.find((n) => n.id === activeNav)?.translationKey || "nav.overview")}
              </span>
              <ChevronRight className="size-3 text-faint" />
              <span className="font-medium text-ink">{t("header.seasonPlan")}</span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <LanguageSelector />
              <ThemeToggle />

              {/* Location Badge */}
              <div className="hidden items-center gap-1.5 rounded-md bg-panel px-3 py-1.5 text-mute ring-1 ring-line sm:flex">
                <MapPin className="size-3.5 text-aqua" /> {farmerProfile.location}
              </div>

              {/* Farmer Profile Button */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-md bg-panel px-2.5 py-1.5 ring-1 ring-line hover:bg-panel2 transition-colors"
                onClick={() => setShowProfileModal(true)}
                title="Edit Farmer & Farm Profile"
              >
                <User className="size-3.5 text-leaf" />
                <span className="text-ink font-medium">{farmerProfile.name}</span>
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
            {activeNav === "Grow plan" && <GrowPlanView notify={notify} />}
            {activeNav === "Advisory" && <AdvisoryView notify={notify} />}
            {activeNav === "Sell vs store" && <SellVsStoreView notify={notify} />}
            {activeNav === "Storage" && <StorageView notify={notify} />}
            {activeNav === "Buyers" && <BuyersView notify={notify} />}
            {activeNav === "Profit" && <ProfitView notify={notify} />}

            {activeNav === "Overview" && (
              <div className="space-y-5">
                <section className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-faint">
                        <span className="pulse-dot size-1.5 rounded-full bg-leaf" /> {t("overview.decisionCockpit")}
                      </div>
                      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {t("overview.mainTitle")}
                      </h1>
                      <p className="mt-1 text-sm text-mute">
                        {t("overview.mainSubtitle")}
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
                        {accepted ? t("overview.planAccepted") : t("overview.acceptRec")}
                      </button>
                      <button type="button" onClick={exportPlan} className="action-secondary">
                        <Download className="size-4" />{" "}
                        <span className="hidden sm:inline">{t("overview.exportPlan")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Context Cards dynamically populated from Farmer Profile */}
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <ContextCard
                      label={t("overview.farm")}
                      value={farmerProfile.farmName}
                      note={`${farmerProfile.location} · ${farmerProfile.landArea}`}
                      icon={Wheat}
                    />
                    <ContextCard
                      label={t("overview.soil")}
                      value={farmerProfile.soilType}
                      note={`pH ${farmerProfile.soilPh}`}
                      icon={Sprout}
                    />
                    <ContextCard
                      label={t("overview.water")}
                      value={farmerProfile.waterSource}
                      note="Aqua 3.2 ac-in"
                      icon={Droplets}
                    />
                    <ContextCard
                      label={t("overview.budget")}
                      value={farmerProfile.budget}
                      note="Season cap set"
                      icon={Gauge}
                    />
                  </div>

                  {/* Interactive Dynamic Farm-to-Market Stepper */}
                  {showWorkflowBar && (
                    <div className="overflow-hidden rounded-md bg-panel p-4 ring-1 ring-line">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-[0.14em] text-faint">
                          {t("overview.workflowTitle")}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[11px] text-mute">
                            {t("overview.step")} 0{activeStepIndex + 1} / 06
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowWorkflowBar(false)}
                            className="text-faint hover:text-ink text-xs flex items-center gap-1"
                            title="Hide Workflow Stepper"
                          >
                            <EyeOff className="size-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="grid min-w-[580px] grid-cols-6 gap-2">
                        {workflowSteps.map((step, index) => {
                          const done = index < activeStepIndex;
                          const current = index === activeStepIndex;
                          const stepTitle = t(step.translationKey);

                          return (
                            <button
                              type="button"
                              key={step.id}
                              onClick={() => {
                                setActiveNav(step.id);
                                notify(`${stepTitle} view opened`);
                              }}
                              className="text-left group transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`grid size-5 shrink-0 place-items-center rounded-full text-[10px] transition-colors ${
                                    done
                                      ? "bg-leaf/20 text-leaf ring-1 ring-leaf/50"
                                      : current
                                      ? "bg-gold/20 text-gold ring-1 ring-gold/40 font-bold"
                                      : "bg-panel2 text-faint ring-1 ring-line group-hover:border-leaf"
                                  }`}
                                >
                                  {done ? <Check className="size-3" /> : index + 1}
                                </span>
                                <span
                                  className={`truncate text-xs ${
                                    current
                                      ? "font-semibold text-gold"
                                      : done
                                      ? "font-medium text-ink"
                                      : "text-faint group-hover:text-ink"
                                  }`}
                                >
                                  {stepTitle}
                                </span>
                              </div>
                              <div
                                className={`mt-2 h-1 rounded-full ${
                                  done ? "bg-leaf" : current ? "bg-gold/40" : "bg-line"
                                }`}
                              >
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    current ? "w-full bg-gold" : done ? "w-full bg-leaf" : "w-0"
                                  }`}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!showWorkflowBar && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowWorkflowBar(true)}
                        className="text-xs text-mute hover:text-ink flex items-center gap-1.5 rounded-md bg-panel px-3 py-1.5 ring-1 ring-line"
                      >
                        <Eye className="size-3.5 text-leaf" /> Show Workflow Stepper
                      </button>
                    </div>
                  )}
                </section>

                <section className="grid gap-4 xl:grid-cols-5">
                  <div className="rounded-md bg-panel p-4 ring-1 ring-line xl:col-span-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                        {t("overview.primaryCropRec")}
                      </div>
                      <span className="rounded-full bg-leaf/15 px-2 py-0.5 text-[11px] text-leaf ring-1 ring-leaf/30">
                        {t("overview.highFit")}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xl font-semibold tracking-tight">
                          {t("overview.soybean")} <span className="text-mute">{t("overview.soybeanVariety")}</span>
                        </div>
                        <div className="mt-1 max-w-lg text-sm text-mute">
                          {t("overview.soybeanDesc")}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-[11px] text-faint">{t("overview.expectedProfit")}</div>
                        <div className="font-mono text-2xl font-semibold text-leaf">₹3.14 L</div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <MetricCard label={t("overview.yield")} value="1.9 t/ac" note="12.2 t total" />
                      <MetricCard
                        label={t("overview.margin")}
                        value="41%"
                        note="vs cost ₹5.9 L"
                        valueClass="text-gold"
                      />
                      <MetricCard
                        label={t("overview.riskScore")}
                        value={t("overview.riskModerate")}
                        note={t("overview.weatherSensitive")}
                        valueClass="text-risk"
                        progress
                      />
                    </div>
                    <div className="mt-3 flex flex-col gap-3 rounded-md bg-panel2 p-3 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-2 text-sm text-mute">
                        <MessageSquareText className="mt-0.5 size-4 shrink-0 text-aqua" />
                        <span>
                          {t("overview.cultivateTip")}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdvisoryOpen((value) => !value)}
                        className="action-secondary shrink-0 px-3 py-1.5 text-xs"
                      >
                        {advisoryOpen ? t("overview.closeAdvisory") : t("overview.openAdvisory")}
                      </button>
                    </div>
                    {advisoryOpen && (
                      <div className="mt-3 grid gap-2 rounded-md bg-aqua/10 p-3 text-xs text-mute ring-1 ring-aqua/20 sm:grid-cols-3">
                        <span>
                          <b className="text-ink">{t("overview.nextAction")}:</b> {t("overview.soilTestTip")}
                        </span>
                        <span>
                          <b className="text-ink">{t("overview.irrigation")}:</b> {t("overview.irrigationTip")}
                        </span>
                        <span>
                          <b className="text-ink">{t("overview.watch")}:</b> {t("overview.watchTip")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col rounded-md bg-panel p-4 ring-1 ring-line xl:col-span-2">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                      {t("overview.weatherSoilContext")}
                    </div>
                    <div className="mt-3 flex flex-1 flex-col gap-3">
                      <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <SunMedium className="size-4 text-gold" /> {t("overview.next72h")}
                          </div>
                          <span className="flex items-center gap-1 text-[11px] text-aqua">
                            <CloudRain className="size-3.5" /> {t("overview.rainsIn4h")}
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
                          <div className="text-[11px] text-faint">{t("overview.soilMoisture")}</div>
                          <div className="font-mono text-lg font-semibold">38%</div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                            <div className="h-full w-[38%] bg-leaf" />
                          </div>
                        </div>
                        <div className="rounded-md bg-panel2 p-3 ring-1 ring-line">
                          <div className="text-[11px] text-faint">{t("overview.nitrogen")}</div>
                          <div className="font-mono text-lg font-semibold">{t("overview.nitrogenLow")}</div>
                          <div className="text-[11px] text-mute">{t("overview.topUpAdvised")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-md bg-panel p-4 ring-1 ring-line">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                      {t("overview.marketPriceTrend")}
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <div className="font-mono text-xl font-semibold">₹4,180</div>
                      <div className="flex items-center gap-1 text-xs text-leaf">
                        <ArrowUpRight className="size-3" /> {t("overview.wkGain")}
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
                      {t("overview.soybeanMandalAvg")}
                    </div>
                  </div>
                  <div className="rounded-md bg-panel p-4 ring-1 ring-line">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                      {t("overview.sellVsStore")}
                    </div>
                    <div className="mt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() => setSellMode("sell")}
                        className={`flex w-full items-center justify-between rounded-md p-3 text-left ring-1 ${sellMode === "sell" ? "bg-leaf/10 ring-leaf/40" : "bg-panel2 ring-line"}`}
                      >
                        <span className="text-sm font-medium">{t("overview.sellNow")}</span>
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
                          {t("overview.store30dRec")}
                        </span>
                        <span className="font-mono text-sm text-leaf">₹3.41 L</span>
                        <span className="sr-only">Recommended</span>
                      </button>
                    </div>
                    <div className="mt-2 text-[11px] text-mute">
                      {t("overview.storageAdvantage")}
                    </div>
                  </div>
                  <div className="rounded-md bg-panel p-4 ring-1 ring-line">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                      {t("overview.nearbyColdStorage")}
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      <StorageRow name="AgroFrost Nashik" price="₹3.5/kilo" />
                      <StorageRow name="Khed Cold Works" price="₹2.8/kilo" active />
                      <StorageRow name="Pune AgroStore" price="₹4.1/kilo" />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-mute">
                      <MapPin className="size-3.5 text-aqua" /> {t("overview.coldStorageDist")}
                    </div>
                  </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-5">
                  <div className="rounded-md bg-panel p-4 ring-1 ring-line xl:col-span-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                        {t("overview.buyerMatches")}
                      </div>
                      <span className="text-[11px] text-mute">{t("overview.sortedByOffer")}</span>
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
                        {t("overview.bestOptionLive")}
                      </div>
                    </div>
                    <div className="mt-3 text-sm leading-relaxed text-mute">
                      {t("overview.bestOptionDesc")}
                    </div>
                    <div className="mt-4 rounded-md bg-ground/50 p-3 ring-1 ring-line">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-faint">{t("overview.expectedNetProfit")}</span>
                        <span className="text-[11px] text-leaf">{t("overview.riskLow")}</span>
                      </div>
                      <div className={`mt-1 font-mono text-3xl font-semibold ${decision.color}`}>
                        {decision.value}
                      </div>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-mute">
                      <div className="flex justify-between">
                        <span>{t("overview.decision")}</span>
                        <span className="text-ink">{decision.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("overview.sellWindow")}</span>
                        <span className="text-ink">Nov 12 – Nov 18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("overview.transport")}</span>
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
                      {locked ? t("overview.planLocked") : t("overview.lockPlan")}
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => setShowFarmForm(true)}
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-md bg-leaf px-4 py-3 text-sm font-medium text-ground shadow-xl shadow-leaf/15 ring-1 ring-leaf/50 transition hover:bg-leaf/90"
      >
        <Sprout className="size-4" /> {t("overview.newFarmPlan")}
      </button>

      {showFarmForm && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-panel p-5 shadow-2xl ring-1 ring-line">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-faint">
                  {t("overview.newPlanningScenario")}
                </div>
                <h2 className="mt-1 text-xl font-semibold">{t("overview.modelAnotherSeason")}</h2>
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
                {t("overview.location")}
                <input className="field-control" defaultValue={farmerProfile.location} />
              </label>
              <label className="text-xs text-mute">
                {t("overview.landArea")}
                <input className="field-control" defaultValue={farmerProfile.landArea} />
              </label>
              <label className="text-xs text-mute">
                {t("overview.soilCondition")}
                <select className="field-control" defaultValue={farmerProfile.soilType}>
                  <option>Black cotton</option>
                  <option>Red loam</option>
                  <option>Alluvial</option>
                  <option>Sandy loam</option>
                  <option>Clay loam</option>
                </select>
              </label>
              <label className="text-xs text-mute">
                {t("overview.season")}
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
                {t("overview.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFarmForm(false);
                  notify("New scenario modeled with your farm context");
                }}
                className="action-primary"
              >
                {t("overview.runRec")} <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Farmer Profile Modal */}
      <FarmerProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={farmerProfile}
        onSave={handleSaveProfile}
        notify={notify}
      />

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
      <div className="mt-1 text-sm font-medium truncate">{value}</div>
      <div className="text-xs text-mute truncate">{note}</div>
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

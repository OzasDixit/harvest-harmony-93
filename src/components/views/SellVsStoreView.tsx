import { useState, useMemo } from "react";
import { PackageCheck, ArrowUpRight, ShieldCheck, Clock, DollarSign, TrendingUp, AlertCircle } from "lucide-react";

interface SellVsStoreViewProps {
  notify?: (msg: string) => void;
}

export function SellVsStoreView({ notify }: SellVsStoreViewProps) {
  const [holdingDays, setHoldingDays] = useState<number>(30);
  const [cropQuantityTonnes] = useState<number>(12.2);
  const [currentMandiPrice] = useState<number>(4180); // per quintal (10 quintals = 1 tonne)

  // Calculations
  const sellNowRevenue = (cropQuantityTonnes * 10) * currentMandiPrice; // Rs

  const expectedPricePerQuintal = useMemo(() => {
    if (holdingDays === 30) return 4650;
    if (holdingDays === 60) return 4820;
    return 4900;
  }, [holdingDays]);

  const storageCostPerQuintalPerMonth = 350; // Rs per quintal
  const months = holdingDays / 30;
  const totalStorageCost = (cropQuantityTonnes * 10) * storageCostPerQuintalPerMonth * months;
  const spoilageLossTonnes = cropQuantityTonnes * (0.02 * months); // 2% per month
  const netSellableTonnes = cropQuantityTonnes - spoilageLossTonnes;

  const storedGrossRevenue = (netSellableTonnes * 10) * expectedPricePerQuintal;
  const storedNetProfit = storedGrossRevenue - totalStorageCost;
  const netAdvantage = storedNetProfit - sellNowRevenue;

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold">
              <PackageCheck className="size-4 text-gold" /> Post-Harvest Market Decision Matrix
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Sell Now vs. Cold Storage Strategy
            </h2>
            <p className="mt-1 text-sm text-mute">
              Simulate net profit margins by holding 12.2 tonnes of Soybean in climate-controlled storage vs immediate mandi disposal.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="rounded-md bg-panel p-4 ring-1 ring-line">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute">
          Select Storage Horizon
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[30, 60, 90].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => {
                setHoldingDays(days);
                if (notify) notify(`Simulating ${days}-day storage horizon`);
              }}
              className={`rounded-md p-3 text-center transition-all ring-1 ${
                holdingDays === days
                  ? "bg-leaf/15 ring-leaf text-ink font-semibold"
                  : "bg-panel2 ring-line text-mute hover:text-ink"
              }`}
            >
              <div className="text-sm font-medium">{days} Days Hold</div>
              <div className="text-xs text-leaf mt-1">
                +₹{days === 30 ? "470" : days === 60 ? "640" : "720"}/q expected
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Sell Now */}
        <div className="rounded-md bg-panel p-5 ring-1 ring-line flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-mute">Option A</span>
              <span className="rounded bg-panel2 px-2 py-0.5 text-xs text-mute">Immediate Liquidity</span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-ink">Sell Today at Mandi</h3>
            <div className="mt-4 space-y-2 text-xs text-mute">
              <div className="flex justify-between">
                <span>Current Mandi Price:</span>
                <span className="font-mono text-ink">₹{currentMandiPrice} / quintal</span>
              </div>
              <div className="flex justify-between">
                <span>Total Volume:</span>
                <span className="font-mono text-ink">122 Quintals (12.2 t)</span>
              </div>
              <div className="flex justify-between">
                <span>Storage & Spoilage Cost:</span>
                <span className="font-mono text-leaf">₹0</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-panel2 p-3.5 ring-1 ring-line">
            <div className="text-xs text-faint uppercase">Net Revenue Today</div>
            <div className="mt-1 font-mono text-2xl font-bold text-ink">
              ₹{sellNowRevenue.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Store & Hold */}
        <div className="rounded-md bg-panel p-5 ring-1 ring-leaf/40 border-2 border-leaf/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-leaf flex items-center gap-1">
                <ShieldCheck className="size-3.5" /> Option B (Recommended)
              </span>
              <span className="rounded bg-leaf/20 px-2 py-0.5 text-xs font-semibold text-leaf">
                +{Math.round((netAdvantage / sellNowRevenue) * 100)}% Higher Gain
              </span>
            </div>
            <h3 className="mt-3 text-lg font-bold text-leaf">Store for {holdingDays} Days</h3>
            <div className="mt-4 space-y-2 text-xs text-mute">
              <div className="flex justify-between">
                <span>Projected Mandi Price:</span>
                <span className="font-mono text-leaf font-medium">₹{expectedPricePerQuintal} / quintal</span>
              </div>
              <div className="flex justify-between">
                <span>Storage Rental ({holdingDays}d):</span>
                <span className="font-mono text-risk">-₹{totalStorageCost.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Spoilage Buffer ({(0.02 * months * 100).toFixed(1)}%):</span>
                <span className="font-mono text-mute">{netSellableTonnes.toFixed(1)} t net volume</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-leaf/10 p-3.5 ring-1 ring-leaf/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-faint uppercase">Net Revenue After Storage</span>
              <span className="text-xs font-bold text-leaf">+₹{netAdvantage.toLocaleString("en-IN")} Advantage</span>
            </div>
            <div className="mt-1 font-mono text-2xl font-bold text-leaf">
              ₹{storedNetProfit.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

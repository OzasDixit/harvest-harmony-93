import { useState } from "react";
import { Check, Calendar, Sprout, Shield, Thermometer, Droplets, Info } from "lucide-react";

interface GrowPlanViewProps {
  notify?: (msg: string) => void;
}

export function GrowPlanView({ notify }: GrowPlanViewProps) {
  const [selectedCrop, setSelectedCrop] = useState("Soybean (Vrindavan)");

  const stages = [
    { stage: "Stage 1: Soil Prep & Sowing", days: "Day 0 - 10", status: "completed", details: "Deep tillage, apply FYM 5 t/ha, sow at 30cm row spacing." },
    { stage: "Stage 2: Germination & Early Veg", days: "Day 10 - 25", status: "current", details: "Apply basal NPK (12:24:12), first weed management." },
    { stage: "Stage 3: Flowering & Pod Initiation", days: "Day 25 - 55", status: "upcoming", details: "Foliar spray of 19:19:19, monitor yellow mosaic virus." },
    { stage: "Stage 4: Pod Filling & Maturation", days: "Day 55 - 90", status: "upcoming", details: "Maintain optimum moisture, stop irrigation 10 days before harvest." },
    { stage: "Stage 5: Harvesting & Threshing", days: "Day 90 - 105", status: "upcoming", details: "Harvest when pods turn golden brown, moisture at 12-14%." }
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <Sprout className="size-4 text-leaf" /> Cultivation Strategy & Agronomy
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Crop Grow Plan · Kharif Season
            </h2>
            <p className="mt-1 text-sm text-mute">
              Agronomic schedule tailored for 6.4 acres in Pune (Black cotton soil, drip irrigated).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCrop}
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                if (notify) notify(`Grow plan updated for ${e.target.value}`);
              }}
              className="rounded-md border border-line bg-panel2 px-3 py-2 text-xs text-ink focus:border-leaf focus:outline-none"
            >
              <option>Soybean (Vrindavan)</option>
              <option>Wheat (Sharbati)</option>
              <option>Onion (Red Nashik)</option>
              <option>Tomato (Hybrid)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="text-xs text-faint uppercase tracking-wider">Target Yield</span>
            <Sprout className="size-4 text-leaf" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold text-leaf">1.9 t / acre</div>
          <div className="mt-1 text-xs text-mute">12.2 tonnes total target across 6.4 acres</div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="text-xs text-faint uppercase tracking-wider">Cultivation Window</span>
            <Calendar className="size-4 text-gold" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold text-gold">105 Days</div>
          <div className="mt-1 text-xs text-mute">Sown: July 15 · Expected Harvest: Oct 28</div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="text-xs text-faint uppercase tracking-wider">Estimated Input Cost</span>
            <Shield className="size-4 text-aqua" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold text-aqua">₹41,500 / acre</div>
          <div className="mt-1 text-xs text-mute">Seed, ferts, pesticides, drip maintenance</div>
        </div>
      </div>

      {/* Stage Roadmap */}
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            Growth Stage Roadmap & Tasks
          </h3>
          <span className="text-xs text-gold font-medium">Currently in Stage 2</span>
        </div>

        <div className="space-y-4">
          {stages.map((stg, i) => (
            <div
              key={stg.stage}
              className={`flex flex-col gap-2 rounded-md p-3.5 ring-1 ${
                stg.status === "completed"
                  ? "bg-leaf/10 ring-leaf/30 text-ink"
                  : stg.status === "current"
                  ? "bg-gold/10 ring-gold/40 text-ink"
                  : "bg-panel2 ring-line text-mute"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid size-5 place-items-center rounded-full text-xs font-bold ${
                      stg.status === "completed"
                        ? "bg-leaf text-ground"
                        : stg.status === "current"
                        ? "bg-gold text-ground"
                        : "bg-line text-faint"
                    }`}
                  >
                    {stg.status === "completed" ? <Check className="size-3" /> : i + 1}
                  </span>
                  <span className="font-semibold text-sm">{stg.stage}</span>
                </div>
                <span className="font-mono text-xs text-faint">{stg.days}</span>
              </div>
              <p className="pl-7 text-xs text-mute">{stg.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

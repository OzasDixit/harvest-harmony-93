import { useState } from "react";
import { Calendar, Sprout, Shield } from "lucide-react";

interface GrowPlanViewProps {
  notify?: (msg: string) => void;
}

export function GrowPlanView({ notify }: GrowPlanViewProps) {
  const [selectedCrop, setSelectedCrop] = useState("Soybean (Vrindavan)");

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
    </div>
  );
}

import { useState } from "react";
import { Calendar, Sprout, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GrowPlanViewProps {
  notify?: (msg: string) => void;
}

export function GrowPlanView({ notify }: GrowPlanViewProps) {
  const { t } = useTranslation();
  const [selectedCrop, setSelectedCrop] = useState("Soybean (Vrindavan)");

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <Sprout className="size-4 text-leaf" /> {t("growPlan.cultivationStrategy")}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {t("growPlan.title")}
            </h2>
            <p className="mt-1 text-sm text-mute">
              {t("growPlan.subtitle")}
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
            <span className="text-xs text-faint uppercase tracking-wider">{t("growPlan.targetYield")}</span>
            <Sprout className="size-4 text-leaf" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold text-leaf">1.9 t / acre</div>
          <div className="mt-1 text-xs text-mute">{t("growPlan.targetYieldSub")}</div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="text-xs text-faint uppercase tracking-wider">{t("growPlan.cultivationWindow")}</span>
            <Calendar className="size-4 text-gold" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold text-gold">105 {t("growPlan.days")}</div>
          <div className="mt-1 text-xs text-mute">{t("growPlan.cultivationWindowSub")}</div>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-line">
          <div className="flex items-center justify-between">
            <span className="text-xs text-faint uppercase tracking-wider">{t("growPlan.estInputCost")}</span>
            <Shield className="size-4 text-aqua" />
          </div>
          <div className="mt-2 font-mono text-2xl font-semibold text-aqua">₹41,500 / acre</div>
          <div className="mt-1 text-xs text-mute">{t("growPlan.estInputCostSub")}</div>
        </div>
      </div>
    </div>
  );
}

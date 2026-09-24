import { useState } from "react";
import { X, User, MapPin, Phone, Sprout, Droplets, Gauge, Wheat, Save, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface FarmerProfile {
  name: string;
  phone: string;
  location: string;
  farmName: string;
  landArea: string;
  soilType: string;
  soilPh: string;
  waterSource: string;
  budget: string;
  targetCrop: string;
}

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  onSave: (updatedProfile: FarmerProfile) => void;
  notify?: (msg: string) => void;
}

export function FarmerProfileModal({
  isOpen,
  onClose,
  profile,
  onSave,
  notify,
}: FarmerProfileModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FarmerProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (notify) notify("Farmer & Farm profile updated successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-md bg-panel p-6 shadow-2xl ring-1 ring-line max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-md bg-leaf/15 ring-1 ring-leaf/40">
              <User className="size-5 text-leaf" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-ink">
                {t("profile.title", "Farmer & Farm Profile")}
              </h2>
              <p className="text-xs text-mute">
                {t("profile.subtitle", "Update your personal details, farm land area, soil type, and budget.")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-md bg-panel2 text-mute ring-1 ring-line hover:text-ink"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Section 1: Farmer Details */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-leaf flex items-center gap-1.5">
              <User className="size-3.5" /> {t("profile.farmerDetails", "Farmer Information")}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.farmerName", "Farmer Name")}</span>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-2 text-ink focus:border-leaf focus:outline-none"
                    required
                  />
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.phone", "Phone / Mobile")}</span>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-2 text-ink focus:border-leaf focus:outline-none"
                  />
                </div>
              </label>

              <label className="space-y-1 sm:col-span-2">
                <span className="text-mute font-medium">{t("profile.location", "Location / District")}</span>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-2 text-ink focus:border-leaf focus:outline-none"
                    placeholder="e.g. Pune, Maharashtra"
                    required
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="border-t border-line/60 pt-3" />

          {/* Section 2: Farm & Soil Details */}
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <Sprout className="size-3.5" /> {t("profile.farmDetails", "Farm & Soil Specification")}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.farmName", "Farm Name")}</span>
                <div className="relative">
                  <Wheat className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
                  <input
                    type="text"
                    value={formData.farmName}
                    onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                    className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-2 text-ink focus:border-leaf focus:outline-none"
                    required
                  />
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.landArea", "Total Land Area")}</span>
                <input
                  type="text"
                  value={formData.landArea}
                  onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                  className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-ink focus:border-leaf focus:outline-none"
                  placeholder="e.g. 6.4 acres"
                  required
                />
              </label>

              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.soilType", "Soil Type")}</span>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-ink focus:border-leaf focus:outline-none"
                >
                  <option value="Black cotton">Black cotton (काळी जमीन)</option>
                  <option value="Red loam">Red loam (ఎర్ర నేల)</option>
                  <option value="Alluvial">Alluvial (వண்டల్ మణ్)</option>
                  <option value="Sandy loam">Sandy loam</option>
                  <option value="Clay loam">Clay loam</option>
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.soilPh", "Soil pH Level")}</span>
                <input
                  type="text"
                  value={formData.soilPh}
                  onChange={(e) => setFormData({ ...formData, soilPh: e.target.value })}
                  className="w-full rounded-md border border-line bg-panel2 px-3 py-2 text-ink focus:border-leaf focus:outline-none"
                  placeholder="e.g. 7.1 (Loam rich)"
                />
              </label>

              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.waterSource", "Water & Irrigation Source")}</span>
                <div className="relative">
                  <Droplets className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
                  <select
                    value={formData.waterSource}
                    onChange={(e) => setFormData({ ...formData, waterSource: e.target.value })}
                    className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-2 text-ink focus:border-leaf focus:outline-none"
                  >
                    <option value="Drip + monsoon">Drip + monsoon</option>
                    <option value="Canal irrigation">Canal irrigation</option>
                    <option value="Borewell + drip">Borewell + drip</option>
                    <option value="Rainfed monsoon">Rainfed monsoon</option>
                  </select>
                </div>
              </label>

              <label className="space-y-1">
                <span className="text-mute font-medium">{t("profile.budgetCap", "Season Budget Cap")}</span>
                <div className="relative">
                  <Gauge className="absolute left-2.5 top-2.5 size-3.5 text-faint" />
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-md border border-line bg-panel2 pl-8 pr-3 py-2 text-ink focus:border-leaf focus:outline-none"
                    placeholder="e.g. ₹2,10,000"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-line pt-4">
            <button
              type="button"
              onClick={onClose}
              className="action-secondary text-xs"
            >
              {t("overview.cancel", "Cancel")}
            </button>
            <button
              type="submit"
              className="action-primary text-xs"
            >
              <Save className="size-3.5" /> {t("profile.saveProfile", "Save Profile & Update Context")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

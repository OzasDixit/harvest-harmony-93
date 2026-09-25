import { useState, useEffect } from "react";
import {
  User,
  Building,
  Sprout,
  ShieldCheck,
  Check,
  Save,
  Layers,
  MapPin,
  Phone,
  Mail,
  Warehouse,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import {
  UserAccount,
  FarmerProfileEntity,
  BuyerProfileEntity,
  UserRole,
  BuyerClassification,
} from "../../server/api-handler";
import {
  updateFarmerProfile,
  updateBuyerProfile,
  updateAccountDetails,
} from "../../lib/api-client";

interface AccountSettingsViewProps {
  currentUser: UserAccount;
  farmerProfile?: FarmerProfileEntity | null;
  buyerProfile?: BuyerProfileEntity | null;
  onUpdateUser: (user: UserAccount) => void;
  onUpdateFarmerProfile: (profile: FarmerProfileEntity) => void;
  onUpdateBuyerProfile: (profile: BuyerProfileEntity) => void;
  notify?: (msg: string) => void;
}

export function AccountSettingsView({
  currentUser,
  farmerProfile,
  buyerProfile,
  onUpdateUser,
  onUpdateFarmerProfile,
  onUpdateBuyerProfile,
  notify,
}: AccountSettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"account" | "farmer" | "buyer">(() =>
    currentUser.role === "BUYER" ? "buyer" : "farmer"
  );

  // Core account state
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [location, setLocation] = useState(currentUser.location);

  // Farmer profile state
  const [farmName, setFarmName] = useState(farmerProfile?.farmName || "");
  const [landArea, setLandArea] = useState(farmerProfile?.landArea || "");
  const [soilType, setSoilType] = useState(farmerProfile?.soilType || "Black cotton");
  const [soilPh, setSoilPh] = useState(farmerProfile?.soilPh || "7.1");
  const [waterSource, setWaterSource] = useState(farmerProfile?.waterSource || "Drip + monsoon");
  const [budget, setBudget] = useState(farmerProfile?.budget || "₹2,10,000");
  const [targetCrop, setTargetCrop] = useState(farmerProfile?.targetCrop || "Soybean (JS 335)");
  const [kisanId, setKisanId] = useState(farmerProfile?.kisanId || "MH-PUN-2024-8841");

  // Buyer profile state
  const [company, setCompany] = useState(buyerProfile?.company || "");
  const [buyerType, setBuyerType] = useState<BuyerClassification>(
    buyerProfile?.buyerType || currentUser.buyerClassification || "MARKET"
  );
  const [apmcLicense, setApmcLicense] = useState(buyerProfile?.apmcLicense || "");
  const [wdraCode, setWdraCode] = useState(buyerProfile?.wdraCode || "N/A");
  const [capacity, setCapacity] = useState(buyerProfile?.capacity || "1,000 Tonnes");
  const [commodities, setCommodities] = useState(buyerProfile?.commodities?.join(", ") || "Soybean, Wheat");
  const [paymentTerms, setPaymentTerms] = useState(buyerProfile?.paymentTerms || "Direct RTGS / NEFT");

  const [savingAccount, setSavingAccount] = useState(false);
  const [savingFarmer, setSavingFarmer] = useState(false);
  const [savingBuyer, setSavingBuyer] = useState(false);

  // Keep state synced when props change
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setLocation(currentUser.location);
  }, [currentUser]);

  useEffect(() => {
    if (farmerProfile) {
      setFarmName(farmerProfile.farmName);
      setLandArea(farmerProfile.landArea);
      setSoilType(farmerProfile.soilType);
      setSoilPh(farmerProfile.soilPh);
      setWaterSource(farmerProfile.waterSource);
      setBudget(farmerProfile.budget);
      setTargetCrop(farmerProfile.targetCrop);
      setKisanId(farmerProfile.kisanId);
    }
  }, [farmerProfile]);

  useEffect(() => {
    if (buyerProfile) {
      setCompany(buyerProfile.company);
      setBuyerType(buyerProfile.buyerClassification || buyerProfile.buyerType || "MARKET");
      setApmcLicense(buyerProfile.apmcLicense);
      setWdraCode(buyerProfile.wdraCode);
      setCapacity(buyerProfile.capacity);
      setCommodities(buyerProfile.commodities?.join(", ") || "Soybean, Wheat");
      setPaymentTerms(buyerProfile.paymentTerms);
    }
  }, [buyerProfile]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAccount(true);
    const updated = await updateAccountDetails({
      id: currentUser.id,
      name,
      email,
      phone,
      location,
    });
    setSavingAccount(false);
    if (updated) {
      onUpdateUser(updated);
      if (notify) notify("Account profile updated successfully");
    }
  };

  const handleSaveFarmer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFarmer(true);
    const updated = await updateFarmerProfile({
      userId: currentUser.id,
      name,
      phone,
      email,
      location,
      farmName,
      landArea,
      soilType,
      soilPh,
      waterSource,
      budget,
      targetCrop,
      kisanId,
    });
    setSavingFarmer(false);
    if (updated) {
      onUpdateFarmerProfile(updated);
      if (notify) notify("Farmer telemetry and agronomic details saved");
    }
  };

  const handleSaveBuyer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBuyer(true);
    const updated = await updateBuyerProfile({
      userId: currentUser.id,
      name,
      phone,
      email,
      location,
      company,
      buyerType,
      apmcLicense,
      wdraCode,
      capacity,
      commodities: commodities.split(",").map((s) => s.trim()).filter(Boolean),
      paymentTerms,
    });
    setSavingBuyer(false);
    if (updated) {
      onUpdateBuyerProfile(updated);
      if (currentUser.buyerClassification !== buyerType) {
        onUpdateUser({ ...currentUser, buyerClassification: buyerType });
      }
      if (notify) notify("Commercial buyer credentials & specs saved");
    }
  };

  const isBoth = currentUser.role === "BOTH";
  const isFarmer = currentUser.role === "FARMER" || isBoth;
  const isBuyer = currentUser.role === "BUYER" || isBoth;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-leaf">
              <User className="size-4 text-leaf" /> Identity & Domain Configuration
            </div>
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              KrishiAstra Account & Profile Settings
            </h1>
            <p className="mt-1 text-sm text-mute">
              Manage core credentials and domain-specific attributes for your account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded px-3 py-1.5 text-xs font-bold ring-1 ${
                isBoth
                  ? "bg-gold/20 text-gold ring-gold/40"
                  : currentUser.role === "FARMER"
                  ? "bg-leaf/20 text-leaf ring-leaf/40"
                  : "bg-aqua/20 text-aqua ring-aqua/40"
              }`}
            >
              Account Identity: {currentUser.role === "BOTH" ? "FARMER & BUYER (BOTH)" : currentUser.role}
              {currentUser.role === "BUYER" && ` (${currentUser.buyerClassification || buyerType})`}
            </span>
          </div>
        </div>

        {/* Tab selection */}
        <div className="mt-5 flex flex-wrap gap-2 border-t border-line/60 pt-4">
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === "account"
                ? "bg-panel2 text-ink ring-1 ring-line font-bold"
                : "text-mute hover:text-ink"
            }`}
          >
            <User className="size-3.5" /> General Account
          </button>

          {isFarmer && (
            <button
              type="button"
              onClick={() => setActiveTab("farmer")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "farmer"
                  ? "bg-leaf text-ground font-bold"
                  : "text-mute hover:text-ink"
              }`}
            >
              <Sprout className="size-3.5" /> Farmer Profile
            </button>
          )}

          {isBuyer && (
            <button
              type="button"
              onClick={() => setActiveTab("buyer")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === "buyer"
                  ? "bg-aqua text-ground font-bold"
                  : "text-mute hover:text-ink"
              }`}
            >
              <Building className="size-3.5" /> Buyer & Commercial Entity
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: General Account Credentials */}
      {activeTab === "account" && (
        <form onSubmit={handleSaveAccount} className="rounded-md bg-panel p-5 ring-1 ring-line space-y-4">
          <div className="border-b border-line pb-3">
            <h3 className="text-base font-bold text-ink">Personal & Authentication Credentials</h3>
            <p className="text-xs text-mute mt-0.5">Primary login details and contact identifier.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            <label className="text-mute">
              Full Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="field-control mt-1"
                required
              />
            </label>

            <label className="text-mute">
              Primary Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-control mt-1"
                required
              />
            </label>

            <label className="text-mute">
              Primary Phone
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field-control mt-1"
                required
              />
            </label>

            <label className="text-mute">
              Primary Location
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="field-control mt-1"
                required
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={savingAccount} className="action-primary flex items-center gap-1.5">
              <Save className="size-3.5" /> {savingAccount ? "Saving..." : "Save Account Details"}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Farmer Profile Details */}
      {activeTab === "farmer" && isFarmer && (
        <form onSubmit={handleSaveFarmer} className="rounded-md bg-panel p-5 ring-1 ring-line space-y-4">
          <div className="border-b border-line pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sprout className="size-4 text-leaf" />
                <h3 className="text-base font-bold text-ink">Farmer Domain Profile</h3>
              </div>
              <p className="text-xs text-mute mt-0.5">
                Acreage, soil health, water source, and target crops used in Agronomic Advisory and Sell vs Store evaluation.
              </p>
            </div>
            <span className="rounded bg-leaf/20 px-2.5 py-1 text-[11px] font-bold text-leaf ring-1 ring-leaf/40">
              Kisan Verified
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <label className="text-mute">
              Farm Name
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute">
              Total Land Area
              <input
                type="text"
                value={landArea}
                onChange={(e) => setLandArea(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute">
              Kisan Registration ID
              <input
                type="text"
                value={kisanId}
                onChange={(e) => setKisanId(e.target.value)}
                className="field-control mt-1 font-mono"
              />
            </label>

            <label className="text-mute">
              Soil Type
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="field-control mt-1"
              >
                <option>Black cotton</option>
                <option>Red loam</option>
                <option>Alluvial</option>
                <option>Sandy loam</option>
                <option>Clay loam</option>
              </select>
            </label>

            <label className="text-mute">
              Soil pH Level
              <input
                type="text"
                value={soilPh}
                onChange={(e) => setSoilPh(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute">
              Water Source & Irrigation
              <input
                type="text"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute">
              Current Target Crop
              <input
                type="text"
                value={targetCrop}
                onChange={(e) => setTargetCrop(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute">
              Seasonal Cultivation Budget
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="field-control mt-1"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={savingFarmer} className="action-primary flex items-center gap-1.5">
              <Save className="size-3.5" /> {savingFarmer ? "Saving..." : "Update Farmer Profile"}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Buyer & Commercial Entity Details */}
      {activeTab === "buyer" && isBuyer && (
        <form onSubmit={handleSaveBuyer} className="rounded-md bg-panel p-5 ring-1 ring-line space-y-4">
          <div className="border-b border-line pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Building className="size-4 text-aqua" />
                <h3 className="text-base font-bold text-ink">Commercial Buyer & Facility Profile</h3>
              </div>
              <p className="text-xs text-mute mt-0.5">
                Corporate credentials, APMC mandi trading license, WDRA storage capacity, and accepted crop commodities.
              </p>
            </div>
            <span className="rounded bg-aqua/20 px-2.5 py-1 text-[11px] font-bold text-aqua ring-1 ring-aqua/40">
              Commercial Entity
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs">
            <label className="text-mute">
              Enterprise / Company Name
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="field-control mt-1"
                required
              />
            </label>

            <label className="text-mute">
              Buyer Classification (Single Choice)
              <select
                value={buyerType}
                onChange={(e) => setBuyerType(e.target.value as BuyerClassification)}
                className="field-control mt-1"
              >
                <option value="MARKET">Market / Mandi Trader (Solvent / Miller / Merchant)</option>
                <option value="STORAGE">Cold Storage & Silo Operator</option>
                <option value="BOTH">Both (Mandi Procurement & Cold Storage Operator)</option>
              </select>
            </label>

            <label className="text-mute">
              APMC Merchant License Code
              <input
                type="text"
                value={apmcLicense}
                onChange={(e) => setApmcLicense(e.target.value)}
                className="field-control mt-1 font-mono"
              />
            </label>

            <label className="text-mute">
              WDRA Warehouse Registration Code
              <input
                type="text"
                value={wdraCode}
                onChange={(e) => setWdraCode(e.target.value)}
                className="field-control mt-1 font-mono"
              />
            </label>

            <label className="text-mute">
              Facility / Monthly Processing Capacity
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute">
              Target Commodities (Comma-separated)
              <input
                type="text"
                value={commodities}
                onChange={(e) => setCommodities(e.target.value)}
                className="field-control mt-1"
              />
            </label>

            <label className="text-mute sm:col-span-2">
              Payment & Settlement Terms
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="field-control mt-1"
              />
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={savingBuyer} className="action-primary flex items-center gap-1.5">
              <Save className="size-3.5" /> {savingBuyer ? "Saving..." : "Update Buyer Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

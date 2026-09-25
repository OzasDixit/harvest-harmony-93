import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Phone,
  MessageCircle,
  MapPin,
  Wheat,
  ShieldCheck,
  CheckCircle2,
  ArrowUpDown,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  Warehouse,
  X,
  ExternalLink,
} from "lucide-react";
import { fetchFarmers, fetchMandiPrices, submitInquiry } from "../../lib/api-client";
import { FarmerRecord, MandiPriceRecord, BuyerProfileEntity } from "../../server/api-handler";

interface BuyerDashboardViewProps {
  buyerRole?: "BUYER_MARKET" | "BUYER_STORAGE";
  buyerClassification?: "STORAGE" | "MARKET" | "BOTH";
  buyerProfile?: BuyerProfileEntity | null | undefined;
  notify?: ((msg: string) => void) | undefined;
}

export function BuyerDashboardView({ buyerRole, buyerClassification, buyerProfile, notify }: BuyerDashboardViewProps) {
  const [farmers, setFarmers] = useState<FarmerRecord[]>([]);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [minVolumeQuintals, setMinVolumeQuintals] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"volume" | "price" | "distance">("volume");
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRecord | null>(null);
  const [offerNote, setOfferNote] = useState("");
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [farmerList, mandiList] = await Promise.all([
        fetchFarmers(),
        fetchMandiPrices(),
      ]);
      setFarmers(farmerList);
      setMandiPrices(mandiList);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter & sort farmers
  const filteredFarmers = farmers
    .filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCrop =
        selectedCrop === "all" ||
        f.crop.toLowerCase().includes(selectedCrop.toLowerCase()) ||
        f.commodity.toLowerCase().includes(selectedCrop.toLowerCase());
      const matchesDistrict =
        selectedDistrict === "all" || f.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchesVolume = f.quantityQuintals >= minVolumeQuintals;
      return matchesSearch && matchesCrop && matchesDistrict && matchesVolume;
    })
    .sort((a, b) => {
      if (sortBy === "volume") return b.quantityQuintals - a.quantityQuintals;
      if (sortBy === "price") return a.askingPricePerQuintal - b.askingPricePerQuintal;
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      return 0;
    });

  // Calculate procurement metrics
  const totalAvailableQuintals = filteredFarmers.reduce((acc, f) => acc + f.quantityQuintals, 0);
  const totalAvailableTonnes = (totalAvailableQuintals / 10).toFixed(1);
  const avgAskingPrice = filteredFarmers.length > 0
    ? Math.round(filteredFarmers.reduce((acc, f) => acc + f.askingPricePerQuintal, 0) / filteredFarmers.length)
    : 0;

  const handleOpenOutreach = (f: FarmerRecord) => {
    setSelectedFarmer(f);
    setOfferNote(`Greetings ${f.name}, regarding your listing of ${f.quantityQuintals} qtl of ${f.crop}. We are interested in inspecting and purchasing.`);
    setInquirySuccess(false);
  };

  const handleSendProcurementOffer = async () => {
    if (!selectedFarmer) return;
    await submitInquiry({
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      farmerPhone: selectedFarmer.phone,
      buyerId: buyerProfile?.userId || "b-market-1",
      buyerName: buyerProfile?.company || "Procurement Desk",
      commodity: selectedFarmer.crop,
      quantityQuintals: selectedFarmer.quantityQuintals,
      proposedRate: `₹${selectedFarmer.askingPricePerQuintal} / quintal`,
      notes: offerNote,
    });
    setInquirySuccess(true);
    if (notify) notify(`Procurement inquiry recorded for ${selectedFarmer.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Buyer Hero Telemetry Banner */}
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-leaf">
              {buyerClassification === "STORAGE" || buyerRole === "BUYER_STORAGE" ? (
                <>
                  <Warehouse className="size-4 text-aqua" /> Cold Storage & Warehouse Operator Hub
                </>
              ) : buyerClassification === "BOTH" ? (
                <>
                  <Building className="size-4 text-gold" /> Integrated Buyer (Mandi Procurement & Storage)
                </>
              ) : (
                <>
                  <Building className="size-4 text-gold" /> Commercial Buyer & Mandi Trader Terminal
                </>
              )}
            </div>
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Verified Farmer Yield Telemetry & Sourcing Portal
            </h1>
            <p className="mt-1 text-sm text-mute">
              Real-time directory of verified agricultural producers, harvest lots, asking rates, and storage readiness. Connect directly with producers for procurement or warehousing intake.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-md bg-panel2 p-3 text-right ring-1 ring-line">
              <div className="text-[10px] uppercase tracking-wider text-faint">Logged As</div>
              <div className="text-xs font-bold text-ink">{buyerProfile?.name || "Procurement Manager"}</div>
              <div className="text-[10px] text-mute">{buyerProfile?.company || "Merchant Desk"}</div>
            </div>
          </div>
        </div>

        {/* Aggregate KPI Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 border-t border-line/60">
          <div className="rounded bg-panel2 p-3 ring-1 ring-line">
            <div className="text-[11px] text-faint">Available Supply</div>
            <div className="mt-1 font-mono text-xl font-bold text-ink">
              {totalAvailableQuintals} <span className="text-xs font-normal text-mute">qtl ({totalAvailableTonnes} t)</span>
            </div>
            <div className="text-[10px] text-mute">{filteredFarmers.length} active producer lots</div>
          </div>

          <div className="rounded bg-panel2 p-3 ring-1 ring-line">
            <div className="text-[11px] text-faint">Avg Producer Ask</div>
            <div className="mt-1 font-mono text-xl font-bold text-leaf">
              ₹{avgAskingPrice} <span className="text-xs font-normal text-mute">/ qtl</span>
            </div>
            <div className="text-[10px] text-mute">Across filtered commodities</div>
          </div>

          <div className="rounded bg-panel2 p-3 ring-1 ring-line">
            <div className="text-[11px] text-faint">Mandi Benchmark</div>
            <div className="mt-1 font-mono text-xl font-bold text-gold">
              ₹4,080 - 4,180
            </div>
            <div className="text-[10px] text-mute">data.gov.in Pune/Nashik</div>
          </div>

          <div className="rounded bg-panel2 p-3 ring-1 ring-line">
            <div className="text-[11px] text-faint">Direct Verification</div>
            <div className="mt-1 font-mono text-xl font-bold text-aqua">100%</div>
            <div className="text-[10px] text-mute">Kisan ID & Phone Verified</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-md bg-panel p-4 ring-1 ring-line space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-faint" />
            <input
              type="text"
              placeholder="Search by farmer name, crop variety, farm name, or village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md bg-panel2 pl-9 pr-3 py-2 text-xs text-ink placeholder:text-faint ring-1 ring-line focus:outline-none focus:ring-leaf"
            />
          </div>

          {/* Crop Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-mute whitespace-nowrap">Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="rounded-md bg-panel2 px-3 py-2 text-xs text-ink ring-1 ring-line focus:outline-none"
            >
              <option value="all">All Crops</option>
              <option value="Soybean">Soybean</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize</option>
              <option value="Onion">Onion</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-mute whitespace-nowrap">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="rounded-md bg-panel2 px-3 py-2 text-xs text-ink ring-1 ring-line focus:outline-none"
            >
              <option value="all">All Districts</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Aurangabad</option>
            </select>
          </div>

          {/* Sorting Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-mute whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-md bg-panel2 px-3 py-2 text-xs text-ink ring-1 ring-line focus:outline-none"
            >
              <option value="volume">Volume (High → Low)</option>
              <option value="price">Ask Price (Low → High)</option>
              <option value="distance">Distance (Nearest First)</option>
            </select>
          </div>
        </div>

        {/* Volume Threshold Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
          <span className="text-[11px] text-mute">Min Volume:</span>
          {[0, 50, 100, 200].map((vol) => (
            <button
              key={vol}
              type="button"
              onClick={() => setMinVolumeQuintals(vol)}
              className={`rounded px-2 py-0.5 text-[11px] transition-colors ${
                minVolumeQuintals === vol
                  ? "bg-leaf/20 text-leaf ring-1 ring-leaf font-medium"
                  : "bg-panel2 text-mute hover:text-ink ring-1 ring-line"
              }`}
            >
              {vol === 0 ? "Any Volume" : `≥ ${vol} Quintals (${vol / 10} t)`}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-faint">
            Showing {filteredFarmers.length} of {farmers.length} lots
          </span>
        </div>
      </div>

      {/* Farmer Telemetry Listings Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-12 text-center text-sm text-mute">Querying farmer inventory telemetry...</div>
        ) : filteredFarmers.length === 0 ? (
          <div className="rounded-md bg-panel p-12 text-center ring-1 ring-line">
            <Wheat className="mx-auto size-8 text-faint" />
            <h3 className="mt-2 text-sm font-semibold text-ink">No farmer listings match your filter criteria</h3>
            <p className="mt-1 text-xs text-mute">Try clearing filters or reducing volume requirement.</p>
          </div>
        ) : (
          filteredFarmers.map((f) => (
            <div
              key={f.id}
              className="rounded-md bg-panel p-5 ring-1 ring-line hover:ring-leaf/40 hover:bg-panel2/50 transition-all"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                {/* Farmer identity & farm info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink">{f.name}</h3>
                    <span className="rounded bg-leaf/15 px-2 py-0.5 text-[10px] font-semibold text-leaf ring-1 ring-leaf/30 flex items-center gap-1">
                      <ShieldCheck className="size-3" /> {f.kisanId}
                    </span>
                    <span className="rounded bg-panel2 px-2 py-0.5 text-[10px] text-mute ring-1 ring-line">
                      {f.farmName}
                    </span>
                    <span className="rounded bg-aqua/10 px-2 py-0.5 text-[10px] text-aqua ring-1 ring-aqua/30">
                      {f.storageStatus}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                    <span className="flex items-center gap-1 font-medium text-ink">
                      <Wheat className="size-3.5 text-leaf" /> {f.crop}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-aqua" /> {f.village}, {f.district} ({f.distanceKm} km away)
                    </span>
                    <span>Farm: {f.landArea} ({f.soilType})</span>
                    <span>Grade: <b className="text-ink">{f.grade}</b></span>
                  </div>

                  <p className="text-xs text-mute leading-relaxed max-w-2xl bg-panel2/40 p-2 rounded ring-1 ring-line/50">
                    "{f.notes}"
                  </p>
                </div>

                {/* Quantitative metrics & payout calculation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-line/60">
                  <div className="text-left sm:text-right space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider text-faint">Volume Available</div>
                    <div className="font-mono text-base font-bold text-ink">
                      {f.quantityQuintals} Quintals <span className="text-xs font-normal text-mute">({f.quantityTonnes} t)</span>
                    </div>

                    <div className="text-[10px] uppercase tracking-wider text-faint mt-1">Asking Rate</div>
                    <div className="font-mono text-base font-bold text-leaf">
                      ₹{f.askingPricePerQuintal} <span className="text-xs font-normal text-mute">/ qtl</span>
                    </div>

                    <div className="text-[11px] text-gold font-medium">
                      Est. Lot Payout: ₹{(f.totalEstimatedAmount / 100000).toFixed(2)} Lakhs
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <a
                      href={`tel:${f.phone.replace(/\s+/g, "")}`}
                      className="action-secondary px-3 py-1.5 text-xs flex items-center justify-center gap-1.5"
                      title="Direct Call Farmer"
                      onClick={() => notify && notify(`Calling ${f.name} at ${f.phone}`)}
                    >
                      <Phone className="size-3.5 text-leaf" /> {f.phone}
                    </a>

                    <a
                      href={`https://wa.me/${f.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(f.name)},%20we%20reviewed%20your%20listing%20for%20${f.quantityQuintals}%20Quintals%20of%20${encodeURIComponent(f.crop)}%20at%20₹${f.askingPricePerQuintal}/qtl.%20We%20would%20like%20to%20discuss%20procurement.`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600/90 px-3 py-1.5 text-xs text-white font-medium hover:bg-emerald-600 transition"
                    >
                      <MessageCircle className="size-3.5" /> WhatsApp Dispatch
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenOutreach(f)}
                      className="action-primary px-3 py-1.5 text-xs flex items-center justify-center gap-1.5"
                    >
                      <FileText className="size-3.5" /> Log Inquiry / Bid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Procurement Outreach / Inquiry Modal */}
      {selectedFarmer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-panel p-6 shadow-2xl ring-1 ring-line animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-leaf">
                  Direct Farmer Outreach
                </span>
                <h3 className="text-lg font-bold text-ink">{selectedFarmer.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFarmer(null)}
                className="grid size-8 place-items-center rounded bg-panel2 text-mute hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-md bg-panel2 p-3 ring-1 ring-line">
                <div>
                  <div className="text-faint">Farmer Phone:</div>
                  <div className="font-mono text-ink font-semibold mt-0.5">{selectedFarmer.phone}</div>
                </div>
                <div>
                  <div className="text-faint">Kisan Verification:</div>
                  <div className="font-mono text-leaf mt-0.5">{selectedFarmer.kisanId}</div>
                </div>
                <div>
                  <div className="text-faint">Crop & Variety:</div>
                  <div className="font-medium text-ink mt-0.5">{selectedFarmer.crop}</div>
                </div>
                <div>
                  <div className="text-faint">Lot Quantity:</div>
                  <div className="font-mono text-ink mt-0.5">{selectedFarmer.quantityQuintals} Quintals</div>
                </div>
                <div>
                  <div className="text-faint">Farmer Ask Rate:</div>
                  <div className="font-mono text-leaf font-bold mt-0.5">₹{selectedFarmer.askingPricePerQuintal} / qtl</div>
                </div>
                <div>
                  <div className="text-faint">Total Lot Valuation:</div>
                  <div className="font-mono text-gold font-bold mt-0.5">₹{selectedFarmer.totalEstimatedAmount.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <div>
                <label className="block text-mute font-medium mb-1">
                  Procurement Inquiry / Offer Note:
                </label>
                <textarea
                  rows={3}
                  value={offerNote}
                  onChange={(e) => setOfferNote(e.target.value)}
                  className="w-full rounded-md bg-panel2 p-3 text-xs text-ink ring-1 ring-line focus:outline-none focus:ring-leaf"
                />
              </div>

              {inquirySuccess ? (
                <div className="flex items-center gap-2 rounded bg-leaf/15 p-3 text-leaf ring-1 ring-leaf/40">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Outreach logged in platform database. You can proceed with phone or weighbridge agreement.</span>
                </div>
              ) : (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFarmer(null)}
                    className="action-secondary"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleSendProcurementOffer}
                    className="action-primary"
                  >
                    Submit Procurement Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

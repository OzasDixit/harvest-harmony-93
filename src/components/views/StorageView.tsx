import { useState, useEffect } from "react";
import { ShieldCheck, MapPin, Thermometer, Phone, MessageCircle, ExternalLink, Info, CheckCircle2, ChevronRight, X, Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchBuyers, submitInquiry } from "../../lib/api-client";
import { BuyerRecord } from "../../server/api-handler";

interface StorageViewProps {
  notify?: (msg: string) => void;
  farmerName?: string;
  farmerPhone?: string;
}

export function StorageView({ notify, farmerName = "Ravi Deshmukh", farmerPhone = "+91 98230 41102" }: StorageViewProps) {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState<BuyerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<BuyerRecord | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [filterCommodity, setFilterCommodity] = useState("all");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchBuyers({ type: "STORAGE" });
      setFacilities(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleOpenContactModal = (fac: BuyerRecord) => {
    setSelectedFacility(fac);
    setInquirySent(false);
  };

  const handleSendDirectInquiry = async () => {
    if (!selectedFacility) return;
    await submitInquiry({
      farmerId: "f-101",
      farmerName,
      farmerPhone,
      buyerId: selectedFacility.id,
      buyerName: selectedFacility.name,
      commodity: "Soybean (JS 335)",
      quantityQuintals: 122,
      proposedRate: selectedFacility.offerPrice,
      notes: "Farmer contacted storage facility operator for space availability & intake scheduling.",
    });
    setInquirySent(true);
    if (notify) notify(`Contact telemetry logged for ${selectedFacility.name}`);
  };

  const filtered = filterCommodity === "all"
    ? facilities
    : facilities.filter((f) => f.commodities.some((c) => c.toLowerCase().includes(filterCommodity.toLowerCase())));

  return (
    <div className="space-y-6">
      {/* Informational Header */}
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <ShieldCheck className="size-4 text-leaf" /> {t("storage.warehousing")}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Scientific Storage & Cold Chain Directory
            </h2>
            <p className="mt-1 text-sm text-mute">
              Browse WDRA-registered cold storages and silos. Direct contact channel for farmers to negotiate space and preserve harvest value without automated slot lock-in.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-panel2 px-3 py-1.5 text-xs text-mute ring-1 ring-line">
              Non-Transactional Direct Discovery
            </span>
          </div>
        </div>

        {/* Commodity Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-line/60">
          <span className="text-xs text-mute font-medium">Filter by crop handling:</span>
          {["all", "Soybean", "Pulses", "Grains", "Onion"].map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => setFilterCommodity(crop)}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                filterCommodity === crop
                  ? "bg-leaf text-ground font-medium"
                  : "bg-panel2 text-mute hover:text-ink ring-1 ring-line"
              }`}
            >
              {crop === "all" ? "All Commodities" : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Government WDRA & Mandi Notice */}
      <div className="rounded-md bg-aqua/5 p-4 ring-1 ring-aqua/30 text-xs text-mute flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <Info className="size-4 text-aqua shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-ink">Government Storage Benchmark:</span> Warehouses listed below comply with WDRA (Warehousing Development and Regulatory Authority) quality preservation norms. Electronic Negotiable Warehouse Receipts (e-NWR) can be pledged for bank credit.
          </div>
        </div>
        <a
          href="https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-aqua hover:underline shrink-0 text-xs"
        >
          <span>data.gov.in Mandi Feeds</span>
          <ExternalLink className="size-3" />
        </a>
      </div>

      {/* Facilities Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-8 text-center text-sm text-mute">Loading registered storage facilities...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-mute">No storage facilities found for this selection.</div>
        ) : (
          filtered.map((fac) => (
            <div
              key={fac.id}
              className="rounded-md bg-panel p-5 ring-1 ring-line hover:ring-leaf/40 hover:bg-panel2/60 transition-all"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink">{fac.name}</h3>
                    <span className="rounded bg-leaf/15 px-2 py-0.5 text-[10px] font-semibold text-leaf ring-1 ring-leaf/30">
                      {fac.apmcCode}
                    </span>
                    <span className="rounded bg-panel2 px-2 py-0.5 text-[10px] text-faint ring-1 ring-line">
                      {fac.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-aqua" /> {fac.location} ({fac.distanceKm} km away)
                    </span>
                    {fac.specs && (
                      <span className="flex items-center gap-1">
                        <Thermometer className="size-3.5 text-gold" /> {fac.specs}
                      </span>
                    )}
                    {fac.capacity && <span>Capacity: <b className="text-ink">{fac.capacity}</b></span>}
                    <span className="text-gold font-medium">★ {fac.rating}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-faint">
                    <span>Commodities:</span>
                    {fac.commodities.map((c) => (
                      <span key={c} className="rounded bg-panel2 px-1.5 py-0.5 text-mute ring-1 ring-line">
                        {c}
                      </span>
                    ))}
                    <span className="ml-2 text-leaf">{fac.mandiBenchmarkDiff}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-line/60">
                  <div className="text-left sm:text-right">
                    <div className="font-mono text-sm font-bold text-leaf">{fac.offerPrice}</div>
                    <div className="text-[11px] text-faint">{fac.paymentTerms}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${fac.phone.replace(/\s+/g, "")}`}
                      className="action-secondary px-3 py-2 text-xs flex items-center gap-1.5"
                      title="Direct Call Facility"
                      onClick={() => notify && notify(`Calling ${fac.name}`)}
                    >
                      <Phone className="size-3.5 text-leaf" /> Call
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenContactModal(fac)}
                      className="action-primary px-3 py-2 text-xs flex items-center gap-1.5"
                    >
                      <Building2 className="size-3.5" /> View Contact & Specs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Storage Facility Contact & Telemetry Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-panel p-6 shadow-2xl ring-1 ring-line animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-leaf">
                  Storage Facility Telemetry
                </span>
                <h3 className="text-lg font-bold text-ink">{selectedFacility.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                className="grid size-8 place-items-center rounded bg-panel2 text-mute hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-md bg-panel2 p-3 ring-1 ring-line">
                <div>
                  <div className="text-faint">Facility In-Charge:</div>
                  <div className="font-medium text-ink mt-0.5">{selectedFacility.contactPerson}</div>
                </div>
                <div>
                  <div className="text-faint">Registration / WDRA Code:</div>
                  <div className="font-mono text-ink mt-0.5">{selectedFacility.apmcCode}</div>
                </div>
                <div>
                  <div className="text-faint">Direct Telephone:</div>
                  <a href={`tel:${selectedFacility.phone}`} className="font-medium text-leaf hover:underline mt-0.5 block">
                    {selectedFacility.phone}
                  </a>
                </div>
                <div>
                  <div className="text-faint">Working Hours:</div>
                  <div className="text-ink mt-0.5">{selectedFacility.openHours}</div>
                </div>
              </div>

              <div className="rounded-md bg-ground/50 p-3 ring-1 ring-line space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-mute">Physical Location:</span>
                  <span className="text-ink font-medium">{selectedFacility.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Storage Holding Rate:</span>
                  <span className="font-mono text-leaf font-bold">{selectedFacility.offerPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Controlled Climate:</span>
                  <span className="text-ink">{selectedFacility.specs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Capacity Available:</span>
                  <span className="text-ink font-semibold">{selectedFacility.capacity}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-gold/10 ring-1 ring-gold/30 text-mute">
                <span className="font-semibold text-ink">Preservation Recommendation:</span> Storing Soybean at this facility allows avoiding peak harvest glut, targeting ₹4,350/quintal in 30-45 days.
              </div>

              {inquirySent ? (
                <div className="flex items-center gap-2 rounded bg-leaf/15 p-3 text-leaf ring-1 ring-leaf/40">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Direct contact logged. Operator desk has been alerted of your harvest profile.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={`https://wa.me/${selectedFacility.whatsapp.replace(/\+/g, "")}?text=Hello%20${encodeURIComponent(selectedFacility.contactPerson)},%20I%20am%20${encodeURIComponent(farmerName)}%20(${encodeURIComponent(farmerPhone)}).%20I%20have%20122%20Quintals%20of%20harvest%20ready%20and%20would%20like%20to%20discuss%20storage%20space.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 transition"
                  >
                    <MessageCircle className="size-4" /> Message on WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={handleSendDirectInquiry}
                    className="flex-1 action-primary justify-center"
                  >
                    Log Direct Inquiry
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

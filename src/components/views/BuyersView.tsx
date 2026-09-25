import { useState, useEffect } from "react";
import { Users, ExternalLink, Phone, MessageCircle, MapPin, Building, Info, CheckCircle2, X, ArrowUpRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { fetchBuyers, fetchMandiPrices, submitInquiry } from "../../lib/api-client";
import { BuyerRecord, MandiPriceRecord } from "../../server/api-handler";

interface BuyersViewProps {
  notify?: (msg: string) => void;
  farmerName?: string;
  farmerPhone?: string;
}

export function BuyersView({ notify, farmerName = "Ravi Deshmukh", farmerPhone = "+91 98230 41102" }: BuyersViewProps) {
  const { t } = useTranslation();
  const [buyers, setBuyers] = useState<BuyerRecord[]>([]);
  const [mandiPrices, setMandiPrices] = useState<MandiPriceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerRecord | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [commodityFilter, setCommodityFilter] = useState("Soybean");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [buyerData, mandiData] = await Promise.all([
        fetchBuyers({ type: "MARKET" }),
        fetchMandiPrices(),
      ]);
      setBuyers(buyerData);
      setMandiPrices(mandiData);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleOpenBuyerModal = (buyer: BuyerRecord) => {
    setSelectedBuyer(buyer);
    setInquirySent(false);
  };

  const handleLogDirectInquiry = async () => {
    if (!selectedBuyer) return;
    await submitInquiry({
      farmerId: "f-101",
      farmerName,
      farmerPhone,
      buyerId: selectedBuyer.id,
      buyerName: selectedBuyer.name,
      commodity: "Soybean (JS 335)",
      quantityQuintals: 122,
      proposedRate: selectedBuyer.offerPrice,
      notes: "Farmer contacted buyer regarding lot inspection & weighbridge delivery.",
    });
    setInquirySent(true);
    if (notify) notify(`Direct inquiry logged with ${selectedBuyer.name}`);
  };

  const relevantMandiPrices = mandiPrices.filter((p) =>
    commodityFilter === "all" ? true : p.commodity.toLowerCase().includes(commodityFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Informational Header */}
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <Users className="size-4 text-leaf" /> Market & Mandi Buyers
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Verified Buyer Directory & Mandi Price Benchmarks
            </h2>
            <p className="mt-1 text-sm text-mute">
              Real-time commodity market prices directly benchmarked from open government feeds (data.gov.in). Contact certified APMC merchants and industrial processors directly without locked middleman contracts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-panel2 px-3 py-1.5 text-xs text-mute ring-1 ring-line">
              Non-Transactional Direct Contact
            </span>
          </div>
        </div>

        {/* Commodity Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-line/60">
          <span className="text-xs text-mute font-medium">Commodity Focus:</span>
          {["Soybean", "Wheat", "Maize", "Onion", "all"].map((crop) => (
            <button
              key={crop}
              type="button"
              onClick={() => setCommodityFilter(crop)}
              className={`rounded px-2.5 py-1 text-xs transition-colors ${
                commodityFilter === crop
                  ? "bg-leaf text-ground font-medium"
                  : "bg-panel2 text-mute hover:text-ink ring-1 ring-line"
              }`}
            >
              {crop === "all" ? "All Commodities" : crop}
            </button>
          ))}
        </div>
      </div>

      {/* Official data.gov.in Mandi Telemetry Widget */}
      <div className="rounded-md bg-panel p-4 ring-1 ring-line space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-2.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Official Government Mandi Daily Prices (data.gov.in)
            </span>
            <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold ring-1 ring-gold/30">
              Live Feed
            </span>
          </div>
          <a
            href="https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-leaf hover:underline"
          >
            <span>Resource: current-daily-price-various-commodities</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-line text-mute">
                <th className="pb-2 font-medium">State / APMC Market</th>
                <th className="pb-2 font-medium">Commodity & Variety</th>
                <th className="pb-2 font-medium">Arrival Date</th>
                <th className="pb-2 font-medium text-right">Min Rate</th>
                <th className="pb-2 font-medium text-right">Max Rate</th>
                <th className="pb-2 font-medium text-right text-leaf">Modal Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {relevantMandiPrices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 text-center text-mute">No mandi feeds found for this filter.</td>
                </tr>
              ) : (
                relevantMandiPrices.map((p) => (
                  <tr key={p.id} className="hover:bg-panel2/50 transition-colors">
                    <td className="py-2.5 font-medium text-ink">
                      {p.market} <span className="text-mute font-normal">({p.district}, {p.state})</span>
                    </td>
                    <td className="py-2.5 text-mute">
                      {p.commodity} <span className="text-faint">({p.variety})</span>
                    </td>
                    <td className="py-2.5 font-mono text-mute">{p.arrivalDate}</td>
                    <td className="py-2.5 font-mono text-right text-mute">₹{p.minPrice}</td>
                    <td className="py-2.5 font-mono text-right text-mute">₹{p.maxPrice}</td>
                    <td className="py-2.5 font-mono text-right font-bold text-leaf">₹{p.modalPrice} / qtl</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verified Buyers Listing */}
      <div className="grid gap-4">
        {loading ? (
          <div className="p-8 text-center text-sm text-mute">Loading certified buyer records...</div>
        ) : (
          buyers.map((buyer) => (
            <div
              key={buyer.id}
              className="rounded-md bg-panel p-5 ring-1 ring-line hover:ring-leaf/40 hover:bg-panel2/60 transition-all"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink">{buyer.name}</h3>
                    <span className="rounded bg-leaf/15 px-2 py-0.5 text-[10px] font-semibold text-leaf ring-1 ring-leaf/30">
                      {buyer.apmcCode}
                    </span>
                    <span className="rounded bg-panel2 px-2 py-0.5 text-[10px] text-faint ring-1 ring-line">
                      {buyer.category}
                    </span>
                    <span className="rounded bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">
                      {buyer.mandiBenchmarkDiff}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5 text-aqua" /> {buyer.location} ({buyer.distanceKm} km away)
                    </span>
                    <span>Min Lot: <b className="text-ink">{buyer.minQty}</b></span>
                    <span className="text-gold font-medium">★ {buyer.rating}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 text-[11px] text-faint">
                    <span>Target Commodities:</span>
                    {buyer.commodities.map((c) => (
                      <span key={c} className="rounded bg-panel2 px-1.5 py-0.5 text-mute ring-1 ring-line">
                        {c}
                      </span>
                    ))}
                    <span className="ml-2 text-mute">{buyer.paymentTerms}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-line/60">
                  <div className="text-left sm:text-right">
                    <div className="font-mono text-base font-bold text-leaf">{buyer.offerPrice}</div>
                    <div className="text-[11px] text-faint">{buyer.openHours}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${buyer.phone.replace(/\s+/g, "")}`}
                      className="action-secondary px-3 py-2 text-xs flex items-center gap-1.5"
                      title="Direct Call Buyer"
                      onClick={() => notify && notify(`Calling ${buyer.name}`)}
                    >
                      <Phone className="size-3.5 text-leaf" /> Call
                    </a>

                    <button
                      type="button"
                      onClick={() => handleOpenBuyerModal(buyer)}
                      className="action-primary px-3 py-2 text-xs flex items-center gap-1.5"
                    >
                      <Building className="size-3.5" /> View Profile & Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Buyer Contact Modal */}
      {selectedBuyer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-md bg-panel p-6 shadow-2xl ring-1 ring-line animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-leaf">
                  Verified Buyer Telemetry
                </span>
                <h3 className="text-lg font-bold text-ink">{selectedBuyer.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBuyer(null)}
                className="grid size-8 place-items-center rounded bg-panel2 text-mute hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-md bg-panel2 p-3 ring-1 ring-line">
                <div>
                  <div className="text-faint">Procurement Officer:</div>
                  <div className="font-medium text-ink mt-0.5">{selectedBuyer.contactPerson}</div>
                </div>
                <div>
                  <div className="text-faint">APMC Registration:</div>
                  <div className="font-mono text-ink mt-0.5">{selectedBuyer.apmcCode}</div>
                </div>
                <div>
                  <div className="text-faint">Direct Phone:</div>
                  <a href={`tel:${selectedBuyer.phone}`} className="font-medium text-leaf hover:underline mt-0.5 block">
                    {selectedBuyer.phone}
                  </a>
                </div>
                <div>
                  <div className="text-faint">Email:</div>
                  <div className="text-ink mt-0.5 truncate">{selectedBuyer.email}</div>
                </div>
              </div>

              <div className="rounded-md bg-ground/50 p-3 ring-1 ring-line space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-mute">Physical Address:</span>
                  <span className="text-ink font-medium">{selectedBuyer.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Procurement Quote:</span>
                  <span className="font-mono text-leaf font-bold">{selectedBuyer.offerPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Benchmark vs Mandi:</span>
                  <span className="text-gold font-semibold">{selectedBuyer.mandiBenchmarkDiff}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-mute">Payment Settlement:</span>
                  <span className="text-ink">{selectedBuyer.paymentTerms}</span>
                </div>
              </div>

              <div className="p-3 rounded bg-aqua/10 ring-1 ring-aqua/30 text-mute">
                <span className="font-semibold text-ink">Direct Deal Notice:</span> Connect with this buyer directly. You can share sample photos, confirm weighbridge schedule, and agree on delivery without automated contract locking.
              </div>

              {inquirySent ? (
                <div className="flex items-center gap-2 rounded bg-leaf/15 p-3 text-leaf ring-1 ring-leaf/40">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Direct contact logged. Buyer procurement officer has received your crop information.</span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={`https://wa.me/${selectedBuyer.whatsapp.replace(/\+/g, "")}?text=Hello%20${encodeURIComponent(selectedBuyer.contactPerson)},%20I%20am%20${encodeURIComponent(farmerName)}%20(${encodeURIComponent(farmerPhone)}).%20I%20have%20122%20Quintals%20of%20Soybean%20ready%20for%20sale%20and%20would%20like%20to%20discuss%20procurement.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700 transition"
                  >
                    <MessageCircle className="size-4" /> Message on WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={handleLogDirectInquiry}
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

import { useState } from "react";
import { Users, Check, ArrowUpRight, ShieldCheck, MapPin, Building, FileCheck } from "lucide-react";

interface BuyersViewProps {
  notify?: (msg: string) => void;
}

export function BuyersView({ notify }: BuyersViewProps) {
  const [lockedBuyerId, setLockedBuyerId] = useState<string | null>("b-1");

  const buyers = [
    { id: "b-1", name: "Krishna Oils Ltd", type: "Solvent Extraction Mill", location: "Nashik", offerPrice: "₹4,350 / quintal", minQty: "10 Tonnes", grade: "Grade A (Moisture < 10%)", paymentTerms: "Instant NEFT", best: true },
    { id: "b-2", name: "Ganesh Feed Mills", type: "Animal Feed Manufacturer", location: "Aurangabad", offerPrice: "₹4,120 / quintal", minQty: "5 Tonnes", grade: "Bulk Grade B", paymentTerms: "Same-day Cash/RTGS", best: false },
    { id: "b-3", name: "Pune Wholesale Mandi APMC", type: "Open Auction Mandi", location: "Pune", offerPrice: "₹4,080 / quintal", minQty: "1 Tonne", grade: "Open Quality", paymentTerms: "T+1 Settlement", best: false },
    { id: "b-4", name: "AgriExport Global Corp", type: "International Exporter", location: "Mumbai Port", offerPrice: "₹4,480 / quintal", minQty: "25 Tonnes", grade: "Export Premium (Organic)", paymentTerms: "LC / Escrow", best: false }
  ];

  const handleLockDeal = (id: string, name: string) => {
    setLockedBuyerId(id);
    if (notify) notify(`Buyer contract locked with ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <Users className="size-4 text-leaf" /> Verified Buyer Network
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Buyer Matching & Offer Marketplace
            </h2>
            <p className="mt-1 text-sm text-mute">
              Pre-vetted institutional buyers matching your Soybean yield of 12.2 tonnes.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {buyers.map((buyer) => (
          <div
            key={buyer.id}
            className={`rounded-md p-5 ring-1 transition-all ${
              lockedBuyerId === buyer.id
                ? "bg-leaf/10 ring-leaf border-l-4 border-l-leaf"
                : "bg-panel ring-line hover:bg-panel2"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{buyer.name}</h3>
                  {buyer.best && (
                    <span className="rounded bg-leaf/20 px-2 py-0.5 text-[10px] font-semibold text-leaf flex items-center gap-1">
                      <ArrowUpRight className="size-3" /> Best Net Offer
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-mute">
                  <span className="flex items-center gap-1 text-ink font-medium">
                    <Building className="size-3.5 text-faint" /> {buyer.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-aqua" /> {buyer.location}
                  </span>
                  <span>Min Order: {buyer.minQty}</span>
                  <span>Grade: {buyer.grade}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-leaf">{buyer.offerPrice}</div>
                  <div className="text-[11px] text-faint">{buyer.paymentTerms}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleLockDeal(buyer.id, buyer.name)}
                  className={lockedBuyerId === buyer.id ? "action-primary bg-leaf" : "action-secondary"}
                >
                  {lockedBuyerId === buyer.id ? <Check className="size-4" /> : <FileCheck className="size-4" />}
                  {lockedBuyerId === buyer.id ? "Contract Locked" : "Lock Contract"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

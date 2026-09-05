import { useState } from "react";
import { ShieldCheck, MapPin, Thermometer, Check, Calendar, Lock } from "lucide-react";

interface StorageViewProps {
  notify?: (msg: string) => void;
}

export function StorageView({ notify }: StorageViewProps) {
  const [bookedId, setBookedId] = useState<string | null>("st-2");

  const facilities = [
    { id: "st-1", name: "AgroFrost Storage Nashik", distance: "28 km", rate: "₹3.5 / kg / month", capacity: "1,200 Tonnes", temp: "4°C - 8°C", humidity: "85%", rating: "4.8 ★" },
    { id: "st-2", name: "Khed Cold Works & Warehousing", distance: "14 km", rate: "₹2.8 / kg / month", capacity: "620 Tonnes", temp: "10°C - 14°C", humidity: "70%", rating: "4.9 ★", recommended: true },
    { id: "st-3", name: "Pune AgroStore & Logistics", distance: "19 km", rate: "₹4.1 / kg / month", capacity: "2,500 Tonnes", temp: "2°C - 6°C", humidity: "90%", rating: "4.7 ★" }
  ];

  const handleBook = (id: string, name: string) => {
    setBookedId(id);
    if (notify) notify(`Storage slot requested at ${name}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-leaf">
              <ShieldCheck className="size-4 text-leaf" /> Climate-Controlled Warehousing
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Nearby Cold Storage Directory
            </h2>
            <p className="mt-1 text-sm text-mute">
              Verified temperature & humidity-regulated storage facilities near Pune & Nashik.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className={`rounded-md p-5 ring-1 transition-all ${
              bookedId === fac.id
                ? "bg-leaf/10 ring-leaf border-l-4 border-l-leaf"
                : "bg-panel ring-line hover:bg-panel2"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{fac.name}</h3>
                  {fac.recommended && (
                    <span className="rounded bg-leaf/20 px-2 py-0.5 text-[10px] font-semibold text-leaf">
                      Optimal Choice
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-mute">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5 text-aqua" /> {fac.distance} away
                  </span>
                  <span className="flex items-center gap-1">
                    <Thermometer className="size-3.5 text-gold" /> Temp: {fac.temp} ({fac.humidity} RH)
                  </span>
                  <span>Cap: {fac.capacity}</span>
                  <span className="text-gold font-medium">{fac.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono text-sm font-bold text-leaf">{fac.rate}</div>
                  <div className="text-[11px] text-faint">Insurance included</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBook(fac.id, fac.name)}
                  className={bookedId === fac.id ? "action-primary bg-leaf" : "action-secondary"}
                >
                  {bookedId === fac.id ? <Check className="size-4" /> : <Lock className="size-4" />}
                  {bookedId === fac.id ? "Reserved" : "Reserve Slot"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

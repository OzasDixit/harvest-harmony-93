export interface MandiRecord {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string; // YYYY-MM-DD
  minPrice: number;    // INR per Quintal
  maxPrice: number;    // INR per Quintal
  modalPrice: number;  // INR per Quintal
  arrivalsTonnes: number;
}

export const INITIAL_MANDI_DATA: MandiRecord[] = [
  // Soybean - Maharashtra & MP
  { id: "m1", state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Soybean", variety: "Vrindavan", arrivalDate: "2026-09-04", minPrice: 4100, maxPrice: 4420, modalPrice: 4350, arrivalsTonnes: 145 },
  { id: "m2", state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Soybean", variety: "Vrindavan", arrivalDate: "2026-09-03", minPrice: 4050, maxPrice: 4380, modalPrice: 4280, arrivalsTonnes: 152 },
  { id: "m3", state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Soybean", variety: "Vrindavan", arrivalDate: "2026-09-02", minPrice: 4000, maxPrice: 4320, modalPrice: 4210, arrivalsTonnes: 160 },
  { id: "m4", state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Soybean", variety: "Vrindavan", arrivalDate: "2026-09-01", minPrice: 3950, maxPrice: 4280, modalPrice: 4180, arrivalsTonnes: 138 },
  { id: "m5", state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Soybean", variety: "Vrindavan", arrivalDate: "2026-08-31", minPrice: 3900, maxPrice: 4210, modalPrice: 4120, arrivalsTonnes: 140 },
  
  { id: "m6", state: "Maharashtra", district: "Nashik", market: "Nashik APMC", commodity: "Soybean", variety: "Yellow", arrivalDate: "2026-09-04", minPrice: 4150, maxPrice: 4480, modalPrice: 4390, arrivalsTonnes: 210 },
  { id: "m7", state: "Maharashtra", district: "Nashik", market: "Nashik APMC", commodity: "Soybean", variety: "Yellow", arrivalDate: "2026-09-03", minPrice: 4100, maxPrice: 4410, modalPrice: 4320, arrivalsTonnes: 195 },
  { id: "m8", state: "Maharashtra", district: "Nashik", market: "Nashik APMC", commodity: "Soybean", variety: "Yellow", arrivalDate: "2026-09-02", minPrice: 4020, maxPrice: 4350, modalPrice: 4260, arrivalsTonnes: 180 },

  { id: "m9", state: "Madhya Pradesh", district: "Indore", market: "Indore Mandi", commodity: "Soybean", variety: "JS 335", arrivalDate: "2026-09-04", minPrice: 4200, maxPrice: 4550, modalPrice: 4450, arrivalsTonnes: 320 },
  { id: "m10", state: "Madhya Pradesh", district: "Indore", market: "Indore Mandi", commodity: "Soybean", variety: "JS 335", arrivalDate: "2026-09-03", minPrice: 4180, maxPrice: 4500, modalPrice: 4400, arrivalsTonnes: 310 },

  // Onion - Maharashtra & Gujarat
  { id: "m11", state: "Maharashtra", district: "Nashik", market: "Lasalgaon Mandi", commodity: "Onion", variety: "Red Onion", arrivalDate: "2026-09-04", minPrice: 1800, maxPrice: 2650, modalPrice: 2350, arrivalsTonnes: 450 },
  { id: "m12", state: "Maharashtra", district: "Nashik", market: "Lasalgaon Mandi", commodity: "Onion", variety: "Red Onion", arrivalDate: "2026-09-03", minPrice: 1750, maxPrice: 2580, modalPrice: 2280, arrivalsTonnes: 480 },
  { id: "m13", state: "Maharashtra", district: "Pune", market: "Pune Mandi", commodity: "Onion", variety: "Local", arrivalDate: "2026-09-04", minPrice: 1700, maxPrice: 2500, modalPrice: 2200, arrivalsTonnes: 290 },
  { id: "m14", state: "Gujarat", district: "Rajkot", market: "Rajkot APMC", commodity: "Onion", variety: "White Onion", arrivalDate: "2026-09-04", minPrice: 1650, maxPrice: 2400, modalPrice: 2100, arrivalsTonnes: 230 },

  // Wheat - Punjab, UP & MP
  { id: "m15", state: "Punjab", district: "Ludhiana", market: "Ludhiana Mandi", commodity: "Wheat", variety: "Sharbati", arrivalDate: "2026-09-04", minPrice: 2450, maxPrice: 2850, modalPrice: 2720, arrivalsTonnes: 520 },
  { id: "m16", state: "Punjab", district: "Ludhiana", market: "Ludhiana Mandi", commodity: "Wheat", variety: "Sharbati", arrivalDate: "2026-09-03", minPrice: 2420, maxPrice: 2810, modalPrice: 2690, arrivalsTonnes: 510 },
  { id: "m17", state: "Uttar Pradesh", district: "Kanpur", market: "Kanpur Mandi", commodity: "Wheat", variety: "Dara", arrivalDate: "2026-09-04", minPrice: 2380, maxPrice: 2700, modalPrice: 2580, arrivalsTonnes: 390 },
  { id: "m18", state: "Madhya Pradesh", district: "Ujjain", market: "Ujjain Mandi", commodity: "Wheat", variety: "Lokwan", arrivalDate: "2026-09-04", minPrice: 2500, maxPrice: 2950, modalPrice: 2810, arrivalsTonnes: 410 },

  // Tomato - Karnataka & Maharashtra
  { id: "m19", state: "Karnataka", district: "Kolar", market: "Kolar APMC", commodity: "Tomato", variety: "Hybrid", arrivalDate: "2026-09-04", minPrice: 1200, maxPrice: 2100, modalPrice: 1750, arrivalsTonnes: 600 },
  { id: "m20", state: "Maharashtra", district: "Pune", market: "Narayangaon Mandi", commodity: "Tomato", variety: "Local", arrivalDate: "2026-09-04", minPrice: 1300, maxPrice: 2200, modalPrice: 1850, arrivalsTonnes: 340 },

  // Cotton - Gujarat & Maharashtra
  { id: "m21", state: "Gujarat", district: "Rajkot", market: "Rajkot APMC", commodity: "Cotton", variety: "Shankar-6", arrivalDate: "2026-09-04", minPrice: 6800, maxPrice: 7600, modalPrice: 7250, arrivalsTonnes: 180 },
  { id: "m22", state: "Maharashtra", district: "Yavatmal", market: "Yavatmal Mandi", commodity: "Cotton", variety: "Medium Staple", arrivalDate: "2026-09-04", minPrice: 6600, maxPrice: 7400, modalPrice: 7100, arrivalsTonnes: 210 },

  // Paddy / Rice - Punjab & UP
  { id: "m23", state: "Punjab", district: "Amritsar", market: "Amritsar Mandi", commodity: "Paddy", variety: "Basmati 1121", arrivalDate: "2026-09-04", minPrice: 3800, maxPrice: 4600, modalPrice: 4350, arrivalsTonnes: 420 },
  { id: "m24", state: "Uttar Pradesh", district: "Varanasi", market: "Varanasi Mandi", commodity: "Paddy", variety: "Common", arrivalDate: "2026-09-04", minPrice: 2150, maxPrice: 2450, modalPrice: 2320, arrivalsTonnes: 280 }
];

export function parseCSVToMandiRecords(csvContent: string): MandiRecord[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length < 2 || !lines[0]) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  
  const stateIdx = headers.findIndex((h) => h.includes("state"));
  const distIdx = headers.findIndex((h) => h.includes("district"));
  const marketIdx = headers.findIndex((h) => h.includes("market") || h.includes("mandi"));
  const commIdx = headers.findIndex((h) => h.includes("commodity") || h.includes("crop"));
  const varIdx = headers.findIndex((h) => h.includes("variety") || h.includes("grade"));
  const dateIdx = headers.findIndex((h) => h.includes("date") || h.includes("arrival_date"));
  const minIdx = headers.findIndex((h) => h.includes("min"));
  const maxIdx = headers.findIndex((h) => h.includes("max"));
  const modalIdx = headers.findIndex((h) => h.includes("modal"));
  const arrIdx = headers.findIndex((h) => h.includes("arrival") && !h.includes("date"));

  const records: MandiRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split(",").map((c) => c.trim().replace(/['"]/g, ""));
    if (cols.length < 4) continue;

    const getCol = (idx: number): string => (idx >= 0 && cols[idx] !== undefined ? cols[idx]! : "");

    const minP = minIdx >= 0 ? parseFloat(getCol(minIdx)) || 0 : 0;
    const maxP = maxIdx >= 0 ? parseFloat(getCol(maxIdx)) || 0 : 0;
    const modalP = modalIdx >= 0 ? parseFloat(getCol(modalIdx)) || 0 : (minP + maxP) / 2 || 0;
    const arrivals = arrIdx >= 0 ? parseFloat(getCol(arrIdx)) || 0 : 50;

    const todayStr = new Date().toISOString().split("T")[0] ?? "2026-09-04";

    records.push({
      id: `user-csv-${i}`,
      state: getCol(stateIdx) || "Unknown State",
      district: getCol(distIdx) || "Unknown District",
      market: getCol(marketIdx) || "Local Mandi",
      commodity: getCol(commIdx) || "Crop",
      variety: getCol(varIdx) || "Standard",
      arrivalDate: getCol(dateIdx) || todayStr,
      minPrice: minP,
      maxPrice: maxP,
      modalPrice: modalP,
      arrivalsTonnes: arrivals,
    });
  }

  return records;
}

export function exportRecordsToCSV(records: MandiRecord[]): string {
  const headers = ["State", "District", "Market", "Commodity", "Variety", "Arrival_Date", "Min_Price", "Max_Price", "Modal_Price", "Arrivals_Tonnes"];
  const rows = records.map((r) => [
    `"${r.state}"`,
    `"${r.district}"`,
    `"${r.market}"`,
    `"${r.commodity}"`,
    `"${r.variety}"`,
    `"${r.arrivalDate}"`,
    r.minPrice,
    r.maxPrice,
    r.modalPrice,
    r.arrivalsTonnes,
  ].join(","));

  return [headers.join(","), ...rows].join("\n");
}

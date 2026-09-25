import fs from "node:fs";
import path from "node:path";
import seedData from "./db.json";

export type UserRole = "FARMER" | "BUYER" | "BOTH";
export type BuyerClassification = "STORAGE" | "MARKET" | "BOTH";

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone: string;
  location: string;
  role: UserRole;
  buyerClassification?: BuyerClassification;
}

export type UserProfile = UserAccount;

export interface FarmerProfileEntity {
  userId: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  farmName: string;
  landArea: string;
  soilType: string;
  soilPh: string;
  waterSource: string;
  budget: string;
  targetCrop: string;
  kisanId: string;
}

export interface BuyerProfileEntity {
  userId: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  company: string;
  buyerClassification: BuyerClassification;
  buyerType?: BuyerClassification;
  apmcLicense: string;
  wdraCode: string;
  capacity: string;
  commodities: string[];
  paymentTerms: string;
}

export interface FarmerRecord {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  distanceKm: number;
  farmName: string;
  landArea: string;
  soilType: string;
  waterSource: string;
  crop: string;
  commodity: string;
  quantityQuintals: number;
  quantityTonnes: number;
  askingPricePerQuintal: number;
  totalEstimatedAmount: number;
  harvestDate: string;
  storageStatus: string;
  verified: boolean;
  kisanId: string;
  grade: string;
  notes: string;
}

export interface BuyerRecord {
  id: string;
  type: "MARKET" | "STORAGE";
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  district: string;
  distanceKm: number;
  apmcCode: string;
  commodities: string[];
  offerPrice: string;
  pricePerQuintal: number;
  minQty: string;
  paymentTerms: string;
  mandiBenchmarkDiff: string;
  rating: number;
  verified: boolean;
  openHours: string;
  capacity?: string;
  specs?: string;
}

export interface MandiPriceRecord {
  id: string;
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrivalDate: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  source: string;
  resourceId: string;
}

export interface InquiryRecord {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  commodity: string;
  quantityQuintals: number;
  proposedRate: string;
  status: string;
  notes: string;
  createdAt: string;
}

// In-memory runtime store initialized from seed data
let database = {
  users: [...seedData.users] as UserAccount[],
  farmerProfiles: [...seedData.farmerProfiles] as FarmerProfileEntity[],
  buyerProfiles: [...seedData.buyerProfiles] as BuyerProfileEntity[],
  farmers: [...seedData.farmers] as FarmerRecord[],
  buyers: [...seedData.buyers] as BuyerRecord[],
  mandiPrices: [...seedData.mandiPrices] as MandiPriceRecord[],
  inquiries: [...seedData.inquiries] as InquiryRecord[],
};

function persistDb() {
  try {
    const dbPath = path.resolve(process.cwd(), "src/server/db.json");
    fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not persist database to disk:", err);
  }
}

export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method;

  const jsonHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  // 1. Health check
  if (pathname === "/api/health") {
    return new Response(JSON.stringify({ status: "healthy", timestamp: new Date().toISOString() }), {
      headers: jsonHeaders,
    });
  }

  // 2. Auth: Login
  if (pathname === "/api/auth/login" && method === "POST") {
    try {
      const body = (await req.json()) as { userId?: string; email?: string; role?: UserRole };
      let user: UserAccount | undefined;
      if (body.userId) {
        user = database.users.find((u) => u.id === body.userId);
      } else if (body.email) {
        user = database.users.find((u) => u.email.toLowerCase() === body.email?.toLowerCase().trim());
      } else if (body.role) {
        user = database.users.find((u) => u.role === body.role);
      }

      if (!user) {
        // Fallback to first user if none matched
        user = database.users[0];
      }

      const farmerProfile = database.farmerProfiles.find((fp) => fp.userId === user?.id);
      const buyerProfile = database.buyerProfiles.find((bp) => bp.userId === user?.id);

      return new Response(
        JSON.stringify({
          success: true,
          token: `jwt-${user?.id}-${Date.now()}`,
          user,
          farmerProfile: farmerProfile || null,
          buyerProfile: buyerProfile || null,
        }),
        { headers: jsonHeaders }
      );
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
    }
  }

  // 3. Auth: Register
  if (pathname === "/api/auth/register" && method === "POST") {
    try {
      const body = (await req.json()) as {
        name: string;
        email: string;
        phone: string;
        location: string;
        role: UserRole;
        buyerClassification?: BuyerClassification;
        farmName?: string;
        landArea?: string;
        company?: string;
      };

      const role = body.role || "FARMER";
      const buyerClassification: BuyerClassification | undefined =
        role === "BUYER"
          ? body.buyerClassification || "MARKET"
          : role === "BOTH"
          ? body.buyerClassification || "BOTH"
          : undefined;

      const newId = `u-${role.toLowerCase()}-${Date.now()}`;

      const newUser: UserAccount = {
        id: newId,
        email: body.email || `user${Date.now()}@krishiastra.in`,
        name: body.name || "New KrishiAstra User",
        phone: body.phone || "+91 99000 00000",
        location: body.location || "Maharashtra, India",
        role,
        ...(buyerClassification ? { buyerClassification } : {}),
      };
      database.users.push(newUser);

      // Create decoupled farmer profile if user is FARMER or BOTH
      let farmerProf: FarmerProfileEntity | undefined;
      if (role === "FARMER" || role === "BOTH") {
        farmerProf = {
          userId: newId,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          location: newUser.location,
          farmName: body.farmName || `${newUser.name}'s Farm`,
          landArea: body.landArea || "5.0 acres",
          soilType: "Black cotton",
          soilPh: "7.0",
          waterSource: "Canal + Well",
          budget: "₹2,00,000",
          targetCrop: "Soybean",
          kisanId: `MH-REG-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        database.farmerProfiles.push(farmerProf);
      }

      // Create decoupled buyer profile if user is BUYER or BOTH
      let buyerProf: BuyerProfileEntity | undefined;
      if (role === "BUYER" || role === "BOTH") {
        const bClassification: BuyerClassification = buyerClassification || "MARKET";
        buyerProf = {
          userId: newId,
          name: newUser.name,
          phone: newUser.phone,
          email: newUser.email,
          location: newUser.location,
          company: body.company || `${newUser.name} Agro Trading`,
          buyerClassification: bClassification,
          buyerType: bClassification,
          apmcLicense: `APMC-REG-${Math.floor(1000 + Math.random() * 9000)}`,
          wdraCode: bClassification === "STORAGE" || bClassification === "BOTH"
            ? `WDRA-MH-${Math.floor(1000 + Math.random() * 9000)}`
            : "N/A",
          capacity: bClassification === "STORAGE" || bClassification === "BOTH" ? "2,500 Tonnes" : "500 Tonnes/mo",
          commodities: ["Soybean", "Wheat", "Maize"],
          paymentTerms: "Standard T+1 NEFT / RTGS",
        };
        database.buyerProfiles.push(buyerProf);
      }

      persistDb();
      return new Response(
        JSON.stringify({
          success: true,
          token: `jwt-${newId}-${Date.now()}`,
          user: newUser,
          farmerProfile: farmerProf || null,
          buyerProfile: buyerProf || null,
        }),
        { status: 201, headers: jsonHeaders }
      );
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
    }
  }

  // 4. Current user session profile (/api/profile/me)
  if (pathname === "/api/profile/me" && method === "GET") {
    const userId = url.searchParams.get("userId") || database.users[0]?.id;
    const user = database.users.find((u) => u.id === userId) || database.users[0];
    const farmerProfile = database.farmerProfiles.find((fp) => fp.userId === user?.id);
    const buyerProfile = database.buyerProfiles.find((bp) => bp.userId === user?.id);

    return new Response(
      JSON.stringify({
        success: true,
        user,
        farmerProfile: farmerProfile || null,
        buyerProfile: buyerProfile || null,
      }),
      { headers: jsonHeaders }
    );
  }

  // 5. Update Farmer Profile (/api/profile/farmer)
  if (pathname === "/api/profile/farmer" && (method === "PUT" || method === "POST")) {
    try {
      const body = (await req.json()) as Partial<FarmerProfileEntity> & { userId: string };
      const idx = database.farmerProfiles.findIndex((fp) => fp.userId === body.userId);
      if (idx >= 0) {
        database.farmerProfiles[idx] = { ...database.farmerProfiles[idx], ...body } as FarmerProfileEntity;
      } else {
        database.farmerProfiles.push(body as FarmerProfileEntity);
      }
      persistDb();
      return new Response(JSON.stringify({ success: true, farmerProfile: database.farmerProfiles[idx] || body }), {
        headers: jsonHeaders,
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
    }
  }

  // 6. Update Buyer Profile (/api/profile/buyer)
  if (pathname === "/api/profile/buyer" && (method === "PUT" || method === "POST")) {
    try {
      const body = (await req.json()) as Partial<BuyerProfileEntity> & { userId: string };
      const idx = database.buyerProfiles.findIndex((bp) => bp.userId === body.userId);
      if (idx >= 0) {
        database.buyerProfiles[idx] = { ...database.buyerProfiles[idx], ...body } as BuyerProfileEntity;
      } else {
        database.buyerProfiles.push(body as BuyerProfileEntity);
      }
      persistDb();
      return new Response(JSON.stringify({ success: true, buyerProfile: database.buyerProfiles[idx] || body }), {
        headers: jsonHeaders,
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
    }
  }

  // 7. Update User Account Details (/api/profile/account)
  if (pathname === "/api/profile/account" && (method === "PUT" || method === "POST")) {
    try {
      const body = (await req.json()) as Partial<UserAccount> & { id: string };
      const idx = database.users.findIndex((u) => u.id === body.id);
      if (idx >= 0) {
        database.users[idx] = { ...database.users[idx], ...body } as UserAccount;
        persistDb();
        return new Response(JSON.stringify({ success: true, user: database.users[idx] }), {
          headers: jsonHeaders,
        });
      }
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: jsonHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
    }
  }

  // 8. Farmers endpoint
  if (pathname === "/api/farmers") {
    if (method === "GET") {
      const crop = url.searchParams.get("crop")?.toLowerCase();
      const district = url.searchParams.get("district")?.toLowerCase();
      let filtered = [...database.farmers];
      if (crop && crop !== "all") {
        filtered = filtered.filter(
          (f) => f.crop.toLowerCase().includes(crop) || f.commodity.toLowerCase().includes(crop)
        );
      }
      if (district && district !== "all") {
        filtered = filtered.filter((f) => f.district.toLowerCase() === district);
      }
      return new Response(JSON.stringify({ success: true, count: filtered.length, data: filtered }), {
        headers: jsonHeaders,
      });
    }

    if (method === "POST") {
      try {
        const newFarmer = (await req.json()) as Partial<FarmerRecord>;
        const id = `f-${Date.now()}`;
        const record: FarmerRecord = {
          id,
          name: newFarmer.name || "Anonymous Farmer",
          phone: newFarmer.phone || "+91 99000 00000",
          village: newFarmer.village || "Local Tehsil",
          district: newFarmer.district || "Pune",
          state: newFarmer.state || "Maharashtra",
          distanceKm: newFarmer.distanceKm || 10,
          farmName: newFarmer.farmName || "Farmstead",
          landArea: newFarmer.landArea || "5.0 acres",
          soilType: newFarmer.soilType || "Black cotton",
          waterSource: newFarmer.waterSource || "Borewell",
          crop: newFarmer.crop || "Soybean (JS 335)",
          commodity: newFarmer.commodity || "Soybean",
          quantityQuintals: newFarmer.quantityQuintals || 50,
          quantityTonnes: (newFarmer.quantityQuintals || 50) / 10,
          askingPricePerQuintal: newFarmer.askingPricePerQuintal || 4200,
          totalEstimatedAmount:
            (newFarmer.quantityQuintals || 50) * (newFarmer.askingPricePerQuintal || 4200),
          harvestDate: newFarmer.harvestDate || "Immediate",
          storageStatus: newFarmer.storageStatus || "On-Farm Dry Shed",
          verified: true,
          kisanId: newFarmer.kisanId || `MH-REG-${Math.floor(1000 + Math.random() * 9000)}`,
          grade: newFarmer.grade || "Grade A",
          notes: newFarmer.notes || "Farmer listing submitted via platform.",
        };
        database.farmers.unshift(record);
        persistDb();
        return new Response(JSON.stringify({ success: true, farmer: record }), {
          status: 201,
          headers: jsonHeaders,
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
      }
    }
  }

  // 9. Buyers endpoint
  if (pathname === "/api/buyers") {
    if (method === "GET") {
      const type = url.searchParams.get("type")?.toUpperCase();
      const district = url.searchParams.get("district")?.toLowerCase();
      let list = [...database.buyers];
      if (type && (type === "MARKET" || type === "STORAGE")) {
        list = list.filter((b) => b.type === type);
      }
      if (district && district !== "all") {
        list = list.filter((b) => b.district.toLowerCase() === district);
      }
      return new Response(JSON.stringify({ success: true, count: list.length, data: list }), {
        headers: jsonHeaders,
      });
    }

    if (method === "POST") {
      try {
        const body = (await req.json()) as BuyerRecord;
        const record = { ...body, id: `b-${Date.now()}` };
        database.buyers.push(record);
        persistDb();
        return new Response(JSON.stringify({ success: true, buyer: record }), {
          status: 201,
          headers: jsonHeaders,
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
      }
    }
  }

  // 10. data.gov.in Daily Mandi Prices dataset
  if (pathname === "/api/mandi-prices") {
    const commodity = url.searchParams.get("commodity")?.toLowerCase();
    const district = url.searchParams.get("district")?.toLowerCase();
    let prices = [...database.mandiPrices];
    if (commodity && commodity !== "all") {
      prices = prices.filter((p) => p.commodity.toLowerCase().includes(commodity));
    }
    if (district && district !== "all") {
      prices = prices.filter((p) => p.district.toLowerCase() === district);
    }
    return new Response(
      JSON.stringify({
        success: true,
        source: "https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi",
        dataset: "Current Daily Price of Various Commodities from Various Markets (Mandi)",
        updated: "25/09/2026",
        count: prices.length,
        data: prices,
      }),
      { headers: jsonHeaders }
    );
  }

  // 11. Direct Inquiries
  if (pathname === "/api/inquiries") {
    if (method === "GET") {
      return new Response(
        JSON.stringify({ success: true, count: database.inquiries.length, data: database.inquiries }),
        { headers: jsonHeaders }
      );
    }
    if (method === "POST") {
      try {
        const body = (await req.json()) as Partial<InquiryRecord>;
        const inq: InquiryRecord = {
          id: `inq-${Date.now()}`,
          farmerId: body.farmerId || "f-101",
          farmerName: body.farmerName || "Farmer",
          farmerPhone: body.farmerPhone || "+91 99999 99999",
          buyerId: body.buyerId || "b-1",
          buyerName: body.buyerName || "Buyer",
          commodity: body.commodity || "Soybean",
          quantityQuintals: body.quantityQuintals || 50,
          proposedRate: body.proposedRate || "Market Benchmark",
          status: "Direct Contact Logged",
          notes: body.notes || "Inquiry initiated via direct platform connection.",
          createdAt: new Date().toISOString(),
        };
        database.inquiries.unshift(inq);
        persistDb();
        return new Response(JSON.stringify({ success: true, inquiry: inq }), {
          status: 201,
          headers: jsonHeaders,
        });
      } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), { status: 400, headers: jsonHeaders });
      }
    }
  }

  return new Response(JSON.stringify({ error: "API endpoint not found" }), {
    status: 404,
    headers: jsonHeaders,
  });
}

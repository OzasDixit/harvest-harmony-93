import {
  FarmerRecord,
  BuyerRecord,
  MandiPriceRecord,
  InquiryRecord,
  UserAccount,
  FarmerProfileEntity,
  BuyerProfileEntity,
  UserRole,
  BuyerClassification,
} from "../server/api-handler";

export interface AuthSessionResponse {
  success: boolean;
  token?: string;
  user: UserAccount;
  farmerProfile: FarmerProfileEntity | null;
  buyerProfile: BuyerProfileEntity | null;
  error?: string;
}

export async function loginUser(params: {
  userId?: string;
  email?: string;
  role?: UserRole;
}): Promise<AuthSessionResponse | null> {
  try {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json();
  } catch (e) {
    console.warn("Login API error", e);
    return null;
  }
}

export async function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: UserRole;
  buyerClassification?: BuyerClassification | undefined;
  farmName?: string | undefined;
  landArea?: string | undefined;
  company?: string | undefined;
}): Promise<AuthSessionResponse | null> {
  try {
    const res = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Registration failed");
    return await res.json();
  } catch (e) {
    console.warn("Registration API error", e);
    return null;
  }
}

export async function fetchCurrentProfile(userId?: string): Promise<AuthSessionResponse | null> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`/api/profile/me${query}`);
    if (!res.ok) throw new Error("Failed to fetch profile");
    return await res.json();
  } catch (e) {
    console.warn("Profile fetch error", e);
    return null;
  }
}

export async function updateFarmerProfile(
  profile: Partial<FarmerProfileEntity> & { userId: string }
): Promise<FarmerProfileEntity | null> {
  try {
    const res = await fetch(`/api/profile/farmer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update farmer profile");
    const json = await res.json();
    return json.farmerProfile;
  } catch (e) {
    console.warn("Farmer profile update error", e);
    return null;
  }
}

export async function updateBuyerProfile(
  profile: Partial<BuyerProfileEntity> & { userId: string }
): Promise<BuyerProfileEntity | null> {
  try {
    const res = await fetch(`/api/profile/buyer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Failed to update buyer profile");
    const json = await res.json();
    return json.buyerProfile;
  } catch (e) {
    console.warn("Buyer profile update error", e);
    return null;
  }
}

export async function updateAccountDetails(
  account: Partial<UserAccount> & { id: string }
): Promise<UserAccount | null> {
  try {
    const res = await fetch(`/api/profile/account`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
    if (!res.ok) throw new Error("Failed to update account details");
    const json = await res.json();
    return json.user;
  } catch (e) {
    console.warn("Account update error", e);
    return null;
  }
}

export async function fetchFarmers(params?: { crop?: string; district?: string }): Promise<FarmerRecord[]> {
  try {
    const query = new URLSearchParams();
    if (params?.crop) query.set("crop", params.crop);
    if (params?.district) query.set("district", params.district);
    const res = await fetch(`/api/farmers?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch farmers");
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.warn("Failed to fetch farmers from backend", e);
    return [];
  }
}

export async function createFarmerListing(farmer: Partial<FarmerRecord>): Promise<FarmerRecord | null> {
  try {
    const res = await fetch(`/api/farmers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(farmer),
    });
    if (!res.ok) throw new Error("Failed to create farmer listing");
    const json = await res.json();
    return json.farmer;
  } catch (e) {
    console.warn("Failed to create farmer listing", e);
    return null;
  }
}

export async function fetchBuyers(params?: { type?: string; district?: string }): Promise<BuyerRecord[]> {
  try {
    const query = new URLSearchParams();
    if (params?.type) query.set("type", params.type);
    if (params?.district) query.set("district", params.district);
    const res = await fetch(`/api/buyers?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch buyers");
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.warn("Failed to fetch buyers from backend", e);
    return [];
  }
}

export async function fetchMandiPrices(params?: { commodity?: string; district?: string }): Promise<MandiPriceRecord[]> {
  try {
    const query = new URLSearchParams();
    if (params?.commodity) query.set("commodity", params.commodity);
    if (params?.district) query.set("district", params.district);
    const res = await fetch(`/api/mandi-prices?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch mandi prices");
    const json = await res.json();
    return json.data || [];
  } catch (e) {
    console.warn("Failed to fetch mandi prices from backend", e);
    return [];
  }
}

export async function submitInquiry(inquiry: {
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  commodity: string;
  quantityQuintals: number;
  proposedRate: string;
  notes?: string;
}): Promise<InquiryRecord | null> {
  try {
    const res = await fetch(`/api/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inquiry),
    });
    if (!res.ok) throw new Error("Failed to submit inquiry");
    const json = await res.json();
    return json.inquiry;
  } catch (e) {
    console.warn("Failed to submit inquiry", e);
    return null;
  }
}

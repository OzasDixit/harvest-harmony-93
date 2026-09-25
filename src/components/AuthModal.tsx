import { useState } from "react";
import {
  X,
  Sprout,
  Building,
  Layers,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Warehouse,
  ArrowRight,
  LogIn,
  UserPlus,
  KeyRound,
  Check,
} from "lucide-react";
import { loginUser, registerUser, AuthSessionResponse } from "../lib/api-client";
import { UserRole, BuyerClassification, UserAccount } from "../server/api-handler";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onAuthSuccess: (session: AuthSessionResponse) => void;
  notify?: (msg: string) => void;
}

const PRECONFIGURED_ACCOUNTS = [
  {
    id: "u-farmer-1",
    name: "Ravi Deshmukh",
    email: "ravi.deshmukh@kisanagro.in",
    role: "FARMER" as UserRole,
    roleLabel: "FARMER",
    roleBadgeClass: "bg-leaf/20 text-leaf ring-leaf/40",
    desc: "Pure agricultural producer (Deshmukh Agro Farms, 6.4 ac, Baramati). Farmer Console only.",
    icon: Sprout,
  },
  {
    id: "u-buyer-market-1",
    name: "Suresh Singhania",
    email: "procurement@krishnaoils.com",
    role: "BUYER" as UserRole,
    buyerClassification: "MARKET" as BuyerClassification,
    roleLabel: "BUYER (MARKET)",
    roleBadgeClass: "bg-aqua/20 text-aqua ring-aqua/40",
    desc: "Krishna Oils Ltd, Nashik APMC. Commercial mandi buyer & solvent extraction mill.",
    icon: Building,
  },
  {
    id: "u-buyer-storage-1",
    name: "Mahesh Patil",
    email: "contact@khedcoldstorage.in",
    role: "BUYER" as UserRole,
    buyerClassification: "STORAGE" as BuyerClassification,
    roleLabel: "BUYER (STORAGE)",
    roleBadgeClass: "bg-panel text-mute ring-line",
    desc: "Khed Cold Works & Warehousing. WDRA-certified cold storage & silo operator.",
    icon: Warehouse,
  },
  {
    id: "u-buyer-both-1",
    name: "Rajesh Agarwal",
    email: "procure@apexagromandi.in",
    role: "BUYER" as UserRole,
    buyerClassification: "BOTH" as BuyerClassification,
    roleLabel: "BUYER (STORAGE & MARKET)",
    roleBadgeClass: "bg-panel text-aqua ring-aqua/40",
    desc: "Apex Agro Trade & Silos. Operates both bulk mandi trading and cold storage intake.",
    icon: Building,
  },
  {
    id: "u-both-1",
    name: "Vikas Patil",
    email: "vikas.patil@agriprosumer.in",
    role: "BOTH" as UserRole,
    buyerClassification: "BOTH" as BuyerClassification,
    roleLabel: "BOTH (FARMER & BUYER)",
    roleBadgeClass: "bg-gold/20 text-gold ring-gold/40",
    desc: "Integrated agri-prosumer in Shirur. Single login with dual access to Farmer & Buyer consoles.",
    icon: Layers,
  },
];

export function AuthModal({ isOpen, onClose, currentUser, onAuthSuccess, notify }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  // Sign In inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("••••••••");

  // Registration inputs
  const [role, setRole] = useState<UserRole>("FARMER");
  const [buyerClassification, setBuyerClassification] = useState<BuyerClassification>("MARKET");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Maharashtra, India");
  const [farmName, setFarmName] = useState("");
  const [landArea, setLandArea] = useState("5.0 acres");
  const [company, setCompany] = useState("");

  if (!isOpen) return null;

  const handleAccountLogin = async (userId: string, label: string) => {
    setLoading(true);
    const session = await loginUser({ userId });
    setLoading(false);
    if (session?.success) {
      onAuthSuccess(session);
      onClose();
      if (notify) notify(`Signed in as ${label}`);
    }
  };

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      if (notify) notify("Please enter your registered email address.");
      return;
    }
    setLoading(true);
    const session = await loginUser({ email: loginEmail.trim() });
    setLoading(false);
    if (session?.success) {
      onAuthSuccess(session);
      onClose();
      if (notify) notify(`Signed in as ${session.user.name} (${session.user.role})`);
    } else {
      if (notify) notify("Account not found with this email. Please check or register.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      if (notify) notify("Please enter your name and email.");
      return;
    }
    setLoading(true);
    const session = await registerUser({
      name,
      email,
      phone,
      location,
      role,
      ...(role === "BUYER" || role === "BOTH" ? { buyerClassification } : {}),
      farmName: farmName || `${name}'s Farm`,
      landArea,
      company: company || `${name} Commercial Trading`,
    });
    setLoading(false);
    if (session?.success) {
      onAuthSuccess(session);
      onClose();
      const roleStr =
        role === "BUYER"
          ? `Buyer (${buyerClassification})`
          : role === "BOTH"
          ? "Both (Farmer & Buyer)"
          : "Farmer";
      if (notify) notify(`Account created! Signed in as ${session.user.name} (${roleStr})`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ground/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-md bg-panel p-6 shadow-2xl ring-1 ring-line animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-6 place-items-center rounded bg-leaf/20 text-leaf">
                <Lock className="size-3.5" />
              </span>
              <h2 className="text-lg font-bold text-ink">KrishiAstra Account Authentication</h2>
            </div>
            <p className="mt-0.5 text-xs text-mute">
              Distinct user logins: A user is either a Farmer, a Buyer (Storage / Market / Both), or Both.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded bg-panel2 text-mute hover:text-ink"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="mt-4 flex border-b border-line">
          <button
            type="button"
            onClick={() => setTab("login")}
            className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === "login"
                ? "border-leaf text-leaf"
                : "border-transparent text-mute hover:text-ink"
            }`}
          >
            <LogIn className="size-3.5" /> Sign In to Your Account
          </button>
          <button
            type="button"
            onClick={() => setTab("register")}
            className={`pb-2 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              tab === "register"
                ? "border-leaf text-leaf"
                : "border-transparent text-mute hover:text-ink"
            }`}
          >
            <UserPlus className="size-3.5" /> Create New Account
          </button>
        </div>

        {/* TAB 1: SIGN IN */}
        {tab === "login" ? (
          <div className="mt-4 space-y-4">
            {/* Direct Login Form */}
            <form onSubmit={handleCustomLogin} className="rounded-md bg-panel2 p-3.5 ring-1 ring-line space-y-3">
              <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                <Mail className="size-3.5 text-leaf" /> Sign In with Registered Email & Password
              </div>
              <div className="grid gap-2 sm:grid-cols-2 text-xs">
                <div>
                  <label className="text-faint text-[11px]">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="user@krishiastra.in"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="field-control mt-1 text-xs"
                  />
                </div>
                <div>
                  <label className="text-faint text-[11px]">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="field-control mt-1 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="action-primary flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <LogIn className="size-3.5" /> {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            {/* Preconfigured User Accounts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-ink">
                  Or Sign In As An Existing User:
                </span>
                <span className="text-[10px] text-faint">Each account has its own credentials & role</span>
              </div>

              <div className="grid gap-2">
                {PRECONFIGURED_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon;
                  const isCurrent = currentUser?.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={loading}
                      onClick={() => handleAccountLogin(acc.id, `${acc.name} (${acc.roleLabel})`)}
                      className={`flex items-center justify-between rounded-md p-3 text-left ring-1 transition-all group ${
                        isCurrent
                          ? "ring-leaf bg-leaf/10"
                          : "ring-line bg-panel hover:bg-panel2"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid size-8 place-items-center rounded bg-panel2 ring-1 ring-line text-ink">
                          <Icon className="size-4 text-leaf" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-ink">{acc.name}</span>
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ring-1 ${acc.roleBadgeClass}`}>
                              {acc.roleLabel}
                            </span>
                            {isCurrent && (
                              <span className="rounded bg-leaf px-1.5 py-0.5 text-[9px] font-bold text-ground">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-faint font-mono">{acc.email}</div>
                          <div className="text-xs text-mute mt-0.5">{acc.desc}</div>
                        </div>
                      </div>
                      <ArrowRight className="size-4 text-faint group-hover:text-ink transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 2: REGISTER NEW ACCOUNT */
          <form onSubmit={handleRegister} className="mt-4 space-y-4">
            {/* Step 1: Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                1. Select Account Identity (A user can only belong to one category):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("FARMER")}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-md text-xs font-medium ring-1 transition-all ${
                    role === "FARMER"
                      ? "bg-leaf/15 ring-leaf text-ink font-semibold"
                      : "bg-panel2 ring-line text-mute hover:text-ink"
                  }`}
                >
                  <Sprout className="size-4 text-leaf" />
                  <span>Farmer</span>
                  <span className="text-[10px] text-faint">Producer Only</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("BUYER")}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-md text-xs font-medium ring-1 transition-all ${
                    role === "BUYER"
                      ? "bg-aqua/15 ring-aqua text-ink font-semibold"
                      : "bg-panel2 ring-line text-mute hover:text-ink"
                  }`}
                >
                  <Building className="size-4 text-aqua" />
                  <span>Buyer</span>
                  <span className="text-[10px] text-faint">Storage / Market</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("BOTH")}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-md text-xs font-medium ring-1 transition-all ${
                    role === "BOTH"
                      ? "bg-gold/15 ring-gold text-ink font-semibold"
                      : "bg-panel2 ring-line text-mute hover:text-ink"
                  }`}
                >
                  <Layers className="size-4 text-gold" />
                  <span>Both</span>
                  <span className="text-[10px] text-gold font-bold">Farmer & Buyer</span>
                </button>
              </div>
            </div>

            {/* Buyer Classification (If Buyer or Both selected) */}
            {(role === "BUYER" || role === "BOTH") && (
              <div className="rounded-md bg-panel2 p-3 ring-1 ring-line space-y-2">
                <label className="block text-xs font-semibold text-ink">
                  2. Buyer Classification (Select exactly ONE option):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setBuyerClassification("STORAGE")}
                    className={`flex flex-col items-center p-2 rounded text-xs ring-1 transition-all ${
                      buyerClassification === "STORAGE"
                        ? "bg-aqua/20 ring-aqua text-ink font-bold"
                        : "bg-panel ring-line text-mute hover:text-ink"
                    }`}
                  >
                    <Warehouse className="size-3.5 mb-1 text-aqua" />
                    <span>Storage</span>
                    <span className="text-[10px] text-faint">Cold chains & silos</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuyerClassification("MARKET")}
                    className={`flex flex-col items-center p-2 rounded text-xs ring-1 transition-all ${
                      buyerClassification === "MARKET"
                        ? "bg-aqua/20 ring-aqua text-ink font-bold"
                        : "bg-panel ring-line text-mute hover:text-ink"
                    }`}
                  >
                    <Building className="size-3.5 mb-1 text-aqua" />
                    <span>Market</span>
                    <span className="text-[10px] text-faint">Mandi / Mills / Traders</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuyerClassification("BOTH")}
                    className={`flex flex-col items-center p-2 rounded text-xs ring-1 transition-all ${
                      buyerClassification === "BOTH"
                        ? "bg-aqua/20 ring-aqua text-ink font-bold"
                        : "bg-panel ring-line text-mute hover:text-ink"
                    }`}
                  >
                    <Layers className="size-3.5 mb-1 text-aqua" />
                    <span>Both</span>
                    <span className="text-[10px] text-faint">Procurement & Storage</span>
                  </button>
                </div>
              </div>
            )}

            {/* Core User Account Credentials */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="text-mute">
                Full Name *
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field-control mt-1"
                />
              </label>

              <label className="text-mute">
                Email Address (Login ID) *
                <input
                  type="email"
                  required
                  placeholder="ramesh@krishi.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field-control mt-1"
                />
              </label>

              <label className="text-mute">
                Password *
                <input
                  type="password"
                  required
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-control mt-1"
                />
              </label>

              <label className="text-mute">
                Telephone Number
                <input
                  type="tel"
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field-control mt-1"
                />
              </label>

              <label className="text-mute col-span-2">
                Location (District, State)
                <input
                  type="text"
                  placeholder="Pune, Maharashtra"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="field-control mt-1"
                />
              </label>
            </div>

            {/* Conditional Farmer Entity details */}
            {(role === "FARMER" || role === "BOTH") && (
              <div className="rounded-md bg-leaf/10 p-3 ring-1 ring-leaf/30 space-y-2">
                <div className="text-[11px] font-bold text-leaf uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="size-3.5" /> Farmer Details
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="text-mute">
                    Farm Name
                    <input
                      type="text"
                      placeholder="e.g. Patel Organic Agro"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      className="field-control mt-0.5"
                    />
                  </label>
                  <label className="text-mute">
                    Landholding Area
                    <input
                      type="text"
                      placeholder="e.g. 8.5 acres"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      className="field-control mt-0.5"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Conditional Buyer Entity details */}
            {(role === "BUYER" || role === "BOTH") && (
              <div className="rounded-md bg-aqua/10 p-3 ring-1 ring-aqua/30 space-y-2">
                <div className="text-[11px] font-bold text-aqua uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="size-3.5" /> Buyer Entity Details
                </div>
                <div className="text-xs">
                  <label className="text-mute">
                    Company / Firm Name
                    <input
                      type="text"
                      placeholder="e.g. Patel Agro Trading & Cold Store"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="field-control mt-0.5"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-line">
              <button
                type="button"
                onClick={onClose}
                className="action-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="action-primary"
              >
                {loading ? "Registering..." : "Create Account & Sign In"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

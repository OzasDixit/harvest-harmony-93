import { useState } from "react";
import { Activity, AlertTriangle, CloudRain, Check, MessageSquare, ShieldAlert, Sun, Thermometer, Send } from "lucide-react";

interface AdvisoryViewProps {
  notify?: (msg: string) => void;
}

export function AdvisoryView({ notify }: AdvisoryViewProps) {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Hello Ravi! Weather models forecast rain in 4 hours. Ensure your field drainage channels are clear to prevent waterlogging in plot B." },
  ]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userText = question;
    setQuestion("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);

    setTimeout(() => {
      let reply = "Based on current soil moisture (38%) and temperature (28°C), apply NPK 12-24-12 in early morning via drip fertigation for optimal nutrient uptake.";
      if (userText.toLowerCase().includes("disease") || userText.toLowerCase().includes("mosaic") || userText.toLowerCase().includes("yellow")) {
        reply = "Yellow Mosaic Disease Alert: Spray Thiamethoxam 25% WG @ 80g/acre if whitefly count exceeds 5 per plant leaf.";
      } else if (userText.toLowerCase().includes("water") || userText.toLowerCase().includes("rain")) {
        reply = "Monsoon prediction: 18mm rain expected over next 48 hours. Pause drip irrigation for 2 days to maintain optimal root zone aeration.";
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: reply }]);
      if (notify) notify("Advisory response generated");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-panel p-5 ring-1 ring-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-aqua">
              <Activity className="size-4 text-aqua" /> Real-time Agronomic Intelligence
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Crop Health & Weather Advisory
            </h2>
            <p className="mt-1 text-sm text-mute">
              AI-driven agronomic recommendations, disease risk monitoring, and field action steps.
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md bg-panel p-4 ring-1 ring-risk/30 border-l-4 border-l-risk">
          <div className="flex items-center gap-2 text-risk text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="size-4" /> Active Alert: Yellow Mosaic Risk
          </div>
          <p className="mt-2 text-xs text-mute leading-relaxed">
            High humidity post-monsoon increases whitefly vector activity. Inspect lower leaves daily. Apply neem oil spray (10,000 ppm) @ 2ml/L as organic defense.
          </p>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-aqua/30 border-l-4 border-l-aqua">
          <div className="flex items-center gap-2 text-aqua text-xs font-semibold uppercase tracking-wider">
            <CloudRain className="size-4" /> Weather Guidance: Monsoon Rain Watch
          </div>
          <p className="mt-2 text-xs text-mute leading-relaxed">
            Heavy rainfall expected on Wednesday night (estimated 24mm). Postpone pesticide spraying until weather clears to avoid spray wash-off.
          </p>
        </div>
      </div>

      {/* AI Advisory Chat Assistant */}
      <div className="rounded-md bg-panel p-4 ring-1 ring-line">
        <div className="mb-3 flex items-center gap-2 border-b border-line pb-3">
          <MessageSquare className="size-4 text-leaf" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            Ask Farm Advisory AI
          </h3>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-3 p-2 bg-panel2 rounded-md ring-1 ring-line mb-3">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-md px-3.5 py-2 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-leaf text-ground font-medium"
                    : "bg-panel text-ink border border-line"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask about fertilizer, pest control, weather, or soil..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 rounded-md border border-line bg-panel2 px-3 py-2 text-xs text-ink placeholder:text-faint focus:border-leaf focus:outline-none"
          />
          <button type="submit" className="action-primary text-xs shrink-0">
            <Send className="size-3.5" /> Ask AI
          </button>
        </form>
      </div>
    </div>
  );
}

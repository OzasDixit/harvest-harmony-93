import { useState, useEffect } from "react";
import { Activity, CloudRain, MessageSquare, ShieldAlert, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdvisoryViewProps {
  notify?: (msg: string) => void;
}

export function AdvisoryView({ notify }: AdvisoryViewProps) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: string; text: string }>>([]);

  useEffect(() => {
    setChatHistory([
      { sender: "ai", text: t("advisory.aiHello") },
    ]);
  }, [t]);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userText = question;
    setQuestion("");
    setChatHistory((prev) => [...prev, { sender: "user", text: userText }]);

    setTimeout(() => {
      let reply = t("advisory.aiDefaultReply");
      if (
        userText.toLowerCase().includes("disease") ||
        userText.toLowerCase().includes("mosaic") ||
        userText.toLowerCase().includes("yellow")
      ) {
        reply = t("advisory.aiDiseaseReply");
      } else if (
        userText.toLowerCase().includes("water") ||
        userText.toLowerCase().includes("rain")
      ) {
        reply = t("advisory.aiWaterReply");
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
              <Activity className="size-4 text-aqua" /> {t("advisory.realTimeIntelligence")}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {t("advisory.title")}
            </h2>
            <p className="mt-1 text-sm text-mute">
              {t("advisory.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Advisory Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md bg-panel p-4 ring-1 ring-risk/30 border-l-4 border-l-risk">
          <div className="flex items-center gap-2 text-risk text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="size-4" /> {t("advisory.activeAlertTitle")}
          </div>
          <p className="mt-2 text-xs text-mute leading-relaxed">
            {t("advisory.activeAlertDesc")}
          </p>
        </div>

        <div className="rounded-md bg-panel p-4 ring-1 ring-aqua/30 border-l-4 border-l-aqua">
          <div className="flex items-center gap-2 text-aqua text-xs font-semibold uppercase tracking-wider">
            <CloudRain className="size-4" /> {t("advisory.weatherGuidanceTitle")}
          </div>
          <p className="mt-2 text-xs text-mute leading-relaxed">
            {t("advisory.weatherGuidanceDesc")}
          </p>
        </div>
      </div>

      {/* AI Advisory Chat Assistant */}
      <div className="rounded-md bg-panel p-4 ring-1 ring-line">
        <div className="mb-3 flex items-center gap-2 border-b border-line pb-3">
          <MessageSquare className="size-4 text-leaf" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
            {t("advisory.askAiTitle")}
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
            placeholder={t("advisory.askPlaceholder")}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 rounded-md border border-line bg-panel2 px-3 py-2 text-xs text-ink placeholder:text-faint focus:border-leaf focus:outline-none"
          />
          <button type="submit" className="action-primary text-xs shrink-0">
            <Send className="size-3.5" /> {t("advisory.askBtn")}
          </button>
        </form>
      </div>
    </div>
  );
}

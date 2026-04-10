import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async (customText) => {
    const text = customText || input;

    if (!text.trim()) return;

    const userMsg = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const API = import.meta.env.VITE_API || "http://localhost:5000";

      const res = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply || "No Response Available" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "AI Server Error. Please Try Again." },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div
          className="
        fixed bottom-5 right-5
        w-[95vw] md:w-96
        h-[600px]
        bg-white shadow-2xl
        rounded-2xl flex flex-col
        overflow-hidden z-50
        "
        >
          {/* HEADER */}
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">AI Assistant</p>
              <p className="text-xs opacity-80">
                Ask About Marketplace, Waste, Carbon
              </p>
            </div>

            <button onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-6">
                <p className="font-medium text-gray-600 mb-3">
                  How Can I Help You?
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => sendMessage("Show Marketplace")}
                    className="bg-white shadow px-3 py-1 rounded-full text-sm"
                  >
                    Show Marketplace
                  </button>

                  <button
                    onClick={() => sendMessage("How To Add Waste")}
                    className="bg-white shadow px-3 py-1 rounded-full text-sm"
                  >
                    Add Waste
                  </button>

                  <button
                    onClick={() => sendMessage("Carbon Calculator")}
                    className="bg-white shadow px-3 py-1 rounded-full text-sm"
                  >
                    Carbon Calculator
                  </button>

                  <button
                    onClick={() => sendMessage("Available Categories")}
                    className="bg-white shadow px-3 py-1 rounded-full text-sm"
                  >
                    Categories
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                  px-4 py-2 rounded-xl
                  max-w-[80%]
                  text-sm md:text-base
                  ${
                    msg.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white shadow"
                  }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-400">AI Is Typing...</div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <input
              className="
              flex-1 border rounded-lg
              px-3 py-2 outline-none
              text-sm md:text-base
              "
              placeholder="Ask About Marketplace, Waste, Carbon..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={() => sendMessage()}
              className="bg-green-600 text-white p-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

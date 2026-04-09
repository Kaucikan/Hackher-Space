import { useState, useEffect, useRef } from "react";
import { Send, Phone, Search } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* -------------------- TYPES -------------------- */

type Message = {
  id: number;
  sender: "me" | "them";
  text: string;
  time: string;
};

type Contact = {
  id: string;
  name: string;
  avatar: string;
  phone: string;
};

/* -------------------- COMPONENT -------------------- */

export const Messages = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  /* -------------------- AUTO SCROLL -------------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeContact]);

  /* -------------------- LOAD CONTACTS -------------------- */

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const res = await fetch(
          `https://hackher-space-be.onrender.com/api/listings/user/${user.id}`,
        );

        const listings = await res.json();

        const reqUsers =
          listings.flatMap((l: any) =>
            (l.requests || []).map((r: any) => ({
              id: r.phone,
              name: r.name,
              phone: r.phone,
              avatar: `https://i.pravatar.cc/150?u=${r.phone}`,
            })),
          ) || [];

        setContacts(reqUsers);

        if (reqUsers.length) {
          setActiveContact(reqUsers[0]);
        }
      } catch {
        console.log("No contacts");
      }
    };

    loadContacts();
  }, []);

  /* -------------------- SEND -------------------- */

  const sendMessage = () => {
    if (!input.trim() || !activeContact) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "me",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMsg],
    }));

    setInput("");
  };

  /* -------------------- FILTER -------------------- */

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex h-[80vh] gap-6">
      {/* CONTACTS */}
      <Card className="w-72 p-0 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-sm font-semibold mb-3">Messages</h2>

          <Input
            placeholder="Search contacts"
            icon={<Search />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-muted p-4">No contacts</p>
          )}

          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={cn(
                "flex items-center gap-3 p-3 w-full text-left transition",
                activeContact?.id === c.id
                  ? "bg-primary/10"
                  : "hover:bg-slate-100",
              )}
            >
              <img src={c.avatar} className="w-9 h-9 rounded-full" />

              <div>
                <p className="text-sm font-medium">{c.name}</p>

                <p className="text-xs text-muted">{c.phone}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* CHAT */}
      <Card className="flex-1 flex flex-col">
        {activeContact ? (
          <>
            {/* HEADER */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={activeContact.avatar}
                  className="w-9 h-9 rounded-full"
                />

                <div>
                  <h3 className="text-sm font-medium">{activeContact.name}</h3>

                  <p className="text-xs text-muted">{activeContact.phone}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(`tel:${activeContact.phone}`)}
              >
                <Phone size={16} />
              </Button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-slate-50">
              {(messages[activeContact.id] || []).length === 0 && (
                <p className="text-center text-sm text-muted">
                  Start a conversation
                </p>
              )}

              {(messages[activeContact.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[70%] px-3 py-2 rounded-lg text-sm",
                    msg.sender === "me"
                      ? "ml-auto bg-primary text-white"
                      : "bg-white border border-border",
                  )}
                >
                  <p>{msg.text}</p>
                  <div className="text-[10px] opacity-60 mt-1">{msg.time}</div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                className="flex-1"
              />

              <Button onClick={sendMessage}>
                <Send size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted">
            No contact selected
          </div>
        )}
      </Card>
    </div>
  );
};

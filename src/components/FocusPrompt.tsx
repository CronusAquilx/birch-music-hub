import { useNavigate } from "@tanstack/react-router";
import { Bot, Film, Gamepad2, Globe, LayoutGrid, Music } from "lucide-react";
import { setPrefs, type Prefs } from "@/lib/astra/prefs";
import { supabase } from "@/integrations/supabase/client";

const OPTIONS: { id: Exclude<Prefs["focus"], "">; label: string; desc: string; icon: typeof Music; to: string }[] = [
  { id: "music", label: "Music", desc: "Songs, playlists & AI DJ", icon: Music, to: "/music" },
  { id: "movies", label: "Movies", desc: "Films and shows", icon: Film, to: "/movies" },
  { id: "web", label: "Web proxy", desc: "Browse any site", icon: Globe, to: "/web" },
  { id: "games", label: "Games", desc: "Play in the browser", icon: Gamepad2, to: "/games" },
  { id: "ai", label: "AI", desc: "Chat, voice & memory", icon: Bot, to: "/chat" },
  { id: "all", label: "All of it", desc: "Everything unlocked", icon: LayoutGrid, to: "/home" },
];

/** First-login question: what is this for? Picking one hides the rest. */
export function FocusPrompt() {
  const navigate = useNavigate();
  async function pick(o: (typeof OPTIONS)[number]) {
    setPrefs({ focus: o.id });
    const { data } = await supabase.auth.getUser();
    if (data.user) await supabase.from("profiles").update({ focus: o.id }).eq("id", data.user.id);
    navigate({ to: o.to as "/home" });
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-2xl">
        <h1 className="text-center font-display text-3xl sm:text-4xl">What are you using this for?</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">We'll set things up around it. You can change this anytime in Settings.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {OPTIONS.map((o) => (
            <button key={o.id} onClick={() => pick(o)} className="focus-option rounded-2xl p-4 text-left transition">
              <o.icon className="size-6 text-primary" />
              <div className="mt-3 font-medium">{o.label}</div>
              <div className="text-xs text-muted-foreground">{o.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

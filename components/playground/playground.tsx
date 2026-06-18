"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { presets, getPreset } from "@/lib/presets";
import { site } from "@/lib/site";

function officialHost() {
  try {
    return new URL(site.url).host;
  } catch {
    return site.url;
  }
}

type Role = "user" | "assistant";
type Turn = { role: Role; content: string; thinking?: string };

type Model = { id: string; label: string; note: string; thinks: boolean };

const MODELS: Model[] = [
  { id: "claude-opus-4-8", label: "Claude Opus 4.8", note: "最も賢い", thinks: true },
  { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", note: "速さと知性の両立", thinks: true },
  { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", note: "最速・軽量", thinks: false },
];

const LS = {
  key: "mondo_api_key",
  keyStore: "mondo_key_store",
  mode: "mondo_mode",
  model: "mondo_model",
  think: "mondo_think",
};

type StoreMode = "local" | "session" | "none";

function readStoredKey(): { key: string; store: StoreMode } {
  try {
    const store = (localStorage.getItem(LS.keyStore) as StoreMode) || "local";
    if (store === "local") return { key: localStorage.getItem(LS.key) || "", store };
    if (store === "session") return { key: sessionStorage.getItem(LS.key) || "", store };
    return { key: "", store: "none" };
  } catch {
    return { key: "", store: "local" };
  }
}

function writeKey(value: string, store: StoreMode) {
  try {
    localStorage.setItem(LS.keyStore, store);
    localStorage.removeItem(LS.key);
    sessionStorage.removeItem(LS.key);
    if (store === "local") localStorage.setItem(LS.key, value);
    else if (store === "session") sessionStorage.setItem(LS.key, value);
  } catch {}
}

const STORE_LABELS: { id: StoreMode; label: string; hint: string }[] = [
  { id: "local", label: "端末に保存", hint: "次回も入力不要（localStorage）" },
  { id: "session", label: "このタブだけ", hint: "タブを閉じると消える" },
  { id: "none", label: "保存しない", hint: "メモリ上のみ・再読込で消える" },
];

export function Playground() {
  const search = useSearchParams();

  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [storageMode, setStorageMode] = useState<StoreMode>("local");
  const [infoOpen, setInfoOpen] = useState(false);
  const [model, setModel] = useState("claude-opus-4-8");
  const [showThinking, setShowThinking] = useState(false);

  const [system, setSystem] = useState("");
  const [draft, setDraft] = useState(
    "AIに何でも聞いてみよう。または下の例から選んでください。"
  );
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // restore prefs
  useEffect(() => {
    try {
      const stored = readStoredKey();
      if (stored.key) setApiKey(stored.key);
      setStorageMode(stored.store);
      const m = localStorage.getItem(LS.mode);
      if (m === "live" || m === "demo") setMode(m);
      const md = localStorage.getItem(LS.model);
      if (md) setModel(md);
      const th = localStorage.getItem(LS.think);
      if (th) setShowThinking(th === "1");
    } catch {}
  }, []);

  // load preset from URL
  useEffect(() => {
    const id = search.get("preset");
    if (id) loadPreset(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const persist = (k: string, v: string) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  };

  const loadPreset = useCallback((id: string) => {
    const p = getPreset(id);
    if (!p) return;
    setSystem(p.system ?? "");
    setDraft(p.user);
    setTurns([]);
    setError(null);
    setActivePreset(id);
    scrollRef.current?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, busy]);

  function reset() {
    abortRef.current?.abort();
    setTurns([]);
    setError(null);
    setBusy(false);
  }

  // ── demo streaming (no key) ────────────────────────────────
  function streamText(full: string, onToken: (s: string) => void, done: () => void) {
    let i = 0;
    const step = () => {
      if (!abortRef.current || abortRef.current.signal.aborted) return done();
      const chunk = full.slice(i, i + 2);
      i += 2;
      onToken(chunk);
      if (i < full.length) {
        setTimeout(step, 12);
      } else {
        done();
      }
    };
    step();
  }

  async function send() {
    const text = draft.trim();
    if (!text || busy) return;
    setError(null);

    const userTurn: Turn = { role: "user", content: text };
    const history = [...turns, userTurn];
    setTurns([...history, { role: "assistant", content: "", thinking: "" }]);
    setDraft("");
    setBusy(true);

    // privacy-safe analytics: only the mode/model, never the prompt content
    track("playground_send", { mode, model: mode === "live" ? model : "demo" });

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    const pushToken = (field: "content" | "thinking", s: string) => {
      setTurns((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, [field]: (last[field] ?? "") + s };
        return next;
      });
    };

    if (mode === "demo") {
      const preset = activePreset ? getPreset(activePreset) : null;
      const matched = preset && preset.user.trim() === text;
      const reply = matched
        ? preset!.demoReply
        : "（デモモード）この例文への用意された回答だけを表示できます。自由に対話するには、上部で「自分の鍵」モードに切り替えてください。あなたのAPIキーはこのブラウザ内にのみ保存され、私たちのサーバーには一切送信されません。\n\n下の例をクリックすると、その回答を体験できます。";
      streamText(
        reply,
        (s) => pushToken("content", s),
        () => {
          setBusy(false);
          abortRef.current = null;
        }
      );
      return;
    }

    // ── live mode (BYOK, direct to Anthropic) ──────────────────
    if (!apiKey.trim()) {
      setError("APIキーを入力してください。鍵はこのブラウザにのみ保存されます。");
      setBusy(false);
      setTurns((prev) => prev.slice(0, -1));
      return;
    }

    const wantThink = showThinking && MODELS.find((m) => m.id === model)?.thinks;
    const body: Record<string, unknown> = {
      model,
      max_tokens: 2048,
      stream: true,
      messages: history.map((t) => ({ role: t.role, content: t.content })),
    };
    if (system.trim()) body.system = system.trim();
    if (wantThink) body.thinking = { type: "adaptive", display: "summarized" };

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        let msg = `エラー (${res.status})`;
        try {
          const j = await res.json();
          msg = j?.error?.message ? `${msg}: ${j.error.message}` : msg;
        } catch {}
        if (res.status === 401) msg = "認証エラー：APIキーが正しいか確認してください。";
        setError(msg);
        setBusy(false);
        setTurns((prev) => prev.slice(0, -1));
        abortRef.current = null;
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const blocks = buf.split("\n\n");
        buf = blocks.pop() ?? "";
        for (const block of blocks) {
          const line = block.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const json = line.slice(5).trim();
          if (!json || json === "[DONE]") continue;
          try {
            const ev = JSON.parse(json);
            if (ev.type === "content_block_delta") {
              if (ev.delta?.type === "text_delta") pushToken("content", ev.delta.text);
              else if (ev.delta?.type === "thinking_delta") pushToken("thinking", ev.delta.thinking);
            } else if (ev.type === "error") {
              setError(ev.error?.message ?? "ストリーミング中にエラーが発生しました。");
            }
          } catch {}
        }
      }
    } catch (e: unknown) {
      if ((e as Error)?.name !== "AbortError") {
        setError(
          "通信に失敗しました。ネットワーク、またはブラウザの拡張機能（広告ブロッカー等）がリクエストを妨げている可能性があります。"
        );
        setTurns((prev) => prev.slice(0, -1));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  const modelMeta = MODELS.find((m) => m.id === model)!;

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {/* ── controls ─────────────────────────────────────── */}
      <aside className="flex flex-col gap-5">
        {/* mode toggle */}
        <div className="card grain-card p-1.5">
          <div className="grid grid-cols-2 gap-1">
            {(["demo", "live"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  persist(LS.mode, m);
                }}
                className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  mode === m ? "bg-shu text-ink-900" : "text-paper-dim hover:text-paper"
                }`}
              >
                {m === "demo" ? "デモ（鍵なし）" : "自分の鍵で実行"}
              </button>
            ))}
          </div>
        </div>

        {mode === "live" && (
          <div className="card grain-card animate-fade-up space-y-3 p-4">
            <div className="flex items-center justify-between">
              <label className="kicker block">Anthropic API Key</label>
              <button
                onClick={() => setInfoOpen(true)}
                className="flex items-center gap-1 text-[11px] text-ai hover:text-paper"
              >
                <span className="grid h-4 w-4 place-items-center rounded-full border border-ai/50 text-[9px]">
                  ?
                </span>
                鍵の扱い・安全性
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  writeKey(e.target.value, storageMode);
                }}
                placeholder="sk-ant-..."
                spellCheck={false}
                autoComplete="off"
                className="ring-shu w-full rounded-lg border border-line bg-ink-900 px-3 py-2 font-mono text-xs text-paper placeholder:text-paper-faint"
              />
              <button
                onClick={() => setShowKey((v) => !v)}
                className="shrink-0 rounded-lg border border-line px-3 text-xs text-paper-mute hover:text-paper"
              >
                {showKey ? "隠す" : "表示"}
              </button>
            </div>

            {/* storage mode */}
            <div>
              <div className="mb-1.5 grid grid-cols-3 gap-1">
                {STORE_LABELS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setStorageMode(s.id);
                      writeKey(apiKey, s.id);
                    }}
                    className={`rounded-md border px-2 py-1.5 text-[11px] transition-colors ${
                      storageMode === s.id
                        ? "border-shu/50 bg-shu/10 text-paper"
                        : "border-line text-paper-mute hover:text-paper"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-paper-faint">
                {STORE_LABELS.find((s) => s.id === storageMode)?.hint}
              </p>
            </div>

            <p className="text-xs leading-relaxed text-paper-mute">
              鍵は<strong className="text-paper-dim">あなたのブラウザ内だけ</strong>に保存され、通信は
              <strong className="text-paper-dim">ブラウザから直接Anthropicへ</strong>。当サイトのサーバーは経由しません。
              ブラウザ側で<strong className="text-paper-dim">Anthropic以外への送信を遮断</strong>しています（CSP）。
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="ulink text-shu"
              >
                APIキーを取得 →
              </a>
              <a
                href="https://console.anthropic.com/settings/limits"
                target="_blank"
                rel="noreferrer"
                className="ulink text-shu"
              >
                支出上限を設定 →
              </a>
            </div>
          </div>
        )}

        {/* model */}
        <div className="card grain-card space-y-2 p-4">
          <label className="kicker block">モデル</label>
          <div className="space-y-1.5">
            {MODELS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setModel(m.id);
                  persist(LS.model, m.id);
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${
                  model === m.id
                    ? "border-shu/50 bg-shu/10"
                    : "border-line hover:border-line-strong"
                }`}
              >
                <span className="text-sm text-paper">{m.label}</span>
                <span className="font-mono text-[10px] text-paper-mute">{m.note}</span>
              </button>
            ))}
          </div>
          <label
            className={`mt-2 flex cursor-pointer items-center justify-between rounded-lg px-1 py-1 text-sm ${
              modelMeta.thinks ? "text-paper-dim" : "pointer-events-none text-paper-faint opacity-50"
            }`}
          >
            <span>思考を表示（藍）</span>
            <input
              type="checkbox"
              checked={showThinking && modelMeta.thinks}
              disabled={!modelMeta.thinks}
              onChange={(e) => {
                setShowThinking(e.target.checked);
                persist(LS.think, e.target.checked ? "1" : "0");
              }}
              className="h-4 w-4 accent-shu"
            />
          </label>
        </div>

        {/* system prompt */}
        <div className="card grain-card space-y-2 p-4">
          <label className="kicker block">システムプロンプト（役割・前提）</label>
          <textarea
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            placeholder="例：あなたは忍耐強い家庭教師です。"
            rows={3}
            className="ring-shu w-full resize-y rounded-lg border border-line bg-ink-900 px-3 py-2 text-sm text-paper placeholder:text-paper-faint"
          />
        </div>

        {/* examples */}
        <div className="card grain-card space-y-3 p-4">
          <label className="kicker block">例から学ぶ</label>
          <div className="-mr-1 max-h-64 space-y-1.5 overflow-y-auto pr-1">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => loadPreset(p.id)}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  activePreset === p.id
                    ? "border-shu/50 bg-shu/10 text-paper"
                    : "border-line text-paper-dim hover:border-line-strong hover:text-paper"
                }`}
              >
                <span className="font-mono text-[9px] tracking-wider text-shu">{p.category}</span>
                <span className="truncate">{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ── conversation ─────────────────────────────────── */}
      <section className="card grain-card flex min-h-[640px] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${mode === "live" ? "bg-shu" : "bg-ai"}`} />
            <span className="font-mono text-xs text-paper-mute">
              {mode === "live" ? `LIVE · ${modelMeta.label}` : "DEMO MODE"}
            </span>
          </div>
          <button
            onClick={reset}
            className="text-xs text-paper-mute hover:text-paper"
            disabled={turns.length === 0 && !busy}
          >
            会話をリセット
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {turns.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="seal mb-4 h-12 w-12 text-2xl">問</span>
              <p className="max-w-sm text-pretty text-sm leading-relaxed text-paper-mute">
                ここは道場。左の例を選ぶか、下に問いを書いて送信してください。
                {mode === "demo" && " デモモードでは、用意された例にAIが応答します。"}
              </p>
            </div>
          )}

          {turns.map((t, i) => (
            <div key={i} className={t.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={`max-w-[88%] ${t.role === "user" ? "" : "w-full"}`}>
                {t.role === "assistant" && t.thinking ? (
                  <details className="mb-2 rounded-lg border border-ai/30 bg-ai/5 px-3 py-2">
                    <summary className="cursor-pointer font-mono text-[11px] text-ai">
                      思考プロセス（要約）
                    </summary>
                    <div className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-ai/80">
                      {t.thinking}
                    </div>
                  </details>
                ) : null}
                <div
                  className={
                    t.role === "user"
                      ? "rounded-2xl rounded-br-md bg-ink-700 px-4 py-3 text-sm text-paper"
                      : "rounded-2xl rounded-bl-md border border-line bg-ink-850 px-4 py-3 text-sm leading-relaxed text-paper-dim"
                  }
                >
                  {t.role === "assistant" && t.content === "" && busy ? (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-shu" />
                      <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-shu [animation-delay:.2s]" />
                      <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-shu [animation-delay:.4s]" />
                    </span>
                  ) : (
                    <span className="whitespace-pre-wrap">{t.content}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {error && (
            <div className="rounded-lg border border-shu/40 bg-shu/10 px-4 py-3 text-sm text-shu-bright">
              {error}
            </div>
          )}
        </div>

        {/* composer */}
        <div className="border-t border-line p-4">
          <div className="flex items-end gap-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              rows={3}
              placeholder="問いを書く…（⌘/Ctrl + Enter で送信）"
              className="ring-shu flex-1 resize-y rounded-xl border border-line bg-ink-900 px-4 py-3 text-sm text-paper placeholder:text-paper-faint"
            />
            <button
              onClick={send}
              disabled={busy || !draft.trim()}
              className="btn btn-primary h-12 shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "…" : "送信"}
            </button>
          </div>
        </div>
      </section>
    </div>

    {infoOpen && <KeyInfoModal onClose={() => setInfoOpen(false)} />}
    </>
  );
}

function KeyInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="鍵の扱いと安全性"
      onClick={onClose}
      className="fixed inset-0 z-[60] grid place-items-center bg-ink-900/80 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card grain-card max-h-[85vh] w-full max-w-lg overflow-y-auto p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="seal h-10 w-10 text-xl">鍵</span>
            <h2 className="font-display text-xl text-paper">あなたの鍵は、あなたのもの。</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full border border-line px-3 py-1 text-sm text-paper-mute hover:text-paper"
          >
            閉じる
          </button>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-paper-dim">
          疑うのは正しい姿勢です。だから「信じてください」ではなく、
          <strong className="text-paper">確かめられる事実</strong>と
          <strong className="text-paper">ブラウザが強制する仕組み</strong>でお見せします。
        </p>

        <div className="mb-5 rounded-lg border border-shu/40 bg-shu/10 px-4 py-3">
          <div className="font-mono text-[10px] tracking-[0.2em] text-shu">公式サイト</div>
          <p className="mt-1 text-sm leading-relaxed text-paper-dim">
            APIキーを入力してよいのは <strong className="break-all text-paper">{officialHost()}</strong> だけです。
            見た目が似ていても、これ以外のURLでは入力しないでください（なりすまし対策）。
          </p>
        </div>

        <ul className="space-y-3 text-sm">
          {[
            ["ブラウザ内だけに保存", "鍵は localStorage / sessionStorage、または保存なし。保存方法はあなたが選べます。当サイトのサーバーには送られません。"],
            ["Anthropicへ直接送信", "通信はあなたのブラウザから api.anthropic.com へ直結。問道のサーバーは鍵もメッセージも経由しません。"],
            ["他送信を物理的に遮断（CSP）", "Content-Security-Policy で、このページは『自分自身』と『Anthropic』以外へ一切通信できません。仮に悪意あるコードがあっても、鍵を外部へ送り出せません。"],
            ["自分の目で検証できる", "DevTools の Network タブを開けば、宛先が api.anthropic.com だけだと確認できます。コードも公開しています。"],
            ["上限付き＆いつでも失効", "支出上限を設定した専用キーの利用を推奨。不安になったら即座に失効できます。"],
            ["不安ならデモモードで", "鍵を入れずとも、デモモードで一通り学べます。BYOK は仕組みを理解した方向けの任意機能です。"],
          ].map(([h, b]) => (
            <li key={h} className="flex gap-3">
              <span className="mt-1 text-shu" aria-hidden>
                ✓
              </span>
              <span>
                <strong className="text-paper">{h}</strong>
                <span className="text-paper-mute"> — {b}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-sm">
          <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="ulink text-shu">
            APIキーを取得 →
          </a>
          <a href="https://console.anthropic.com/settings/limits" target="_blank" rel="noreferrer" className="ulink text-shu">
            支出上限を設定 →
          </a>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-paper-faint">
          注：共有PCやブラウザ拡張機能が多い環境では、ブラウザに鍵を置くこと自体に一般的なリスクがあります。
          その場合は「保存しない」を選ぶか、デモモードのご利用を。
        </p>
      </div>
    </div>
  );
}

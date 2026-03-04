"use client";

import { useState } from "react";

// ── SVG paths ─────────────────────────────────────────────────────────────────
const ICONS: Record<string, { bg: string; path: JSX.Element }> = {
  Facebook: {
    bg: "#1877f2",
    path: <svg viewBox="0 0 24 24" fill="white" style={{width:"100%",height:"100%"}}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  },
  Instagram: {
    bg: "linear-gradient(135deg,#f58529,#dd2a7b,#8134af)",
    path: <svg viewBox="0 0 24 24" fill="white" style={{width:"100%",height:"100%"}}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  },
  Tiktok: {
    bg: "#010101",
    path: <svg viewBox="0 0 24 24" fill="white" style={{width:"100%",height:"100%"}}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/></svg>,
  },
  YouTube: {
    bg: "#ff0000",
    path: <svg viewBox="0 0 24 24" fill="white" style={{width:"100%",height:"100%"}}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
  },
  Pinterest: {
    bg: "#e60023",
    path: <svg viewBox="0 0 24 24" fill="white" style={{width:"100%",height:"100%"}}><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>,
  },
  X: {
    bg: "#000000",
    path: <svg viewBox="0 0 24 24" fill="white" style={{width:"100%",height:"100%"}}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  },
};

const BRAND: Record<string, string> = {
  Facebook: "#1877f2", Instagram: "#dd2a7b", Tiktok: "#000",
  YouTube: "#ff0000", Pinterest: "#e60023", X: "#000",
};

function Icon({ name, size }: { name: string; size: number }) {
  const cfg = ICONS[name];
  if (!cfg) return <div style={{ width: size, height: size, borderRadius: 10, background: "#e2e8f0", flexShrink: 0 }} />;
  const r = Math.round(size * 0.26);
  return (
    <div style={{ width: size, height: size, borderRadius: r, background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: size * 0.54, height: size * 0.54 }}>{cfg.path}</div>
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const PLATFORMS = [
  { name: "Facebook",  followers: "1,654", posts: "50", engagement: "1,920" },
  { name: "Instagram", followers: "2,014", posts: "40", engagement: "1,220" },
  { name: "Tiktok",    followers: "1,478", posts: "30", engagement: "980"   },
  { name: "YouTube",   followers: "895",   posts: "10", engagement: "1,750" },
  { name: "Pinterest", followers: "1,654", posts: "50", engagement: "1,920" },
];

const POSTS = [
  { title: "Enjoy your vacation here!",      date: "Mar 1, 2026 - 10:00 AM",  platform: "Facebook"  },
  { title: "Book your reservation with us!", date: "Mar 5, 2026 - 12:00 PM",  platform: "Instagram" },
  { title: "Get your hotel with IU!",        date: "Mar 10, 2026 - 11:00 AM", platform: "Instagram" },
  { title: "Enjoy your summer vacation!",    date: "Apr 20, 2026 - 09:00 PM", platform: "Pinterest" },
];

const ACCOUNTS = [
  { name: "Facebook",  handle: "Egetinnz Page"  },
  { name: "Instagram", handle: "@Egetinnz_Page" },
  { name: "YouTube",   handle: "@egetinnz"      },
  { name: "Tiktok",    handle: "@egetinnz"      },
  { name: "Pinterest", handle: "@egetinnz"      },
  { name: "X",         handle: "@egetinnz"      },
];

const PAGES = [
  { name: "Egetinnz Page", plt: "Facebook", f: "6,302", e: "500", tl: "Reach", tv: "10,000", posts: "120" },
  { name: "@egetinnz",     plt: "Tiktok",   f: "6,302", e: "500", tl: "Views", tv: "10,000", posts: "120" },
];

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ title, sub, badge, onClose, children }: { title: string; sub: string; badge: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#3d5a80", borderRadius: 20, width: 560, maxWidth: "calc(100vw - 32px)", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "28px 28px 16px", display: "flex", justifyContent: "space-between" }}>
          <div><h2 style={{ color: "#fff", margin: 0, fontSize: 20, fontWeight: 700 }}>{title}</h2><p style={{ color: "#a8c4e0", margin: "4px 0 0", fontSize: 12 }}>{sub}</p></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>←</button>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>{badge}</span>
          </div>
        </div>
        <div style={{ padding: "0 20px 26px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 360, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}

function MRow({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: h ? "#eef4ff" : "#fff", borderRadius: 12, padding: "14px 18px", transition: "all 0.15s", cursor: "pointer", transform: h ? "translateY(-1px)" : "none" }}>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [modal, setModal] = useState<"followers"|"posted"|"scheduled"|"engagement"|null>(null);

  return (
    <div style={{ fontFamily: "'DM Sans','Inter',sans-serif", color: "#1a202c", fontSize: 14, lineHeight: "1.5" }}>

      {/* ── Modals ── */}
      {modal === "followers" && (
        <Modal title="Total Followers" sub="Overview for Egetinnz total followers performance." badge="Total: 7,852 Followers" onClose={() => setModal(null)}>
          {[{p:"Facebook",v:"6,302 followers"},{p:"Instagram",v:"4,500 followers"},{p:"Pinterest",v:"900 followers"},{p:"X",v:"150 followers"}].map(r=>(
            <MRow key={r.p}><div style={{display:"flex",alignItems:"center",gap:10}}><Icon name={r.p} size={36}/><span style={{fontWeight:500}}>{r.p}</span></div><span style={{fontWeight:700,fontSize:15}}>{r.v}</span></MRow>
          ))}
        </Modal>
      )}
      {modal === "posted" && (
        <Modal title="Total Posted Content" sub="Overview for Egetinnz total posted content." badge="Published: 120 Posts" onClose={() => setModal(null)}>
          {["Facebook","Instagram","Pinterest","YouTube"].map(p=>(
            <MRow key={p}><div style={{display:"flex",alignItems:"center",gap:10}}><Icon name={p} size={36}/><span style={{fontWeight:500}}>{p}</span></div><span style={{fontWeight:700,fontSize:20}}>20</span></MRow>
          ))}
        </Modal>
      )}
      {modal === "scheduled" && (
        <Modal title="Total Scheduled Content" sub="Overview for Egetinnz total scheduled content." badge="Scheduled Post: 8" onClose={() => setModal(null)}>
          {[{p:"Facebook",c:5,t:2,w:1,l:2},{p:"Instagram",c:3,t:1,w:1,l:1},{p:"Pinterest",c:0,t:0,w:0,l:0}].map(r=>(
            <MRow key={r.p}><div style={{display:"flex",alignItems:"center",gap:10}}><Icon name={r.p} size={36}/><span style={{fontWeight:500}}>{r.p}</span></div><div style={{display:"flex",alignItems:"center",gap:16}}><span style={{fontWeight:700,fontSize:20}}>{r.c}</span><div style={{fontSize:11,color:"#94a3b8",lineHeight:1.8}}><div>Today: {r.t}</div><div>This Week: {r.w}</div><div>Later: {r.l}</div></div></div></MRow>
          ))}
        </Modal>
      )}
      {modal === "engagement" && (
        <Modal title="Total Engagement" sub="Overview for Egetinnz total engagement." badge="Total Interactions:" onClose={() => setModal(null)}>
          {["Facebook","Instagram","Pinterest","YouTube"].map(p=>(
            <MRow key={p}><div style={{display:"flex",alignItems:"center",gap:10}}><Icon name={p} size={36}/><span style={{fontWeight:500}}>{p}</span></div><div style={{display:"flex",gap:12,color:"#94a3b8"}}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div></MRow>
          ))}
        </Modal>
      )}

      {/* ── Header ── */}
      <h1 style={{ fontSize: 30, fontWeight: 700, margin: "0 0 4px" }}>Dashboard</h1>
      <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 22px" }}>Overview for <strong>Egetinnz</strong> social media performance.</p>

      {/* ── Two-column layout ── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Stat cards */}
          <div style={{ display: "flex", gap: 14 }}>
            <StatCard title="Total Followers"         value="7,852" sub="As of February 11, 2026" hl onClick={() => setModal("followers")} />
            <StatCard title="Total Posted Content"    value="120"   sub="Published Post"           onClick={() => setModal("posted")} />
            <StatCard title="Total Scheduled Content" value="8"     sub="Scheduled Post"           onClick={() => setModal("scheduled")} />
            <StatCard title="Total Engagement"        value="3,420" sub="Interactions"             onClick={() => setModal("engagement")} />
          </div>

          {/* Summary Per Platform */}
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Summary Per Platform</p>
            <div style={{ display: "flex", gap: 12 }}>
              {PLATFORMS.map(p => <PlatCard key={p.name} p={p} />)}
            </div>
          </div>

          {/* Scheduled Per Post */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px 20px 0", border: "1px solid #e8edf3", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Scheduled Per Post</p>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
              <thead>
                <tr>
                  <th style={TH}>Post Title</th>
                  <th style={TH}>Date &amp; Time</th>
                  <th style={TH}>Platform</th>
                  <th style={TH}>Status</th>
                  <th style={TH}>Action</th>
                </tr>
                {/* spacer after header */}
                <tr><td colSpan={5} style={{ padding: "16px 0", background: "#fff" }} /></tr>
              </thead>
              <tbody>
                {POSTS.map((p, i) => <PostRow key={i} post={p} />)}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Connected Accounts */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "18px 16px", border: "1px solid #e8edf3", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Connected Accounts</p>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {ACCOUNTS.map(a => <AccRow key={a.name} acc={a} />)}
            </div>
          </div>

          {/* Summary per Pages */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "18px 16px", border: "1px solid #e8edf3", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Summary per Pages</p>
              <SmBtn>View All</SmBtn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {PAGES.map((pg, i) => <PageCard key={pg.name} page={pg} divider={i < PAGES.length - 1} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, hl, onClick }: { title: string; value: string; sub: string; hl?: boolean; onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: 1, minWidth: 0, borderRadius: 14, padding: "22px 20px 18px", cursor: "pointer",
      background: hl ? "#1e3a5f" : "#fff",
      border: hl ? "none" : "1px solid #e8edf3",
      color: hl ? "#fff" : "#1a202c",
      boxShadow: h ? "0 8px 24px rgba(0,0,0,0.13)" : (hl ? "0 4px 16px rgba(30,58,95,0.2)" : "0 1px 3px rgba(0,0,0,0.05)"),
      transform: h ? "translateY(-2px)" : "translateY(0)",
      transition: "all 0.15s ease",
    }}>
      <p style={{ fontSize: 12, fontWeight: 500, margin: "0 0 10px", color: hl ? "#a8c4e0" : "#64748b" }}>{title}</p>
      <p style={{ fontSize: 40, fontWeight: 700, margin: "0 0 8px", lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 11, fontWeight: 600, fontStyle: "italic", margin: 0, color: hl ? "#7ba8cc" : "#64748b" }}>{sub}</p>
    </div>
  );
}

// ── Platform Card ─────────────────────────────────────────────────────────────
function PlatCard({ p }: { p: typeof PLATFORMS[0] }) {
  const [h, setH] = useState(false);
  const bc = BRAND[p.name] ?? "#e8edf3";
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      flex: 1, minWidth: 0,
      borderRadius: 12,
      border: "1px solid #e8edf3",
      borderTop: `3px solid ${bc}`,
      padding: "14px 14px 16px",
      background: "#fff",
      cursor: "pointer",
      transform: h ? "translateY(-2px)" : "translateY(0)",
      boxShadow: h ? "0 6px 18px rgba(0,0,0,0.10)" : "0 1px 4px rgba(0,0,0,0.06)",
      transition: "all 0.15s ease",
    }}>
      {/* icon + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
        <Icon name={p.name} size={34} />
        <span style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</span>
      </div>
      {/* stats: label left, bold value right */}
      {[["Followers", p.followers], ["Posts", p.posts], ["Engagement", p.engagement]].map(([lbl, val]) => (
        <div key={lbl} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>{lbl}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1a202c" }}>{val}</span>
        </div>
      ))}
    </div>
  );
}

// ── Table header ─────────────────────────────────────────────────────────────
const TH: React.CSSProperties = {
  textAlign: "left", padding: "12px 16px",
  fontSize: 12, fontWeight: 600, color: "#64748b",
  background: "#f1f5f9", borderBottom: "none",
};

// ── Post Row ──────────────────────────────────────────────────────────────────
function PostRow({ post }: { post: typeof POSTS[0] }) {
  const [h, setH] = useState(false);
  const [bh, setBh] = useState(false);
  return (
    <tr onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#e8f0fe" : "#f8fafc", transition: "background 0.15s", cursor: "default" }}>
      <td style={TD}>{post.title}</td>
      <td style={{ ...TD, color: "#64748b", whiteSpace: "nowrap" }}>{post.date}</td>
      <td style={TD}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name={post.platform} size={24} />
          <span style={{ fontWeight: 500 }}>{post.platform}</span>
        </div>
      </td>
      <td style={TD}>
        <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 13 }}>Scheduled</span>
      </td>
      <td style={TD}>
        <button onMouseEnter={() => setBh(true)} onMouseLeave={() => setBh(false)}
          style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, color: bh ? "#1d4ed8" : "#2563eb", textDecoration: bh ? "underline" : "none", padding: 0, fontFamily: "inherit", transition: "all 0.15s" }}>
          View Post
        </button>
      </td>
    </tr>
  );
}

const TD: React.CSSProperties = {
  padding: "15px 16px", fontSize: 13, fontWeight: 400,
  borderBottom: "4px solid #fff",
};

// ── Connected Account Row ─────────────────────────────────────────────────────
function AccRow({ acc }: { acc: typeof ACCOUNTS[0] }) {
  const [h, setH] = useState(false);
  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: h ? "#f0f6ff" : "#f8fafc",
      border: "1px solid #eef2f7",
      borderRadius: 12, padding: "10px 12px",
      cursor: "pointer", transition: "all 0.15s",
      marginBottom: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon name={acc.name} size={36} />
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, margin: 0, lineHeight: 1.3, color: "#1a202c" }}>{acc.name}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{acc.handle}</p>
        </div>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 600, color: "#16a34a",
        background: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap", flexShrink: 0,
      }}>
        Connected
      </span>
    </div>
  );
}

// ── Small Button ──────────────────────────────────────────────────────────────
function SmBtn({ children }: { children: React.ReactNode }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", background: h ? "#1e3a5f" : "#fff", color: h ? "#fff" : "#1a202c", transition: "all 0.15s", fontFamily: "inherit" }}>
      {children}
    </button>
  );
}

// ── Page Card ─────────────────────────────────────────────────────────────────
function PageCard({ page, divider }: { page: typeof PAGES[0]; divider: boolean }) {
  return (
    <div style={{ paddingBottom: divider ? 16 : 0, marginBottom: divider ? 16 : 0, borderBottom: divider ? "1px solid #f1f5f9" : "none" }}>
      {/* icon + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Icon name={page.plt} size={32} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>{page.name}</span>
      </div>
      {/* column labels */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 3 }}>
        <span>Followers</span><span>Engagement</span><span>{page.tl}</span>
      </div>
      {/* values */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
        <span>{page.f}</span><span>{page.e}</span><span>{page.tv}</span>
      </div>
      {/* posts + details */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "#64748b" }}>Posts&nbsp;<strong style={{ color: "#1a202c" }}>{page.posts}</strong></span>
        <DetailsBtn />
      </div>
    </div>
  );
}

function DetailsBtn() {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", background: h ? "#1e3a5f" : "#fff", color: h ? "#fff" : "#1a202c", transition: "all 0.15s", fontFamily: "inherit" }}>
      Details
    </button>
  );
}
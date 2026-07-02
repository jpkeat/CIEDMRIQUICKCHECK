import { useState } from "react";

// ── Device Database ────────────────────────────────────────────────────────────
// Sources: manufacturer MRI labeling, FDA approvals, HRS/ACC guidance
// MR Conditional = device has been tested and found safe under defined conditions
// Each entry: { model, manufacturer, type, mriStatus, conditions, note }

const DEVICE_DB = {
  // ── Medtronic Cans ──
  "W1DR01": { model: "Advisa DR MRI SureScan", manufacturer: "Medtronic", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T only. Requires SureScan leads. Must program MRI mode.", note: "" },
  "W4SR01": { model: "Advisa SR MRI SureScan", manufacturer: "Medtronic", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T only. Requires SureScan leads.", note: "" },
  "W1TR01": { model: "Consulta CRT-P MRI SureScan", manufacturer: "Medtronic", type: "CRT-P", mriStatus: "conditional", conditions: "1.5T only. SureScan leads required. Program MRI mode.", note: "" },
  "D374TRM": { model: "Visia AF MRI ICD", manufacturer: "Medtronic", type: "ICD", mriStatus: "conditional", conditions: "1.5T only. SureScan leads required. Suspend tachy therapy before scan.", note: "" },
  "DTBA1QQ": { model: "Evera MRI ICD", manufacturer: "Medtronic", type: "ICD", mriStatus: "conditional", conditions: "1.5T only. SureScan leads required.", note: "" },
  "ADDR01": { model: "Azure DR MRI SureScan", manufacturer: "Medtronic", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T. SureScan leads required. Program MRI SureScan mode.", note: "3T capable" },
  "ADSR01": { model: "Azure SR MRI SureScan", manufacturer: "Medtronic", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T. SureScan leads required.", note: "3T capable" },
  "ATDR01": { model: "Azure XT DR MRI SureScan", manufacturer: "Medtronic", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T. SureScan leads required.", note: "3T capable" },
  "CRDR01": { model: "Claria MRI CRT-D SureScan", manufacturer: "Medtronic", type: "CRT-D", mriStatus: "conditional", conditions: "1.5T and 3T. SureScan leads required.", note: "3T capable" },
  "MC1DR2": { model: "Micra AV", manufacturer: "Medtronic", type: "Leadless Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T. No leads. No programming changes required.", note: "Leadless — no lead serial needed" },
  "EV3500": { model: "Extrel CRT-D", manufacturer: "Medtronic", type: "CRT-D", mriStatus: "non-conditional", conditions: "", note: "Legacy device — not MRI labeled" },
  "GEM9250": { model: "Gem III DR", manufacturer: "Medtronic", type: "ICD", mriStatus: "non-conditional", conditions: "", note: "Legacy ICD" },

  // ── Abbott / St. Jude Medical Cans ──
  "PM2160": { model: "Accent MRI DR", manufacturer: "Abbott", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T only. Requires Tendril MRI leads. Activate MRI Protection Mode.", note: "" },
  "PM2162": { model: "Accent MRI SR", manufacturer: "Abbott", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T only. Requires Tendril MRI leads.", note: "" },
  "CD3317": { model: "Fortify Assura MRI ICD", manufacturer: "Abbott", type: "ICD", mriStatus: "conditional", conditions: "1.5T only. Requires MRI-labeled leads. Disable tachy therapy.", note: "" },
  "EL3316": { model: "Ellipse MRI ICD", manufacturer: "Abbott", type: "ICD", mriStatus: "conditional", conditions: "1.5T only. MRI-labeled leads required.", note: "" },
  "PM2210": { model: "Assurity MRI DR", manufacturer: "Abbott", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T. Requires Tendril MRI leads.", note: "3T capable" },
  "PM2212": { model: "Assurity MRI SR", manufacturer: "Abbott", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T.", note: "3T capable" },
  "CD3355": { model: "Quadra Assura MP CRT-D", manufacturer: "Abbott", type: "CRT-D", mriStatus: "conditional", conditions: "1.5T only. MRI leads required.", note: "" },
  "V339": { model: "Identity ADx DR", manufacturer: "Abbott", type: "Pacemaker", mriStatus: "non-conditional", conditions: "", note: "Legacy device" },

  // ── Boston Scientific Cans ──
  "L300": { model: "Ingenio MRI EL DR", manufacturer: "Boston Scientific", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T only. Requires Ingevity MRI leads. Enable MRI Protection Mode.", note: "" },
  "L301": { model: "Ingenio MRI EL SR", manufacturer: "Boston Scientific", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T only. Requires Ingevity MRI leads.", note: "" },
  "G157": { model: "Resonate MRI ICD", manufacturer: "Boston Scientific", type: "ICD", mriStatus: "conditional", conditions: "1.5T only. MRI-labeled leads required. Disable tachy therapy before scan.", note: "" },
  "G159": { model: "Resonate X4 CRT-D", manufacturer: "Boston Scientific", type: "CRT-D", mriStatus: "conditional", conditions: "1.5T only. MRI leads required.", note: "" },
  "L311": { model: "Accolade MRI DR", manufacturer: "Boston Scientific", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T. Ingevity MRI leads required.", note: "3T capable" },
  "L313": { model: "Accolade MRI SR", manufacturer: "Boston Scientific", type: "Pacemaker", mriStatus: "conditional", conditions: "1.5T and 3T.", note: "3T capable" },
  "G107": { model: "EMBLEM MRI S-ICD", manufacturer: "Boston Scientific", type: "S-ICD", mriStatus: "conditional", conditions: "1.5T only. Subcutaneous — no transvenous leads. Disable therapy during scan.", note: "S-ICD — no lead serial needed" },
  "T165": { model: "Longitude CRT-D", manufacturer: "Boston Scientific", type: "CRT-D", mriStatus: "non-conditional", conditions: "", note: "Legacy CRT-D" },
  "P123": { model: "Pulsar Max DR", manufacturer: "Boston Scientific", type: "Pacemaker", mriStatus: "non-conditional", conditions: "", note: "Legacy pacemaker" },

  // ── Medtronic Leads ──
  "5086MRI": { model: "CapSureFix MRI SureScan 5086", manufacturer: "Medtronic", type: "RV Lead", mriStatus: "conditional", conditions: "Must be paired with SureScan-labeled can.", note: "" },
  "5076":    { model: "CapSureFix Novus 5076", manufacturer: "Medtronic", type: "RV Lead", mriStatus: "non-conditional", conditions: "", note: "Non-MRI lead — disqualifies system" },
  "4076":    { model: "Attain Ability 4076 LV Lead", manufacturer: "Medtronic", type: "LV Lead", mriStatus: "conditional", conditions: "SureScan system required.", note: "" },
  "4298":    { model: "Sprint Quattro Secure 6947", manufacturer: "Medtronic", type: "RV Shock Lead", mriStatus: "non-conditional", conditions: "", note: "Legacy shock lead" },
  "3830":    { model: "SelectSecure 3830 Lumenless", manufacturer: "Medtronic", type: "His/CSP Lead", mriStatus: "conditional", conditions: "1.5T only with SureScan can.", note: "" },

  // ── Abbott Leads ──
  "1888TC": { model: "Tendril MRI 1888TC", manufacturer: "Abbott", type: "RV Lead", mriStatus: "conditional", conditions: "Must be paired with MRI-labeled Abbott can.", note: "" },
  "2088TC": { model: "Tendril MRI 2088TC", manufacturer: "Abbott", type: "RV Lead", mriStatus: "conditional", conditions: "MRI-labeled Abbott can required.", note: "" },
  "1948HV": { model: "Durata 7121Q Shock Lead", manufacturer: "Abbott", type: "RV Shock Lead", mriStatus: "non-conditional", conditions: "", note: "Legacy ICD lead" },
  "1646T":  { model: "Tendril SDX 1646T", manufacturer: "Abbott", type: "RV Lead", mriStatus: "non-conditional", conditions: "", note: "Legacy lead — not MRI labeled" },
  "1258T":  { model: "Quartet 1458Q LV Lead", manufacturer: "Abbott", type: "LV Lead", mriStatus: "conditional", conditions: "MRI-labeled Abbott can required.", note: "" },

  // ── Boston Scientific Leads ──
  "4470": { model: "Ingevity MRI 4470", manufacturer: "Boston Scientific", type: "RV Lead", mriStatus: "conditional", conditions: "Must be paired with Ingenio/Accolade MRI can.", note: "" },
  "4472": { model: "Ingevity MRI Steroid 4472", manufacturer: "Boston Scientific", type: "RV Lead", mriStatus: "conditional", conditions: "MRI-labeled BSc can required.", note: "" },
  "4394": { model: "Reliance 4-Site 4394 Shock Lead", manufacturer: "Boston Scientific", type: "RV Shock Lead", mriStatus: "non-conditional", conditions: "", note: "Legacy ICD lead" },
  "4513": { model: "Acuity Spiral LV 4513", manufacturer: "Boston Scientific", type: "LV Lead", mriStatus: "conditional", conditions: "MRI-labeled BSc can required.", note: "" },
  "4517": { model: "Acuity X4 LV 4517", manufacturer: "Boston Scientific", type: "LV Lead", mriStatus: "conditional", conditions: "MRI-labeled BSc can required.", note: "" },
  "4292": { model: "Endotak Reliance G 4292", manufacturer: "Boston Scientific", type: "RV Shock Lead", mriStatus: "non-conditional", conditions: "", note: "Legacy ICD lead" },
};

function lookup(serial) {
  if (!serial || serial.trim() === "") return null;
  const key = serial.trim().toUpperCase();
  // Exact match first
  if (DEVICE_DB[key]) return DEVICE_DB[key];
  // Partial prefix match (for longer serials entered with suffix)
  const found = Object.keys(DEVICE_DB).find(k => key.startsWith(k) || k.startsWith(key));
  return found ? DEVICE_DB[found] : null;
}

function StatusBadge({ status }) {
  if (!status) return null;
  const cfg = {
    conditional: { bg: "#0D9488", label: "MR CONDITIONAL", icon: "✓" },
    "non-conditional": { bg: "#DC2626", label: "NOT MR CONDITIONAL", icon: "✕" },
    unknown: { bg: "#64748B", label: "UNRECOGNIZED", icon: "?" },
  }[status] || { bg: "#64748B", label: "UNKNOWN", icon: "?" };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: cfg.bg, color: "#fff",
      fontFamily: "Inter, system-ui, sans-serif",
      fontWeight: 700, fontSize: 11, letterSpacing: "0.08em",
      padding: "3px 10px", borderRadius: 4,
    }}>
      <span style={{ fontSize: 13 }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

function DeviceCard({ label, serial, result }) {
  const isEmpty = !serial.trim();
  const notFound = serial.trim() && !result;

  return (
    <div style={{
      background: "#111C2D", borderRadius: 10, padding: "14px 18px",
      border: result
        ? result.mriStatus === "conditional" ? "1px solid #0D9488" : "1px solid #DC2626"
        : "1px solid #1E2D45",
      transition: "border-color 0.3s",
      minHeight: 90,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ color: "#64748B", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
        {result && <StatusBadge status={result.mriStatus} />}
        {notFound && <StatusBadge status="unknown" />}
      </div>
      {isEmpty && <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>No serial entered</p>}
      {notFound && (
        <p style={{ color: "#94A3B8", fontSize: 13, margin: 0 }}>
          Serial <code style={{ color: "#F8FAFC", fontFamily: "monospace", background: "#0A1628", padding: "1px 6px", borderRadius: 3 }}>{serial.trim()}</code> not found in database — verify manually.
        </p>
      )}
      {result && (
        <div>
          <p style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 600, margin: "0 0 2px" }}>{result.model}</p>
          <p style={{ color: "#94A3B8", fontSize: 12, margin: "0 0 6px" }}>{result.manufacturer} · {result.type}</p>
          {result.conditions && (
            <p style={{ color: "#CBD5E1", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
              <span style={{ color: "#F59E0B", fontWeight: 600 }}>Conditions: </span>{result.conditions}
            </p>
          )}
          {result.note && (
            <p style={{ color: "#7DD3D0", fontSize: 11, margin: "4px 0 0", fontStyle: "italic" }}>{result.note}</p>
          )}
        </div>
      )}
    </div>
  );
}

function SystemVerdict({ canResult, leadResults }) {
  const allEntered = canResult !== undefined;
  if (!allEntered) return null;

  const allResults = [canResult, ...leadResults].filter(Boolean);
  if (allResults.length === 0) return null;

  const hasNonConditional = allResults.some(r => r && r.mriStatus === "non-conditional");
  const hasUnknown = [canResult, ...leadResults].some((r, i) => {
    if (i === 0) return canResult === null;
    return r === null;
  });
  const allConditional = allResults.length > 0 && allResults.every(r => r && r.mriStatus === "conditional") && !hasUnknown;

  let verdict, color, bg, icon, sublabel;
  if (hasNonConditional) {
    verdict = "SYSTEM NOT MR CONDITIONAL";
    sublabel = "One or more components are not MRI labeled. Do not proceed without further evaluation.";
    color = "#FEF2F2"; bg = "#7F1D1D"; icon = "✕";
  } else if (hasUnknown) {
    verdict = "UNABLE TO VERIFY";
    sublabel = "One or more serials were not found. Manual verification required before scanning.";
    color = "#FFFBEB"; bg = "#78350F"; icon = "⚠";
  } else if (allConditional) {
    verdict = "SYSTEM MR CONDITIONAL";
    sublabel = "All entered components are MR Conditional. Confirm programming requirements before scan.";
    color = "#F0FDF4"; bg = "#14532D"; icon = "✓";
  } else {
    return null;
  }

  return (
    <div style={{
      background: bg, borderRadius: 12, padding: "20px 24px",
      display: "flex", alignItems: "flex-start", gap: 16,
      animation: "fadeIn 0.4s ease",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <p style={{ color, fontWeight: 800, fontSize: 16, letterSpacing: "0.04em", margin: "0 0 4px" }}>{verdict}</p>
        <p style={{ color, opacity: 0.85, fontSize: 13, margin: 0, lineHeight: 1.5 }}>{sublabel}</p>
      </div>
    </div>
  );
}

const LEAD_LABELS = ["RA Lead", "RV Lead", "LV Lead"];

export default function App() {
  const [canSerial, setCanSerial] = useState("");
  const [leadSerials, setLeadSerials] = useState(["", "", ""]);
  const [checked, setChecked] = useState(false);
  const [canResult, setCanResult] = useState(undefined);
  const [leadResults, setLeadResults] = useState([undefined, undefined, undefined]);

  const handleCheck = () => {
    setCanResult(lookup(canSerial));
    setLeadResults(leadSerials.map(s => s.trim() ? lookup(s) : undefined));
    setChecked(true);
  };

  const handleReset = () => {
    setCanSerial(""); setLeadSerials(["", "", ""]);
    setChecked(false); setCanResult(undefined);
    setLeadResults([undefined, undefined, undefined]);
  };

  const enteredLeads = leadSerials.map((s, i) => ({ s, i })).filter(({ s }) => s.trim());

  const inputStyle = {
    background: "#0A1628", border: "1px solid #1E2D45", borderRadius: 8,
    color: "#F8FAFC", fontFamily: "monospace", fontSize: 15, letterSpacing: "0.08em",
    padding: "10px 14px", width: "100%", outline: "none", boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#060F1E",
      fontFamily: "Inter, system-ui, sans-serif", color: "#F8FAFC",
      padding: "0 0 48px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #0D9488 !important; }
        input::placeholder { color: #334155; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #060F1E; }
        ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{ background: "#0A1628", borderBottom: "1px solid #1E2D45", padding: "16px 32px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: "0.02em" }}>CIED MRI Safety Checker</h1>
          <p style={{ margin: 0, fontSize: 11, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase" }}>Cardiac Device · MR Conditional Verification</p>
        </div>
        <div style={{ marginLeft: "auto", background: "#0D174D", border: "1px solid #1E3A8A", borderRadius: 6, padding: "4px 12px" }}>
          <span style={{ fontSize: 10, color: "#93C5FD", fontWeight: 600, letterSpacing: "0.08em" }}>FOR CLINICAL USE — VERIFY WITH MANUFACTURER IFU</span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>

        {/* ── LEFT: Input ── */}
        <div>
          <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748B", margin: "0 0 20px" }}>Device Serials</h2>

          {/* Can */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6, letterSpacing: "0.06em" }}>
              GENERATOR / CAN SERIAL
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. ADDR01 or W1DR01"
              value={canSerial}
              onChange={e => { setCanSerial(e.target.value); setChecked(false); }}
            />
            <p style={{ fontSize: 11, color: "#475569", margin: "4px 0 0" }}>Enter model number or serial prefix</p>
          </div>

          {/* Leads */}
          {LEAD_LABELS.map((label, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#94A3B8", marginBottom: 6, letterSpacing: "0.06em" }}>
                {label.toUpperCase()} SERIAL <span style={{ color: "#475569", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                style={inputStyle}
                placeholder={i === 0 ? "e.g. 5086MRI or 1888TC" : "Leave blank if not present"}
                value={leadSerials[i]}
                onChange={e => {
                  const updated = [...leadSerials];
                  updated[i] = e.target.value;
                  setLeadSerials(updated);
                  setChecked(false);
                }}
              />
            </div>
          ))}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button
              onClick={handleCheck}
              disabled={!canSerial.trim() && leadSerials.every(s => !s.trim())}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 8, border: "none",
                background: (!canSerial.trim() && leadSerials.every(s => !s.trim())) ? "#1E2D45" : "#0D9488",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: (!canSerial.trim() && leadSerials.every(s => !s.trim())) ? "not-allowed" : "pointer",
                letterSpacing: "0.04em", transition: "background 0.2s",
              }}
            >
              CHECK MRI STATUS
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: "12px 18px", borderRadius: 8, border: "1px solid #1E2D45",
                background: "transparent", color: "#64748B", fontWeight: 600, fontSize: 14, cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>

          {/* Lookup tip */}
          <div style={{ marginTop: 20, background: "#0A1628", borderRadius: 8, border: "1px solid #1E2D45", padding: "12px 16px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em" }}>SUPPORTED MANUFACTURERS</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Medtronic", "Abbott / SJM", "Boston Scientific"].map(m => (
                <span key={m} style={{ fontSize: 11, background: "#111C2D", color: "#94A3B8", padding: "2px 8px", borderRadius: 4 }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Results ── */}
        <div>
          <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#64748B", margin: "0 0 20px" }}>Results</h2>

          {!checked && (
            <div style={{ background: "#0A1628", borderRadius: 12, border: "1px dashed #1E2D45", padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>Enter device serials and press<br /><strong style={{ color: "#64748B" }}>Check MRI Status</strong> to see results.</p>
            </div>
          )}

          {checked && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.35s ease" }}>
              {/* Verdict */}
              <SystemVerdict
                canResult={canSerial.trim() ? canResult : undefined}
                leadResults={leadSerials.map((s, i) => s.trim() ? leadResults[i] : undefined)}
              />

              {/* Can card */}
              {canSerial.trim() && (
                <DeviceCard label="Generator / Can" serial={canSerial} result={canResult} />
              )}

              {/* Lead cards */}
              {leadSerials.map((s, i) => s.trim() ? (
                <DeviceCard key={i} label={LEAD_LABELS[i]} serial={s} result={leadResults[i]} />
              ) : null)}

              {/* Disclaimer */}
              <div style={{ background: "#0A1628", borderRadius: 8, border: "1px solid #1E2D45", padding: "12px 16px", marginTop: 4 }}>
                <p style={{ margin: 0, fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
                  <span style={{ color: "#F59E0B", fontWeight: 700 }}>⚠ Clinical Reminder: </span>
                  MRI Conditional status requires ALL system components to be labeled. Always confirm with the manufacturer's IFU and complete institutional MRI screening protocol. This tool does not replace physician judgment.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Crosshair, Droplets, Layers, Leaf, Search, Thermometer, CloudRain, X } from "lucide-react";
import { districts, type District } from "@/data/demo";

type LayerKey = "moisture" | "rainfall" | "temp" | "ndvi";
const layerInfo: Record<LayerKey, { label: string; icon: typeof Droplets; unit: string; min: number; max: number; ramp: string[] }> = {
  moisture: { label: "Soil Moisture", icon: Droplets, unit: "%", min: 20, max: 80, ramp: ["#e8b04a", "#9fd27f", "#3fa7d6", "#1e5aa8"] },
  rainfall: { label: "Rainfall", icon: CloudRain, unit: "mm", min: 100, max: 520, ramp: ["#d6ecf7", "#7cc4e8", "#3a8fd0", "#1b4f9c"] },
  temp: { label: "Temperature", icon: Thermometer, unit: "°C", min: 26, max: 35, ramp: ["#5fb3e0", "#f2d04e", "#f08a3c", "#d6402e"] },
  ndvi: { label: "NDVI Health", icon: Leaf, unit: "", min: 0.3, max: 0.85, ramp: ["#c9772f", "#e8d35a", "#8bcf72", "#1f7a3e"] },
};

function colorFor(layer: LayerKey, v: number) {
  const { min, max, ramp } = layerInfo[layer];
  const t = Math.min(1, Math.max(0, (v - min) / (max - min)));
  return ramp[Math.min(ramp.length - 1, Math.floor(t * ramp.length))];
}

const pin = L.divIcon({
  className: "",
  html: '<div style="width:18px;height:18px;border-radius:50%;background:#2E8B57;border:3px solid #fff;box-shadow:0 0 0 6px rgba(46,139,87,.3)"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 9, { duration: 1.2 });
  }, [target, map]);
  return null;
}

function ClickPicker({ onPick }: { onPick: (ll: [number, number]) => void }) {
  useMapEvents({ click: (e) => onPick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

export default function FieldMap({ height = 620, compact = false }: { height?: number; compact?: boolean }) {
  const [base, setBase] = useState<"street" | "satellite">("street");
  const [layer, setLayer] = useState<LayerKey>("moisture");
  const [selected, setSelected] = useState<District | null>(districts[7] ?? null);
  const [fly, setFly] = useState<[number, number] | null>(null);
  const [field, setField] = useState<[number, number] | null>(null);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  const matches = q ? districts.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()) || d.bn.includes(q)) : [];
  const info = layerInfo[layer];

  const choose = (d: District) => {
    setSelected(d);
    setFly([d.lat, d.lng]);
    setQ("");
  };

  const locate = () => {
    if (!navigator.geolocation) return setMsg("GPS not available on this device");
    setMsg("Locating…");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const ll: [number, number] = [p.coords.latitude, p.coords.longitude];
        setField(ll);
        setFly(ll);
        setMsg("");
      },
      () => setMsg("Location permission denied"),
    );
  };

  const pickField = (ll: [number, number]) => {
    setField(ll);
    const nearest = [...districts].sort((a, b) => Math.hypot(a.lat - ll[0], a.lng - ll[1]) - Math.hypot(b.lat - ll[0], b.lng - ll[1]))[0];
    setSelected(nearest ?? null);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-lift" style={{ height }}>
      <MapContainer center={[23.7, 90.3]} zoom={7} className="h-full w-full" zoomControl={false} scrollWheelZoom={!compact}>
        {base === "street" ? (
          <TileLayer attribution="© OpenStreetMap contributors" url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        ) : (
          <TileLayer attribution="Tiles © Esri" url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        )}
        {districts.map((d) => (
          <CircleMarker
            key={d.name}
            center={[d.lat, d.lng]}
            radius={selected?.name === d.name ? 26 : 20}
            pathOptions={{ color: "#fff", weight: selected?.name === d.name ? 3 : 1.5, fillColor: colorFor(layer, d[layer]), fillOpacity: 0.78 }}
            eventHandlers={{ click: (e) => { L.DomEvent.stopPropagation(e); setSelected(d); } }}
          >
            <Tooltip direction="top">
              <b>{d.name}</b> · {d[layer]}{info.unit}
            </Tooltip>
          </CircleMarker>
        ))}
        {field && <Marker position={field} icon={pin} />}
        <ClickPicker onPick={pickField} />
        <FlyTo target={fly} />
      </MapContainer>

      {/* Top controls */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-wrap items-start gap-2">
        <div className="pointer-events-auto relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search district / upazila" className="w-full rounded-full border border-border bg-card/95 py-2.5 pl-9 pr-4 text-sm shadow-soft outline-none backdrop-blur focus:ring-2 focus:ring-ring" />
          {matches.length > 0 && (
            <ul className="absolute mt-1 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
              {matches.map((d) => (
                <li key={d.name}>
                  <button onClick={() => choose(d)} className="flex w-full justify-between px-4 py-2 text-left text-sm hover:bg-secondary">
                    {d.name} <span className="text-muted-foreground">{d.bn}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="pointer-events-auto flex rounded-full border border-border bg-card/95 p-1 text-xs font-semibold shadow-soft">
          {(["street", "satellite"] as const).map((b) => (
            <button key={b} onClick={() => setBase(b)} className={`rounded-full px-3 py-1.5 capitalize ${base === b ? "bg-primary text-primary-foreground" : "text-forest"}`}>
              {b}
            </button>
          ))}
        </div>
        <button onClick={locate} className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-forest px-3 py-2 text-xs font-semibold text-primary-foreground shadow-soft">
          <Crosshair className="h-4 w-4" /> My location
        </button>
        {msg && <span className="pointer-events-auto rounded-full bg-card px-3 py-2 text-xs shadow-soft">{msg}</span>}
      </div>

      {/* Layer switcher */}
      <div className="absolute bottom-3 left-3 z-[500] rounded-2xl border border-border bg-card/95 p-3 shadow-soft backdrop-blur">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest"><Layers className="h-3.5 w-3.5" /> Data layer</div>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(layerInfo) as LayerKey[]).map((k) => {
            const I = layerInfo[k].icon;
            return (
              <button key={k} onClick={() => setLayer(k)} className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium ${layer === k ? "bg-primary text-primary-foreground" : "bg-muted text-forest hover:bg-secondary"}`}>
                <I className="h-3.5 w-3.5" /> {layerInfo[k].label}
              </button>
            );
          })}
        </div>
        <div className="mt-3">
          <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${info.ramp.join(",")})` }} />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{info.min}{info.unit}</span><span>{info.max}{info.unit}</span>
          </div>
        </div>
      </div>

      {/* Info panel */}
      {selected && !compact && (
        <aside className="absolute right-3 top-16 z-[500] w-64 rounded-2xl border border-border bg-card/95 p-4 shadow-lift backdrop-blur max-sm:hidden">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-forest">{selected.name}</h3>
              <p className="text-xs text-muted-foreground">{selected.bn} · {field ? "Selected field" : "District overview"}</p>
            </div>
            <button aria-label="Close" onClick={() => setSelected(null)} className="rounded-full p-1 hover:bg-muted"><X className="h-4 w-4" /></button>
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {(Object.keys(layerInfo) as LayerKey[]).map((k) => (
              <div key={k} className="rounded-xl bg-muted p-2">
                <dt className="text-muted-foreground">{layerInfo[k].label}</dt>
                <dd className="text-base font-bold text-forest">{selected[k]}{layerInfo[k].unit}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-3 rounded-xl bg-secondary p-3 text-xs">
            <span className="font-semibold text-forest">Recommended:</span> {selected.crop}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Tip: click anywhere on the map to drop a field pin.</p>
        </aside>
      )}
    </div>
  );
}

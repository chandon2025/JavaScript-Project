import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Polygon, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Crosshair, Layers, RotateCcw, Trash2 } from "lucide-react";
import { useLang } from "@/lib/lang";

export function calculatePolygonArea(latlngs: Array<[number, number]>): { sqMeters: number; acres: number; bigha: number } {
  if (latlngs.length < 3) return { sqMeters: 0, acres: 0, bigha: 0 };

  const R = 6378137; // Earth's radius in meters
  let area = 0;
  const n = latlngs.length;

  for (let i = 0; i < n; i++) {
    const p1 = latlngs[i]!;
    const p2 = latlngs[(i + 1) % n]!;
    const p0 = latlngs[(i - 1 + n) % n]!;

    const lat = (p1[0] * Math.PI) / 180;
    const lonNext = (p2[1] * Math.PI) / 180;
    const lonPrev = (p0[1] * Math.PI) / 180;

    area += (lonNext - lonPrev) * Math.sin(lat);
  }

  area = Math.abs((area * R * R) / 2);
  const acres = area / 4046.86;
  const bigha = acres * 3.025;

  return {
    sqMeters: Math.round(area),
    acres: parseFloat(acres.toFixed(2)),
    bigha: parseFloat(bigha.toFixed(2)),
  };
}

function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPosition({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

interface FieldDrawingMapProps {
  points: Array<[number, number]>;
  onPointsChange: (points: Array<[number, number]>) => void;
  onAreaChange: (acres: number, bigha: number) => void;
}

export default function FieldDrawingMap({ points, onPointsChange, onAreaChange }: FieldDrawingMapProps) {
  const { lang } = useLang();
  const [baseLayer, setBaseLayer] = useState<"satellite" | "street">("satellite");
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  // Recalculate area whenever points change
  useEffect(() => {
    const { acres, bigha } = calculatePolygonArea(points);
    onAreaChange(acres, bigha);
  }, [points, onAreaChange]);

  const handleMapClick = (lat: number, lon: number) => {
    const updated = [...points, [lat, lon] as [number, number]];
    onPointsChange(updated);
  };

  const handleUndo = () => {
    if (points.length > 0) {
      onPointsChange(points.slice(0, -1));
    }
  };

  const handleClear = () => {
    onPointsChange([]);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setFlyTarget([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          // Default to Bogura/Mymensingh if permission denied
          setFlyTarget([24.75, 90.41]);
        },
      );
    }
  };

  const areaResult = calculatePolygonArea(points);

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-slate-900 shadow-inner md:h-[450px]">
        <MapContainer
          center={[24.75, 90.41]}
          zoom={8}
          className="h-full w-full"
          zoomControl={true}
        >
          {baseLayer === "satellite" ? (
            <TileLayer
              attribution="Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}

          <MapClickHandler onMapClick={handleMapClick} />
          <FlyToPosition position={flyTarget} />

          {/* Draw connecting lines or completed polygon */}
          {points.length >= 3 ? (
            <Polygon
              positions={points}
              pathOptions={{
                color: "#10B981",
                fillColor: "#10B981",
                fillOpacity: 0.35,
                weight: 3,
                dashArray: "4 4",
              }}
            />
          ) : points.length === 2 ? (
            <Polyline positions={points} pathOptions={{ color: "#10B981", weight: 3 }} />
          ) : null}

          {/* Vertex points */}
          {points.map((pt, idx) => (
            <CircleMarker
              key={idx}
              center={pt}
              radius={6}
              pathOptions={{
                color: "#FFFFFF",
                fillColor: "#059669",
                fillOpacity: 1,
                weight: 2,
              }}
            />
          ))}
        </MapContainer>

        {/* Top-Right Control Buttons overlay */}
        <div className="pointer-events-auto absolute right-3 top-3 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setBaseLayer(baseLayer === "satellite" ? "street" : "satellite")}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md backdrop-blur transition-all hover:bg-slate-100 dark:bg-slate-900/95 dark:text-white dark:hover:bg-slate-800"
          >
            <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {baseLayer === "satellite"
                ? (lang === "bn" ? "রাস্তা" : "Street")
                : (lang === "bn" ? "উপগ্রহ" : "Satellite")}
            </span>
          </button>

          <button
            type="button"
            onClick={handleLocateMe}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md backdrop-blur transition-all hover:bg-slate-100 dark:bg-slate-900/95 dark:text-white dark:hover:bg-slate-800"
          >
            <Crosshair className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>{lang === "bn" ? "আমার অবস্থান" : "My location"}</span>
          </button>

          <button
            type="button"
            onClick={handleUndo}
            disabled={points.length === 0}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md backdrop-blur transition-all hover:bg-slate-100 disabled:opacity-50 dark:bg-slate-900/95 dark:text-white dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>{lang === "bn" ? "পূর্বাবস্থা" : "Undo"}</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={points.length === 0}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-slate-800 shadow-md backdrop-blur transition-all hover:bg-slate-100 disabled:opacity-50 dark:bg-slate-900/95 dark:text-white dark:hover:bg-slate-800"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
            <span>{lang === "bn" ? "মুছে ফেলুন" : "Clear"}</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics Pill Boxes (Points, Acres, Bigha) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/70 p-3 text-center dark:bg-emerald-950/30">
          <div className="text-xs font-medium text-muted-foreground">{lang === "bn" ? "পয়েন্ট" : "Points"}</div>
          <div className="mt-0.5 text-xl font-black text-forest dark:text-emerald-400">
            {points.length}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/70 p-3 text-center dark:bg-emerald-950/30">
          <div className="text-xs font-medium text-muted-foreground">{lang === "bn" ? "একর" : "Acres"}</div>
          <div className="mt-0.5 text-xl font-black text-forest dark:text-emerald-400">
            {areaResult.acres > 0 ? areaResult.acres.toFixed(2) : "0.00"}
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/70 p-3 text-center dark:bg-emerald-950/30">
          <div className="text-xs font-medium text-muted-foreground">{lang === "bn" ? "বিঘা" : "Bigha"}</div>
          <div className="mt-0.5 text-xl font-black text-forest dark:text-emerald-400">
            {areaResult.bigha > 0 ? areaResult.bigha.toFixed(2) : "0.00"}
          </div>
        </div>
      </div>
    </div>
  );
}

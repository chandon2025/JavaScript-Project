import { lazy, Suspense, useEffect, useState } from "react";

const FieldDrawingMap = lazy(() => import("./FieldDrawingMap"));

interface FieldDrawingMapClientProps {
  points: Array<[number, number]>;
  onPointsChange: (points: Array<[number, number]>) => void;
  onAreaChange: (acres: number, bigha: number) => void;
}

export function FieldDrawingMapClient(props: FieldDrawingMapClientProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fallback = <div className="h-[400px] w-full animate-pulse rounded-2xl bg-muted md:h-[450px]" />;
  if (!mounted) return fallback;

  return (
    <Suspense fallback={fallback}>
      <FieldDrawingMap {...props} />
    </Suspense>
  );
}

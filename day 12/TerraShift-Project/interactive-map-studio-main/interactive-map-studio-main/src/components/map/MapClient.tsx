import { lazy, Suspense, useEffect, useState } from "react";

const FieldMap = lazy(() => import("./FieldMap"));

export function MapClient(props: { height?: number; compact?: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const fallback = <div className="animate-pulse rounded-3xl bg-muted" style={{ height: props.height ?? 620 }} />;
  if (!ready) return fallback;
  return (
    <Suspense fallback={fallback}>
      <FieldMap {...props} />
    </Suspense>
  );
}

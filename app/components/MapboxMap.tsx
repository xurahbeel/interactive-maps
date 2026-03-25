"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  mapOptionsForContainer,
  MISSING_MAPBOX_TOKEN_HINT,
  seedMapWithUserLocation,
} from "@/app/lib/seeder";
import { useEffect, useRef, useState } from "react";

type MapboxMapProps = {
  className?: string;
};

export default function MapboxMap({ className }: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      setHint(MISSING_MAPBOX_TOKEN_HINT);
      return;
    }

    const el = containerRef.current;
    if (!el || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map(mapOptionsForContainer(el));
    mapRef.current = map;

    let cancelled = false;
    seedMapWithUserLocation(map, () => cancelled);

    return () => {
      cancelled = true;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  if (hint) {
    return (
      <div
        className={`flex items-center justify-center bg-zinc-100 px-6 text-center text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 ${className ?? ""}`}
      >
        {hint}
      </div>
    );
  }

  return <div ref={containerRef} className={className} />;
}

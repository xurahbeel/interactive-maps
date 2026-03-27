"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  flyToUsaView,
  flyToUserLngLat,
  mapOptionsForContainer,
  MISSING_MAPBOX_TOKEN_HINT,
  seedMapWithUserLocation,
  setUserLocationMarker,
  GEOLOCATION_OPTIONS,
} from "@/app/lib/seeder";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export type MapboxMapHandle = {
  showUsa: () => void;
  showCurrentLocation: () => void;
};

type MapboxMapProps = {
  className?: string;
};

const MapboxMap = forwardRef<MapboxMapHandle, MapboxMapProps>(
  function MapboxMap({ className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
    const [hint, setHint] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      showUsa: () => {
        const map = mapRef.current;
        if (!map) return;
        userMarkerRef.current?.remove();
        userMarkerRef.current = null;
        flyToUsaView(map);
      },
      showCurrentLocation: () => {
        const map = mapRef.current;
        if (!map || !navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lngLat: [number, number] = [
              pos.coords.longitude,
              pos.coords.latitude,
            ];
            flyToUserLngLat(map, lngLat);
            userMarkerRef.current = setUserLocationMarker(
              map,
              lngLat,
              userMarkerRef.current,
            );
          },
          () => {
            /* denied or error */
          },
          GEOLOCATION_OPTIONS,
        );
      },
    }));

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
      seedMapWithUserLocation(map, () => cancelled, userMarkerRef);

      return () => {
        cancelled = true;
        userMarkerRef.current?.remove();
        userMarkerRef.current = null;
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
  },
);

export default MapboxMap;

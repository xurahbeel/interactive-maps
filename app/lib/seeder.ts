import mapboxgl from "mapbox-gl";
import type { MapboxOptions } from "mapbox-gl";

export const MISSING_MAPBOX_TOKEN_HINT =
  "Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local (Mapbox account).";

/** Continental US when geolocation is denied, fails, or unavailable */
export const DEFAULT_VIEW = {
  center: [-98.5795, 39.8283] as [number, number],
  zoom: 3.5,
};

export const MAP_STYLE = "mapbox://styles/mapbox/streets-v12";

export const USER_LOCATION_ZOOM = 12;

export const USER_MARKER_COLOR = "#2563eb";

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: false,
  maximumAge: 300_000,
  timeout: 12_000,
} satisfies PositionOptions;

export const mapOptionsForContainer = (
  container: HTMLElement,
): MapboxOptions => ({
  container,
  style: MAP_STYLE,
  center: DEFAULT_VIEW.center,
  zoom: DEFAULT_VIEW.zoom,
});

export const flyToUsaView = (map: mapboxgl.Map): void => {
  map.flyTo({
    center: DEFAULT_VIEW.center,
    zoom: DEFAULT_VIEW.zoom,
    essential: true,
  });
};

export const flyToUserLngLat = (
  map: mapboxgl.Map,
  lngLat: [number, number],
): void => {
  map.flyTo({
    center: lngLat,
    zoom: USER_LOCATION_ZOOM,
    essential: true,
  });
};

export const setUserLocationMarker = (
  map: mapboxgl.Map,
  lngLat: [number, number],
  previous: mapboxgl.Marker | null,
): mapboxgl.Marker => {
  previous?.remove();
  return new mapboxgl.Marker({ color: USER_MARKER_COLOR })
    .setLngLat(lngLat)
    .addTo(map);
};

type UserMarkerRef = { current: mapboxgl.Marker | null };

/**
 * After style loads, asks for geolocation; on success flies to user and adds a marker.
 * On deny/error, default view stays. `shouldAbort` is checked before touching the map.
 */
export const seedMapWithUserLocation = (
  map: mapboxgl.Map,
  shouldAbort: () => boolean,
  userMarkerRef: UserMarkerRef,
): void => {
  map.once("load", () => {
    if (shouldAbort() || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (shouldAbort()) return;
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
        /* keep default view */
      },
      GEOLOCATION_OPTIONS,
    );
  });
};

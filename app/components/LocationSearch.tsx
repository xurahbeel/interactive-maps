"use client";

import { lngLatFromFeature, lngLatFromFeatureCollection } from "@/app/lib/addressGeo";
import { AddressAutofill, useConfirmAddress } from "@mapbox/search-js-react";
import type { ComponentProps, FormEvent } from "react";
import { useCallback, useRef } from "react";

type RetrieveResponse = Parameters<
  NonNullable<ComponentProps<typeof AddressAutofill>["onRetrieve"]>
>[0];

type LocationSearchProps = {
  accessToken: string;
  onNavigate: (lngLat: [number, number]) => void;
  className?: string;
};

export default function LocationSearch({
  accessToken,
  onNavigate,
  className,
}: LocationSearchProps) {
  const { formRef, showConfirm } = useConfirmAddress({
    footer: "Confirm the address Mapbox found before searching the map.",
  });

  const lastCoordsRef = useRef<[number, number] | null>(null);

  const navigateIfCoords = useCallback(
    (ll: [number, number] | null) => {
      if (!ll) return;
      lastCoordsRef.current = ll;
      onNavigate(ll);
    },
    [onNavigate],
  );

  const onRetrieve = useCallback(
    (res: RetrieveResponse) => {
      navigateIfCoords(lngLatFromFeatureCollection(res));
    },
    [navigateIfCoords],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const result = await showConfirm();
        if (result.type === "change" && "feature" in result && result.feature) {
          navigateIfCoords(lngLatFromFeature(result.feature));
        } else if (result.type === "nochange") {
          navigateIfCoords(lastCoordsRef.current);
        }
      } catch {
        /* dismissed or unavailable */
      }
    },
    [navigateIfCoords, showConfirm],
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={className}
    >
      <AddressAutofill accessToken={accessToken} onRetrieve={onRetrieve}>
        <input
          type="text"
          name="address-line1"
          autoComplete="address-line1"
          placeholder="Search address…"
          className="w-full rounded-md border border-zinc-200 bg-white/95 px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none backdrop-blur-sm placeholder:text-zinc-500 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300/50 dark:border-zinc-600 dark:bg-zinc-950/95 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600/50"
        />
      </AddressAutofill>
    </form>
  );
}

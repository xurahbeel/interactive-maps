"use client";

import { CloseIcon, MenuIcon } from "@/app/components/icons";
import MapboxMap, { type MapboxMapHandle } from "@/app/components/MapboxMap";
import { useCallback, useRef, useState } from "react";

export default function MapPage() {
  const mapRef = useRef<MapboxMapHandle>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const showUsa = useCallback(() => {
    mapRef.current?.showUsa();
    closeSidebar();
  }, [closeSidebar]);

  const showCurrentLocation = useCallback(() => {
    mapRef.current?.showCurrentLocation();
    closeSidebar();
  }, [closeSidebar]);

  return (
    <div className="flex h-dvh min-h-0 w-full">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        id="map-sidebar"
        className={`fixed top-0 left-0 z-50 flex h-full w-64 shrink-0 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-out md:relative md:z-0 md:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-3 dark:border-zinc-800">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Map
          </h1>
          <button
            type="button"
            className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-900"
            aria-label="Close menu"
            onClick={closeSidebar}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          <button
            type="button"
            className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
            onClick={showUsa}
          >
            Show USA
          </button>
          <button
            type="button"
            className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
            onClick={showCurrentLocation}
          >
            Show current location
          </button>
        </nav>
      </aside>

      <div className="relative min-h-0 min-w-0 flex-1">
        {!sidebarOpen ? (
          <button
            type="button"
            className="absolute top-3 left-3 z-10 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white/95 text-zinc-800 shadow-sm backdrop-blur-sm md:hidden dark:border-zinc-700 dark:bg-zinc-950/95 dark:text-zinc-100"
            aria-label="Open menu"
            aria-expanded={false}
            aria-controls="map-sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </button>
        ) : null}

        <MapboxMap ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
}

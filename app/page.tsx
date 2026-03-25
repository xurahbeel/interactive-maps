import MapboxMap from "./components/MapboxMap";

export default function Home() {
  return (
    <div className="flex h-dvh min-h-0 w-full flex-col">
      <header className="shrink-0 border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Map
        </h1>
      </header>
      <MapboxMap className="min-h-0 w-full flex-1" />
    </div>
  );
}

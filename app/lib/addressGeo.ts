type Pointish = {
  type?: string;
  coordinates?: number[];
};

type Featureish = {
  geometry?: Pointish;
};

export const lngLatFromFeatureCollection = (res: {
  features?: readonly Featureish[];
}): [number, number] | null => {
  const geom = res.features?.[0]?.geometry;
  if (!geom || geom.type !== "Point" || !geom.coordinates?.length) return null;
  const [lng, lat] = geom.coordinates;
  if (typeof lng !== "number" || typeof lat !== "number") return null;
  return [lng, lat];
};

export const lngLatFromFeature = (
  feature: Featureish | null | undefined,
): [number, number] | null =>
  lngLatFromFeatureCollection({ features: feature ? [feature] : [] });

function parseBoolean(value) {
  if (typeof value === 'undefined') return undefined;
  const normalized = String(value).toLowerCase().trim();
  if (normalized === 'true' || normalized === '1') return true;
  if (normalized === 'false' || normalized === '0') return false;
  return undefined;
}

export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  return {
    contactType: type,
    isFavourite: parseBoolean(isFavourite),
  };
}

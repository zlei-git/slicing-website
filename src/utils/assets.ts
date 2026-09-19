export const getAssetUrl = (path: string): string => {
  const clean = path.replace(/^\//, '');
  const base = import.meta.env.BASE_URL || './';
  return `${base}${clean}`;
};

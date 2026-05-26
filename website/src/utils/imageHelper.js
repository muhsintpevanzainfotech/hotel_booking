export const getImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('data:')
  ) {
    return url;
  }
  const serverBase = import.meta.env.VITE_SERVER_URL || '';
  return `${serverBase}/${url}`;
};

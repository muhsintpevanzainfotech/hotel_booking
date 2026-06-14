export const getImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('/') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  let serverBase = import.meta.env.VITE_SERVER_URL || '';
  serverBase = serverBase.replace(/\/api\/?$/, '');
  return `${serverBase}/${url}`;
};

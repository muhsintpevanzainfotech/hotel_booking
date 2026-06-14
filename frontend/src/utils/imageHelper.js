export const getImageUrl = (url, apiBase) => {
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
  if (!serverBase && apiBase) {
    serverBase = apiBase;
  }
  serverBase = serverBase.replace(/\/api\/?$/, '');
  return `${serverBase}/${url}`;
};

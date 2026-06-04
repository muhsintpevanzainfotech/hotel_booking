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
  const serverBase = apiBase ? apiBase.replace('/api', '') : '';
  return `${serverBase}/${url}`;
};

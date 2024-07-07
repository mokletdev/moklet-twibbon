export const isValidImageUrl = (url: string): boolean => {
  const imageExtensions = /\.(jpeg|jpg|gif|png|svg|webp|bmp|tiff|ico)$/i;

  if (!imageExtensions.test(url)) {
    return false;
  }

  return true;
};

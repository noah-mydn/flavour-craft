export const convertBlobsToFiles = async (blobUrls) => {
  const urls = Array.isArray(blobUrls) ? blobUrls : [blobUrls];

  const files = await Promise.all(
    urls.map(async (blobUrl, index) => {
      try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return new File([blob], `image_${index}.jpg`, { type: blob.type });
      } catch (error) {
        console.error("Error converting blob to file:", error);
        return null;
      }
    })
  );

  return Array.isArray(blobUrls) ? files : files[0];
};

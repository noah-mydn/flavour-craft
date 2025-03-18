export const convertBlobsToFiles = async (blobUrls) => {
  return Promise.all(
    blobUrls.map(async (blobUrl, index) => {
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
};

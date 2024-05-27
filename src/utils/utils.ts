export async function getMIMETypeFromURL(url: string): Promise<string | null> {
    /**
     * This function returns the MIME type of the resource at the specified URL. Ensuring that
     * the resource is a valid image.
     * 
     * @param url The URL of the resource
     * 
     * @returns The MIME type of the resource
     */
    try {
      // Fetch the resource from the URL
      const response = await fetch(url);
  
      // Ensure that the fetch was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} for Image URL: ${url}`);
      }
  
      // Retrieve a Blob object of the body
      const blob = await response.blob();
  
      // The MIME type will be a string like 'image/jpeg' if the Blob represents an image,
      // otherwise, it could be a different MIME type or empty.
      const mimeType = blob.type;
  
      // Check if the MIME type starts with 'image/'
      if (mimeType.startsWith('image/')) {
        return mimeType;
      } else {
        console.error(`The URL: ${url} does not point to a valid image.`);
        return null; // Not a valid image MIME type
      }
    } catch (error) {
      console.error('Error in getMIMETypeFromURL:', error);
      return null; // Error case or not a valid image
    }
  }

  export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
}

export function movieInfoToOpenGraph(movieInfo: Record<string, any> | null = null, tags: String[] = []): Record<string, string>[] {

  if (!movieInfo) return [];

  const metaTags = [];
  // Add actors
  movieInfo.staff.cast.forEach((actor) => {
    metaTags.push({ property: "video:actor", content: actor.name });
    if (actor.role) {
      metaTags.push({ property: "video:actor:role", content: actor.role });
    }
  });

  // Add directors
  movieInfo.staff.directors.forEach((director) => {
    metaTags.push({ property: "video:director", content: director.name });
  });

  // Add writers
  movieInfo.staff.screenwriters.forEach((writer) => {
    metaTags.push({ property: "video:writer", content: writer.name });
  });

  // Add duration
  if (movieInfo.basic_info.duration_minutes) {
    const durationInSeconds = movieInfo.basic_info.duration_minutes * 60;
    metaTags.push({ property: "video:duration", content: durationInSeconds });
  }

  // Add tags
  tags.forEach((tag) => {
    metaTags.push({ property: "video:tag", content: tag });
  });

  console.log(metaTags);

  return metaTags;

}
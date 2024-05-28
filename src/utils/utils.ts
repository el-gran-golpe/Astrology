

function convertToISODuration(minutes: number): string {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const remainingMinutes = String(minutes % 60).padStart(2, '0');
  const seconds = String(0).padStart(2, '0');
  return `PT${hours}H${remainingMinutes}M${seconds}S`;
}

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

export function movieInfoToOpenGraph(movieInfo: Record<string, any> | null = null, tags: String[]  = []): Record<string, string>[] {

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

  return metaTags;

}

export function movieInfoToSchemaOrg(movieInfo: Record<string, any>, genres: String[], currentUrl: string ): Record<string, any> {

  if (!movieInfo) return {};
  console.log(movieInfo)

  let schemaOrgData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movieInfo.locationInfo.title,
    "url": currentUrl,
    "description": movieInfo.locationInfo.synopsis,
    "image": {
      "@type": "ImageObject",
      "url": movieInfo.extended_info.poster_url
    },
    "duration": convertToISODuration(movieInfo.basic_info.duration_minutes),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": `${movieInfo.film_affinity_info.score.average}`, 
      "bestRating": "5",
      "worstRating": "0",
      "ratingCount": `${movieInfo.film_affinity_info.score.votes}`
    },
  };
  
  if (movieInfo.alternative_multimedia.trailer_url){
    schemaOrgData["trailer"] = {
      "@type": "VideoObject",
      "name": `${movieInfo.locationInfo.title} Trailer`,
      "description": `Trailer for ${movieInfo.locationInfo.title}`,
      "contentUrl": movieInfo.alternative_multimedia.trailer_url
    }
  }

  // Add director
  if (movieInfo.staff.directors.length > 1){
    schemaOrgData["director"] = movieInfo.staff.directors.map((director) => {
      return {"@type": "Person", "name": director.name}
    });
  }
  else if (movieInfo.staff.directors.length > 0){
    schemaOrgData["director"] = {"@type": "Person", "name": movieInfo.staff.directors[0].name}
  }
  
  if (movieInfo.staff.cast.length > 0){
    schemaOrgData["actor"] = movieInfo.staff.cast.map((actor) => {
      if (actor.role){
        return {"@type": "Person", "name": actor.name, "characterName": actor.role}
      } else {
        return {"@type": "Person", "name": actor.name}
      }
    }
    )
  }

  if (movieInfo.staff.musicians.length > 1){
    schemaOrgData["musicBy"] = movieInfo.staff.musicians.map((musician) => {
      return {"@type": "Person", "name": musician.name}
    });
  }
  else if (movieInfo.staff.musicians.length > 0){
    schemaOrgData["musicBy"] = {"@type": "Person", "name": movieInfo.staff.musicians[0].name}
  } 


  console.log(JSON.stringify(schemaOrgData, null, 2));

  return schemaOrgData;
}
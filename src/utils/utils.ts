

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

export function movieInfoToOpenGraph(movieInfo: Record<string, any> | null = null, tags: String[]  = []): Record<string, string|number>[] {

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

export function movieInfoToSchemaOrg(filmInfo: Record<string, any>, genres: String[], currentUrl: string ): Record<string, any> {

  if (!filmInfo) return {};
  console.log(filmInfo)

  let schemaOrgData: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": filmInfo.locationInfo.title,
    "genre": genres,
    "dateCreated": filmInfo.basic_info.publication_date? filmInfo.basic_info.publication_date : filmInfo.basic_info.year,
    "url": currentUrl,
    "description": filmInfo.locationInfo.synopsis,
    "image": {
      "@type": "ImageObject",
      "url": filmInfo.extended_info.poster_url,
      "caption": `Poster of ${filmInfo.locationInfo.title}`,
      "thumbnail": {
        "@type": "ImageObject",
        "url": filmInfo.extended_info.poster_thumbnail_url
      },
      "description": filmInfo.locationInfo.short_synopsis
    },
    "duration": convertToISODuration(filmInfo.basic_info.duration_minutes),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": `${filmInfo.film_affinity_info.score.average}`, 
      "bestRating": "5",
      "worstRating": "0",
      "ratingCount": `${filmInfo.film_affinity_info.score.votes}`
    },
  };

  if (filmInfo.alternative_multimedia.trailer_url){
    schemaOrgData["trailer"] = {
      "@type": "VideoObject",
      "name": `${filmInfo.locationInfo.title} Trailer`,
      "description": `Trailer for ${filmInfo.locationInfo.title}`,
      "contentUrl": filmInfo.alternative_multimedia.trailer_url
    }
  }

  if (filmInfo.extended_info.relevant_links.length > 0){
    schemaOrgData["sameAs"] = filmInfo.extended_info.relevant_links.map((link: Record<string, string>) => link.url);

  }

  // Keep only the nominations that have a "to" field that is not null. Parse from list to a map structure {<to>: [<award1>, <award2>...]}
  let nominations: Record<string, string[]> = {};

  for (const nomination of filmInfo.extended_info.nominations) {
    if (nomination.to){
      if (!nominations[nomination.to]){
        nominations[nomination.to] = [];
      }
      nominations[nomination.to].push(nomination.award);
    } else {
      if (!nominations["Other"]){
        nominations["Other"] = [];
      }
      nominations["Other"].push(nomination.award);
    }
  }


  if (filmInfo.basic_info.countries.length > 1){
    schemaOrgData["countryOfOrigin"] = filmInfo.basic_info.countries.map((country: string) => {
      return {"@type": "Country", "name": country}
    });
  } else if (filmInfo.basic_info.countries.length > 0){
    schemaOrgData["countryOfOrigin"] = {"@type": "Country", "name": filmInfo.basic_info.countries[0]}
  }

// Add director
if (filmInfo.staff.directors.length > 1) {
  schemaOrgData["director"] = filmInfo.staff.directors.map((director: Record<string, string>) => {

    let directorEntry: Record<string, any> = { "@type": "Person", "name": director.name };
    if (nominations[director.name]) {
      directorEntry["award"] = nominations[director.name];
    }
    return directorEntry;
  });
} else if (filmInfo.staff.directors.length > 0) {
  let directorEntry: Record<string, any> = { "@type": "Person", "name": filmInfo.staff.directors[0].name };
  if (nominations[filmInfo.staff.directors[0].name]) {
    directorEntry["award"] = nominations[filmInfo.staff.directors[0].name];
  }

  schemaOrgData["director"] = directorEntry;
}

// Add cast
if (filmInfo.staff.cast.length > 0) {
  schemaOrgData["actor"] = filmInfo.staff.cast.map((actor: Record<string, string>) => {
    let actorEntry: Record<string, any> = { "@type": "Person", "name": actor.name };
    if (actor.role) {
      actorEntry["characterName"] = actor.role;
    }
    if (nominations[actor.name]) {
      actorEntry["award"] = nominations[actor.name];
    }
    return actorEntry;
  });
}

// Add musicians
if (filmInfo.staff.musicians.length > 1) {
  schemaOrgData["musicBy"] = filmInfo.staff.musicians.map((musician: Record<string, string>) => {
    let musicianEntry: Record<string, any> = { "@type": "Person", "name": musician.name };
    if (nominations[musician.name]) {
      musicianEntry["award"] = nominations[musician.name];
    }
    return musicianEntry;
  });
} else if (filmInfo.staff.musicians.length > 0) {
  let musicianEntry: Record<string, any> = { "@type": "Person", "name": filmInfo.staff.musicians[0].name };
  if (nominations[filmInfo.staff.musicians[0].name]) {
    musicianEntry["award"] = nominations[filmInfo.staff.musicians[0].name];
  }
  schemaOrgData["musicBy"] = musicianEntry;
} 

  if (nominations["Other"]){
    schemaOrgData["award"] = nominations["Other"];
  }

  console.log(JSON.stringify(schemaOrgData, null, 2));

  return schemaOrgData;
}
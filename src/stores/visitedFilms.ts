import { persistentMap } from '@nanostores/persistent'

export interface FilmInfo {
    slug: string,
    title: string,
    posterURL: string,
};

export const visitedFilms = persistentMap<Record<string, string>>('visited-films:');

export function addVisitedFilm({ slug, title, posterURL }: FilmInfo) {
    const currentEntry = visitedFilms.get()[slug];
    if (!currentEntry) {
        visitedFilms.setKey(slug, JSON.stringify({slug, title, posterURL}));
        return true;
    }
    return false;
  }
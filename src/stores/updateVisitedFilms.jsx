// Just a way to use nanostores easily
import { useEffect } from 'react';
import { addVisitedFilm } from '../stores/visitedFilms';

const UpdateVisitedFilms = ({ slug, title, posterURL }) => {
  useEffect(() => {
    addVisitedFilm({slug, title, posterURL});
  }, [slug, title, posterURL]);

  return null; // This component does not render anything visually
};

export default UpdateVisitedFilms;

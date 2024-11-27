import { catchError, of, pluck, retry, switchMap } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import './playground';

const endpoint = 'http://localhost:3333/api/pokemon?flakiness=3&delay=5000';

export const example$ = fromFetch(endpoint).pipe(
  switchMap((res) => {
    if (res.ok) return res.json();
    else throw new Error('Failed to fetch');
  }),
  retry(4),
  catchError((error) => {
    console.error(error.message);
    return of({ error: true, message: error.message });
  }),
  pluck('pokemon'),
);

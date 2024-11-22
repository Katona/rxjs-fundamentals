import { fromEvent, of, timer, merge, NEVER, throwError, EMPTY } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import {
  catchError,
  exhaustMap,
  mapTo,
  mergeMap,
  retry,
  startWith,
  switchMap,
  tap,
  pluck,
  map,
  exhaustAll,
} from 'rxjs/operators';

import {
  fetchButton,
  stopButton,
  clearError,
  clearFacts,
  addFacts,
  setError,
} from './utilities';

// const endpoint = 'http://localhost:3333/api/facts';
const endpoint =
  'http://localhost:3333/api/facts?delay=3000&chaos=1&flakiness=20';

const fetchData = () => {
  console.log('fetchData');
  return fromFetch(endpoint).pipe(
    mergeMap((res) => {
      console.log({ ok: res.ok });
      if (res.ok) return res.json();
      throw new Error('Fetch failed');
    }),
    retry(4),
    catchError((error) => {
      return of(error.message);
    }),
  );
};

if (fetchButton && stopButton) {
  const fetchClick$ = fromEvent(fetchButton, 'click').pipe(mapTo(true));
  const pauseClick$ = fromEvent(stopButton, 'click').pipe(mapTo(false));
  const factStream$ = merge(fetchClick$, pauseClick$).pipe(
    switchMap((shouldFetch) => {
      if (shouldFetch) return timer(0, 5000).pipe(map(fetchData));
      else return NEVER;
    }),
    exhaustAll(),
    tap(() => clearError()),
    tap(() => clearFacts()),
  );
  // const fetches = fromEvent(fetchButton, 'click').pipe(exhaustMap(fetchData));

  factStream$.subscribe(addFacts);
}

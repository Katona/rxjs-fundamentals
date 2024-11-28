import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
  mergeMap,
  switchMap,
  tap,
  of,
  merge,
  from,
  filter,
  catchError,
  concat,
  take,
  EMPTY,
  pluck,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon/search';

if (search) {
  const search$ = fromEvent(search, 'input').pipe(
    debounceTime(300),
    map((ev) => ev.target.value),
    distinctUntilChanged(),
    switchMap((value) =>
      fromFetch(`${endpoint}/${value}?delay=1000&chaos=true`),
    ),
    mergeMap((res) => res.json()),
    pluck('pokemon'),
    tap(clearResults),
    tap(addResults),
  );
  search$.subscribe();
}

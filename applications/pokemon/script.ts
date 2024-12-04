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
  identity,
  takeLast,
} from 'rxjs';

import { fromFetch } from 'rxjs/fetch';

import {
  addResults,
  addResult,
  clearResults,
  endpointFor,
  search,
  form,
  submit,
  renderPokemon,
} from '../pokemon/utilities';

const endpoint = 'http://localhost:3333/api/pokemon/search';

type Pokemon = { name: string; id: string };
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

if (submit) {
  const submit$ = fromEvent(submit, 'click').pipe(
    mergeMap(() =>
      fromFetch(`${endpoint}/${search.value}?delay=1000&chaos=true`).pipe(
        switchMap((res) => res.json()),
      ),
    ),
    map((json): Pokemon[] => json.pokemon),
    mergeMap(identity),
    take(1),
    switchMap((pokemon: Pokemon) => {
      const pokemonWithData$ = fromFetch(endpointFor(pokemon.id)).pipe(
        mergeMap((res) => res.json()),
        map((json) => ({ ...pokemon, data: json })),
      );
      return merge(of(pokemon), pokemonWithData$);
    }),
    tap((pokemon) => renderPokemon(pokemon)),
  );
  submit$.subscribe();
}

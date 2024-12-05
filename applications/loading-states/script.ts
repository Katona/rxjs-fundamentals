import { concat, fromEvent, race, timer } from 'rxjs';
import { exhaustMap, shareReplay, tap } from 'rxjs/operators';

import {
  fetchData,
  form,
  showLoading,
  showLoadingAfterField,
  showLoadingForAtLeastField,
} from './utilities';

const fetch$ = fromEvent(form, 'submit').pipe(
  exhaustMap(() => {
    const fetchData$ = fetchData().pipe(shareReplay(1));
    const shouldShowLoading$ = timer(
      Number.parseInt(showLoadingAfterField.value),
    ).pipe(tap(() => showLoading(true)));
    const hideLoading$ = timer(
      Number.parseInt(showLoadingForAtLeastField.value),
    );
    const fetchWithLoading$ = concat(
      shouldShowLoading$,
      hideLoading$,
      fetchData$.pipe(tap(() => showLoading(false))),
    );
    return race(fetchData$, fetchWithLoading$);
  }),
);

fetch$.subscribe(console.log);

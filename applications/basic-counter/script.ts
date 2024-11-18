import {
  fromEvent,
  interval,
  mapTo,
  merge,
  NEVER,
  scan,
  shareReplay,
  skipUntil,
  startWith,
  Subscription,
  switchMap,
  takeUntil,
  timer,
} from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click').pipe(mapTo(true));
const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));

const counter = interval(1000).pipe(shareReplay());

merge(start$, pause$)
  .pipe(
    startWith(false),
    switchMap((isRunning) => (isRunning ? counter : NEVER)),
  )
  .subscribe(setCount);

// interval(100)
//   .pipe(
//     skipUntil(start$),
//     scan((v) => v + 1, 0),
//     takeUntil(pause$),
//   )
//   .subscribe(setCount);

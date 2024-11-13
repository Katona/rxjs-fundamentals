import {
  fromEvent,
  interval,
  merge,
  NEVER,
  scan,
  skipUntil,
  Subscription,
  takeUntil,
  timer,
} from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

const interval$ = interval(100)
  .pipe(
    skipUntil(start$),
    scan((v) => v + 1, 0),
    takeUntil(pause$),
  )
  .subscribe(setCount);

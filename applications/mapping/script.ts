import { of, from, interval, fromEvent, merge, NEVER } from 'rxjs';
import {
  pluck,
  concatMap,
  take,
  map,
  mergeMap,
  scan,
  takeUntil,
  skipUntil,
} from 'rxjs/operators';

import {
  getCharacter,
  render,
  startButton,
  pauseButton,
  setStatus,
} from './utilities';

if (startButton && pauseButton) {
  const startEvents = fromEvent(startButton, 'click');
  const pauseEvents = fromEvent(pauseButton, 'click');
  const character$ = interval(1000)
    .pipe(
      skipUntil(startEvents),
      takeUntil(pauseEvents),
      scan((n: number) => n + 1, 1),
    )
    .pipe(mergeMap((n) => from(getCharacter(n))))
    .pipe(pluck('name'));

  character$.subscribe(render);
}

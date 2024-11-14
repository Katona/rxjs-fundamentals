import { fromEvent, interval } from 'rxjs';
import {
  throttleTime,
  debounceTime,
  delay,
  debounce,
  throttle,
  scan,
  map,
  tap,
  observeOn,
} from 'rxjs/operators';

import {
  button,
  panicButton,
  addMessageToDOM,
  deepThoughtInput,
  setStatus,
} from './utilities';

const intervalObservable = interval(2000);
// const operator = throttle((ev) => intervalObservable);
const operator = debounce((ev) => intervalObservable);

if (button && panicButton) {
  const buttonClicks$ = fromEvent(button, 'click').pipe(operator);

  buttonClicks$.subscribe(addMessageToDOM);
}

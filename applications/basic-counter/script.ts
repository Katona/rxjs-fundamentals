import { fromEvent, interval, merge, NEVER, Subscription, timer } from 'rxjs';
import { setCount, startButton, pauseButton } from './utilities';

const start$ = fromEvent(startButton, 'click');
const pause$ = fromEvent(pauseButton, 'click');

// const interval$ = interval(1000);
const interval$ = timer(1000, 800); //, 1000);

let currentIntervalSubscription: Subscription | undefined;

start$.subscribe(() => {
  if (currentIntervalSubscription) currentIntervalSubscription.unsubscribe();
  currentIntervalSubscription = interval$.subscribe((v) => setCount(v + 1));
});
pause$.subscribe(() => currentIntervalSubscription?.unsubscribe());

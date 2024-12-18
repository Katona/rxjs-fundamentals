import { from, Observable, of } from 'rxjs';
import {
  take,
  skip,
  filter,
  map,
  mapTo,
  reduce,
  scan,
  takeWhile,
} from 'rxjs/operators';
import { fibonacci } from '../utilities/fibonacci';

/**
 * Returns all of the values emitted by an observable as an array.
 * I'm tired of typing this out for every test.
 */
const getResult = async <T>(observable: Observable<T>) => {
  return new Promise((resolve, reject) => {
    const result: T[] = [];
    const subscription = observable.subscribe({
      next: (value) => result.push(value),
      error: reject,
      complete: () => {
        resolve(result);
        // subscription.unsubscribe();
      },
    });
  });
};

describe('Basic Operators', () => {
  it('should take the first 5 values and map them to the word "DINOSAUR"', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      take(5),
      mapTo('DINOSAUR'),
    );

    return expect(await getResult(observable$)).toEqual([
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
      'DINOSAUR',
    ]);
  });

  it('should skip the first 5 values and double last two', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      skip(5),
      map((x) => x * 2),
    );

    return expect(await getResult(observable$)).toEqual([12, 14]);
  });

  it('should emit the square of every even number in the stream', async () => {
    const observable$ = of(1, 2, 3, 4, 5, 6, 7).pipe(
      filter((x) => x % 2 === 0),
      map((x) => x * x),
    );

    return expect(await getResult(observable$)).toEqual([4, 16, 36]);
  });

  it('should sum of the total of all of the Fibonacci numbers under 200', async () => {
    const observable$ = from(fibonacci()).pipe(
      takeWhile((x) => x < 200),
      reduce((sum, x) => sum + x, 0),
    );

    expect(await getResult(observable$)).toEqual([376]);
  });

  it('should merge each object emited into a single object, emitting each state along the way', async () => {
    const observable$ = of(
      { isRunning: true },
      { currentSpeed: 100 },
      { currentSpeed: 200 },
      { distance: 500 },
    ).pipe(scan((merged, current) => ({ ...merged, ...current }), {}));

    expect(await getResult(observable$)).toEqual([
      { isRunning: true },
      { isRunning: true, currentSpeed: 100 },
      { isRunning: true, currentSpeed: 200 },
      { isRunning: true, currentSpeed: 200, distance: 500 },
    ]);
  });
});

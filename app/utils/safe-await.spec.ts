import { safeAwait } from './safe-await';

describe('safeAwait()', () => {
  test('a valid promise has data', async () => {
    const [err, data] = await safeAwait(new Promise(res => res({ objWithData: true })));
    expect(err).toBeUndefined();
    expect(data).toEqual({ objWithData: true });
  });

  test('error is returned', async () => {
    const [err, data] = await safeAwait(new Promise((_res, reject) => reject({ error: true })));
    expect(data).toBeUndefined();
    expect(err).toEqual({ error: true });
  });

  test('throws on code syntax error "ReferenceError"', async () => {
    expect.assertions(1);
    try {
      const [_err, _data] = await safeAwait(
        new Promise(() => {
          throw new ReferenceError('a native error');
        })
      );
    } catch (error) {
      expect(error).toEqual(new ReferenceError('a native error'));
    }
  });

  test('returns error if it is valid response', async () => {
    const [err, data] = await safeAwait(new Promise(res => res(new Error('test err'))));
    expect(err).toEqual(new Error('test err'));
  });

  test('optional finally function is invoked', async () => {
    const mockFn = jest.fn();
    await safeAwait(new Promise(res => res({ objWithData: true })), mockFn);
    expect(mockFn).toHaveBeenCalled();
  });
});
// import test from 'ava';
// import safeAwait from '../lib';

// test('Valid promise has data. [err, data]', async t => {
//   const [err, data] = await safeAwait(promiseOne());
//   t.is(err, undefined);
//   t.is(data, 'data here');
// });

// test('Error promise has string error. [err, data]', async t => {
//   const [err, data] = await safeAwait(promiseOne(true));
//   t.is(err, 'error happened');
//   t.is(data, undefined);
// });

// test('Error promise has instance of error. [err, data]', async t => {
//   const [err, data] = await safeAwait(promiseThrows());
//   t.is(err instanceof Error, true);
//   t.is(data, undefined);
// });

// /**
//  * Verify promises still throw native errors when deeper issue exists
//  */

// test('throws on code syntax error "ReferenceError"', async t => {
//   await t.throwsAsync(
//     async () => {
//       const [err, data] = await safeAwait(promiseWithSyntaxError());
//     },
//     {
//       instanceOf: ReferenceError,
//       message: 'madeUpThing is not defined',
//     }
//   );
// });

// test('throws on code syntax error "ReferenceError" in try/catch', async t => {
//   try {
//     const [err, data] = await safeAwait(promiseWithSyntaxError());
//   } catch (e) {
//     t.is(e instanceof ReferenceError, true);
//   }
// });

// test('throws on code "TypeError"', async t => {
//   await t.throwsAsync(
//     async () => {
//       const [err, data] = await safeAwait(promiseWithTypeError());
//     },
//     {
//       instanceOf: TypeError,
//       message: "Cannot read property 'lolCool' of null",
//     }
//   );
// });

// test('throws on code "TypeError" in try/catch', async t => {
//   try {
//     const [err, data] = await safeAwait(promiseWithTypeError());
//   } catch (e) {
//     t.is(e instanceof TypeError, true);
//   }
// });

// function promiseOne(doError) {
//   return new Promise((resolve, reject) => {
//     if (doError) return reject('error happened'); // eslint-disable-line
//     return resolve('data here');
//   });
// }

// function promiseThrows(doError) {
//   return new Promise((resolve, reject) => {
//     return reject(new Error('business logic error'));
//   });
// }

// function promiseWithSyntaxError() {
//   return new Promise((resolve, reject) => {
//     console.log(madeUpThing);
//     return resolve('should not reach this');
//   });
// }

// function promiseWithTypeError(doError) {
//   return new Promise((resolve, reject) => {
//     const fakeObject = null;
//     console.log(fakeObject.lolCool);
//     return resolve('should not reach this');
//   });
// }

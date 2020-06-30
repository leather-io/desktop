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

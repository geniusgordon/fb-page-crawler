const { createLazySaveFn } = require('../db');

describe('createLazySaveFn', () => {
  it('should save lazily', async () => {
    const saveFn = jest.fn();
    const lazySaveFn = createLazySaveFn(saveFn, 3);
    const a = await lazySaveFn([1, 2]);
    const b = await lazySaveFn([3, 4]);
    const c = await lazySaveFn([5, 6]);
    const d = await lazySaveFn.flush();
    expect(a).toBe(0);
    expect(b).toBe(4);
    expect(c).toBe(0);
    expect(d).toBe(2);
    expect(saveFn.mock.calls.length).toBe(2);
    expect(saveFn.mock.calls[0][0]).toEqual([1, 2, 3, 4]);
    expect(saveFn.mock.calls[1][0]).toEqual([5, 6]);
  });
});

import sum from '../src/sum';

describe('sum', () => {
  test('test', () => {
    const response = sum(1, 2);
    expect(response).toBe(3);
  });
});

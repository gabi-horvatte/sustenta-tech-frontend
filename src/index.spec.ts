import { sum } from '.';

describe('sum', () => {
  it('should sum two numbers', () => {
    expect(sum(1, 2)).toBe(3);
  });
});

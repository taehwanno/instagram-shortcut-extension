import bind from '../bind';

describe('bind', () => {
  class A {
    @bind
    foo() {
      return this;
    }
  }

  it('should be class instance', () => {
    const f = new A().foo;
    expect(f() instanceof A).toBe(true);
    expect(true).toBe(true);
  });
});

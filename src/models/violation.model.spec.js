import { CRITICAL, Violation } from './violation.model';

describe('Violation', () => {

  describe('#isEmpty', () => {

  });

  describe('#criticalValue', () => {
    Object.entries(CRITICAL).forEach(([value, expectedResult]) => {
      describe(`called with ${value}`, () => {
        it(`returns ${expectedResult}`, () => {
          expect(Violation.criticalValue(value)).toEqual(expectedResult);
        });
      });
    });

    describe('called with null', () => {
      it('returns null', () => {
        expect(Violation.criticalValue(null)).toEqual(null);
      });
    });
  });

});

import { Grade } from './grade.model';

describe('Grade', () => {
  let grade = new Grade({});

  describe('#isEmpty', () => {
    describe('with date === null', () => {
      beforeEach(() => {
        grade = new Grade({ date: null });
      });

      it('returns true', () => {
        expect(grade.isEmpty()).toEqual(true);
      });
    });

    describe(`with grade === ''`, () => {
      beforeEach(() => {
        grade = new Grade({ date: new Date(), grade: '' });
      });

      it('returns true', () => {
        expect(grade.isEmpty()).toEqual(true);
      });
    });

    describe(`with date !== null and grade !== ''`, () => {
      beforeEach(() => {
        grade = new Grade({ date: new Date(), grade: 'A' });
      });

      it('returns false', () => {
        expect(grade.isEmpty()).toEqual(false);
      });
    });
  });

  describe('#sameAs', () => {
    let otherGrade = new Grade({}), date = Date.now(), otherDate = Date.now() - 3000;

    describe('with date === null', () => {
      beforeEach(() => {
        grade = new Grade({ date: null });
      });

      it('returns false', () => {
        expect(grade.sameAs(otherGrade)).toEqual(false);
      });
    });

    describe('with param.date === null', () => {
      beforeEach(() => {
        otherGrade = new Grade({ date: null });
      });

      it('returns false', () => {
        expect(grade.sameAs(otherGrade)).toEqual(false);
      });
    });

    describe('with date !== param.date', () => {
      beforeEach(() => {
        grade = new Grade({ date });
        otherGrade = new Grade({ date: otherDate });
      });

      it('returns false', () => {
        expect(grade.sameAs(otherGrade)).toEqual(false);
      });
    });

    describe('with date === param.date', () => {
      beforeEach(() => {
        grade = new Grade({ date });
        otherGrade = new Grade({ date });
      });

      it('returns true', () => {
        expect(grade.sameAs(otherGrade)).toEqual(true);
      });
    });
  });
});

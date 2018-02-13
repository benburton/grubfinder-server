import Restaurant from './restaurant.model';
import { Inspection } from './inspection.model';
import { Grade } from './grade.model';
import { Violation } from './violation.model';
import titleize from '../utils/titleize';

describe('Restaurant', () => {
  const baseDate = new Date();

  let restaurant;

  describe('#latestInspectionDate', () => {
    const inspectionDates = [0, 1000, 2000, 3000].map(ms => new Date(baseDate - ms));
    const [ mostRecentInspectionDate, ...otherDates ] = inspectionDates;

    beforeEach(() => {
      restaurant = new Restaurant({
        inspections: inspectionDates.map(date => new Inspection({ date }))
      });
    });

    it('returns most recent transactionDate', () => {
      expect(restaurant.latestInspectionDate()).toEqual(mostRecentInspectionDate);
    });

  });

  describe('#findInspection', () => {

    describe('does not have an inspection with matching date', () => {
      const inspectionDates = [1000, 2000, 3000].map(ms => new Date(baseDate - ms));

      beforeEach(() => {
        restaurant = new Restaurant({
          inspections: inspectionDates.map(date => new Inspection({ date }))
        });
      });

      it('returns undefined', () => {
        expect(restaurant.findInspection(new Inspection({ date: baseDate }))).toEqual(undefined);
      });
    });

    describe('has an inspection with matching date', () => {
      const inspectionDates = [0, 1000, 2000].map(ms => new Date(baseDate - ms));
      const inspections = inspectionDates.map(date => new Inspection({ date }));

      beforeEach(() => {
        restaurant = new Restaurant({ inspections });
      });

      xit('returns inspection with matchingDate', () => {
        expect(restaurant.findInspection(new Inspection({ date: baseDate })))
          .toEqual(inspections[0]);
      });
    });
  });

  describe('#hasGrade', () => {
    describe('does not have a grade with matching date', () => {
      const gradeDates = [1000, 2000, 3000].map(ms => new Date(baseDate - ms));

      beforeEach(() => {
        restaurant = new Restaurant({
          grades: gradeDates.map(date => new Grade({ date }))
        });
      });

      it('returns false', () => {
        expect(restaurant.hasGrade(new Grade({ date: baseDate }))).toEqual(false);
      });
    });

    describe('has a grade with matching date', () => {
      const gradeDates = [0, 1000, 2000].map(ms => new Date(baseDate - ms));
      const grades = gradeDates.map(date => new Grade({ date }));

      beforeEach(() => {
        restaurant = new Restaurant({ grades });
      });

      it('returns true', () => {
        expect(restaurant.hasGrade(new Grade({ date: baseDate }))).toEqual(true);
      });
    });
  });

  describe('#latestGrade', () => {
    describe('restaurant has no grades', () => {
      beforeEach(() => {
        restaurant = new Restaurant({ grades: [] });
      })
      it('returns null', () => {
        expect(restaurant.latestGrade()).toEqual(null);
      });
    });

    describe('restaurant has grades', () => {
      const grades = [['A', 0], ['B', 1000], ['C', 2000]].map((grade, ms) =>
        new Grade({
          date: new Date(baseDate - ms),
          grade
        })
      );

      const [ mostRecentGrade, ...otherGrades ] = grades;

      beforeEach(() => {
        restaurant = new Restaurant({ grades });
      });

      it('returns grade string with most recent timestamp', () => {
        expect(restaurant.latestGrade()).toEqual(mostRecentGrade.grade);
      });
    });
  });

  describe('#fromRow', () => {
    const camis = '41418789', doingBusinessAs = "The Original Emilio's Pizza", borough = 'BRONX',
      streetNumber = '3843   ', streetName = '   EAST TREMONT AVENUE', zip = '10465',
      phone = '718090929', description = 'Pizza', inspectionDate = '09/27/2017',
      action = 'Some action', violationCode = '04L', violationDescription = 'There were mice',
      criticalFlag = 'critical', score = '11', gradeString = 'A', gradeDate = '09/27/2017',
      recordDate = '02/12/2018', inspectionType = 'Cycle Inspection / Re-Inspection';

    const csvRow = [
      camis, doingBusinessAs, borough, streetNumber, streetName, zip, phone, description,
      inspectionDate, action, violationCode, violationDescription, criticalFlag, score, gradeString,
      gradeDate, recordDate, inspectionType
    ];

    beforeEach(() => {
      restaurant = Restaurant.fromRow(csvRow);
    });

    describe('camis', () => {
      it('equals camis from csv row', () => {
        expect(restaurant.camis).toEqual(camis);
      });
    });

    describe('doingBusinessAs', () => {
      it('equals doingBusinessAs from csv row', () => {
        expect(restaurant.doingBusinessAs).toEqual(doingBusinessAs);
      });
    });

    describe('location', () => {
      let location;
      beforeEach(() => {
        location = restaurant.location;
      });

      describe('borough', () => {
        it('equals titleized borough from csv row', () => {
          expect(location.borough).toEqual(titleize(borough));
        });
      });

      describe('streetAddress', () => {
        it('equals trimmed streetNumber and trimmed, titleized streetName from csv row', () => {
          expect(location.streetAddress).toEqual(
            `${streetNumber.trim()} ${titleize(streetName).trim()}`
          );
        });
      });

      describe('zip', () => {
        it('equals numeric representation of zip from csv row', () => {
          expect(location.zip).toEqual(parseInt(zip, 10));
        });
      });
    });

    describe('phone', () => {
      it('equals phone from csv row', () => {
        expect(restaurant.phone).toEqual(phone);
      });
    });

    describe('description', () => {
      it('equals description from csv row', () => {
        expect(restaurant.description).toEqual(description);
      });
    });

    describe('inspections', () => {

      it('contains a single inspection', () => {
        expect(restaurant.inspections.length).toEqual(1);
      });

      describe('inspection', () => {
        let inspection;

        beforeEach(() => {
          inspection = restaurant.inspections[0];
        });

        describe('date', () => {
          it('equals date representation of inspectionDate from csv row', () => {
            expect(inspection.date).toEqual(new Date(inspectionDate));
          });
        });

        describe('action', () => {
          it('equals action from csv row', () => {
            expect(inspection.action).toEqual(action);
          });
        });

        describe('violations', () => {
          it('contains a single violation', () => {
            expect(inspection.violations.length).toEqual(1);
          });

          describe('violation', () => {
            let violation;

            beforeEach(() => {
              violation = inspection.violations[0];
            });

            describe('code', () => {
              it('equals violationCode from csv row', () => {
                expect(violation.code).toEqual(violationCode);
              });
            });

            describe('description', () => {
              it('equals violationDescription from csv row', () => {
                expect(violation.description).toEqual(violationDescription);
              });
            });

            describe('critical', () => {
              it('equals boolean representation of criticalFlag from csv row', () => {
                expect(violation.critical).toEqual(Violation.criticalValue(criticalFlag));
              });
            });
          });
        });

        describe('score', () => {
          it('equals numeric representation of score from csv row', () => {
            expect(inspection.score).toEqual(parseInt(score, 10));
          });
        });

        describe('recordDate', () => {
          it('equals date representation of recordDate from csv row', () => {
            expect(inspection.recordDate).toEqual(new Date(recordDate));
          });
        });

        describe('inspectionType', () => {
          it('equals inspectionType from inspectionType from csv row', () => {
            expect(inspection.inspectionType).toEqual(inspectionType);
          });
        });
      });

      describe('grades', () => {
        let grade;

        beforeEach(() => {
          grade = restaurant.grades[0];
        });

        it('contains a single grade', () => {
          expect(restaurant.grades.length).toEqual(1);
        });

        describe('grade', () => {
          describe('grade', () => {
            it('equals grade string from csv row', () => {
              expect(grade.grade).toEqual(gradeString);
            });
          });

          describe('date', () => {
            it('equals date representation of gradeDate from csv row', () => {
              expect(grade.date).toEqual(new Date(gradeDate));
            });
          });
        });
      });
    });
  });
});

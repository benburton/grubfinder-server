import mongoose from 'mongoose';
import AsyncLock from 'async-lock';

import titleize from '../utils/titleize';
import { Grade, GradeSchema } from './grade.model';
import { Violation } from './violation.model';
import { Inspection, InspectionSchema } from './inspection.model';
import RestaurantStats from './query-stats.model';

const lock = new AsyncLock();

const RestaurantSchema = new mongoose.Schema({
  camis: { type: String, required: true, index: true, unique: true },
  doingBusinessAs: { type: String, required: false },
  location: new mongoose.Schema({
    streetAddress: { type: String, required: false },
    zip: { type: Number, required: false },
    borough: { type: String, required: false }
  }, { _id: false }),
  phone: {
    type: String,
    required: false
  },
  description: { type: String, required: false, index: true },
  inspections: [InspectionSchema],
  grade: { type: String, required: false, index: true },
  grades: [GradeSchema]
});

RestaurantSchema.index({ description: 1, grade: 1 });

RestaurantSchema.method({

  async upsert() {
    await lock.acquire(this.camis, async () => {
      const record = await this.constructor.findOne({ camis: this.camis }).exec();

      if (record === null) {
        return this.save();
      }

      if (this.latestInspectionDate() > record.latestInspectionDate()) {
        record.doingBusinessAs = this.doingBusinessAs;
        record.location = this.location;
        record.phone = this.phone;
        record.description = this.description;
      }

      const [inspection, ...old] = this.inspections;
      const [grade, ...oldGrades] = this.grades;

      const existingInspection = record.findInspection(inspection);

      if (existingInspection === undefined) {
        record.inspections = record.inspections || [];
        record.inspections.push(inspection);
      } else {
        const [violation, ...oldViolations] = inspection.violations;
        if (!existingInspection.hasViolation(violation)) {
          existingInspection.violations =
            existingInspection.violations || [];
          existingInspection.violations.push(violation);
        }
      }
      if (grade && !record.hasGrade(grade)) {
        record.grades = record.grades || [];
        record.grades.push(grade);
        record.grade = record.latestGrade();
      }

      return record.save();
    });
  },

  latestInspectionDate() {
    return this.inspections
      .sort((a, b) => a.date.getTime() - b.date.getTime())[this.inspections.length - 1].date;
  },

  findInspection(inspection) {
    return this.inspections.find(i => i.sameAs(inspection));
  },

  hasGrade(grade) {
    return this.grades.find(g => g.sameAs(grade)) !== undefined;
  },

  latestGrade() {
    const grade = this.grades.slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime())[this.grades.length - 1];
    return grade ? grade.grade : null;
  }

});

function sanitizeDescription(description) {
  const rewrites = {
    'CafÃ©': 'Café'
  };
  return Object.entries(rewrites).reduce((acc, [original, replacement]) => {
    return acc.replace(original, replacement);
  }, description);
}

RestaurantSchema.statics = {

  list({ skip = 0, limit = 50, descriptions = [], grades = [] } = {}) {
    let query = descriptions.length > 0 ? { description: { $in: descriptions } } : {};
    query = grades.length > 0 ? Object.assign({}, query, { grade: { $in: grades } }) : query;
    return this.find(query).skip(+skip).limit(+limit).exec();
  },

  async stats({ skip = 0, limit = 50, descriptions = [], grades = [] } = {}) {
    let query = descriptions.length > 0 ? { description: { $in: descriptions } } : {};
    query = grades.length > 0 ? Object.assign({}, query, { grade: { $in: grades } }) : query;
    try {
      return new RestaurantStats({
        skip,
        limit,
        total: await this.count(query),
        grades: await this.aggregate()
          .match(query)
          .group({ _id: '$grade', count: { $sum: 1 } })
          .exec(),
        descriptions: await this.aggregate()
          .match(query)
          .group({ _id: '$description', count: { $sum: 1 } })
          .exec(),
        descriptionsGrades: await this.aggregate()
          .match(query)
          .group({ _id: { grade: '$grade', description: '$description' }, count: { $sum: 1 } })
          .exec()
      });
    } catch (e) {
      throw e;
    }
  },

  descriptions() {
    return this.distinct('description').exec();
  },

  fromRow(data) {
    const model = new this();
    const [
      camis, doingBusinessAs, borough, streetNumber, streetName, zip, phone, description,
      inspectionDate, action, violationCode, violationDescription, criticalFlag, score, gradeString,
      gradeDate, recordDate, inspectionType
    ] = data;
    const grade = new Grade({ date: gradeDate, grade: gradeString });
    const violation = new Violation({
      code: violationCode,
      description: violationDescription,
      critical: Violation.criticalValue(criticalFlag)
    });

    const inspection = new Inspection({
      date: inspectionDate,
      recordDate,
      action,
      score,
      inspectionType,
      violations: violation.isEmpty() ? [] : [violation]
    });

    model.camis = camis;
    model.doingBusinessAs = titleize(doingBusinessAs);
    model.location = {
      streetAddress: `${streetNumber.trim()} ${titleize(streetName).trim()}`,
      zip: zip === 'N/A' ? null : zip,
      borough: titleize(borough)
    };
    model.phone = phone;
    model.description = sanitizeDescription(description);
    model.inspections = [inspection];
    model.grades = grade.isEmpty() ? [] : [grade];
    model.grade = grade.isEmpty() ? null : grade.grade;
    return model;
  }

};

const model = mongoose.model('Restaurant', RestaurantSchema);

export default model;

import mongoose from 'mongoose';

const MISSING = 'N';

const GRADE_MAP = {
  A: ['A'],
  B: ['B'],
  C: ['C'],
  P: ['P', 'Z']
};

GRADE_MAP[MISSING] = ['Not Yet Graded', null];

export const GradeSchema = new mongoose.Schema({
  date: { type: Date, required: false },
  grade: { type: String, required: false }
}, { _id: false });

GradeSchema.method({

  isEmpty() {
    return this.date === null || this.grade === '';
  },

  sameAs(that) {
    return !!this.date && !!that.date && this.date.getTime() === that.date.getTime();
  }

});

GradeSchema.static({
  parseGrade(grade) {
    if (!grade) {
      return MISSING;
    }
    const [result, value] = Object.entries(GRADE_MAP).find(([key, values]) => {
      return values.indexOf(grade) >= 0;
    });
    return result !== undefined ? result : MISSING;
  }
});

export const Grade = mongoose.model('Grade', GradeSchema);


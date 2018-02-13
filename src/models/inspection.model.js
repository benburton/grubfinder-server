import mongoose from 'mongoose';
import { ViolationSchema } from './violation.model';

export const InspectionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  recordDate: { type: Date, required: false },
  action: { type: String, required: false },
  score: { type: Number, required: false },
  inspectionType: { type: String, required: false },
  violations: [ViolationSchema]
}, { _id: false });

InspectionSchema.method({

  hasViolation(violation) {
    if (!violation) {
      return false;
    }
    return this.violations.filter(v => !!v).find(v => v.code === violation.code) !== undefined;
  },

  sameAs(inspection) {
    return this.date.getTime() === inspection.date.getTime();
  }

});

export const Inspection = mongoose.model('Inspection', InspectionSchema);

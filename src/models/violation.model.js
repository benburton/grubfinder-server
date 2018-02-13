import mongoose from 'mongoose';

export const CRITICAL = {
  Critical: true,
  'Not Critical': false
};

export const ViolationSchema = new mongoose.Schema({
  code: { type: String, required: false },
  description: { type: String, required: false },
  critical: { type: Boolean, required: false }
}, { _id: false });

ViolationSchema.method({

  isEmpty() {
    return !this.code;
  }

});

ViolationSchema.static({

  criticalValue(criticalFlag) {
    return CRITICAL[criticalFlag] !== undefined ? CRITICAL[criticalFlag] : null;
  }

});

export const Violation = mongoose.model('Violation', ViolationSchema);


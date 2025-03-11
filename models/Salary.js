const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const salarySchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  basicSalary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  ETF: { type: Number, default: 0 },
  totalSalary: { type: Number, required: true },
  payday: { type: Date, required: true } // New payday field
}, { timestamps: true });

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;

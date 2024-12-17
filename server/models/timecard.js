const mongoose = require("mongoose");

const timecardSchema = mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, default: null },
  yearStart: { type: Number, required: true },
  monthStart: { type: Number, default: null },
  dayStart: { type: Number, default: null },
  yearEnd: { type: Number, default: null },
  monthEnd: { type: Number, default: null },
  dayEnd: { type: Number, default: null }
});

timecardSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Timecard", timecardSchema);

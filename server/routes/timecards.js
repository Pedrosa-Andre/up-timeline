var express = require("express");

const Timecard = require("../models/timecard"); // Import the Timecard model

var router = express.Router();

// Get the next available timecard ID by finding the maximum ID
async function getNextTimecardId() {
  // Sort in descending order to get the last document by ID
  const lastTimecard = await Timecard.findOne().sort({ id: -1 }).exec();
  // If no timecard found, start at 1
  return lastTimecard ? lastTimecard.id + 1 : 1;
}


// GET request to retrieve timecards
router.get("/", async (req, res, next) => {
  try {
    const timecards = await Timecard.find();
    res.status(200).json({
      resMessage: "Timecards retrieved successfully",
      timecards: timecards,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "Error when getting timecards.",
      error: error,
    });
  }
});

// POST request to create a new timecard
router.post("/", async (req, res, next) => {
  try {
    const nextId = await getNextTimecardId();

    const timecard = new Timecard({
      id: nextId,
      title: req.body.title,
      description: req.body.description,
      yearStart: req.body.yearStart,
      monthStart: req.body.monthStart,
      dayStart: req.body.dayStart,
      yearEnd: req.body.yearEnd,
      monthEnd: req.body.monthEnd,
      dayEnd: req.body.dayEnd,
    });

    const createdTimecard = await timecard.save();
    res.status(201).json({
      resMessage: "Timecard added successfully",
      timecard: createdTimecard,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});

// PUT request to update an existing timecard
router.put("/:id", async (req, res, next) => {
  try {
    const timecard = await Timecard.findOne({ id: req.params.id });
    if (!timecard) {
      return res.status(404).json({
        resMessage: "Timecard not found.",
      });
    }

    // Update the timecard fields
    timecard.title = req.body.title;
    timecard.description = req.body.description;
    timecard.yearStart = req.body.yearStart;
    timecard.monthStart = req.body.monthStart;
    timecard.dayStart = req.body.dayStart;
    timecard.yearEnd = req.body.yearEnd;
    timecard.monthEnd = req.body.monthEnd;
    timecard.dayEnd = req.body.dayEnd;

    const updatedTimecard = await Timecard.updateOne(
      { id: req.params.id },
      timecard
    );
    res.status(200).json({
      resMessage: "Timecard updated successfully",
      timecard: timecard,
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});

// DELETE request to remove an existing timecard
router.delete("/:id", async (req, res, next) => {
  try {
    const timecard = await Timecard.findOne({ id: req.params.id });
    if (!timecard) {
      return res.status(404).json({
        resMessage: "Timecard not found.",
      });
    }

    await Timecard.deleteOne({ id: req.params.id });
    res.status(200).json({
      resMessage: "Timecard deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      resMessage: "An error occurred",
      error: error,
    });
  }
});

module.exports = router;

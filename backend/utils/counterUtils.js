// utils/counterUtils.js
import Counter from "../models/counter.js";

// Function to get the next sequential value for a given counter name
export const getNextSequenceValue = async (sequenceName) => {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } }, // Increment the counter
    { new: true, upsert: true } // Create the counter if it doesn't exist
  );
  return sequenceDocument.sequence_value;
};

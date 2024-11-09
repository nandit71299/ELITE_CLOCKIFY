import Counter from "../models/counter.js"; // Import the Counter model

// Helper function to get the next sequence value
const getNextSequenceValue = async (counterName) => {
  // Increment the sequence_value for the counter
  const result = await Counter.findOneAndUpdate(
    { _id: counterName }, // Find the counter by its name (e.g., 'clientId')
    { $inc: { sequence_value: 1 } }, // Increment sequence_value by 1
    { new: true, upsert: true } // Create if doesn't exist and return the updated document
  );

  return result.sequence_value; // Return the incremented sequence value
};

export { getNextSequenceValue };

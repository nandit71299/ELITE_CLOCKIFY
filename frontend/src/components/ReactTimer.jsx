import React, { useState, useEffect } from "react";

const Timer = ({ selectedTask, setStartTime, setEndTime }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    console.log("isRunning:", isRunning);
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime((prevTime) => prevTime + 10), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time % 3600000) / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = time % 1000;

  const handleStart = async () => {
    if (!hasStarted) {
      const result = await setStartTime(new Date());
      console.log("API result:", result);
      if (result) {
        setHasStarted(true);
        setIsRunning(true);
        console.log("Timer started");
        console.log("isRunning:", isRunning);
      } else {
        alert("Failed to start timer. Please try again.");
      }
    }
  };

  const handleStop = async () => {
    if (isRunning) {
      const result = await setEndTime(new Date());
      if (result) {
        setIsRunning(false);
        setTime(0);
        setHasStarted(false);
        console.log("Timer stopped");
      } else {
        console.log("Failed to stop timer. Please try again.");
      }
    }
  };

  const formatTime = (num) => num.toString().padStart(2, "0");

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Task: {selectedTask?.taskTitle}</h3>
      <div style={{ fontSize: "100px" }}>
        <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:
        <span>{formatTime(seconds)}</span>:
        <span>{formatTime(Math.floor(milliseconds / 10))}</span>
      </div>

      <div style={{ marginTop: "20px" }}>
        {!isRunning ? (
          <button onClick={handleStart} className="bg-primary btn">
            Start
          </button>
        ) : (
          <button onClick={handleStop} className="bg-danger btn">
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;

// const handleStart = () => {
//   if (!hasStarted) {
//     // Set the start time when starting the timer
//     setStartTime(new Date());
//     setHasStarted(true);
//   }
//   setIsRunning(true);
// };

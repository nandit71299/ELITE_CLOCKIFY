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
    <div
      style={{
        textAlign: "center",
        maxHeight: "300px",
        height: "300px",
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative", // Ensure the parent is positioned relative
        cursor: selectedTask ? "pointer" : "not-allowed",
        opacity: 0.8,
      }}
    >
      {/* Overlay message on top of the blurred area */}
      {!selectedTask && (
        <div
          style={{
            position: "absolute", // Position it absolutely within the parent
            zIndex: 2, // Higher zIndex to ensure it stays on top of the blur
            fontSize: "18px", // Adjust the font size as needed
            top: "50%", // Center vertically
            transform: "translateY(-50%)", // Adjust for perfect centering
            width: "100%",
            textAlign: "center",
            color: "black",
          }}
        >
          Please select a task to start the timer.
        </div>
      )}

      {/* Blur effect applied only to the timer content with animation */}
      <div
        style={{
          filter: selectedTask ? "none" : "blur(20px)",
          pointerEvents: selectedTask ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 1, // Ensure the content below the message has a lower z-index
          transition: "filter 0.6s ease-in-out", // Add transition for the blur effect
        }}
      >
        <h3>Task: {selectedTask?.taskTitle}</h3>
        <div style={{ fontSize: "100px" }}>
          <span>{formatTime(hours)}</span>:<span>{formatTime(minutes)}</span>:
          <span>{formatTime(seconds)}</span>:
          <span>{formatTime(Math.floor(milliseconds / 10))}</span>
        </div>

        <div style={{ marginTop: "20px" }}>
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="bg-primary btn"
              disabled={isRunning || !selectedTask}
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="bg-danger btn"
              disabled={!isRunning || !selectedTask}
            >
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;

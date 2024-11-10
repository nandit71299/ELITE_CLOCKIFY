// utils/filterUtils.js
import { calculateDuration } from "./timeUtils";

export const getFilteredTasks = (clients, filters) => {
  const tasks = [];

  clients.forEach((client) => {
    client.projects.forEach((project) => {
      project.taskGroups.forEach((taskGroup) => {
        taskGroup.tasks.forEach((task) => {
          task.timers.forEach((timer) => {
            if (timer.startTime && timer.endTime) {
              const { duration, totalSeconds } = calculateDuration(
                timer.startTime,
                timer.endTime
              );

              const meetsStartDate =
                !filters.startDate ||
                new Date(timer.startTime) >= new Date(filters.startDate);
              const meetsEndDate =
                !filters.endDate ||
                new Date(timer.endTime) <= new Date(filters.endDate);
              const meetsMinDuration = totalSeconds >= filters.minDuration;

              if (meetsStartDate && meetsEndDate && meetsMinDuration) {
                tasks.push({
                  clientName: client.name,
                  projectName: project.projectTitle,
                  taskGroupName: taskGroup.groupName,
                  taskTitle: task.taskTitle,
                  startTime: new Date(timer.startTime).toLocaleString(),
                  endTime: new Date(timer.endTime).toLocaleString(),
                  duration,
                  totalSeconds,
                });
              }
            }
          });
        });
      });
    });
  });

  return tasks.sort((a, b) =>
    filters.sortOrder === "asc"
      ? a.totalSeconds - b.totalSeconds
      : b.totalSeconds - a.totalSeconds
  );
};

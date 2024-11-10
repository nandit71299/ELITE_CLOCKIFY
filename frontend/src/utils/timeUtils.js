// utils/timeUtils.js
export const calculateDuration = (startTime, endTime) => {
  const duration = new Date(endTime) - new Date(startTime);
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((duration % (1000 * 60)) / 1000);

  return {
    duration: `${hours} hrs ${minutes} mins ${seconds} secs`,
    totalSeconds: Math.floor(duration / 1000),
  };
};

// Additional utility to filter tasks by time criteria
export const filterAndSortTasks = (clients, filters) => {
  return clients
    .flatMap((client) =>
      client.projects.flatMap((project) =>
        project.taskGroups.flatMap((taskGroup) =>
          taskGroup.tasks.flatMap((task) =>
            task.timers
              .filter(
                (timer) =>
                  timer.startTime &&
                  timer.endTime &&
                  (!filters.startDate ||
                    new Date(timer.startTime) >= new Date(filters.startDate)) &&
                  (!filters.endDate ||
                    new Date(timer.endTime) <= new Date(filters.endDate)) &&
                  calculateDuration(timer.startTime, timer.endTime)
                    .totalSeconds >= filters.minDuration
              )
              .map((timer) => ({
                clientName: client.name,
                projectName: project.projectTitle,
                taskGroupName: taskGroup.groupName,
                taskTitle: task.taskTitle,
                ...calculateDuration(timer.startTime, timer.endTime),
                startTime: new Date(timer.startTime).toLocaleString(),
                endTime: new Date(timer.endTime).toLocaleString(),
              }))
          )
        )
      )
    )
    .sort((a, b) =>
      filters.sortOrder === "asc"
        ? a.totalSeconds - b.totalSeconds
        : b.totalSeconds - a.totalSeconds
    );
};

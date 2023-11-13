export const logScheduleAction = (scheduleId, message) => {
  if (!scheduleId) {
    return Promise.resolve();
  }

  return fetch(`/api/schedules/${scheduleId}/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({ message }),
  });
};

export const updateSchedule = (scheduleId, data) => {
  if (!scheduleId) {
    return Promise.resolve();
  }

  return fetch(`/api/schedules/${scheduleId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  });
};

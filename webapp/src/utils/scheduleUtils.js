import convertDateToSpanishString from "../utils/timeUtils";

function getDaySchedules(day, noAvailSchedPerDay, timeFrame) {
  let scheduleList = [];

  let temp = new Date(day).getTime();

  for (let j = 1; j < noAvailSchedPerDay; j++) {
    scheduleList.push(temp);
    temp = temp + timeFrame * (1000 * 60);
  }
  scheduleList.push(temp);

  return scheduleList;
}

function scheduleIsNotAvailable(
  scheduleToValidate,
  scheduleList,
  currPractice,
  reservedSchedules
) {
  const currDate = Date.now();
  let disable = !scheduleList
    .filter(
      (schedule) =>
        // Only enable schedule if its end time has not yet come
        schedule + (currPractice.timeFrame - 1) * 60 * 1000 > currDate &&
        // If the schedule isn't on the reserved schedules array
        // then enable it
        !reservedSchedules?.find(function (scheduleReserved) {
          if (scheduleReserved == schedule) return true;
        })
    )
    .includes(scheduleToValidate);
  return disable;
}

function getNearestPractice(groups) {
  return groups
    .map((group) =>
      group.practices.map((practice) =>
        practice.currentStudentSchedule
          ? {
              name: practice.name,
              practiceNumber: group.practices.indexOf(practice) + 1,
              ip: practice.raspIp,
              subjectId: group.subjectId,
              groupName: group.name,
              dateString: convertDateToSpanishString(
                practice.currentStudentSchedule.timestamp
              ),
              startTime: practice.currentStudentSchedule.timestamp,
              endTime:
                practice.currentStudentSchedule.timestamp +
                practice.timeFrame * 60 * 1000,
              schedule: practice.currentStudentSchedule,
            }
          : null
      )
    )
    .flat()
    .filter((s) => s)
    .find(
      (schedule) =>
        Date.now() > schedule.startTime && Date.now() < schedule.endTime
    );
}

export function getScheduleImprovedStatus({
  practiceStartDate,
  practiceEndDate,
  practiceTimeframe,
  scheduleTimestamp,
  scheduleStatus,
}) {
  const currDate = Date.now();
  // Days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const reserveTime = 7 * 24 * 60 * 60 * 1000;

  if (scheduleStatus === "FINISHED") {
    return "FINISHED";
  } else if (
    scheduleStatus === "STARTED" &&
    currDate < scheduleTimestamp + practiceTimeframe
  ) {
    return "STARTED";
  } else if (
    scheduleStatus === "STARTED" &&
    currDate > scheduleTimestamp + practiceTimeframe
  ) {
    return "STARTED_EXPIRED";
  } else if (scheduleStatus === "SCHEDULED" && currDate < scheduleTimestamp) {
    return "READY_TO_START";
  } else if (
    scheduleStatus === "SCHEDULED" &&
    currDate > scheduleTimestamp &&
    currDate < practiceEndDate
  ) {
    return "SCHEDULE_EXPIRED";
  } else if (
    scheduleStatus === undefined &&
    currDate < practiceEndDate &&
    currDate >= practiceStartDate - reserveTime
  ) {
    return "READY_TO_SCHEDULE";
  } else if (currDate > practiceEndDate) {
    return "NO_LONGER_AVAILABLE";
  } else if (currDate < practiceStartDate - reserveTime) {
    return "NOT_YET_AVAILABLE";
  }
}

export { getDaySchedules, scheduleIsNotAvailable, getNearestPractice };

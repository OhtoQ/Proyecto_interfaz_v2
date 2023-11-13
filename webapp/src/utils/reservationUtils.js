function getFullReservationDate(date, timeFrame) {
  let newDate;

  let optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let optionsHour = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  let dayString = new Date(date).toLocaleDateString("es-MX", optionsDate);
  let initHourString = new Date(date)
    .toLocaleDateString("es-MX", optionsHour)
    .slice(-5);
  let endHour = new Date(
    new Date(date).getTime() + (timeFrame - 1) * 1000 * 60
  );
  let endHourString = endHour
    .toLocaleDateString("es-MX", optionsHour)
    .slice(-5);
  newDate = [dayString, initHourString, endHourString];

  return newDate;
}

function schedulesPerDay(startDate, endDate, timeFrame) {
  const firstDayEndTime = [
    new Date(startDate).getFullYear(),
    new Date(startDate).getMonth(),
    new Date(startDate).getDate(),
    new Date(endDate).getHours(),
    new Date(endDate).getMinutes(),
  ];
  const startDateEndTime = new Date(...firstDayEndTime).getTime();

  const noAvailSchedPerDay =
    ((startDateEndTime - startDate) / (1000 * 60) / timeFrame) | 0;

  return noAvailSchedPerDay;
}

export { getFullReservationDate, schedulesPerDay };

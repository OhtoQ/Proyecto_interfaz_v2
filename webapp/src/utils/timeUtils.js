function convertDateToSpanishString(date) {
  let optionsDay = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let optionsHour = {
    hour: "numeric",
    minute: "numeric",
  };

  const dayString = new Date(date).toLocaleDateString("es-MX", optionsDay);
  const hourString = new Date(date)
    .toLocaleDateString("es-MX", optionsHour)
    .slice(-5);

  const dateString = [dayString, hourString];

  return dateString;
}

export default convertDateToSpanishString;

export function addDaysToCurrentDate(daysToAdd: number): Date {
  const convertedDate = new Date();
  convertedDate.setDate(convertedDate.getDate() + daysToAdd);
  return convertedDate;
}

export function addSecondsToCurrentDate(secondsToAdd: number): Date {
  const currentDate = new Date();
  currentDate.setSeconds(currentDate.getSeconds() + secondsToAdd);
  return currentDate;
}

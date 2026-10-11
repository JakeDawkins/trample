export default function getDayNumber() {
  // '2023-12-31'
  const dayZeroDate = new Date();
  dayZeroDate.setFullYear(2023);
  dayZeroDate.setMonth(11);
  dayZeroDate.setDate(31);
  dayZeroDate.setHours(0);
  dayZeroDate.setMinutes(0);
  dayZeroDate.setSeconds(0);
  dayZeroDate.setMilliseconds(0);
  const dayZero = +dayZeroDate;
  const today = +new Date();
  const dayNumber = Math.floor((today - dayZero) / 86400000);
  return dayNumber;
}

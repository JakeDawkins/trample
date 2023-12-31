export default function getDayNumber() {
  const dayZero = +new Date('2023-12-31');
  const today = +new Date();
  const dayNumber = Math.floor((today - dayZero) / 86400000);
  return dayNumber;
}

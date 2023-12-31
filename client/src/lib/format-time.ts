/**
 * @param time time is 1/100 seconds
 */
export function formatTime(time: number): string {
  let seconds = Math.floor(time / 100);
  let minutes = Math.floor(seconds / 60);
  let miliseconds = Math.floor(time / 10);
  miliseconds = miliseconds % 10;
  seconds = seconds % 60;

  const min = minutes <= 0 ? "" : minutes.toString().padStart(1, "0") + ":";
  const s = seconds.toString().padStart(2, "0") + ".";
  const ms = miliseconds.toString().padStart(1, "0");

  return min + s + ms;
}

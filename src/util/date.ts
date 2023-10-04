export function formatDateTime(date: number | Date | string = 0, time = true) {
  console.log('formatDateTime');
  const d = new Date(date);
  const year = d.getFullYear();
  const month = zeroStart(d.getMonth() + 1);
  const da = zeroStart(d.getDate());
  const hour = zeroStart(d.getHours());
  const minutes = zeroStart(d.getMinutes());
  const seconds = zeroStart(d.getSeconds());

  if (!time) {
    return `${year}-${month}-${da}`;
  }

  return `${year}-${month}-${da} ${hour}:${minutes}:${seconds}`;
}

export function zeroStart(v: string | number, maxLength: number = 2) {
  return `${v}`.padStart(maxLength, '0');
}

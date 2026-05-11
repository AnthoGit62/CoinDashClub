const DAY_MS = 24 * 60 * 60 * 1000;

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_MS);
}

export function isSameUtcDay(left?: string, right = new Date()) {
  if (!left) {
    return false;
  }

  const date = new Date(left);

  return (
    date.getUTCFullYear() === right.getUTCFullYear() &&
    date.getUTCMonth() === right.getUTCMonth() &&
    date.getUTCDate() === right.getUTCDate()
  );
}

export function isFutureDate(value?: string) {
  if (!value) {
    return false;
  }

  return new Date(value).getTime() > Date.now();
}

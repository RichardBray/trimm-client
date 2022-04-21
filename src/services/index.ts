// UTILITIES

/**
 * Adds `0` to month if it has single number
 * @example modifyMonth(8) // 08
 * @example modifyMonth(11) // 11
 */
export function modifyMonth(month: number): string {
  return `0${month}`.slice(-2);
}

/**
 * Rounds a number to 2 decimal places
 * @example roundNumber(2.324543) // 2.34
 */
export function roundNumber(num: number): number {
  return Math.round(num * 100) / 100;
}

export function categoryColours(): string[] {
  return ['#8DE1FE', '#897ACC', '#F9BB82', '#F3A2B9', '#B9E185', '#EDEF78', '#DFA2F3', '#A2BEF3', '#F3A2A2', '#C2C2C2'];
}

export function monthToText(month: string | number): string {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (month === 13) {
    return monthNames[0];
  }

  if (month === 0) {
    return monthNames[11];
  }
  return monthNames[+month - 1];
}

export function isObjEmpty(obj: Record<string, unknown>): boolean {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

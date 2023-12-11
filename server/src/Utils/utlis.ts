export const compareValues = (
  value1: string | number,
  value2: number
): boolean => {
  if (typeof value1 === "number") {
    return value1 > value2;
  } else {
    const numericValue1 = parseFloat(value1);
    if (!isNaN(numericValue1)) {
      return numericValue1 > value2;
    } else {
      return false;
    }
  }
};

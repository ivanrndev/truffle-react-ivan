
export const getNormalizedField = (filledCellsResult) => {
  return filledCellsResult[0].map((x, i) => {
    return {
      x: +x,
      y: +filledCellsResult[1][i],
      color: +filledCellsResult[2][i],
    }
  });
};
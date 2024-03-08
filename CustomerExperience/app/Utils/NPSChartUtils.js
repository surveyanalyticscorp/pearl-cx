export const generateAxisRangeHelperObject = (parcent, fillColor) => {
  return {value: parcent, fillColor: fillColor, angle: parcent * (180 / 100)};
};

export const generatedAxisRanges = data => {
  let axisRanges = [];
  let startingAxis = -100;
  data.forEach(element => {
    if (element.value > 0) {
      const angle = element.value * (180 / 100);
      const endAxis = startingAxis + (angle / 180) * 200;

      axisRanges.push({
        value: startingAxis,
        endValue: endAxis,
        axisFill: {
          fillOpacity: 1,
          fill: element.fillColor,
          zIndex: 1,
        },
      });
      startingAxis = endAxis;
    }
  });
  return axisRanges;
};

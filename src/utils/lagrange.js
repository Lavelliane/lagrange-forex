export default function lagrange(target, x, y) {
    let result = 0;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < y.length; i++) {
      const t = coeff(target, x, i, x[i]);
      result += t * y[i];
    }
    return result;
  }

  function coeff(target, arr, currentIndex, currentValue) {
    let prod = 1;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < arr.length; i++) {
      if (i !== currentIndex) {
        prod *= (target - arr[i]) / (currentValue - arr[i]);
      }
    }
    return prod;
  }
export const getUserKey = (data) => Object.keys(data)[0];

export const getUniqueList = (arr, key) => {
  return arr.filter((v, i, a) => a.findIndex((v2) => v2[key] === v[key]) === i);
};

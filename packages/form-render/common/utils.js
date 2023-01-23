import _ from "lodash";

/**
 * 清理空数据
 * @param {*} data
 * @returns
 */
export function cleanData(data) {
  let value = _.cloneDeep(data);
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }
  if (Array.isArray(value)) {
    const temp = [];
    value.forEach((val, i) => {
      if (typeof val === "object") {
        const res = cleanData(val);
        if (res) {
          temp.push(res);
        }
      } else if (val !== null && val !== undefined) {
        temp.push(val);
      }
    });
    value = temp;
    return value.length > 0 ? value : undefined;
  }

  Object.keys(value).forEach((key) => {
    const val = value[key];
    if (val === null || val === undefined) {
      delete value[key];
    } else if (typeof val === "object") {
      const res = cleanData(val);
      if (res) {
        value[key] = res;
      } else {
        delete value[key];
      }
    }
  });

  return Object.keys(value).length > 0 ? value : undefined;
}

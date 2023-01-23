import _ from "lodash";
import dayjs from "dayjs";

/**
 * 清理空数据
 * @param {*} data
 * @returns
 */
export function cleanData(data) {
  let value = _.cloneDeep(data);
  if (value instanceof dayjs) {
    return dayjs(value).valueOf();
  }
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
    } else if (typeof val === "object" && !(val instanceof dayjs)) {
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

export const rangeModeList = [
  "datetimerange",
  "daterange",
  "weekrange",
  "monthrange",
  "yearrange",
];

export function handelBackData(data = {}, fieldList) {
  if (!data) {
    return data;
  }
  const res = _.cloneDeep(data);
  fieldList?.forEach((f) => {
    const { name, type } = f;
    const val = data[name];
    if (type === "date-picker" && val) {
      if (Array.isArray(val)) {
        val.forEach((it, i) => {
          res[name][i] = dayjs(it);
        });
      } else {
        res[name] = dayjs(data[name]);
      }
    } else if (type === "subform") {
      res[name] = handelBackData(res[name], f.fieldList);
    } else if (type === "item-list") {
      res[name]?.forEach((it, i) => {
        res[name][i] = handelBackData(it, f.fieldList);
      });
    }
  });
  return res;
}

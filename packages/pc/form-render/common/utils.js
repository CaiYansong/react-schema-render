import _ from "lodash";
import dayjs from "dayjs";

export const rangeModeList = [
  "datetimerange",
  "daterange",
  "weekrange",
  "monthrange",
  "yearrange",
];

/**
 * 清理空数据
 * @param {*} data
 * @returns
 */
export function cleanData(data) {
  let value = _.cloneDeep(data);
  if (value instanceof dayjs) {
    return dayjs(value);
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

export function getDateTimeVal(val, field) {
  if (!val) {
    return;
  }
  let getResFn = field.type === "time-picker" ? getTimeFormat : getDateFormat;
  if (Array.isArray(val)) {
    return val.map((it) => getResFn(it, field.valueFormat, field.mode));
  }
  return getResFn(val, field.valueFormat, field.mode);
}

export function getDateFormat(val, valueFormat, mode) {
  let format = valueFormat;
  if (format === "x") {
    return dayjs(val).valueOf();
  }
  if (format) {
    return dayjs(val).format(format);
  }
  if (mode === "date" || mode === "daterange" || !mode) {
    format = "YYYY-MM-DD";
  } else if (mode === "week" || mode === "weekrange") {
    format = "YYYY-wo";
  } else if (mode === "month" || mode === "monthrange") {
    format = "YYYY-MM";
  } else if (mode === "year" || mode === "yearrange" || mode === "decade") {
    format = "YYYY";
  } else {
    format = "YYYY-MM-DD HH:mm:ss";
  }
  return dayjs(val).format(format);
}

export function getTimeFormat(val, valueFormat) {
  let format = valueFormat || "HH:mm:ss";
  if (format === "x") {
    return dayjs(val).valueOf();
  }
  return dayjs(val).format(format);
}

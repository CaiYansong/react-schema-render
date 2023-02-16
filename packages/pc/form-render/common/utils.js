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

/**
 * 处理回填数据
 * @param {*} data
 * @param {*} fieldList
 * @returns
 */
export function handelBackData(data = {}, fieldList) {
  if (!data) {
    return data;
  }
  const res = _.cloneDeep(data);
  fieldList?.forEach((f) => {
    const { name, type } = f;
    const val = data[name];
    if ((type === "date-picker" || type === "time-picker") && val) {
      if (Array.isArray(val)) {
        val.forEach((it, i) => {
          res[name][i] = dayjs(it);
        });
      } else {
        res[name] = dayjs(data[name]);
      }
    } else if (type === "subform") {
      res[name] = handelBackData(res[name], f.fieldList);
    } else if (type === "item-list" && Array.isArray(res[name])) {
      res[name]?.forEach((it, i) => {
        res[name][i] = handelBackData(it, f.fieldList);
      });
    }
  });
  return res;
}

/**
 * 根据 schema.fieldList 格式化数据
 * @param {*} data
 * @param {*} fieldList
 * @returns
 */
export function getFormatData(data, fieldList) {
  if (!data) {
    return data;
  }
  const res = _.cloneDeep(data);
  fieldList?.forEach((f) => {
    const { name, type } = f;
    const val = data[name];
    if ((type === "date-picker" || type === "time-picker") && val) {
      // f.valueFormat
      if (Array.isArray(val)) {
        val.forEach((it, i) => {
          res[name][i] = getDateTimeVal(it, f);
        });
      } else {
        res[name] = getDateTimeVal(data[name], f);
      }
    } else if (type === "switch") {
      res[name] =
        res[name] === true || res[name] === f.activeValue
          ? f.activeValue || true
          : f.inactiveValue || false;
    } else if (type === "input-file") {
      // 文件上传数据
      // TODO: 类型格式 url?
      res[name] = res[name]?.fileList || res[name];
      if (
        (f.multiple === false || f.multiple === undefined) &&
        Array.isArray(res[name]) &&
        res[name].length > 0
      ) {
        res[name] = res[name][0];
      }
    } else if (type === "subform") {
      res[name] = getFormatData(res[name], f.fieldList);
    } else if (type === "item-list" && Array.isArray(res[name])) {
      res[name]?.forEach((it, i) => {
        res[name][i] = getFormatData(it, f.fieldList);
      });
    }
  });
  return res;
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

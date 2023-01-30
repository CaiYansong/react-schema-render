import _ from "lodash";
import dayjs from "dayjs";

const dateFormatEnum = {
  datetime: "YYYY-MM-DD HH:mm:ss",
  date: "YYYY-MM-DD",
};

/**
 * 获取 field 对应的值
 * @param {Object} field schema 项
 * @param {Object} data 数据
 * @param {Object} opt 配置项
 * @returns
 */
export function getVal(field = {}, data = {}, opt = {}) {
  let val = _.get(data, field.name);
  const { type, mode, multiple } = field || {};
  if (val && type === "date-picker") {
    if (Array.isArray(val)) {
      return val
        .map((it) => getDateVal(it, mode?.replace("range", ""), opt))
        .join(" ~ ");
    }
    return getDateVal(val, mode, opt);
  }

  if (val && type === "time-picker") {
    if (Array.isArray(val)) {
      return val.map((it) => dayjs(it).format("HH:mm:ss")).join(" ~ ");
    }
    return dayjs(val).format("HH:mm:ss");
  }

  if (type === "switch") {
    if (val === true || val === field.activeValue) {
      return field.activeText || "是";
    }
    if (val === undefined || val === false || val === field.inactiveValue) {
      return field.inactiveText || "否";
    }
    return val;
  }

  if (type === "select" && !Array.isArray(val)) {
    return field.options?.find((option) => option.value === val)?.label || val;
  } else if (type === "select" && multiple && Array.isArray(val)) {
    let _val = [];
    val.forEach((valIt) => {
      _val.push(
        field.options?.find((option) => option.value === valIt)?.label || valIt,
      );
    });
    val = _val;
  }

  if (Array.isArray(val)) {
    return val.join("、");
  }

  return val;
}

export function getDateVal(val, mode, opt = {}) {
  const _formatEnum = opt.dateFormatEnum || dateFormatEnum;
  let format = _formatEnum[mode] || _formatEnum.date;
  return dayjs(val).format(format);
}
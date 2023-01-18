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
export function getVal(field, data = {}, opt = {}) {
  let val = _.get(data, field.name);
  const { type, mode, multiple } = field || {};
  if (val && type === "date-picker") {
    const _formatEnum = opt.dateFormatEnum || dateFormatEnum;
    let format = _formatEnum[mode] || _formatEnum.date;
    return dayjs(val).format(format);
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

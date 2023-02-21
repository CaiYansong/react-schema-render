import _ from "lodash";
import dayjs from "dayjs";

const dateFormatEnum = {
  datetime: "YYYY-MM-DD HH:mm:ss",
  date: "YYYY-MM-DD",
};

export function getVal(it, data = {}, opt = {}) {
  let val = _.get(data, it.name);
  const { type, mode } = it || {};
  if (val && type === "date-picker") {
    let format = dateFormatEnum[mode] || dateFormatEnum.date;
    return dayjs(val).format(format);
  }
  if (type === "select") {
    return it.options?.find((option) => option.value === val)?.label || val;
  }
  if (Array.isArray(val)) {
    return val.join("、");
  }
  return val;
}

import { handleFillBackSelect, handleSubmitSelect } from "./select-adapter";

/**
 * 处理回填数据
 * @param {Array} fieldList  schema.fieldList
 * @param {Object} data 表单数据
 */
export function handleFillBackData(fieldList, data) {
  if (!data) {
    return data;
  }
  fieldList?.forEach((field) => {
    const { type, name } = field || {};
    if (type === "select") {
      data[name] = handleFillBackSelect(data[name]);
    }
    if (type === "item-list" && Array.isArray(data[name])) {
      data[name].forEach((it, idx) => {
        handleFillBackData(field.fieldList, it);
      });
    }
  });
  return data;
}

/**
 * 处理提交数据
 * @param {Array} fieldList  schema.fieldList
 * @param {Object} data 表单数据
 */
export function handleSubmitData(fieldList, data) {
  if (!data) {
    return data;
  }
  fieldList?.forEach((field) => {
    const { type, name } = field || {};
    if (type === "select") {
      data[name] = handleSubmitSelect(data[name]);
    }
    if (type === "item-list" && data[name]) {
      data[name].forEach((it, idx) => {
        handleSubmitData(field.fieldList, it);
      });
    }
  });
  return data;
}

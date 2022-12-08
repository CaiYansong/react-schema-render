export default function delectAdapter(schema, data) {}

/**
 * 处理回填数据
 * @param {Object} data 表单数据
 */
export function handleFillBackSelect(data) {
  let value = data;
  const hasVal = value !== undefined && value !== null && value !== "";
  if (hasVal && !Array.isArray(value)) {
    value = [value];
  }
  return value;
}

/**
 * 处理提交数据
 * @param {Object} data 表单数据
 */
export function handleSubmitSelect(data) {
  if (Array.isArray(data) && data.length === 1) {
    return data[0];
  }
  return data;
}

/*
{
  "type": "required",
  "trigger": [
    "change",
    "blur"
  ]
},
{
  "type": "regexp",
  "regexp": "^\\d+$",
  "trigger": [
    "change",
    "blur"
  ],
  "note": "请输入数字"
},
{
  "type": "func",
  "isPreset": false,
  "func": "if (+value > 10) {\n  // 校验通过\n  callback();\n} else {\n  // 未通过\n  callback('请输入大于10的数')\n}",
  "trigger": [
    "change",
    "blur"
  ]
},
{
  "type": "func",
  "preset": "passwordConfirmRule",
  "trigger": ["change", "blur", "focus"]
}

适配点：
"type": "required", -> required: true
trigger -> validateTrigger
  blur -> onBlur
  change -> onChange
  focus -> onFocus
note -> message
regexp -> pattern
func -> validator
preset -> 获取预设校验函数 -> validator

[
  {
    required: true,
    message: 'Please confirm your password!',
  },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords that you entered do not match!'));
    },
  }),
]
*/

/**
 * 批量规则转化适配器
 * @param {Array<Object>} rules
 * @param {Array} validFuncs 预设校验函数
 */
export function rulesAdapter(rules = [], validFuncs = []) {
  return rules?.map((rule) => ruleAdapter(rule, validFuncs));
}

/**
 * 规则转化适配器
 * @param {Object} rule
 * @param {Array} validFuncs 预设校验函数
 */
export function ruleAdapter(rule, validFuncs) {
  const { type, trigger, note, regexp } = rule;
  let res = {
    message: note,
  };

  if (regexp) {
    res.pattern = regexp;
  }

  if (typeof trigger === "string") {
    res.validateTrigger = trigger;
  }

  if (type === "required") {
    res.required = true;
  } else if (type === "func") {
    const { isPreset, func } = rule;
    let funcStr = func;
    if (isPreset !== false) {
      const { preset } = rule;
      funcStr = validFuncs?.find((it) => it.key === preset)?.func;
    }
    // 使用 ((form: FormInstance) => RuleConfig) 写法，便于获取其他表单数据
    res = (formInstance) => ({
      ...res,
      validator: function (rule, value, callback) {
        return new Function(
          "rule",
          "value",
          "callback",
          "formInstance",
          funcStr,
        ).call(this, rule, value, callback, formInstance);
      },
    });
  }
  return res;
}

/**
 * 获取正确的 trigger 项
 * @param {string|Array} trigger
 */
export function getTrigger(trigger) {
  let res = undefined;
  if (typeof trigger === "string") {
    res = addPrefix(trigger);
  } else if (Array.isArray(trigger)) {
    res = trigger.map((it) => addPrefix(it));
  }
}

/**
 * 添加前缀，且目标字符串首字母大写
 * change -> onChange
 * @param {string} str 目标字符串
 * @param {string} prefix 前缀
 * @returns
 */
export function addPrefix(str, prefix = "on") {
  return `${prefix.trim()}${str.trim().replace(/^(.)/, "$1".toUpperCase())}`;
}

export default rulesAdapter;

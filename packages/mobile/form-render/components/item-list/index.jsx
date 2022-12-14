import { Form } from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";

import "./index.less";

import FormItems from "../../form-items";

function ItemList(props) {
  const {
    name,
    label,
    disabled,
    readOnly,
    scenario,
    data,
    inline,
    initialValues,
    formConf = {},
    fieldList = [],
    validFuncs = [],
    validRules = {},
    config,
    formInstance,
    onChange,
    onFinish,
    onFinishFailed,
  } = props || {};

  const schema = { formConf, fieldList, validFuncs, validRules };

  return (
    // TODO: 确认是否添加禁止删除第一项
    <div className="item-list">
      <Form.Array
        initialValue={[{}]}
        name={name}
        onAdd={(operation) => operation.add({})}
        renderAdd={() => {
          if (readOnly || disabled) {
            return null;
          }
          return (
            <span>
              <AddCircleOutline /> 添加
            </span>
          );
        }}
        renderHeader={({ index }, { remove }) => {
          return (
            <>
              <span>
                {label}
                {index + 1}
              </span>
              {readOnly || disabled ? null : (
                <a onClick={() => remove(index)} style={{ float: "right" }}>
                  删除
                </a>
              )}
            </>
          );
        }}
      >
        {(fields) =>
          fields.map(({ index }) => (
            <FormItems
              disabled={disabled}
              readOnly={readOnly}
              name={name}
              parentField={props}
              itemListIndex={index}
              scenario={scenario}
              schema={schema}
              config={config}
              formInstance={formInstance}
            ></FormItems>
          ))
        }
      </Form.Array>
    </div>
  );
}

export default ItemList;

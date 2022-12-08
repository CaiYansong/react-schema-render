import { Form } from "antd-mobile";
import { AddCircleOutline } from "antd-mobile-icons";

import FormItems from "../../form-items";

function ItemList(props) {
  const {
    name,
    label,
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
    <Form.Array
      name={name}
      onAdd={(operation) => operation.add({})}
      renderAdd={() => (
        <span>
          <AddCircleOutline /> 添加
        </span>
      )}
      renderHeader={({ index }, { remove }) => (
        <>
          <span>
            {label}
            {index + 1}
          </span>
          <a onClick={() => remove(index)} style={{ float: "right" }}>
            删除
          </a>
        </>
      )}
    >
      {(fields) =>
        fields.map(({ index }) => (
          <FormItems
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
  );
}

export default ItemList;

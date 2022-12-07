import { useState } from 'react';
import { Form, Button } from 'antd-mobile';

// TODO: 解决循环引用导致组件加载 undefined 的问题
import FormItems from '../../form-items-copy';

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
      renderAdd={() => <span>添加</span>}
      renderHeader={({ index }, { remove }) => (
        <>
          <span>
            {label}
            {index + 1}
          </span>
          <a onClick={() => remove(index)} style={{ float: 'right' }}>
            删除
          </a>
        </>
      )}
    >
      {(fields) =>
        fields.map(({ index }) => (
          <>
            <FormItems
              scenario={scenario}
              schema={schema}
              config={config}
              formInstance={formInstance}
            ></FormItems>
          </>
        ))
      }
    </Form.Array>
  );
}

export default ItemList;

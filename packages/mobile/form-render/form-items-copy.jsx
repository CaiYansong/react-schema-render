import { Form } from 'antd';

import rulesAdapter from './adapter/rules-adapter';

import Input from './components/input';
import Select from './components/select';
import ItemList from './components/item-list';
import Slot from './components/slot';

const TypeEnum = {
  input: Input,
  'input-number': Input,
  select: Select,
  'item-list': ItemList,
  slot: Slot,
};

// 内置了 Form.Item 的组件
const insizeFormItemEnum = {
  select: true,
  'item-list': true,
};

export default function FormRender(props) {
  const {
    name,
    inline,
    scenario,
    schema = {},
    data = {},
    form,
    config = {},
    formInstance,
    fieldSubmit,
    onChange,
  } = props || {};

  const {
    formConf = {},
    fieldList = [],
    validFuncs = [],
    validRules = {},
  } = schema;

  console.log('form', form);

  const { marginY, marginX } = formConf || {};

  function onItemChange(...args) {
    // console.log('onItemChange', ...args);
  }

  console.log('name', name, formInstance);

  return (
    <>
      {fieldList?.map((it) => {
        if (it.activated === false) {
          return null;
        }
        const Component = TypeEnum[it.type];
        if (!Component) {
          return null;
        }
        const { type, name } = it;

        const rules = rulesAdapter(validRules[name], validFuncs);

        const formItemProps = {
          key: it.name,
          label: it.label,
          name: it.name,
          rules: rules,
          wrapperCol: { span: it.span },
          inline,
          style: {
            display: it.visible === false ? 'none' : undefined,
            marginBottom: `${marginY || 24}px`,
            marginRight: `${marginX || 16}px`,
          },
          config,
          scenario,
        };

        const childProps = {
          key: it.name,
          ...it,
          scenario: scenario,
          config: config,
          data: data[name],
          formInstance: formInstance,
          onChange: onItemChange,
        };

        if (type === 'slot') {
          return (
            <Form.Item {...formItemProps}>
              <Component {...childProps}>
                {type === 'slot' &&
                  props.children?.find((child) => child.key === it.slotName)}
              </Component>
            </Form.Item>
          );
        }

        if (insizeFormItemEnum[type]) {
          return (
            <Component
              {...childProps}
              formItemProps={formItemProps}
            ></Component>
          );
        }

        return (
          <Form.Item {...formItemProps}>
            <Component {...childProps}></Component>
          </Form.Item>
        );
      })}
    </>
  );
}

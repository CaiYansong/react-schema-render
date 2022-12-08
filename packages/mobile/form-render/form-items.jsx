import { Form } from 'antd-mobile';

import rulesAdapter from './adapter/rules-adapter';

import Input from './components/input';
import Select from './components/select';
import ItemList from './components/item-list';
import Slot from './components/slot';

// 内置了 Form.Item 的组件
// TODO: 全部改为内置 Form.Item
const insizeFormItemEnum = {
  input: true,
  select: true,
  'item-list': true,
};

export default function FormItems(props) {
  const {
    name,
    parentField,
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

  // 放在这里，解决循环引用导致组件初始加载 undefined 的问题
  // TODO: 全部改为内置 Form.Item
  const TypeEnum = {
    input: Input,
    'input-number': Input,
    select: Select,
    'item-list': ItemList,
    slot: Slot,
  };

  const { marginY, marginX } = formConf || {};

  function onItemChange(changedValues, field) {
    console.log('changedValues', changedValues, field);
    onChange &&
      onChange(changedValues, {
        ...formInstance.getFieldsValue(true),
        ...changedValues,
      });
  }

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
          key: name,
          label: it.label,
          parentField: parentField || props,
          name: name,
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
          formInstance,
        };

        const childProps = {
          key: name,
          parentField: parentField || props,
          ...it,
          scenario: scenario,
          config: config,
          data: data[name],
          formInstance: formInstance,
          onChange: onItemChange,
        };

        // 处理 item list name 属性
        if (typeof props.itemListIndex === 'number') {
          formItemProps.name = [props.itemListIndex, name];
          childProps.name = [props.itemListIndex, name];
        }

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

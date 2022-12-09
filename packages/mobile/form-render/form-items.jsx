import { Form } from "antd-mobile";

import rulesAdapter from "./adapter/rules-adapter";

import Input from "./components/input";
import Select from "./components/select";
import ItemList from "./components/item-list";
import Slot from "./components/slot";


export default function FormItems(props) {
  const {
    name,
    parentField,
    inline,
    scenario,
    schema = {},
    data = {},
    config = {},
    formInstance,
  } = props || {};

  const {
    formConf = {},
    fieldList = [],
    validFuncs = [],
    validRules = {},
  } = schema;

  // 放在这里，解决循环引用导致组件初始加载 undefined 的问题
  const TypeEnum = {
    input: Input,
    "input-number": Input,
    select: Select,
    "item-list": ItemList,
    slot: Slot,
  };

  const { marginY, marginX } = formConf || {};

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
            display: it.visible === false ? "none" : undefined,
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
        };

        // 处理 item list name 属性
        if (typeof props.itemListIndex === "number") {
          formItemProps.name = [props.itemListIndex, name];
          childProps.name = [props.itemListIndex, name];
        }

        return (
          <Component {...childProps} formItemProps={formItemProps}>
            {type === "slot" &&
              props.children?.find((child) => child.key === it.slotName)}
          </Component>
        );
      })}
    </>
  );
}

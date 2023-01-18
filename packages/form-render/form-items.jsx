import { Form } from "antd";

import rulesAdapter from "./adapter/rules-adapter";

import Input from "./components/input";
import Select from "./components/select";
import DatePicker from "./components/date-picker";
import Uploader from "./components/uploader";
import ItemList from "./components/item-list";
import Slot from "./components/slot";

const TypeEnum = {
  input: Input,
  select: Select,
  "date-picker": DatePicker,
  "input-file": Uploader,
  "item-list": ItemList,
  slot: Slot,
};

function FormItems(props) {
  const {
    data = {},
    scenario,
    schema = {},
    slots,
    config = {},
    formInstance,
    onChange,
    fieldSubmit,
  } = props;

  const {
    fieldList = [],
    formConf = {},
    validRules = {},
    validFuncs = [],
  } = schema;

  const { marginY, marginX } = formConf || {};

  const marginStyle = {
    marginBottom: `${marginY || 24}px`,
    marginRight: `${marginX || 16}px`,
  };

  return (
    <>
      {fieldList?.map((it) => {
        if (it.activated === false) {
          return null;
        }
        const { type, name } = it;
        const rules = rulesAdapter(validRules[name], validFuncs);

        const Component = TypeEnum[type];

        const formItemProps = {
          key: it.name,
          label: it.label,
          name: it.name,
          rules: rules,
          wrapperCol: { span: it.span },
          style: {
            display: it.visible === false ? "none" : undefined,
            ...marginStyle,
          },
        };

        return (
          Component && (
            <Component
              formItemProps={formItemProps}
              field={it}
              scenario={scenario}
              config={config}
              data={data[name]}
              formInstance={formInstance}
              onChange={onChange}
              fieldSubmit={fieldSubmit}
            >
              {type === "slot" &&
                slots?.find((slot) => slot.key === it.slotName)}
            </Component>
          )
        );
      })}
    </>
  );
}

export default FormItems;

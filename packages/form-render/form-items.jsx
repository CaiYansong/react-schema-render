import rulesAdapter from "./adapter/rules-adapter";

import Input from "./components/input";
import InputNumber from "./components/input-number";
import Select from "./components/select";
import DatePicker from "./components/date-picker";
import TimePicker from "./components/time-picker";
import Uploader from "./components/uploader";
import ItemList from "./components/item-list";
import Slot from "./components/slot";

const TypeEnum = {
  input: Input,
  "input-number": InputNumber,
  select: Select,
  "date-picker": DatePicker,
  "time-picker": TimePicker,
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
    isItemList,
    itemListProps,
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

        if (isItemList && itemListProps) {
          it.itemListName = [itemListProps.name, name];
        }

        const formItemProps = {
          key: name,
          label: it.label,
          name: it.itemListName || name,
          rules: rules,
          wrapperCol: { span: it.span },
          style: {
            display: it.visible === false ? "none" : undefined,
            ...marginStyle,
          },
        };

        const itemProps = {
          formItemProps: formItemProps,
          field: it,
          scenario: scenario,
          config: config,
          data: data[name],
          formInstance: formInstance,
          onChange: onChange,
          fieldSubmit: fieldSubmit,
          slots,
        };

        return (
          Component && <Component key={it.name} {...itemProps}></Component>
        );
      })}
    </>
  );
}

export default FormItems;

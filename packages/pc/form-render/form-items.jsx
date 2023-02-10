import { useState } from "react";

import rulesAdapter from "./adapter/rules-adapter";

import Input from "./components/input";
import InputNumber from "./components/input-number";
import Select from "./components/select";
import Cascader from "./components/cascader";
import DatePicker from "./components/date-picker";
import TimePicker from "./components/time-picker";
import Uploader from "./components/uploader";
import ItemList from "./components/item-list";
import Switch from "./components/switch";
import Wrapper from "./components/wrapper";
import Slot from "./components/slot";

const TypeEnum = {
  input: Input,
  "input-number": InputNumber,
  select: Select,
  cascader: Cascader,
  "date-picker": DatePicker,
  "time-picker": TimePicker,
  "input-file": Uploader,
  "item-list": ItemList,
  switch: Switch,
  wrapper: Wrapper,
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
    watchEnum,
  } = props;

  const {
    fieldList = [],
    formConf = {},
    validRules = {},
    validFuncs = [],
  } = schema;

  const [state, setState] = useState({});

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

        if (it.effect) {
          if (!it._effectParams) {
            it._effectParams = [
              {
                key: "scenario",
                value: props.scenario,
              },
              {
                key: "config",
                value: props.config,
              },
              {
                key: "data",
                value: props.data,
              },
              {
                key: "field",
                value: props.field,
              },
              {
                key: "watch",
                value: (path, func, opt = {}) => {
                  if (!watchEnum[path]) {
                    watchEnum[path] = [];
                  }

                  it._path = path;
                  it._opt = opt;
                  it._watchFn = function (val) {
                    func(val, { ...opt, formInstance, field: it });
                  };

                  watchEnum[path].push(it._watchFn);
                },
              },
              {
                key: "set",
                value: (key, val) => {
                  if (key === "data") {
                    formInstance.setFieldValue(...val);
                  } else {
                    it[key] = val;
                    setState({ key, val });
                  }
                },
              },
            ];

            let effectFunc = new Function(
              ...it._effectParams.map((p) => p.key),
              it.effect,
            );

            it._effectFunc = effectFunc.bind(this);

            it._effectFunc(...it._effectParams.map((p) => p.value));
          }
        }

        function _onChange(value) {
          console.log(value);
          // it._watchFn &&
          //   it._watchFn(formInstance.getFieldValue(it._path), value);
          onChange && onChange(value);
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
          onChange: _onChange,
          fieldSubmit: fieldSubmit,
          slots,
          watchEnum: props.watchEnum,
        };

        return (
          Component && (
            <Component
              // 更新指定组件状态
              key={it.name === state.key ? it.name + state.val : it.name}
              {...itemProps}
            ></Component>
          )
        );
      })}
    </>
  );
}

export default FormItems;

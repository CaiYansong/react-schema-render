import { Form, Button } from "antd";

import FormItems from "../../form-items";

import "./index.less";

// Form.List
function ItemList(props) {
  const { field = {}, data = {}, config } = props;

  function onItemChange(...args) {
    console.log("item-list onItemChange: ", ...args);
  }

  const _itemsProps = {
    disabled: field.disabled || props.disabled,
    readOnly: field.readonly || props.readOnly,
    scenario: props.scenario,
    schema: {
      fieldList: field.fieldList,
      formConf: field.formConf,
      validRules: field.validRules,
      validFuncs: field.validFuncs,
    },
    slots: props.slots,
    formInstance: props.formInstance,
    fieldsConf: props.fieldsConf,
    config,
    onChange: onItemChange,
    fieldSubmit: props.fieldSubmit,
    watchEnum: props.watchEnum,
  };

  return (
    <Form.List name={field.name}>
      {(fields, { add, remove }) => (
        <div className="item-list">
          <Button onClick={() => add()} type="primary">
            新增
          </Button>
          {fields.map(({ key, name, ...restField }, index) => {
            const itemsProps = {
              ..._itemsProps,
              itemListProps: { key, name, ...restField, index },
              data: data[field.name] && data[field.name][index],
            };
            return (
              <div className="list-item" key={key + name + index}>
                <FormItems isItemList {...itemsProps} />
                <Button onClick={() => remove(index)}>删除</Button>
              </div>
            );
          })}
        </div>
      )}
    </Form.List>
  );
}

export default ItemList;

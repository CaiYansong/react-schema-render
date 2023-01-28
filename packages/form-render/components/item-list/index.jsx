import { Form, Button } from "antd";

import FormItems from "../../form-items";

const FormItem = Form.Item;

const canEdit = true;

// Form.List
function ItemList(props) {
  const { field = {}, disabled, readOnly, data = {}, config } = props;

  function onItemChange(...args) {
    console.log("item-list onItemChange: ", ...args);
  }

  const _itemsProps = {
    disabled,
    readOnly,
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
        <>
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
              <div>
                <FormItems isItemList {...itemsProps} />
                <Button onClick={() => remove(index)}>删除</Button>
              </div>
            );
          })}
        </>
      )}
    </Form.List>
  );
}

export default ItemList;

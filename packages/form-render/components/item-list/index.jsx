import { Form, Input, Button } from "antd";

import FormItems from "../../form-items";

function gettext(text) {
  return text;
}

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
  };

  return (
    <Form.List name={field.name}>
      {(fields, { add, remove }) => (
        <>
          <Button onClick={() => add()} type="primary">
            新增
          </Button>
          {fields.map(({ key, name, ...restField }, i) => (
            <div>
              <FormItems {..._itemsProps} />
              <Button
                onClick={() => {
                  // TODO: 删除逻辑，数据删除逻辑
                  remove(i);
                }}
              >
                删除
              </Button>
            </div>
          ))}
        </>
      )}
    </Form.List>
  );
}

export default ItemList;

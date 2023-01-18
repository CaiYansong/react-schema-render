import { Form, Input, Button } from "antd";

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
  };

  return (
    <Form.List name={field.name}>
      {(fields, { add, remove }) => (
        <>
          <FormItem>
            用户填写信息
            <Button
              type="primary"
              style={{ marginLeft: "20px" }}
              ghost
              disabled={!canEdit}
              shape="circle"
              onClick={() => add()}
            >
              +
            </Button>
          </FormItem>
          <FormItem>
            <div style={{ color: "#999" }}>
              请在下方输入框中配置用户需要填写的信息标题，如手机号码
            </div>
          </FormItem>
          {fields.map(({ key, name, ...restField }) => (
            <div className="infoItem" key={key}>
              <div className="removeBtn">
                <Button
                  danger
                  ghost
                  shape="circle"
                  disabled={!canEdit}
                  onClick={() => remove(name)}
                >
                  -
                </Button>
              </div>
              <FormItem label={"中文标题"} name={[name, "info"]} required>
                <Input disabled={!canEdit} placeholder={"请输入中文标题"} />
              </FormItem>

              <FormItem label={"英文标题"} name={[name, "infoEn"]} required>
                <Input disabled={!canEdit} placeholder={"请输入英文标题"} />
              </FormItem>
            </div>
          ))}
        </>
      )}
    </Form.List>
  );
}

export default ItemList;

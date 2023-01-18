import { Form, Input, Button } from "antd";

function gettext(text) {
  return text;
}

const FormItem = Form.Item;

const canEdit = true;

// Form.List
function ItemList(props) {
  const { field = {} } = props;
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
              <FormItem
                label={gettext("中文标题")}
                name={[name, "info"]}
                required
              >
                <Input
                  disabled={!canEdit}
                  placeholder={gettext("请输入中文标题")}
                />
              </FormItem>

              <FormItem
                label={gettext("英文标题")}
                name={[name, "infoEn"]}
                required
              >
                <Input
                  disabled={!canEdit}
                  placeholder={gettext("请输入英文标题")}
                />
              </FormItem>
            </div>
          ))}
        </>
      )}
    </Form.List>
  );
}

export default ItemList;

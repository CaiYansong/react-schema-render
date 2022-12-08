import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "antd";

function ListItemForm({}, parentRef) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("新增");
  const [form, setForm] = useState({});
  useImperativeHandle(parentRef, () => ({
    onShow(formVal, title = "新增") {
      setForm(formVal || {});
      setTitle(title);
      setOpen(true);
    },
  }));

  function onOk() {
    console.log("onOk");
    onCancel();
  }

  function onCancel() {
    setOpen(false);
  }

  return (
    <Modal title={title} open={open} onOk={onOk} onCancel={onCancel}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  );
}

export default forwardRef(ListItemForm);

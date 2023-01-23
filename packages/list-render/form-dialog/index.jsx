import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Modal } from "antd";

import FormRender from "@packages/form-render";

import "./index.less";

function FormDialog(props, parentRef) {
  const [title, setTitle] = useState("新增");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});

  const formRef = useRef();
  const resolveCB = useRef();
  const rejectCB = useRef();

  // useEffect(() => {
  //   console.log(form);
  // }, [form]);

  function show(form, title) {
    setOpen(true);
    setForm(form || {});
    setTitle(title || "新增");
    return new Promise((resolve, reject) => {
      resolveCB.current = resolve;
      rejectCB.current = reject;
    });
  }

  function close() {
    setOpen(false);
    setForm({});
  }

  function cancel() {
    close();
    rejectCB.current && rejectCB.current();
  }

  useImperativeHandle(parentRef, () => ({
    show,
    close,
    cancel,
  }));

  function onOk() {
    resolveCB.current && resolveCB.current(form);
    props.onSubmit && props.onSubmit(form);
    close();
  }

  function onFormChange(cur, form) {
    setForm(form);
  }

  return (
    <Modal
      wrapClassName="form-dialog"
      title={title}
      open={open}
      onCancel={cancel}
      onOk={onOk}
    >
      <FormRender
        ref={formRef}
        schema={props.schema}
        data={form}
        config={props.formConf}
        onChange={onFormChange}
      />
    </Modal>
  );
}

export default forwardRef(FormDialog);

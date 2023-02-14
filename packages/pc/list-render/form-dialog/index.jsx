import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Modal, Button, message } from "antd";

import FormRender from "@packages/pc/form-render";

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
    onOk,
  }));

  function onOk() {
    formRef.current
      .validate()
      .then((values) => {
        const submitForm = formRef.current.getSubmitData(form);
        console.log("submitForm", submitForm);
        resolveCB.current && resolveCB.current(submitForm);
        props.onSubmit && props.onSubmit(submitForm);
        close();
      })
      .catch((err) => {
        console.log("err", err);
        message.error("输入有误！");
      });
  }

  function onFormChange(cur, form) {
    setForm(form);
  }

  const { slots } = props;
  let footer = undefined;
  if (props.dialogConf?.footer) {
    footer = props.dialogConf?.footer;
  } else {
    footer = [];

    if (slots.dialogFooterPre) {
      const Pre = slots.dialogFooterPre;
      footer.push(<Pre key="pre" fnEnum={{ cancel, onOk, close }} />);
    }

    footer.push(
      <Button key="cancel" onClick={cancel}>
        取 消
      </Button>,
    );

    if (slots.dialogFooterCenter) {
      const Pre = slots.dialogFooterCenter;
      footer.push(<Pre key="center" fnEnum={{ cancel, onOk, close }} />);
    }

    footer.push(
      <Button key="confirm" type="primary" onClick={onOk}>
        确 定
      </Button>,
    );

    if (slots.dialogFooterSuffix) {
      const Pre = slots.dialogFooterSuffix;
      footer.push(<Pre key="suffix" fnEnum={{ cancel, onOk, close }} />);
    }
  }

  return (
    <Modal
      wrapClassName="form-dialog"
      title={title}
      open={open}
      onCancel={cancel}
      onOk={onOk}
      footer={footer}
    >
      <FormRender
        ref={formRef}
        schema={props.schema}
        data={form}
        initialValues={props.formInitialValues}
        config={props.formConf}
        slots={props.formSlots}
        onChange={onFormChange}
      />
    </Modal>
  );
}

export default forwardRef(FormDialog);

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

  function getForm() {
    return formRef.current.getSubmitData(form);
  }

  function validate() {
    return new Promise((resolve) => {
      formRef.current
        .validate()
        .then((values) => {
          resolve(true, values);
        })
        .catch((err) => {
          resolve(false, err);
          console.log("err", err);
          message.error("输入有误！");
        });
    });
  }

  function onFormChange(cur, form) {
    setForm(form);
  }

  const { Slots = {}, dialogConf = {} } = props;
  let footer = undefined;
  if (dialogConf?.footer) {
    footer = dialogConf?.footer;
  } else {
    footer = [];
    const options = { cancel, onOk, close, getForm, validate, formRef };

    if (Slots.dialogFooterPre) {
      footer.push(<Slots.dialogFooterPre key="pre" options={options} />);
    }

    footer.push(
      <Button key="cancel" onClick={cancel}>
        {dialogConf.cancelText || "取 消"}
      </Button>,
    );

    if (Slots.dialogFooterCenter) {
      footer.push(<Slots.dialogFooterCenter key="center" options={options} />);
    }

    footer.push(
      <Button key="confirm" type="primary" onClick={onOk}>
        {dialogConf.okText || "确 定"}
      </Button>,
    );

    if (Slots.dialogFooterSuffix) {
      footer.push(<Slots.dialogFooterSuffix key="suffix" options={options} />);
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
        Slots={props.formSlots}
        onChange={onFormChange}
      />
    </Modal>
  );
}

export default forwardRef(FormDialog);

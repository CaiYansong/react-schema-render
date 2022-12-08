import { useState, useEffect } from "react";
import { Form, Picker } from "antd-mobile";

const FormItem = Form.Item;

function SelectCom(props) {
  const {
    parentField,
    name,
    data,
    clearable,
    disabled,
    readonly,
    multiple,
    searchable,
    placeholder = "请选择",
    options,
    formInstance,
    formItemProps = {},
    onChange,
  } = props;
  const [_options, setOptions] = useState(options ? [options] : []);

  // 处理数据源为 func 的逻辑
  useEffect(() => {
    if (
      props.isRemote &&
      props.remoteConf &&
      props.remoteConf.type === "func" &&
      props.remoteConf.func
    ) {
      // 只能这样拿到 AsyncFunction
      // 直接写 Object.getPrototypeOf(async function(){}).constructor
      // 会被 babel 转成 Function
      const getAsyncFunction = new Function(
        `return Object.getPrototypeOf(async function(){}).constructor;`,
      );
      const AsyncFunction = getAsyncFunction();

      let fetchFunc = new AsyncFunction(
        "config",
        "scenario",
        `${props.remoteConf.func}`,
      );
      fetchFunc = fetchFunc.bind(this);
      fetchFunc(props.config, props.scenario).then((options) => {
        setOptions([options]);
      });
    }
  }, [props.isRemote, props.remoteConf?.func]);

  // 处理数据源为 api 的逻辑
  useEffect(() => {
    if (
      props.isRemote &&
      props.remoteConf &&
      props.remoteConf.type === "api" &&
      props.remoteConf.api
    ) {
      fetch(props.remoteConf.api, {
        method: "get",
        headers: props.config?.headers || {},
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 200) {
            setOptions([res.data]);
          }
        })
        .catch((error) => {
          console.error("Error select remote api: ", error);
        });
    }
  }, [props.isRemote, props.remoteConf?.api]);

  const [visible, setVisible] = useState(false);

  function onClose() {
    setVisible(false);
  }

  function onClick() {
    setVisible((val) => {
      return !val;
    });
  }

  const _formItemProps = {
    ...formItemProps,
    trigger: "onConfirm",
  };

  return (
    <FormItem {..._formItemProps} onClick={onClick}>
      <Picker columns={_options} visible={visible} onClose={onClose}>
        {(value) => (value && value.length > 0 ? value[0]?.label : placeholder)}
      </Picker>
    </FormItem>
  );
}

export default SelectCom;

import { useState, useEffect } from 'react';
import { Form, Picker } from 'antd-mobile';

const FormItem = Form.Item;

function SelectCom(props) {
  const {
    name,
    data,
    clearable,
    disabled,
    readonly,
    multiple,
    searchable,
    placeholder = '请选择',
    options,
    onChange,
    formItemProps = {},
  } = props;
  const [_options, setOptions] = useState(options ? [options] : []);

  const _props = {
    id: name,
    value: data,
    allowClear: clearable,
    disabled,
    readOnly: readonly,
    showSearch: searchable,
    mode: multiple === true ? 'multiple' : undefined,
    onClear: onChange,
    onChange: onChange,
  };

  // 处理数据源为 func 的逻辑
  useEffect(async () => {
    if (
      !props.isRemote ||
      !props.remoteConf ||
      props.remoteConf.type !== 'func' ||
      !props.remoteConf.func
    ) {
      return;
    }
    // 只能这样拿到 AsyncFunction
    // 直接写 Object.getPrototypeOf(async function(){}).constructor
    // 会被 babel 转成 Function
    const getAsyncFunction = new Function(
      `return Object.getPrototypeOf(async function(){}).constructor;`,
    );
    const AsyncFunction = getAsyncFunction();

    let fetchFunc = new AsyncFunction(
      'config',
      'scenario',
      `${props.remoteConf.func}`,
    );
    fetchFunc = fetchFunc.bind(this);
    try {
      const options = (await fetchFunc(props.config, props.scenario)) || [];
      setOptions([options]);
    } catch (err) {
      console.error('Error select remote func: ', err);
    }
  }, [props.isRemote, props.remoteConf?.func]);

  // 处理数据源为 api 的逻辑
  useEffect(async () => {
    if (
      !props.isRemote ||
      !props.remoteConf ||
      props.remoteConf.type !== 'api' ||
      !props.remoteConf.api
    ) {
      return;
    }
    // TODO: api 请求 options 相关逻辑
    fetch(props.remoteConf.api, {
      method: 'get',
      headers: props.config?.headers || {},
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code === 200) {
          setOptions([res.data]);
        }
      })
      .catch((error) => {
        console.error('Error select remote api: ', error);
      });
  }, [props.isRemote, props.remoteConf?.api]);

  const [visible, setVisible] = useState(false);

  function onClose() {
    setVisible(false);
  }

  function onConfirm(val) {
    console.log('val', val);
    onChange(val);
  }

  function onClick() {
    console.log('onClick');
    setVisible((val) => {
      return !val;
    });
  }

  return (
    <FormItem {...formItemProps} onClick={onClick}>
      <Picker
        columns={_options}
        visible={visible}
        onCancel={onClose}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        {(value) => (value && value.length > 0 ? value[0]?.label : placeholder)}
      </Picker>
    </FormItem>
  );
}

export default SelectCom;

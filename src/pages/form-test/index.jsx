import { useState, useRef } from 'react';
import { Input, Button } from 'antd';

import FormRender from '@/components/form-render';

import demoSchema from './demo.schema.json';

function TestSlot(props) {
  const [val, setVal] = useState(0);
  const valRef = useRef(0);
  console.log('TestSlot props: ', props);

  return (
    <div>
      <Input value={props.data} onChange={props.onChange} />
      TestSlot val - {val}
      <Button
        onClick={() => {
          setVal((val) => {
            let res = ++val;
            props.onChange(res);
            return res;
          });
        }}
      >
        add
      </Button>
      <br />
      valRef - {valRef.current}
      <Button
        onClick={() => {
          valRef.current = 1 + (valRef.current || 0);
          // props.onChange(valRef.current);
        }}
      >
        add
      </Button>
    </div>
  );
}

export default function FormTestPage() {
  const [form, setForm] = useState({
    'input-f9b7f9b': '1',
    'input-59f411d': '2',
    'select-b836c9c': 'option1',
    'select-func': 'remote2',
  });
  function onChange(changedValues, allValues, form) {
    console.log('form test onChange: ', changedValues, allValues, form);
    setForm(allValues);
  }
  const config = {
    getOptions() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: 'Remote 1',
              value: 'remote1',
            },
            {
              label: 'Remote 2',
              value: 'remote2',
            },
          ]);
        }, 1000);
      });
    },
  };
  return (
    <div>
      FormTestPage
      <br />
      form: {JSON.stringify(form)}
      <br />
      <FormRender
        scenario="create"
        schema={demoSchema}
        data={form}
        onChange={onChange}
        config={config}
      >
        <TestSlot key="slotName" />
        <div key="slotName2">form test slot2</div>
      </FormRender>
    </div>
  );
}

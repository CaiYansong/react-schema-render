import { useState, useRef } from 'react';

import FormRender from '@/components/form-render';

import demoSchema from './demo.schema.json';

export default function FormTestPage() {
  const [form, setForm] = useState({"input-f9b7f9b":"1","input-59f411d":"2","select-b836c9c":"option1","select-func":"remote2"});
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
        schema={demoSchema}
        data={form}
        onChange={onChange}
        config={config}
      />
    </div>
  );
}

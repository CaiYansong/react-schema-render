import { useState, useRef } from 'react';

import FormRender from '@/components/form-render';

import demoSchema from './demo.schema.json';

export default function FormTestPage() {
  const data = useRef({});
  const [form, setForm] = useState({});
  function onChange(changedValues, allValues, form) {
    data.current = allValues;
    setForm(allValues);
  }
  return (
    <div>
      FormTestPage
      <br />
      data: {JSON.stringify(data)}
      <br />
      form: {JSON.stringify(form)}
      <br />
      <FormRender schema={demoSchema} data={data} onChange={onChange} />
    </div>
  );
}

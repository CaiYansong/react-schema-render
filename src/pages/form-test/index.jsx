import { useRef } from 'react';

import FormRender from '@/components/form-render';

import demoSchema from './demo.schema.json';

export default function FormTestPage() {
  const data = useRef({});
  return (
    <div>
      FormTestPage
      {JSON.stringify(data)}
      <br />
      <FormRender schema={demoSchema} data={data} />
    </div>
  );
}

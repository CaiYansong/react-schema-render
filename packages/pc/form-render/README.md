# form render

## 示例

```JavaScript
import { useState } from "react";
import dayjs from "dayjs";

import FormRender from "@packages/pc/form-render";

import demoSchema from "./demo.schema.json";

export default function FormTestPage() {
  const [form, setForm] = useState({
    "input-f9b7f9b": "1",
    "input-59f411d": "2",
    "select-b836c9c": ["option1"],
    "select-func": "remote2",
    "date-picker-cce160e": dayjs("2022-1-1 09:1:2").format(
      "YYYY-MM-DD HH:mm:ss",
    ),
    "item-list-cdf09d8": [
      {
        "date-picker-cce160e": dayjs("2022-1-1 09:1:2").format(
          "YYYY-MM-DD HH:mm:ss",
        )
      }
    ],
  });

  function onChange(changedValues, allValues, form) {
    console.log("form test onChange: ", changedValues, allValues, form);
    setForm(allValues);
  }

  // 相关配置数据
  const config = {
    // schema 项远程数据函数 
    getOptions() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: "Remote 1",
              value: "remote1",
            },
            {
              label: "Remote 2",
              value: "remote2",
            },
          ]);
        }, 1000);
      });
    },
  };

  return (
    <div>
      <FormRender
        disabled
        scenario="create"
        schema={demoSchema}
        data={form}
        onChange={onChange}
        config={config}
      />

      <h1>disabled</h1>
      <FormRender
        disabled
        scenario="detail"
        schema={demoSchema}
        data={form}
        onChange={onChange}
        config={config}
      />
    </div>
  );
}
```
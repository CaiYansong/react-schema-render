import { useState, useRef } from "react";
import { Input, Button } from "antd";
import dayjs from "dayjs";

import FormRender from "@packages/form-render";

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
    "date-picker-cce160e-range": [
      dayjs("2022-1-1 09:1:2"),
      dayjs("2022-1-2 09:1:2"),
    ],
    "date-picker-time-cce160e": dayjs("2022-1-1 01:2:3").format(
      "YYYY-MM-DD HH:mm:ss",
    ),
    "date-picker-time-cce160e-range": [
      dayjs("2022-1-1 04:5:6"),
      dayjs("2022-1-2 07:8:9"),
    ],
    "subform-377c7bc": {
      "date-picker-cce160e": dayjs("2022-1-1 09:1:2").format(
        "YYYY-MM-DD HH:mm:ss",
      ),
    },
    "item-list-cdf09d8": [
      {
        "date-picker-cce160e": dayjs("2022-1-1 09:1:2").format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        "date-picker-cce160e-range": [
          dayjs("2022-1-1 09:1:2"),
          dayjs("2022-1-2 09:1:2"),
        ],
        "date-picker-time-cce160e": dayjs("2022-1-1 01:2:3").format(
          "YYYY-MM-DD HH:mm:ss",
        ),
        "date-picker-time-cce160e-range": [
          dayjs("2022-1-1 04:5:6"),
          dayjs("2022-1-2 07:8:9"),
        ],
      },
    ],
  });
  function onChange(changedValues, allValues, form) {
    console.log("form test onChange: ", changedValues, allValues, form);
    setForm(allValues);
  }
  const config = {
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
    getCascaderOptions() {
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
              children: [
                {
                  label: "Remote 21",
                  value: "remote21",
                },
              ],
            },
          ]);
        }, 1000);
      });
    },
  };
  return (
    <div style={{ padding: "20px" }}>
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
      {/*  */}
      <h1>disabled</h1>
      <FormRender
        disabled
        scenario="create"
        schema={demoSchema}
        data={form}
        onChange={onChange}
        config={config}
      >
        <TestSlot key="slotName" />
        <div key="slotName2">form test slot2</div>
      </FormRender>
      {/*  */}
      <h1>readOnly</h1>
      <FormRender
        readOnly
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

function TestSlot(props) {
  const [val, setVal] = useState(0);
  const valRef = useRef(0);

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

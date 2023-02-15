import FormItems from "../../form-items";

function Wrapper(props) {
  const { fieldList = [], formConf = {}, validRules = {}, validFuncs = [] } =
    props.field || {};

  return (
    <>
      <FormItems
        {...{
          data: props.data,
          disabled: props.disabled,
          readOnly: props.readOnly,
          scenario: props.scenario,
          schema: {
            fieldList,
            formConf,
            validRules,
            validFuncs,
          },
          Slots: props.Slots,
          formInstance: props.formInstance,
          config: props.config,
          fieldsConf: props.fieldsConf || {},
          onChange: props.onChange,
          fieldSubmit: props.fieldSubmit,
          watchEnum: props.watchEnum,
        }}
      />
    </>
  );
}

export default Wrapper;

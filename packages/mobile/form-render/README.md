# Mobile Form Render

- 注意：select 类型 校验时机需要选择 change

## 差异
- input
  - 前后缀需要手动写，可使用 Form.Item extra 参数
- mobile antd 表单校验不支持 return Promise 写法；



#### Form.Item extra
```
<Form layout='horizontal'>
  <Form.Item
    label='短信验证码'
    extra={
      <div className={styles.extraPart}>
        <a>发送验证码</a>
      </div>
    }
  >
    <Input placeholder='请输入验证码' clearable />
  </Form.Item>
</Form>
```

## 问题
- 表单选择框已经选择，但是提交时校验出现 ['${label}不是一个有效的${type}'] 错误。
  - 校验 validateTrigger 需要有 change


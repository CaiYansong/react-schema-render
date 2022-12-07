# Mobile Form Render


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
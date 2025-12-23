import React from 'react';
import { Button, Checkbox, Form, Input, Select, DatePicker } from 'antd';

const BasicFormPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Basic Form Test</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        className="ant-form"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
        >
          <Select>
            <Select.Option value="male">Male</Select.Option>
            <Select.Option value="female">Female</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Agreement"
          name="agreement"
          valuePropName="checked"
        >
          <Checkbox>I agree to the terms</Checkbox>
        </Form.Item>
        
        <Form.Item label="Birth Date" name="birthday">
            <DatePicker />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BasicFormPage;

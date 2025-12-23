import React from 'react';
import { Form, Select, Button } from 'antd';

const SelectTestPage: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1>Advanced Select Test</h1>
      <Form
        form={form}
        name="select-test"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        className="ant-form"
      >
        <Form.Item
          label="Favorite Color"
          name="color"
          rules={[{ required: true, message: 'Please select a color!' }]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Select a color"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: 'red', label: 'Red' },
              { value: 'green', label: 'Green' },
              { value: 'blue', label: 'Blue' },
              { value: 'yellow', label: 'Yellow' },
              { value: 'purple', label: 'Purple' },
            ]}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
            Reset
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SelectTestPage;

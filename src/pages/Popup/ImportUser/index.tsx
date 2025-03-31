import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { addOrUpdateUser } from '../util';
import { dispatchCustomEvent } from '../../../util/dom';
import { getDomainFromUrl } from '../../../util';
import { useForm } from 'antd/es/form/Form';

interface Props {
  onSuccess(): void;
  url: string;
}

const styles: Record<'formItem', React.CSSProperties> = {
  formItem: {
    marginBottom: '12px',
  },
};

interface FormData {
  name: string;
  cookies: string;
  changeDomain: boolean;
  domain: string;
}

export default function ImportUser(props: Props) {
  const [form] = useForm();

  const formData: FormData = Form.useWatch([], form);

  const onFinish = async (values: FormData) => {
    try {
      // message.info(JSON.stringify(values));
      console.log('ImportUser values:', values);

      const cookies: chrome.cookies.Cookie[] = JSON.parse(values.cookies);

      if (values.changeDomain) {
        cookies.forEach((c) => {
          c.domain = values.domain;
        });
      }

      const user = {
        name: values.name.trim(),
        cookies,
        updateTime: Date.now(),
      };
      // 保存
      await addOrUpdateUser(user, values.domain);
      dispatchCustomEvent('refresh-users');
      props.onSuccess();
    } catch (err: any) {
      message.error(`添加失败: ${err?.message}`);
    }
  };

  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        domain: getDomainFromUrl(props.url) || '',
      }}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 18,
      }}
      form={form}
    >
      <Form.Item
        name="name"
        required
        label="用户名"
        style={styles.formItem}
        rules={[
          {
            required: true,
            type: 'string',
            message: '用户名不能为空',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="域名"
        name="domain"
        required
        style={styles.formItem}
        rules={[
          {
            required: true,
            type: 'string',
            message: '域名不能为空',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="更改域名"
        name="changeDomain"
        required
        style={styles.formItem}
        valuePropName="checked"
      >
        <Checkbox>
          更改cookie域名为 &nbsp;
          <span style={{ color: 'red' }}>{formData?.domain || ''}</span>
        </Checkbox>
      </Form.Item>
      <Form.Item
        name="cookies"
        required
        label="cookies"
        style={styles.formItem}
        rules={[
          {
            required: true,
            type: 'string',
            message: 'cookies不能为空',
          },
        ]}
      >
        <TextArea
          cols={20}
          rows={12}
          placeholder="请输入JSON格式的cookie数组"
        ></TextArea>
      </Form.Item>
      <Form.Item
        style={{
          textAlign: 'center',
        }}
        wrapperCol={{
          span: 24,
        }}
      >
        <Button type="primary" htmlType="submit">
          保存
        </Button>
      </Form.Item>
    </Form>
  );
}

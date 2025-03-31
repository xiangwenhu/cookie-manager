import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Space,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import SameSiteSelect from '../SameSiteSelect';

type Cookie = chrome.cookies.Cookie;

interface Props {
  item: Cookie;
  onSave(item: Cookie): void;
  onCancel(): void;
}

interface FormData extends Omit<Cookie, 'expirationDate'> {
  expirationDate: dayjs.Dayjs | undefined;
}

const transfer = {
  toCookieData(data: FormData): Cookie {
    return {
      ...data,
      expirationDate: data.session
        ? undefined
        : data.expirationDate
        ? Math.ceil(data.expirationDate?.toDate().getTime() / 1000)
        : undefined,
      sameSite: data.sameSite || 'unspecified',
      partitionKey:
        !data.partitionKey ||
        (data.partitionKey.hasCrossSiteAncestor === undefined &&
          data.partitionKey.topLevelSite === undefined)
          ? undefined
          : data.partitionKey,
    };
  },
  toFormData(data: Cookie): FormData {
    return {
      ...data,
      expirationDate: data.expirationDate
        ? dayjs(data.expirationDate * 1000)
        : undefined,
      partitionKey: {},
    };
  },
};

const EditCookieItem: React.FC<Props> = ({ item, onCancel, onSave }) => {
  const initialValues = transfer.toFormData(item);
  const [form] = useForm();
  const values: FormData = Form.useWatch([], form);

  const onToSave = async () => {
    try {
      form
        .validateFields()
        .then((values) => {
          const data = transfer.toCookieData(values);
          onSave(data);
        })
        .catch((err) => {});
    } catch (err: any) {
      message.error(`保存失败：${err?.message}`);
    }
  };

  return (
    <Form
      form={form}
      initialValues={initialValues}
      labelCol={{
        span: 4,
      }}
    >
      <Form.Item
        label="name"
        name="name"
        required
        rules={[
          {
            required: true,
            type: 'string',
            message: 'name不能为空',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="value" name="value">
        <Input />
      </Form.Item>
      <Form.Item
        label="domain"
        name="domain"
        required
        rules={[
          {
            required: true,
            type: 'string',
            message: 'domain不能为空',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="expirationDate">
        <Form.Item name="session" valuePropName="checked">
          <Checkbox>是否是会话Cookie</Checkbox>
        </Form.Item>
        {values && !values.session ? (
          <Form.Item label="expirationDate" name="expirationDate" required>
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
        ) : null}
      </Form.Item>
      <Form.Item
        label="path"
        name="path"
        rules={[
          {
            required: true,
            type: 'string',
            message: 'path不能为空',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="httpOnly" name="httpOnly" valuePropName="checked">
        <Checkbox>httpOnly</Checkbox>
      </Form.Item>

      <Form.Item label="secure" name="secure" valuePropName="checked">
        <Checkbox>secure</Checkbox>
      </Form.Item>
      <Form.Item label="sameSite" name="sameSite">
        {/* <SameSiteSelect defaultValue={initialValues.sameSite} /> */}
        <SameSiteSelect />
      </Form.Item>

      <Form.Item label="partitionKey">
        <Form.Item
          labelCol={{
            span: 12,
          }}
          name={['partitionKey', 'hasCrossSiteAncestor']}
          valuePropName="checked"
        >
          <Checkbox>hasCrossSiteAncestor</Checkbox>
        </Form.Item>
        <Form.Item label="topLevelSite" name={['partitionKey', 'topLevelSite']}>
          <Input placeholder="请输入topLevelSite" />
        </Form.Item>
      </Form.Item>

      <Form.Item>
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <Space>
            <Button type="primary" onClick={onToSave}>
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </div>
      </Form.Item>
    </Form>
  );
};

export default EditCookieItem;

import React from "react";
import { Button, Form, Input, message } from "antd"
import TextArea from "antd/es/input/TextArea";
import { addUser } from "../util";
import { dispatchCustomEvent } from "../../../util/dom";
import { getDomainFromUrl } from "../../../util";

interface Props {
    onSuccess(): void,
    url: string;
};


export default (props: Props) => {

    const onFinish = async (values: any) => {
        try {
            // message.info(JSON.stringify(values));
            console.log("ImportUser values:", values);
            const user = {
                name: values.name.trim(),
                cookies: JSON.parse(values.cookies),
                updateTime: Date.now(),
            };
            // 保存
            await addUser(user, values.domain);
            dispatchCustomEvent('add-user-success');
            props.onSuccess();
        } catch (err: any) {
            message.error("添加失败，" + (err && err.message));
        }
    }

    return (
        <Form onFinish={onFinish} initialValues={{
            domain: getDomainFromUrl(props.url) || ''
        }}>
            <Form.Item name="name" required label="用户名">
                <Input />
            </Form.Item>
            <Form.Item label="域名" name="domain" required>
                <Input />
            </Form.Item>
            <Form.Item name="cookies" required>
                <TextArea cols={20} rows={12} placeholder="请输入JSON格式的cookie数组"></TextArea>
            </Form.Item>
            <Form.Item style={{
                textAlign: "center"
            }} required>
                <Button type="primary" htmlType="submit">保存</Button>
            </Form.Item>
        </Form >
    )
}
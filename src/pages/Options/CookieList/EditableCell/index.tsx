import React from "react";
import { Form, Input, InputNumber } from "antd";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text' | 'datePicker';
    record: chrome.cookies.Cookie;
    index: number;
    children: React.ReactNode;
}


const comMap: Record<string, any> = {
    number: <InputNumber />,
    input: <Input />
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = comMap[inputType];

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode || null}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

import React, { useEffect, Fragment, useState } from 'react';
import './index.scss';
import { Form, Popconfirm, Table, TableColumnProps, Typography } from 'antd';
import { formatExpirationDate } from '../util';
import { ColumnsType } from 'antd/es/table';

const { Column } = Table;


type Item = chrome.cookies.Cookie & {
    key?: string;
};

interface Props {
    list: Item[];
}

type EditableTableProps = Parameters<typeof Table>[0];


type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const CookieList: React.FC<Props> = ({ list }: Props) => {

    const [form] = Form.useForm();
    const [data, setData] = useState<Item[]>(list.map(it => ({
        key: it.name,
        ...it
    })));
    const [editingKey, setEditingKey] = useState<string>('');

    const isEditing = (record: Item) => record.key === editingKey;

    const edit = (record: Partial<Item> & { key: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key: React.Key) => {
        try {
            const row = (await form.validateFields()) as Item;

            const newData: Item[] = [...data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


    const columns: (ColumnTypes & { editable?: boolean; dataIndex?: string }) = [{
        title: "序号",
        render: (_text, _data, index) => index + 1
    }, {
        title: "name",
        dataIndex: "name"
    }, {
        title: "value",
        dataIndex: "value",
        render: (text) => {
            return <div title={text} className="ck-value">{text}</div>
        }
    }, {
        title: "domain",
        dataIndex: "domain"
    }, {
        title: "expirationDate",
        dataIndex: "expirationDate",
        render: text => formatExpirationDate(text)
    }, {
        title: "path",
        dataIndex: "path"
    }, {
        title: "httpOnly",
        dataIndex: "httpOnly"
    }, {
        title: "secure",
        dataIndex: "secure"
    }, {
        title: "sameSite",
        dataIndex: "sameSite"
    }, {
        title: "partitionKey",
        dataIndex: "partitionKey"
    }, {
        title: 'operation',
        dataIndex: 'operation',
        render: (_: any, record: any) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
                    <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                        保存
                    </Typography.Link>
                    <Typography.Link onClick={cancel}>
                        取消
                    </Typography.Link>
                </span>
            ) : (
                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                    编辑
                </Typography.Link>
            );
        },
    },];


    const mergedColumns = columns.map((col: any) => {
        if (!col) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    const renderList = () => {
        return <Table
            dataSource={data}
            pagination={{
                pageSize: 1000,
                hideOnSinglePage: true,
            }}
            rowKey={(record) => `${record.name}-${record.expirationDate}`}
            className="ck-table"
            columns={mergedColumns as any[]}
        >
        </Table>
    }


    return (
        <div className="cookie-list-x">
            {renderList()}
        </div>
    );
};

export default CookieList;

import { message, Modal, Popconfirm, Table, Typography } from 'antd';
import React, { Fragment, useState } from 'react';
import { formatExpirationDate } from '../util';
import './index.scss';
import { DomainGroup, DomainUser } from '../types';
import { addOrUpdateUser } from '../../Popup/util';

type Item = chrome.cookies.Cookie & {
    key?: string;
};

interface Props {
    user: DomainUser;
    onOk(): void;
    onCancel(): void;
    group: DomainGroup
}

const CookieList: React.FC<Props> = ({ user, onCancel, onOk, group }: Props) => {

    const [data, setData] = useState<Item[]>(user.cookies.map((it, index) => ({
        key: `${it.name}-${index}`,
        ...it
    })));

    const onDelete = (index: number) => {
        data.splice(index, 1);
        setData([...data])
    }

    const onUpdateUser = async () => {
        if (!user) return;
        try {
            user.cookies = data
            await addOrUpdateUser(user, group.domain);
            message.success("保存成功");
            onOk();
        } catch (err: any) {
            message.error(`保存失败：${err && err.message}`);
        }
    }

    const columns: any[] = [{
        title: "序号",
        render: (_text: any, _data: any, index: any) => index + 1
    }, {
        title: "name",
        dataIndex: "name",
        editable: true,
    }, {
        title: "value",
        dataIndex: "value",
        editable: true,
        render: (text: any) => {
            return <div title={text} className="ck-value">{text}</div>
        }
    }, {
        title: "domain",
        dataIndex: "domain",
        editable: true,
    }, {
        title: "expirationDate",
        dataIndex: "expirationDate",
        render: (text: any) => formatExpirationDate(text),
        editable: true,
    }, {
        title: "path",
        dataIndex: "path",
        editable: true,
    }, {
        title: "httpOnly",
        dataIndex: "httpOnly",
        editable: true,
    }, {
        title: "secure",
        dataIndex: "secure",
        editable: true,
    }, {
        title: "sameSite",
        dataIndex: "sameSite",
        editable: true,
    }, {
        title: "partitionKey",
        dataIndex: "partitionKey"
    }, {
        title: '操作',
        dataIndex: 'operation',
        render: (_: any, record: any, index: number) => {
            return (<Fragment>
                <Typography.Link style={{ marginRight: 8 }}>
                    编辑
                </Typography.Link>
                <Popconfirm title="确定删除吗?" onConfirm={() => onDelete(index)}>
                    <a>删除</a>
                </Popconfirm>
            </Fragment>)
        },
    },];


    const renderList = () => {
        return <Table

            dataSource={data}
            pagination={{
                pageSize: 1000,
                hideOnSinglePage: true,
            }}
            rowKey={(record) => `${record.key}`}
            className="ck-table"
            columns={columns}
        >
        </Table>
    }





    return (
        <Modal open={true}
            title={`cookie列表(${user.name})`}
            width="96%"
            onOk={onUpdateUser}
            onCancel={onCancel}>
            <div className="cookie-list-x">
                {renderList()}
            </div>
        </Modal>
    );
};

export default CookieList;

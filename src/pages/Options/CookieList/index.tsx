import React, { useEffect, Fragment } from 'react';
import './index.scss';
import { Table } from 'antd';
import { formatExpirationDate } from '../util';

const { Column } = Table;

interface Props {
    list: chrome.cookies.Cookie[]
}

const CookieList: React.FC<Props> = ({ list }: Props) => {

    const renderList = () => {
        return <Table
            dataSource={list}
            pagination={{
                pageSize: 10,
                hideOnSinglePage: true,
            }}
            rowKey={(record) => `${record.name}-${record.expirationDate}`}
        >
            <Column title="序号" render={(_text, _data, index) => index + 1} />
            <Column title="名字" dataIndex="name"></Column>
            <Column width='100px' title="值" dataIndex="value" render={(text) => {
                return <div title={text} className="ck-value">{text}</div>
            }}></Column>
            <Column title="域" dataIndex="domain"></Column>
            <Column title="过期时间" dataIndex="expirationDate" render={text => formatExpirationDate(text)}></Column>
            <Column title="path" dataIndex="path"></Column>
            <Column title="httpOnly" dataIndex="httpOnly" render={text => `${text}`}></Column>
            <Column title="secure" dataIndex="secure" render={text => `${text}`}></Column>
            <Column title="sameSite" dataIndex="sameSite"></Column>
        </Table>
    }


    return (
        <div className="cookie-list-x">
            {renderList()}
        </div>
    );
};

export default CookieList;

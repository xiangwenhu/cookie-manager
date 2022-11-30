import React, { useEffect, Fragment } from 'react';
import './index.css';
import { DomainGroup, DomainUser } from "../types";
import { Table, Button } from 'antd';

const { Column } = Table;

interface Props {
    group: DomainGroup,
    onDelete(user: DomainUser, domain: DomainGroup): Promise<void>;
}

const DomainGroup: React.FC<Props> = ({ group, onDelete }: Props) => {

    const renderUsers = () => {
        return <Table
            dataSource={[...group.users]}
            pagination={{
                pageSize: 5,
                hideOnSinglePage: true,
            }}
        // rowKey="name"
        >
            <Column title="序号" render={(_text, _data, index) => index + 1} />
            <Column title="用户" dataIndex="name"></Column>
            <Column
                title="操作"
                key="action"
                render={(_text, user: DomainUser) => {
                    return (
                        <Button danger onClick={() => onDelete(user, group)}>
                            删除
                        </Button>
                    );
                }}
            ></Column>
        </Table>
    }


    return (
        <div className="domain-x">
            <h3 className="domain-name">{group.domain}</h3>
            <div className="domain-users"> {renderUsers()}</div>
        </div>
    );
};

export default DomainGroup;

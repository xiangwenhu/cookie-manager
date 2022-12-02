import React, { useEffect, Fragment, useState } from 'react';
import './index.css';
import { DomainGroup, DomainUser } from "../types";
import { Table, Button, Modal } from 'antd';
import { formatDateTime } from '../../../util/date';
import CookieList from '../CookieList';

const { Column } = Table;

interface Props {
    group: DomainGroup,
    onDelete(user: DomainUser, domain: DomainGroup): Promise<void>;
}

const DomainGroup: React.FC<Props> = ({ group, onDelete }: Props) => {

    const [showDetail, setShowDetail] = useState(false);
    const [user, setSelectedUser] = useState<DomainUser | null>(null);

    const onViewDetail = (usr: DomainUser) => {
        setShowDetail(true);
        setSelectedUser(usr);
    }

    const renderDetail = () => {
        if (!showDetail || !user) {
            return null;
        }

        return <Modal open={showDetail}
            width="80%"
            onOk={() => setShowDetail(false)}
            onCancel={() => setShowDetail(false)}>
            <CookieList list={user?.cookies} />
        </Modal>
    }

    const renderUsers = () => {
        return <Table
            dataSource={[...group.users]}
            pagination={{
                pageSize: 5,
                hideOnSinglePage: true,
            }}
            rowKey="name"
        >
            <Column width={100} title="序号" render={(_text, _data, index) => index + 1} />
            <Column width={120} title="用户" dataIndex="name"></Column>
            <Column width={120} title="更新时间" dataIndex="updateTime" render={
                (text) => formatDateTime(text || 0)
            }></Column>
            <Column
                width={120}
                title="操作"
                key="action"
                render={(_text, user: DomainUser) => {
                    return (
                        <Fragment>
                            <Button type="default" onClick={() => onViewDetail(user)}>
                                详情
                            </Button>
                            <Button danger onClick={() => onDelete(user, group)}>
                                删除
                            </Button>
                        </Fragment>
                    );
                }}
            ></Column>
        </Table>
    }




    return (
        <div className="domain-x">
            <h3 className="domain-name">{group.domain}</h3>
            <div className="domain-users"> {renderUsers()}</div>
            {renderDetail()}
        </div>
    );
};

export default DomainGroup;

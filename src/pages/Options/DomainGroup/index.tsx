import React, { useEffect, Fragment, useState } from 'react';
import './index.css';
import { DomainGroup, DomainUser } from "../types";
import { Table, Button, Modal, message, Popconfirm } from 'antd';
import CookieList from '../CookieList';

import { formatDateTime } from '../../../util/date';
import { writeText } from '../../../util/clipboard';
import { toJSONString } from '../../../util/cookie';
import { downloadFile } from '../../..//util';

const { Column } = Table;

const styles = {
    buttonStyle: {
        marginLeft: "10px"
    }
}

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

    const onCopy = (usr: DomainUser) => {
        try {
            writeText(toJSONString(usr.cookies));
            message.success("复制成功")
        } catch (err) {
            message.error("复制失败，请重试")
        }
    }

    const onExport = () => {
        try {

            if (!group) {
                return;
            }

            downloadFile(JSON.stringify(group, undefined, "\t"), `${group.domain}.json`);
            message.success("导出成功")
        } catch (err) {
            message.error("导出失败")
        }
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

                            <Popconfirm
                                title="确认删除该用户吗？"
                                onConfirm={() => onDelete(user, group)}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button danger style={styles.buttonStyle}>删除</Button>
                            </Popconfirm>

                            <Button type='default' onClick={() => onCopy(user)} style={styles.buttonStyle}>复制</Button>
                        </Fragment>
                    );
                }}
            ></Column>
        </Table>
    }

    return (
        <div className="domain-x">
            <div className='domain-group'>
                <h3 className="domain-name">{group.domain}</h3>
                <Button className='btn-export-group' type='primary' onClick={onExport}>导出</Button>
            </div>
            <div className="domain-users"> {renderUsers()}</div>
            {renderDetail()}
        </div>
    );
};

export default DomainGroup;

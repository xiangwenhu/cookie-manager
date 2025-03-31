import { Checkbox, message, Modal, Popconfirm, Table, Typography } from 'antd';
import React, { Fragment, useState } from 'react';
import { formatExpirationDate } from '../util';
import './index.scss';
import { DomainGroup, DomainUser } from '../types';
import { addOrUpdateUser } from '../../Popup/util';
import EditCookieItem from '../../../components/EditCookieItem';

type Item = chrome.cookies.Cookie & {
  key?: string;
};

interface Props {
  user: DomainUser;
  onOk(): void;
  onCancel(): void;
  group: DomainGroup;
}

const CookieList: React.FC<Props> = ({
  user,
  onCancel,
  onOk,
  group,
}: Props) => {
  const [data, setData] = useState<DomainUser>({
    updateTime: user.updateTime,
    name: user.name,
    cookies: user.cookies.map((it, index) => ({
      ...it,
      key: `${it.name}-${index}`,
    })),
  });

  const [editInfo, setEditInfo] = useState<{
    showEditItem: boolean;
    item: Item | undefined;
    index: number;
  }>({
    showEditItem: false,
    item: undefined,
    index: -1,
  });

  const onToEditCookieItem = (item: Item, index: number) => {
    setEditInfo({
      showEditItem: true,
      item,
      index,
    });
  };

  const onSaveCookieItem = (item: Item) => {
    if (item && editInfo && data.cookies[editInfo.index]) {
      data.cookies[editInfo.index] = item;
      data.cookies = [...data.cookies];
      setData({ ...data });
    }
    setEditInfo({
      showEditItem: false,
      item: undefined,
      index: -1,
    });
  };

  const onDelete = (index: number) => {
    data.cookies.splice(index, 1);
    data.cookies = [...data.cookies];
    setData({ ...data });
  };

  const onUpdateUser = async () => {
    if (!user) return;
    try {
      user.cookies = data.cookies;
      await addOrUpdateUser(user, group.domain);
      message.success('保存成功');
      onOk();
    } catch (err: any) {
      message.error(`保存失败：${err && err.message}`);
    }
  };

  const columns: any[] = [
    {
      title: '序号',
      render: (_text: any, _data: any, index: any) => index + 1,
    },
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'value',
      dataIndex: 'value',
      render: (text: any) => {
        return (
          <div title={text} className="ck-value">
            {text}
          </div>
        );
      },
    },
    {
      title: 'domain',
      dataIndex: 'domain',
    },
    {
      title: 'expirationDate',
      dataIndex: 'expirationDate',
      render: (text: any) => formatExpirationDate(text),
    },
    {
      title: 'path',
      dataIndex: 'path',
    },
    {
      title: 'httpOnly',
      dataIndex: 'httpOnly',
      render: (text: any) => {
        return <Checkbox checked={text} className="point-event-none" />;
      },
    },
    {
      title: 'secure',
      dataIndex: 'secure',
      render: (text: any) => {
        return <Checkbox checked={text} className="point-event-none" />;
      },
    },
    {
      title: 'sameSite',
      dataIndex: 'sameSite',
    },
    {
      title: 'partitionKey',
      dataIndex: 'partitionKey',
      render: (val: chrome.cookies.CookiePartitionKey) => {
        if (!val) return null;

        return (
          <Fragment>
            <div>
              hasCrossSiteAncestor: {val.hasCrossSiteAncestor ? '✔' : '✘'}
            </div>

            <div>topLevelSite: {val.topLevelSite || ''}</div>
          </Fragment>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any, index: number) => {
        return (
          <Fragment>
            <Typography.Link
              style={{ marginRight: 8 }}
              onClick={() => onToEditCookieItem(record, index)}
            >
              编辑
            </Typography.Link>
            <Popconfirm title="确定删除吗?" onConfirm={() => onDelete(index)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        );
      },
    },
  ];

  const renderList = () => {
    return (
      <Table
        dataSource={data.cookies}
        pagination={{
          pageSize: 1000,
          hideOnSinglePage: true,
        }}
        // rowKey={(record: any) => `${record.key}`}
        className="ck-table"
        columns={columns}
      ></Table>
    );
  };

  return (
    <Fragment>
      <Modal
        centered
        open={true}
        title={`cookie列表(${user.name})`}
        width="96%"
        onOk={onUpdateUser}
        onCancel={onCancel}
      >
        <div className="cookie-list-x">{renderList()}</div>
      </Modal>

      {editInfo.showEditItem ? (
        <Modal
          open={editInfo && editInfo.showEditItem && !!editInfo.item}
          title="编辑Cookie项"
          footer={null}
          width="660px"
          onCancel={() =>
            setEditInfo({
              showEditItem: false,
              item: undefined,
              index: -1,
            })
          }
        >
          <EditCookieItem
            item={editInfo.item!}
            onCancel={() =>
              setEditInfo({
                showEditItem: false,
                item: undefined,
                index: -1,
              })
            }
            onSave={(data) => onSaveCookieItem(data)}
          />
        </Modal>
      ) : null}
    </Fragment>
  );
};

export default CookieList;

import React, { useCallback, useEffect, useState } from 'react';
import { getDomainFromUrl } from '../../../util';
import { formatDateTime } from '../../../util/date';
import { getUsers, removeUser, saveCookieByTabAndName } from '../util';
import './index.css';

import { Button, Popconfirm, Table, message } from 'antd';
import { writeText } from '../../../util/clipboard';
import { deleteAll, setDetailsByTab, toJSONString } from '../../../util/cookie';
import { dispatchCustomEvent } from '../../../util/dom';
import { DomainUser } from '../../Options/types';

const { Column } = Table;

const UserList = ({ curTab }: { curTab: chrome.tabs.Tab }) => {
  const [users, setUsers] = useState<any[]>([]);

  const getUsersFromTab = useCallback(async () => {
    console.log('UserList:getDomainFromUrl');
    const domain = getDomainFromUrl(curTab.url!);
    const users = await getUsers(domain!);
    setUsers(users);
  }, [curTab.url]);

  useEffect(() => {
    function onFresh() {
      getUsersFromTab();
    }
    window.addEventListener('refresh-users', onFresh);
    return () => window.removeEventListener('refresh-users', onFresh);
  }, [curTab, getUsersFromTab]);

  useEffect(() => {
    async function init() {
      if (!curTab) {
        return;
      }
      getUsersFromTab();
    }
    init();
  }, [curTab, getUsersFromTab]);

  const onSelect = async function (user: DomainUser) {
    try {
      const cookies = user.cookies;
      await deleteAll(
        cookies as unknown as chrome.cookies.SetDetails[],
        curTab.url!
      );
      await setDetailsByTab(cookies, curTab);

      chrome.extension
        .getViews({
          type: 'popup',
          // tabId: curTab.id
          // windowId: window.id
        })
        .forEach((v) => v.close());
      // chrome.tabs.reload({});
      // curTab.
      await chrome.tabs.update(curTab.id!, { active: true });
      await chrome.windows.update(curTab.windowId, { focused: true });
      chrome.tabs.reload(curTab.id!);
    } catch (err: any) {
      console.error('切换用户失败', err);
      message.error(`切换用户失败: ${err?.message}`);
    }
  };

  const onCopy = (usr: DomainUser) => {
    try {
      writeText(toJSONString(usr.cookies));
      message.success('复制成功');
    } catch (err) {
      message.error('复制失败，请重试');
    }
  };

  const onDelete = async (usr: DomainUser) => {
    try {
      const domain = getDomainFromUrl(curTab.url!);
      await removeUser(domain!, usr.name);
      getUsersFromTab();
      message.success('删除成功');
    } catch (err) {
      message.error('删除失败，请重试');
    }
  };

  const onUpdate = async (usr: DomainUser) => {
    try {
      await saveCookieByTabAndName(curTab, usr.name);
      getUsersFromTab();
      message.success("更新成功")
    } catch (err: any) {
      message.error(`保存失败: ${err?.message}`);
    }
  }

  const renderList = () => {
    return (
      <Table
        dataSource={users}
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
        }}
        rowKey="name"
      >
        <Column title="序号" render={(_text, _data, index) => index + 1} />
        <Column width={150} title="用户" dataIndex="name" className='break' />
        <Column
          width={120}
          title="更新时间"
          dataIndex="updateTime"
          render={(text) => formatDateTime(text || 0, false)}
        ></Column>
        <Column
          title="操作"
          key="action"
          render={(_text, data: DomainUser) => {
            return (
              <>
                <Button type="primary" onClick={() => onSelect(data)}>
                  切换
                </Button>
                <Button
                  type="primary"
                  onClick={() => onCopy(data)}
                  style={{
                    marginLeft: '10px',
                  }}
                >
                  复制
                </Button>

                <Popconfirm
                  title="确认更新cookie到当前用户？"
                  onConfirm={() => onUpdate(data)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    type="primary"
                    style={{
                      marginLeft: '10px',
                    }}
                    title='更新当前cookie到此用户'
                  >
                    更新
                  </Button>
                </Popconfirm>
                <Popconfirm
                  title="确认删除该用户吗？"
                  onConfirm={() => onDelete(data)}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button
                    danger
                    style={{
                      marginLeft: '10px',
                    }}
                  >
                    删除
                  </Button>
                </Popconfirm>
              </>
            );
          }}
        ></Column>
      </Table >
    );
  };

  console.log('users:', users);
  return <div className="container-user">{renderList()}</div>;
};

export default UserList;

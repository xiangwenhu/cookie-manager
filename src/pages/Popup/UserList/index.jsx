import React, { useState, useEffect } from 'react';
import './index.css';
import { getUsers } from '../util';
import { getDomainFromUrl } from '../../../util';
import { formatDateTime } from '../../../util/date';

import { deleteAll, setDetailsByTab } from '../../../util/cookie';
import { Button, Table, message } from 'antd';

const { Column } = Table;

const UserList = ({ curTab }) => {
  const [users, setUsers] = useState([]);

  const getUsersFromTab = async () => {
    console.log('UserList:getDomainFromUrl');
    const domain = getDomainFromUrl(curTab.url);
    const users = await getUsers(domain);
    setUsers(users);
  };

  useEffect(() => {
    function onAddUser() {
      getUsersFromTab();
    }
    window.addEventListener('add-user-success', onAddUser);
    return () => window.removeEventListener('add-user-success', onAddUser);
  }, [curTab]);

  useEffect(() => {
    async function init() {
      if (!curTab) {
        return;
      }
      getUsersFromTab();
    }
    init();
  }, [curTab]);

  const onSelect = async function (user) {
    try {
      const cookies = user.cookies;
      await deleteAll(cookies, curTab.url);
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
      await chrome.tabs.update(curTab.id, { active: true });
      await chrome.windows.update(curTab.windowId, { focused: true });
      chrome.tabs.reload(curTab.id);
    } catch (err) {
      console.error('切换用户失败', err);
      message.error('切换用户失败：', err.message);
    }
  };

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
        <Column title="用户" dataIndex="name"></Column>
        <Column
          width={120}
          title="更新时间"
          dataIndex="updateTime"
          render={(text) => formatDateTime(text || 0, false)}
        ></Column>
        <Column
          title="操作"
          key="action"
          render={(_text, data) => {
            return (
              <Button type="primary" onClick={() => onSelect(data)}>
                切换
              </Button>
            );
          }}
        ></Column>
      </Table>
    );
  };

  console.log('users:', users);
  return <div className="container-user">{renderList()}</div>;
};

export default UserList;

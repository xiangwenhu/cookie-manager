import React, { useState, useEffect } from 'react';
import './index.css';
import { getUsers } from "../util";
import { getDomainFromUrl } from "../../../util";
import { deleteAll, setDetailsByTab } from "../../../util/cookie";

const UserList = ({
    curTab
}) => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');

    const getUsersFromTab = async () => {
        console.log("UserList:getDomainFromUrl");
        const domain = getDomainFromUrl(curTab.url);
        const users = await getUsers(domain);
        setUsers(users);
    }

    useEffect(() => {
        function onAddUser() {
            getUsersFromTab();
        }
        window.addEventListener("add-user-success", onAddUser);
        return () => window.removeEventListener("add-user-success", onAddUser);

    }, [curTab]);

    useEffect(() => {
        async function init() {
            if (!curTab) {
                return;
            }
            getUsersFromTab();
        };
        init();
    }, [curTab])


    const onSelect = async function (user) {
        try {
            const cookies = user.cookies;
            await deleteAll(cookies, curTab.url);
            await setDetailsByTab(cookies, curTab);

            chrome.extension.getViews({
                type: 'popup',
                // tabId: curTab.id
                // windowId: window.id
            }).forEach(v => v.close());
            chrome.tabs.reload({});
        } catch (err) {
            alert('切换用户失败：', err.message)
        }
    };


    const renderUserList = () => {
        if (!curTab || users.length === 0) {
            return <div>暂无用户</div>;
        }
        return users.map((u, index) => (
            <div key={`${u.name}-${index}`}
                onClick={() => onSelect(u)}
                className={`user ${u.name.trim() === name ? 'active' : ''}`}>{u.name}</div>
        ))
    }


    return (
        <div className="container-user">
            <h2>用户列表：</h2>
            {renderUserList()}
        </div>
    );
};

export default UserList;

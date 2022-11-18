import React, { useState } from 'react';
import './index.css';
import { getCookiesByTab } from "../../../util/cookie";
import { addUser } from "../util";
import { getDomainFromUrl } from "../../../util";
import { dispatchCustomEvent } from "../../../util/dom";

const SaveCookie = ({
    curTab
}) => {
    const [showSaveOpt, setShowSaveOpt] = useState(false);
    const [name, setName] = useState('');

    const onSave = async function () {
        try {
            // 获取当前页面的cookies
            const cookies = await getCookiesByTab(curTab);
            if (!cookies || !Array.isArray(cookies)) {
                return alert("保存失败");
            }
            const domain = getDomainFromUrl(curTab.url);
            if (!domain) {
                return alert("获取域名失败");
            }
            const user = {
                name: name.trim(),
                cookies
            }
            // 保存
            await addUser(user, domain);

            console.log("cookies:", cookies);
            setShowSaveOpt(false);

            dispatchCustomEvent("add-user-success")
        } catch (err) {
            alert("保存失败，" + err.message)
        }
    }

    const renderSaveOptions = function () {
        if (!showSaveOpt) {
            return null;
        }

        return <div className="save-options">
            <div className='label'>名字</div>
            <div className='field'>
                <input type="name" onChange={ev => setName(ev.target.value)} value={name}></input>
            </div>
            <div className='action'>
                <button className="btn-save" onClick={onSave}>保存</button>
            </div>
        </div>

    }

    if (!curTab) {
        return null;
    }

    return (
        <div className="container">
            <button type="button" onClick={() => setShowSaveOpt(true)}>保存当前cookie</button>
            {renderSaveOptions()}
        </div>
    );
};

export default SaveCookie;

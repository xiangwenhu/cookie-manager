import React, { useEffect, useState } from 'react';
import './index.css';
import * as util from "../util";
import DomainGroupCom from "../DomainGroup";
import { DomainGroup, DomainUser } from "../types";
import storage from "../../../util/storage"
import { DOMAIN_PREFIX } from '../../../const';

interface Props {
}

const DomainGroupList: React.FC<Props> = ({ }: Props) => {

    const [groupList, setGroupList] = useState<DomainGroup[]>([]);

    useEffect(() => {
        async function init() {
            const list = await util.groupCookies();
            setGroupList(list);
        };
        init();

        window.addEventListener("import-success", init);
        return () => window.removeEventListener("import-success", init);

    }, []);


    const onDelete = async (user: DomainUser, group: DomainGroup) => {
        try {
            const g = groupList.find(g => g.domain === group.domain);
            if (!g || !g.users) return;
            const index = g.users.findIndex(u => u.name == user.name);
            if (index < 0) return;
            // 删除
            g.users.splice(index, 1);
            setGroupList([...groupList])

            // 如果没有用户了，删除，否则，更新
            if (g.users.length === 0) {
                const gIndex = groupList.findIndex(g => g.domain === group.domain);
                if (gIndex !== -1) {
                    groupList.splice(gIndex, 1);
                    setGroupList([...groupList])
                }

                const res = await storage.removeItem(g.storeKey);
                console.log("remove result:", res);
                // chrome.storage.local.clear();
            } else {
                storage.setItem({
                    [g.storeKey]: g.users
                })
            }

        } catch (err: any) {
            alert("删除失败:" + err.message);
        }
    }

    const renderGroupList = () => {
        if (!groupList || groupList.length <= 0) {
            return <div>暂无用户</div>
        }
        return groupList.map(g => <DomainGroupCom key={g.domain} group={g} onDelete={onDelete} />)
    }


    return <div className="">
        <h2>账户管理：</h2>
        {renderGroupList()}
    </div>;
};

export default DomainGroupList;

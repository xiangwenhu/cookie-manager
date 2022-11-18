import React, { useEffect, Fragment } from 'react';
import './index.css';
import { DomainGroup, DomainUser } from "../types";

interface Props {
    group: DomainGroup,
    onDelete(user: DomainUser, domain: DomainGroup): Promise<void>;
}

const DomainGroup: React.FC<Props> = ({ group, onDelete }: Props) => {


    const renderUser = (user: DomainUser, index: number) => {
        return <div className="domain-user-item" key={`${user.name}-${index}`}>
            <div className="user-name">{user.name}</div>
            <div>
                <button onClick={_ => onDelete(user, group)} >删除</button>
            </div>
        </div>
    }


    return (
        <div className="domain-x">
            <h3 className="domain-name">{group.domain}</h3>
            <div className="domain-users"> {(group.users || []).map(renderUser)}</div>
        </div>
    );
};

export default DomainGroup;


export interface DomainUser {
    name: string;
    cookies: chrome.cookies.Cookie[];
    updateTime: number;
}


export interface DomainGroup {
    domain: string;
    storeKey: string;
    users: DomainUser[]
}
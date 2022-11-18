
export interface DomainUser {
    name: string;
    cookies: chrome.cookies.Cookie[]
}


export interface DomainGroup {
    domain: string;
    storeKey: string;
    users: DomainUser[]
}

export type CookieItem = Omit<chrome.cookies.Cookie, "storeId">;

export interface DomainUser {
    name: string;
    cookies: CookieItem[];
    updateTime: number;
}


export interface DomainGroup {
    domain: string;
    storeKey: string;
    users: DomainUser[]
}
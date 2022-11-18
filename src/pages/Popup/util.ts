import { DOMAIN_PREFIX } from "../../const";
import { getDomainFromUrl } from "../../util";
import storage from "../../util/storage";


interface UserInfo {
    name: string;
    cookies: chrome.cookies.Cookie[]
}

/**
 * 通过域名获取用户
 * @param domain 
 * @returns 
 */
export async function getUsers(domain: string) {
    // 通过当前页面地址获取 domain
    const domainKey = `${DOMAIN_PREFIX}${domain}`;
    // 查询当前域下的用户
    let users = ((await storage.getItem([domainKey])) || {})[domainKey] || [];
    console.log("users:", users);
    return users;
}

/**
 * 保存用户到指定域名
 * @param domain 
 * @param user 
 */
export async function addUser(user: UserInfo, domain: string,) {
    const users = await getUsers(domain);
    // 如果有，更新当前用户
    const index = users.findIndex((u: UserInfo) => (u.name || '').trim() === user.name.trim());
    if (index !== -1) {
        users[index] = user
    } else {
        users.push(user);
    }
    const domainKey = `${DOMAIN_PREFIX}${domain}`;
    // 保存
    await storage.setItem({ [domainKey]: users });
}

import { DOMAIN_PREFIX } from '../../const';
import storage from '../../util/storage';
import { getCurrentActiveTab, getTabById } from '../../util/tab';

interface UserInfo {
  name: string;
  updateTime: number;
  cookies: chrome.cookies.Cookie[];
}

/**
 * 通过域名获取用户
 * @param domain
 * @returns
 */
export async function getUsers(domain: string): Promise<any[]> {
  // 通过当前页面地址获取 domain
  const domainKey = `${DOMAIN_PREFIX}${domain}`;
  // 查询当前域下的用户
  let users = ((await storage.getItem([domainKey])) || {})[domainKey] || [];
  console.log('users:', users);
  return users;
}


export async function removeUser(domain: string, userName: string) {
  const users = await getUsers(domain);
  // 如果有，更新当前用户
  const index = users.findIndex(
    (u: UserInfo) => (u.name || '').trim() === userName.trim()
  );

  if (index > -1) users.splice(index, 1)


  const domainKey = `${DOMAIN_PREFIX}${domain}`;
  // 保存
  await storage.setItem({ [domainKey]: users });
}

/**
 * 保存用户到指定域名
 * @param domain
 * @param user
 */
export async function addOrUpdateUser(user: UserInfo, domain: string) {
  const users = await getUsers(domain);
  // 如果有，更新当前用户
  const index = users.findIndex(
    (u: UserInfo) => (u.name || '').trim() === user.name.trim()
  );
  if (index !== -1) {
    users[index] = user;
  } else {
    users.push(user);
  }
  const domainKey = `${DOMAIN_PREFIX}${domain}`;
  // 保存
  await storage.setItem({ [domainKey]: users });
}

export async function getPageTab() {
  const href = location.href;
  console.log('getCurrentTab:', href);

  const sp = new URLSearchParams(location.search);
  const tabId = +(sp.get('id') || '');
  // const url = sp.get('url');
  if (tabId) {
    const tab = await getTabById(tabId);
    return tab;
  }

  return getCurrentActiveTab();
}

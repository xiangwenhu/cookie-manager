import { message } from 'antd';
import { DOMAIN_PREFIX } from '../../const';
import { getCookiesByTab } from '../../util/cookie';
import storage from '../../util/storage';
import { getCurrentActiveTab, getTabById } from '../../util/tab';
import { getDomainFromUrl } from '../../util';

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


export async function saveCookieByTabAndName(tab: chrome.tabs.Tab, name: string) {

  // 获取当前页面的cookies
  const cookies = await getCookiesByTab(tab);
  if (!cookies || !Array.isArray(cookies)) {
    return message.error('获取cookies失败');
  }
  const domain = getDomainFromUrl(tab.url!);
  if (!domain) {
    return message.error('获取域名失败');
  }

  const rName = name.trim();
  if (rName.length === 0) return message.error('用户名不能为空');

  const user = {
    name: rName,
    // cookies: cookies.filter((ck) => !!ck.expirationDate),
    cookies,
    updateTime: Date.now(),
  };
  // 保存
  await addOrUpdateUser(user, domain);

  console.log('cookies:', cookies);
}
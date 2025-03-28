import { message } from 'antd';
import { getCurrentActiveTab } from './tab';

/**
 * 获取全部的cookies
 * @param details
 * @returns
 */
export async function getAllCookies(details: chrome.cookies.GetAllDetails) {
  console.log('getAllCookies details:', details);
  const cookies = await chrome.cookies.getAll(details);
  console.log('cookies:', cookies);
  return cookies;
}

/**
 * 获取当前tab的cookie
 * @returns
 */
export async function getCurrentPageCookies() {
  const tab = await getCurrentActiveTab();
  return getCookiesByTab(tab as chrome.tabs.Tab);
}

/**
 * 获取当前tab的cookieStore
 * @returns
 */
export async function getTabCookieStore(tab: chrome.tabs.Tab) {
  if (!tab) return null;
  const cookieStores = await chrome.cookies.getAllCookieStores();
  console.log('cookieStores:', cookieStores);
  const store = cookieStores.find((st) => st.tabIds.indexOf(tab.id!) != -1);
  return store;
}

/**
 * 通过tab的获取cookie
 * @returns
 */
export async function getCookiesByTab(tab: chrome.tabs.Tab) {
  const store = await getTabCookieStore(tab);
  if (!store) return null;

  return getAllCookies({
    storeId: store.id!,
    url: tab.url,
  });
}

/**
 * 设置cookie
 * @param details
 */
export async function setDetails(details: chrome.cookies.SetDetails[]) {
  for (let i = 0; i < details.length; i++) {
    const detail = details[i];
    try {
      await chrome.cookies.set(detail);
    } catch (err: any) {
      message.warning(`键为${detail.name}的cookie设置失败`, 3000);
    }
  }
}

function buildUrl(domain: string, path: string, searchUrl: string) {
  // Keep same protocol as searchUrl
  // This fixes a bug when we want to unset 'secure' property in an https domain
  var secure = searchUrl.indexOf('https://') === 0;

  if (domain.substring(0, 1) === '.') domain = domain.substring(1);

  return 'http' + (secure ? 's' : '') + '://' + domain + path;
}

/**
 * 删除全部的cookie
 * @param cookieList
 * @param searchUrl
 */
export async function deleteAll(
  cookieList: chrome.cookies.SetDetails[],
  searchUrl: string
) {
  for (var i = 0; i < cookieList.length; i++) {
    try {
      var curr = cookieList[i];
      var url = buildUrl(curr.domain!, curr.path!, searchUrl);
      await deleteCookie(url, curr.name!, curr.storeId!);
    } catch (err) {
      console.log('删除cookie失败:', err);
    }
  }
}

/**
 * 删除cookie
 * @param url
 * @param name
 * @param store
 * @returns
 */
async function deleteCookie(url: string, name: string, store: string) {
  const details: unknown = await chrome.cookies.remove({
    url: url,
    name: name,
    storeId: store,
  });

  if (details === 'null' || details === undefined || details === 'undefined') {
    return false;
  } else {
    return true;
  }
}

export function cookieToSetDetails(
  cookies: chrome.cookies.Cookie[],
  options: {
    url: string;
    storeId: string;
  }
): chrome.cookies.SetDetails[] {
  return (cookies || []).map((ck) => ({
    domain: ck.domain!,
    name: ck.name!,
    value: ck.value!,
    expirationDate: ck.expirationDate!,
    path: ck.path!,
    httpOnly: ck.httpOnly,
    secure: ck.secure,
    sameSite: ck.sameSite,
    ...options,
  }));
}

export function setDetailsFromCookies(
  cookies: chrome.cookies.Cookie[],
  options: {
    url: string;
    storeId: string;
  }
) {
  const details = cookieToSetDetails(cookies, options);
  return setDetails(details);
}

export async function setDetailsByTab(
  cookies: chrome.cookies.Cookie[],
  tab: chrome.tabs.Tab
) {
  const cookieStore = await getTabCookieStore(tab);
  if (!cookieStore) {
    return false;
  }
  const options = {
    url: tab.url!,
    storeId: cookieStore.id,
  };
  await setDetailsFromCookies(cookies, options);
  return true;
}

export function toJSONString(cookies: chrome.cookies.Cookie[]) {
  let string = '';
  string += '[\n';
  let cookie: chrome.cookies.Cookie;
  for (var i = 0; i < cookies.length; i++) {
    cookie = cookies[i];
    // cookie.id = i + 1;
    string += JSON.stringify(cookie, null, 4);
    if (i < cookies.length - 1) string += ',\n';
  }
  string += '\n]';
  return string;
}

import { DOMAIN_PREFIX } from '../../const';
import store from '../../util/storage';
import { DomainGroup } from './types';
import { formatDateTime } from '../../util/date';

export async function groupCookies(): Promise<DomainGroup[]> {
  const data = await store.getItem();

  console.log('store:', data);
  const groups = Object.keys(data)
    .filter((key) => key.startsWith(DOMAIN_PREFIX))
    .map((key) => ({
      domain: key.substring(DOMAIN_PREFIX.length),
      storeKey: key,
      users: Array.isArray(data[key]) ? data[key] : [data[key]],
    }));

  return groups;
}

export async function importDomainGroups(
  domainGroups: DomainGroup[]
): Promise<boolean> {
  if (!domainGroups) {
    return false;
  }
  const groups = Array.isArray(domainGroups) ? domainGroups : [domainGroups];

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    try {
      await store.setItem({
        [group.storeKey]: group.users,
      });
    } catch (err: any) {
      console.log('导入失败：' + err.message);
      continue;
    }
  }

  return true;
}

export function formatExpirationDate(val: undefined | number | string) {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    return '会话';
  }
  return formatDateTime(val * 1000);
}

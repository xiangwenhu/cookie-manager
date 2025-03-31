export function getDomainFromUrl(href: string) {
  try {
    const url = new URL(href);
    return url.hostname;
  } catch (err) {
    console.log('getDomainFromUrl error: ' + err);
    return null;
  }
}

export function downloadFile(content: string | Blob, filename: string) {
  let blob = content;
  if (typeof blob === 'string') {
    blob = new Blob([blob]);
  }
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  // a.style.display = 'none';
  a.download = filename;
  a.href = url;

  a.click();
  window.URL.revokeObjectURL(url);
}

export async function showPopup(
  info: chrome.contextMenus.OnClickData,
  tab: chrome.tabs.Tab
) {
  const tabUrl = encodeURIComponent(`${tab.url!}`);
  const tabID = encodeURIComponent(`${tab.id!}`);
  const tabIncognito = encodeURIComponent(`${+tab.incognito}`);

  const urlToOpen = `/popup.html?url=${tabUrl}&id=${tabID}&incognito=${tabIncognito}`;
  // chrome.extension.getURL('popup.html')

  console.log('chrome.extension.getURL', typeof chrome.extension.getURL);

  chrome.tabs.query(
    { windowId: chrome.windows.WINDOW_ID_CURRENT },
    function (tabList) {
      for (var x = 0; x < tabList.length; x++) {
        var cTab = tabList[x];
        if (cTab.url!.endsWith(urlToOpen)) {
          chrome.tabs.update(cTab.id!, { active: true });
          return;
        }
      }
      chrome.tabs.create({
        url: urlToOpen,
      });
    }
  );
}


export function arrayToRecord<T extends Record<string, any>>(arr: T[] = [], key: keyof T): Record<string, T> {
  return arr.reduce((obj: Record<string, T>, cur) => {
    obj[cur[key]] = cur;
    return obj
  }, {} as Record<string, T>)
}

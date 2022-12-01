export async function getCurrentActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  console.log('tabs:', tabs);
  return tabs && tabs.length > 0 ? tabs[0] : undefined;
}

export async function getCurrentPage() {
  const tab = await getCurrentActiveTab();
  return tab ? tab.url : undefined;
}

export async function getTabByUrl(url: string) {
  const tabs = await chrome.tabs.query({
    windowType: 'normal',
    url,
  });

  return tabs && tabs.length > 0 ? tabs[0] : undefined;
}


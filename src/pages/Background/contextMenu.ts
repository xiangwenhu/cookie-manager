// Add a listener to create the initial context menu items,
// context menu items only need to be created at runtime.onInstalled

import { showPopup } from '../../util';

chrome.runtime.onInstalled.addListener(async () => {
  console.log('chrome.runtime.onInstalled');
  chrome.contextMenus.create({
    id: '__to__popup__',
    title: '切换用户Cookie',
    type: 'normal',
    contexts: ['page'],
  });
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
  showPopup(item, tab!);
});

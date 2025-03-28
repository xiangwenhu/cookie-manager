
export function setItem(items: {
    [key: string]: any;
}) {
    return chrome.storage.local.set(items)
}

export function getItem(keys?: string | string[] | { [key: string]: any } | null) {
    return chrome.storage.local.get(keys)
}

export function removeItem(keys: string | string[]) {
    return chrome.storage.local.remove(keys)
}


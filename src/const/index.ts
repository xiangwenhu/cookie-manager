import { arrayToRecord } from "../util";



export const DOMAIN_PREFIX = 'domain_';

export const SameSiteList: { label: chrome.cookies.SameSiteStatus, value: chrome.cookies.SameSiteStatus }[] = [{
    label: "unspecified",
    value: "unspecified"
}, {
    label: "no_restriction",
    value: "no_restriction"
}, {
    label: "lax",
    value: "lax"
}, {
    label: "strict",
    value: "strict"
}];


export const SameSiteMap = arrayToRecord(SameSiteList, "value");
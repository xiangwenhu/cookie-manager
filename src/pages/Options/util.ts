import { DOMAIN_PREFIX } from "../../const";
import store from "../../util/storage";
import { DomainGroup } from "./types";

export async function groupCookies(): Promise<DomainGroup[]> {
    const data = await store.getItem();

    console.log("store:", data);
    const groups = Object
        .keys(data)
        .filter(key => key.startsWith(DOMAIN_PREFIX))
        .map(key => ({
            domain: key.substring(DOMAIN_PREFIX.length),
            storeKey: key,
            users: Array.isArray(data[key]) ? data[key] : [data[key]]
        }));

    return groups;
}

export async function importConfig(config: DomainGroup[]): Promise<boolean> {

    if (!config || !Array.isArray(config)) {
        return false
    }
    for (let i = 0; i < config.length; i++) {
        const group = config[i];

        try {
            await store.setItem({
                [group.storeKey]: group.users
            })
        } catch (err: any) {
            console.log("导入失败：" + err.message);
            continue
        }
    }

    return true;

}
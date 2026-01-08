interface ipv6Neighbor {
    local_ipv6: string;
    mac: string;
}

interface BaseDevice{
    mac: string;
    tag_id: number;
    alias: string;
}
interface Device extends BaseDevice{}
interface Gateway extends BaseDevice{
    local_ipv6: string;
}

export interface Tag{
    tag_id: number;
    alias: string;
}
async function get_ipv6_neighbors(): Promise<ipv6Neighbor[]>{
    return [
        {
            local_ipv6:"fe80::cbe:ccb7:69f7:8e16",
            mac: "6c:b1:33:9f:d9:fc"
        },
        {
            local_ipv6:"fe80::cbe:ccb7:69f7:8e17",
            mac: "6c:b1:33:9f:d9:fd",
        }
    ]
}

async function get_devices(): Promise<Device[]>{
    return [
        {
            mac: "6c:b1:33:9f:d9:fc",
            tag_id: 0,
            alias: "Xiaomi 14 Ultra",
        }
    ]
}
async function get_gateways(): Promise<Gateway[]>{
    return []
}


async function get_tags(): Promise<Tag[]>{
    return [
        {
            tag_id: 0,
            alias: "直连",
        },
        {
            tag_id: 1,
            alias: "代理",
        }
    ]
}
export {get_ipv6_neighbors, get_devices, get_gateways, get_tags};
export type { ipv6Neighbor, Device, Gateway };

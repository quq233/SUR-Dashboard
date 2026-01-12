import axios from 'axios';

// --- 基础配置 ---
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000', // 你的 FastAPI 地址
    timeout: 5000,
});

// --- 类型定义 (与后端保持同步) ---
export interface Tag {
    tag_id?: number;
    alias: string;
}

export interface BaseDevice {
    mac: string;
    tag_id: number;
    alias?: string;
}

export interface Device extends BaseDevice {}

export interface Gateway extends BaseDevice {
    local_ipv6: string;
}

export interface ipv6Neighbor {
    local_ipv6: string;
    mac: string;
}

// --- API 请求实现 ---

/**
 * TAG 标签管理
 */
export const tagApi = {
    getAll: () => api.get<Tag[]>('/tags/').then(res => res.data),
    create: (tag: Tag) => api.post<Tag>('/tags/', tag).then(res => res.data),
    update: (id: number, tag: Tag) => api.put<Tag>(`/tags/${id}`, tag).then(res => res.data),
    delete: (id: number) => api.delete(`/tags/${id}`).then(res => res.data),
};

/**
 * DEVICE 设备管理
 */
export const deviceApi = {
    getAll: () => api.get<Device[]>('/devices/').then(res => res.data),
    create: (device: Device) => api.post<Device>('/devices/', device).then(res => res.data),
    update: (mac: string, device: Device) => api.put<Device>(`/devices/${mac}`, device).then(res => res.data),
    delete: (mac: string) => api.delete(`/devices/${mac}`).then(res => res.data),
};

/**
 * GATEWAY 网关管理
 */
export const gatewayApi = {
    getAll: () => api.get<Gateway[]>('/gateways/').then(res => res.data),
    create: (gw: Gateway) => api.post<Gateway>('/gateways/', gw).then(res => res.data),
    update: (mac: string, gw: Gateway) => api.put<Gateway>(`/gateways/${mac}`, gw).then(res => res.data),
    delete: (mac: string) => api.delete(`/gateways/${mac}`).then(res => res.data),
};

/**
 * 特殊功能：获取邻居 (如果后端没写，建议在 FastAPI 增加该接口)
 * 目前先保留逻辑，你可以根据需要对接
 */
export async function get_ipv6_neighbors(): Promise<ipv6Neighbor[]> {
    // 假设你后端有个接口叫 GET /neighbors/
    // const res = await api.get<ipv6Neighbor[]>('/neighbors/');
    // return res.data;

    // 暂时 mock
    return [
        { local_ipv6: "fe80::cbe:ccb7:69f7:8e16", mac: "6c:b1:33:9f:d9:fc" }
    ];
}

// 为了兼容你原有的导出格式
export const get_tags = tagApi.getAll;
export const get_devices = deviceApi.getAll;
export const get_gateways = gatewayApi.getAll;

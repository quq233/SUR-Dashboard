import { ref, computed, type Ref } from "vue";
import api, {
    type Device, type Gateway, type ipv6Neighbor,
    get_devices, get_gateways, get_ipv6_neighbors, type Tag, get_tags
} from "./api.ts";

export const authed=ref(!!localStorage.getItem('token'));
// --- 关键：将状态定义在函数外部，实现全局单例 ---
const neighbors: Ref<ipv6Neighbor[]> = ref([]);
const devices: Ref<Device[]> = ref([]);
const gateways: Ref<Gateway[]> = ref([]);
const tags: Ref<Tag[]> = ref([])
const loading = ref(false);

// 自动维护的哈希表
const deviceMap = computed(() => new Map(devices.value.map(d => [d.mac, d])));
const gatewayMap = computed(() => new Map(gateways.value.map(g => [g.mac, g])));
const tagMap = computed(() => new Map(tags.value.map(t => [t.tag_id,t])))
// 内部使用的数据获取函数
const fetchData = async () => {
    if (loading.value) return; // 防止重复请求
    loading.value = true;
    try {
        [neighbors.value, devices.value, gateways.value, tags.value] = await Promise.all([
            get_ipv6_neighbors(),
            get_devices(),
            get_gateways(),
            get_tags()
        ]);
    } finally {
        loading.value = false;
    }
};

// --- 导出函数 ---
export function useDevices() {

    // 提供给外部的方法
    const find_device_by_mac = (mac: string) => deviceMap.value.get(mac);
    const find_gateway_by_mac = (mac: string) => gatewayMap.value.get(mac);
    const find_tag_by_id = (tag_id:number) => tagMap.value.get(tag_id);
    // 返回组件需要用到的所有东西
    return {
        neighbors,
        devices,
        gateways,
        tags,
        loading,
        fetchData,
        find_device_by_mac,
        find_gateway_by_mac,
        find_tag_by_id
    };
}

export interface DialogState{
    visible: boolean,
    isEdit: boolean,
    title: string,
    form: any,
    _is_gateway: boolean,
}

export interface TagDialogState {
    visible: boolean,
    form: any,
    isEdit: boolean,
    title: string,
}
export const validateIPv6 = (value: any):boolean => {
    const ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv6Pattern.test(value)
};

export interface AuthResult {
    success: boolean;
    message?: string; // 可选的错误信息
    code?: number;    // 可选的状态码，方便前端做多语言逻辑
}

export async function auth(token: string|null): Promise<AuthResult> {
    try {
        if(token != null)
            localStorage.setItem('token', token);
        await api.get('/verify_token');

        authed.value = true;
        return { success: true };
    } catch (error: any) {
        const status = error.response?.status;
        let message = '登录验证失败';

        if (status === 401) {
            localStorage.removeItem('token');
            message = 'Token 已过期或无效';
        } else if (!error.response) {
            message = '网络连接异常';
        }

        return {
            success: false,
            message: message,
            code: status
        };
    }
}
export function deauth(){
    localStorage.removeItem('token')
    authed.value=false;
}
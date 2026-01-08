import { ref, computed, type Ref } from "vue";
import {
    type Device, type Gateway, type ipv6Neighbor,
    get_devices, get_gateways, get_ipv6_neighbors, type Tag, get_tags
} from "./api.ts";

// --- 关键：将状态定义在函数外部，实现全局单例 ---
const neighbors: Ref<ipv6Neighbor[]> = ref([]);
const devices: Ref<Device[]> = ref([]);
const gateways: Ref<Gateway[]> = ref([]);
const tags: Ref<Tag[]> = ref([])
const loading = ref(false);

// 自动维护的哈希表
const deviceMap = computed(() => new Map(devices.value.map(d => [d.mac, d])));
const gatewayMap = computed(() => new Map(gateways.value.map(g => [g.mac, g])));

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

    // 返回组件需要用到的所有东西
    return {
        neighbors,
        devices,
        gateways,
        tags,
        loading,
        fetchData,
        find_device_by_mac,
        find_gateway_by_mac
    };
}
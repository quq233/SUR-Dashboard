<script setup lang="ts">
import {type Device, type Gateway, get_devices, get_gateways, get_ipv6_neighbors, type ipv6Neighbor} from "./api.ts";
import {computed, onMounted, type Ref, ref} from "vue";
import BaseDeviceInfoCard from "./components/BaseDeviceInfoCard.vue"; // 需要安装 @element-plus/icons-vue

const neighbors: Ref<ipv6Neighbor[]> = ref([])
const devices: Ref<Device[]> = ref([])
const gateways: Ref<Gateway[]> = ref([])

const loading = ref(false)
const editDeviceDialogVisible = ref(false)
const form: Ref<Device|null> = ref(null)
const formLabelWidth = '140px'

const fetchData = async () => {
  loading.value = true
  // 假设 get_ipv6_neighbors 是异步的，如果不是，直接赋值即可
  neighbors.value = await get_ipv6_neighbors()
  devices.value= await get_devices()
  gateways.value= await get_gateways()
  loading.value = false
}

// 2. 自动维护的 Device 哈希表
const deviceMap = computed(() => {
  return new Map(devices.value.map(d => [d.mac, d]));
});

// 3. 自动维护的 Gateway 哈希表
const gatewayMap = computed(() => {
  return new Map(gateways.value.map(g => [g.mac, g]));
});

onMounted(() => {
  fetchData()
})
const find_device_by_mac = (mac: string) => deviceMap.value.get(mac)
const find_gateway_by_mac = (mac: string) => gatewayMap.value.get(mac)

function edit_ipv6_device(mac: string) {
  console.log("search "+mac)
  const found = find_device_by_mac(mac);
  // 如果找到，则进行真正的深拷贝
  if (found){
    form.value = { ...found };
    console.log("found "+form.value?.mac)
    editDeviceDialogVisible.value = true
  }
}

function add_device_from_neigh(mac: string,ip) {

}
</script>

<template>
  <!--编辑现有设备-->
  <el-dialog v-model="editDeviceDialogVisible" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="mac" :label-width="formLabelWidth">
        <el-input v-model="form!.mac" autocomplete="off" />
      </el-form-item>
      <el-form-item label="tag" :label-width="formLabelWidth">
        <el-select v-model="form!.tag_id" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="0" />
          <el-option label="Zone No.2" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDeviceDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editDeviceDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!--从neigh添加到设备/网关-->
  <el-dialog v-model="editDeviceDialogVisible" title="Shipping address" width="500">
    <el-form :model="form">
      <el-form-item label="mac" :label-width="formLabelWidth">
        <el-input v-model="form!.mac" autocomplete="off" />
      </el-form-item>
      <el-form-item label="tag" :label-width="formLabelWidth">
        <el-select v-model="form!.tag_id" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="0" />
          <el-option label="Zone No.2" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editDeviceDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="editDeviceDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-col class="container">
    <BaseDeviceInfoCard
        title="IPv6设备"
        :data="devices"
        :loading="loading"
        @refresh="fetchData"
    >
      <template #extra-columns>
        <el-table-column prop="alias" label="名称"/>
        <el-table-column prop="tag_id" label="标签">
          <template #default="scope">
            {{ scope.row.tag_id }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button @click="edit_ipv6_device(scope.row.mac)">
            编辑
          </el-button>
        </template>
      </el-table-column>
      </template>
    </BaseDeviceInfoCard>

    <BaseDeviceInfoCard
        title="IPv6网关"
        :data="gateways"
        :loading="loading"
        @refresh="fetchData"
    >
      <template #extra-columns>
        <el-table-column prop="alias" label="名称"/>
        <el-table-column prop="tag_id" label="标签">
          <template #default="scope">
            {{ scope.row.tag_id }}
          </template>
        </el-table-column>

      </template>
    </BaseDeviceInfoCard>

    <BaseDeviceInfoCard
        title="网络中活跃的 IPv6 设备"
        :data="neighbors"
        :loading="loading"
        @refresh="fetchData">
      <template #extra-columns>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button v-if="!find_device_by_mac(scope.row.mac)" @click="edit_ipv6_device(scope.row.mac)">
              添加
            </el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </template>
    </BaseDeviceInfoCard>
  </el-col>
</template>

<style scoped>
</style>
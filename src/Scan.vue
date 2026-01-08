<script setup lang="ts">
import {type Device, type Gateway, get_devices, get_gateways, get_ipv6_neighbors, type ipv6Neighbor} from "./api.ts";
import { onMounted, type Ref, ref } from "vue";
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

onMounted(() => {
  fetchData()
})

function edit_ipv6_device(mac: string) {
  console.log("search "+mac)
  const found: Device|undefined = devices.value.find((d) => d.mac === mac);
  // 如果找到，则进行真正的深拷贝
  if (found){
    form.value = { ...found };
    console.log("found "+form.value?.mac)
    editDeviceDialogVisible.value = true
  }
}
</script>

<template>

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
        @refresh="fetchData"/>
  </el-col>
</template>

<style scoped>
</style>
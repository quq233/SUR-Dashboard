<script setup lang="ts">
import {type Device, type Gateway} from "./api.ts";
import {onMounted, type Ref, ref} from "vue";
import BaseDeviceInfoCard from "./components/BaseDeviceInfoCard.vue";
import {useDevices} from "./shared.ts";
import BaseDeviceInfoDialog from "./components/BaseDeviceInfoDialog.vue"; // 需要安装 @element-plus/icons-vue

const { devices, loading, fetchData, find_device_by_mac, gateways,neighbors,tags } = useDevices();

const editDeviceDialogVisible = ref(false)
const deviceForm: Ref<Device|null> = ref(null)
const form: Ref<any> = ref({})
const formLabelWidth = '140px'

function edit_ipv6_device(mac: string) {
  console.log("search "+mac)
  const found = find_device_by_mac(mac);
  // 如果找到，则进行真正的深拷贝
  if (found){
    deviceForm.value = { ...found };
    console.log("found "+deviceForm.value?.mac)
    editDeviceDialogVisible.value = true
  }
}

const addDeviceDialogVisible = ref(false)
function addDeviceFromNeigh(mac: string, local_ipv6: string) {
  form.value = {
    mac: mac,
    tag_id: 0,
    alias: "",
    local_ipv6: local_ipv6,
    is_gateway: 0,
  }
  addDeviceDialogVisible.value = true
}
</script>

<template>
  <!--编辑现有设备-->
  <BaseDeviceInfoDialog
      :form="deviceForm!"
      :showDialog="editDeviceDialogVisible"
      :handleCancel="() => {editDeviceDialogVisible=false}"
      :handleSubmit="() => {}"
  />
<!--  <el-dialog v-model="editDeviceDialogVisible" title="Shipping address" width="500">
    <el-form :model="deviceForm">
      <el-form-item label="mac" :label-width="formLabelWidth">
        <el-input v-model="deviceForm!.mac" autocomplete="off" />
      </el-form-item>
      <el-form-item label="tag" :label-width="formLabelWidth">
        <el-select v-model="deviceForm!.tag_id" placeholder="选择tag">
          <el-option v-for="tag in tags" :label="tag.alias" :value="tag.tag_id"/>
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
  </el-dialog>-->


  <!--从neigh添加到设备/网关-->
  <BaseDeviceInfoDialog
      title="添加设备/网关"
      :form="form!"
      :showDialog="addDeviceDialogVisible"
      :handleCancel="() => {addDeviceDialogVisible=false}"
      :handleSubmit="() => {

      }"
  >
  </BaseDeviceInfoDialog>

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
            <el-button v-if="!find_device_by_mac(scope.row.mac)" @click="addDeviceFromNeigh(scope.row.mac,scope.row.local_ipv6)">
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
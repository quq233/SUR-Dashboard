<script setup lang="ts">
import {type Ref, ref} from "vue";
import BaseDeviceInfoCard from "./components/BaseDeviceInfoCard.vue";
import {type DialogState, useDevices} from "./shared.ts";
import {Refresh} from "@element-plus/icons-vue";
import UniformedInfoDialog from "./components/UniformedInfoDialog.vue"; // 需要安装 @element-plus/icons-vue

const { devices, loading, fetchData, find_device_by_mac,find_gateway_by_mac, gateways,neighbors } = useDevices();


const dialogState: Ref<DialogState>=ref({
  visible: false,isEdit: false,title: "",form: undefined,_is_gateway: false,
})

function editBaseDevice(mac: string, isGateway: boolean) {
  console.log("search "+mac)
  const found = isGateway ? find_gateway_by_mac(mac) : find_device_by_mac(mac);
  if (found){
    console.log(found.tag_id)
    dialogState.value = {
      visible: true,
      isEdit: true,
      title: "编辑",
      form : {...found},
      _is_gateway : isGateway,
    }
  }
}

function addDeviceFromNeigh(mac: string, local_ipv6: string) {
  dialogState.value = {
    visible: true,
    isEdit: false,
    title: "添加",
    form: {
      mac: mac,
      tag_id: 0,
      alias: "",
      local_ipv6: local_ipv6,
    },
    _is_gateway: false,
  }
}

function addCustom(){
  dialogState.value = {
    visible: true,
    isEdit: false,
    title: "添加",
    form: {
      mac: "",
      tag_id: 0,
      alias: "",
      local_ipv6: "",
      is_gateway: 0,
    },
    _is_gateway : false,
  }
}

</script>

<template>
  <UniformedInfoDialog
      :dialogState="dialogState"
      :handleClose="() => {dialogState.visible=false}"
  >
  </UniformedInfoDialog>

  <el-col class="container">
    <BaseDeviceInfoCard
        title="IPv6设备"
        :data="devices"
        :loading="loading"
        @refresh="fetchData"
    >
      <template #actions>
        <el-button type="primary" :icon="Refresh" :loading="loading" @click="addCustom">
          添加
        </el-button>
      </template>
      <template #extra-columns>
        <el-table-column prop="alias" label="名称"/>
        <el-table-column prop="tag_id" label="标签">
          <template #default="scope">
            {{ scope.row.tag_id }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button @click="editBaseDevice(scope.row.mac,false)">
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

        <el-table-column fixed="right" label="操作" min-width="120">
          <template #default="scope">
            <el-button @click="editBaseDevice(scope.row.mac,true)">
              编辑
            </el-button>
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
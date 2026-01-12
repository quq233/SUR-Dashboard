<script setup lang="ts">
import { ref, watch } from "vue";
import { type DialogState, useDevices } from "../shared.ts";
import { deviceApi, gatewayApi } from "../api.ts";

const props = defineProps<{
  dialogState: DialogState,
  handleClose: () => void,
}>();

const { fetchData, tags } = useDevices();

// 1. 本地表单状态：用于存储当前编辑的内容，避免直接修改 Props
const localForm = ref<any>({});
const localIsGateway = ref(false);

// 2. 深度监听 Props 变化：当父组件打开对话框或切换数据时，同步到本地
watch(() => props.dialogState, (newVal) => {
  if (newVal.visible && newVal.form) {
    // 浅拷贝表单数据，防止直接污染父组件
    localForm.value = { ...newVal.form };
    localIsGateway.value = newVal._is_gateway;
  }
}, { deep: true, immediate: true });

async function submit() {
  const endpoint = localIsGateway.value ? gatewayApi : deviceApi;

  try {
    if (props.dialogState.isEdit) {
      await endpoint.update(localForm.value.mac, localForm.value);
    } else {
      await endpoint.create(localForm.value);
    }
    props.handleClose();
    await fetchData(); // 刷新列表
  } catch (error) {
    console.error("提交失败:", error);
  }
}
async function del() {
  const endpoint = localIsGateway.value ? gatewayApi : deviceApi;
  await endpoint.delete(localForm.value.mac);
  props.handleClose();
  await fetchData(); // 刷新列表
}
</script>

<template>
  <el-dialog
      :model-value="dialogState.visible"
      @update:model-value="handleClose"
      :title="dialogState.title"
      width="500px"
  >
    <el-form :model="localForm" label-width="80px">
      <el-form-item v-if="localIsGateway && 'local_ipv6' in localForm" label="IPv6">
        <el-input v-model="localForm.local_ipv6" />
      </el-form-item>

      <el-form-item label="MAC">
        <el-input v-model="localForm.mac" :disabled="dialogState.isEdit" />
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="localForm.alias" />
      </el-form-item>

      <el-form-item label="Tag">
        <el-select v-model="localForm.tag_id" placeholder="选择Tag">
          <el-option v-for="tag in tags" :key="tag.tag_id" :label="tag.alias" :value="tag.tag_id" />
        </el-select>
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="localIsGateway" :disabled="dialogState.isEdit">
          <el-option label="设备" :value="false" />
          <el-option label="网关" :value="true" />
        </el-select>
      </el-form-item>

      <slot name="extra-columns"></slot>
    </el-form>

    <template #footer>
      <el-button @click="del">删除</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from "vue";
import {type DialogState, useDevices, validateIPv6} from "../shared.ts";
import { deviceApi, gatewayApi } from "../api.ts";
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps<{
  dialogState: DialogState,
  handleClose: () => void,
}>();

const { fetchData, tags } = useDevices();

// 表单引用
const formRef = ref<FormInstance>();

// 本地表单状态
const localForm = ref<any>({});
const localIsGateway = ref(false);

// IPv6 验证函数
const validateLocalIPv6 = (_rule: any, value: any, callback: any) => {
  if (!localIsGateway.value) {
    callback();
    return;
  }
  if (!value) {
    callback(new Error('请输入IPv6地址'));
    return;
  }

  if (!validateIPv6(value)) {
    callback(new Error('IPv6地址格式不正确'));
  } else {
    callback();
  }
};

// 验证规则 - 移除所有 trigger，只在手动调用 validate 时触发
const rules = computed<FormRules>(() => ({
  mac: [
    { required: true, message: '请输入MAC地址' },
    {
      pattern: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
      message: 'MAC地址格式不正确（例如：AA:BB:CC:DD:EE:FF）'
    }
  ],
  alias: [
    { required: true, message: '请输入名称' }
  ],
  tag_id: [
    { required: true, message: '请选择Tag' }
  ],
  local_ipv6: localIsGateway.value ? [
    { required: true, message: '请输入IPv6地址' },
    { validator: validateLocalIPv6 }
  ] : []
}));

watch(() => props.dialogState, (newVal) => {
  console.log(newVal);
  if (newVal.visible && newVal.form) {
    localForm.value = { ...newVal.form };
    localIsGateway.value = newVal._is_gateway;
    // 重要：清除所有验证状态
    setTimeout(() => {
      formRef.value?.clearValidate();
    }, 0);
  }
}, { deep: true, immediate: true });

async function submit() {
  // 先验证表单
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
  } catch (error) {
    console.log('验证失败:', error);
    return;
  }

  const endpoint = localIsGateway.value ? gatewayApi : deviceApi;

  try {
    if (props.dialogState.isEdit) {
      await endpoint.update(localForm.value.mac, localForm.value);
    } else {
      await endpoint.create(localForm.value);
    }
    props.handleClose();
    await fetchData();
  } catch (error) {
    console.error("提交失败:", error);
  }
}

async function del() {
  const endpoint = localIsGateway.value ? gatewayApi : deviceApi;
  await endpoint.delete(localForm.value.mac);
  props.handleClose();
  await fetchData();
}
</script>

<template>
  <el-dialog
      :model-value="dialogState.visible"
      @update:model-value="handleClose"
      :title="dialogState.title"
      width="500px"
  >
    <el-form
        ref="formRef"
        :model="localForm"
        :rules="rules"
        label-width="80px"
    >
      <el-form-item
          v-if="localIsGateway && 'local_ipv6' in localForm"
          label="IPv6"
          prop="local_ipv6"
      >
        <el-input v-model="localForm.local_ipv6" />
      </el-form-item>

      <el-form-item label="MAC" prop="mac">
        <el-input v-model="localForm.mac" :disabled="dialogState.isEdit" />
      </el-form-item>

      <el-form-item label="名称" prop="alias">
        <el-input v-model="localForm.alias" />
      </el-form-item>

      <el-form-item label="Tag" prop="tag_id">
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
      <el-popconfirm
          class="box-item"
          title="确定要删除吗？"
          placement="top-start"
          @confirm="del"
          v-if="dialogState.isEdit"
      >
        <template #reference>
          <el-button type="danger" style="float: left">删除</el-button>
        </template>
      </el-popconfirm>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </template>
  </el-dialog>
</template>
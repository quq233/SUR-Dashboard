<script setup lang="ts">
import { ref, watch } from "vue";
import {useDevices } from "../shared.ts";
import {tagApi} from "../api.ts";
import type {TagDialogState} from "../shared.ts";

const props = defineProps<{
  dialogState: TagDialogState,
  handleClose: () => void,
}>();

const { fetchData } = useDevices();

// 1. 本地表单状态：用于存储当前编辑的内容，避免直接修改 Props
const localForm = ref<any>({});

// 2. 深度监听 Props 变化：当父组件打开对话框或切换数据时，同步到本地
watch(() => props.dialogState, (newVal) => {
  if (newVal.visible && newVal.form) {
    // 浅拷贝表单数据，防止直接污染父组件
    localForm.value = { ...newVal.form };
  }
}, { deep: true, immediate: true });

async function submit() {
  const endpoint = tagApi
  //console.log({...localForm.value})
  try {
    if (props.dialogState.isEdit) {
      await endpoint.update(localForm.value.tag_id, localForm.value);
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

  await tagApi.delete(localForm.value.tag_id);
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

      <el-form-item label="名称">
        <el-input v-model="localForm.alias" />
      </el-form-item>

      <el-form-item label="Tag ID">
        <el-input v-model.number="localForm.tag_id" :disabled="dialogState.isEdit" />
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
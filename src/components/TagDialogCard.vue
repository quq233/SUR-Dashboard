<script setup lang="ts">
import { ref, watch } from "vue";
import { useDevices } from "../shared.ts";
import { tagApi } from "../api.ts";
import type { TagDialogState } from "../shared.ts";
import { Plus, Delete } from '@element-plus/icons-vue';

const props = defineProps<{
  dialogState: TagDialogState,
  handleClose: () => void,
}>();

const { fetchData } = useDevices();

// 本地表单状态
const localForm = ref<any>({});

// 监听 Props 变化
watch(() => props.dialogState, (newVal) => {
  if (newVal.visible && newVal.form) {
    localForm.value = {
      ...newVal.form,
      dns: [...(newVal.form.dns || [])] // 深拷贝 DNS 数组
    };
  }
}, { deep: true, immediate: true });

// 添加 DNS 服务器
function addDns() {
  if (!localForm.value.dns) {
    localForm.value.dns = [];
  }
  localForm.value.dns.push('');
}

// 删除 DNS 服务器
function removeDns(index: number) {
  localForm.value.dns.splice(index, 1);
}

async function submit() {
  try {
    // 过滤空的 DNS 条目
    const formData = {
      ...localForm.value,
      dns: localForm.value.dns.filter((d: string) => d.trim() !== '')
    };

    if (props.dialogState.isEdit) {
      await tagApi.update(formData.tag_id, formData);
    } else {
      await tagApi.create(formData);
    }
    props.handleClose();
    await fetchData();
  } catch (error) {
    console.error("提交失败:", error);
  }
}

async function del() {
  await tagApi.delete(localForm.value.tag_id);
  props.handleClose();
  await fetchData();
}
</script>

<template>
  <el-dialog
      :model-value="dialogState.visible"
      @update:model-value="handleClose"
      :title="dialogState.title"
      width="600px"
  >
    <el-form :model="localForm" label-width="100px">
      <el-form-item label="Tag ID">
        <el-input v-model.number="localForm.tag_id" :disabled="dialogState.isEdit" />
      </el-form-item>

      <el-form-item label="名称">
        <el-input v-model="localForm.alias" placeholder="请输入标签名称" />
      </el-form-item>

      <!-- DNS 服务器列表 -->
      <el-form-item label="DNS 服务器">
        <div style="width: 100%;">
          <div
              v-for="(_, index) in localForm.dns"
              :key="index"
              style="display: flex; margin-bottom: 10px; align-items: center;"
          >
            <el-input
                v-model="localForm.dns[index as number]"
                placeholder="例如: 2400:3200::1"
                style="flex: 1;"
            >
              <template #prepend>DNS {{ index + 1 }}</template>
            </el-input>
            <el-button
                :icon="Delete"
                type="danger"
                @click="removeDns(index as number)"
                style="margin-left: 10px;"
                circle
            />
          </div>

          <el-button
              :icon="Plus"
              @click="addDns"
              style="width: 100%;"
              type="primary"
              plain
          >
            添加 DNS 服务器
          </el-button>

          <el-text type="info" size="small" style="margin-top: 10px; display: block;">
            提示：支持 IPv6 地址，例如 2400:3200::1
          </el-text>
        </div>
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

<style scoped>
/* 可选：添加一些样式 */
</style>
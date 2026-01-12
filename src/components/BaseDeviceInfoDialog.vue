<script setup lang="ts">
import {useDevices} from "../shared.ts";


const {tags } = useDevices();

defineProps<{
  showDialog: boolean,
  title: string,
  form: any,
  handleCancel: () => void,
  handleSubmit: () => void,
  isEdit: boolean,
}>();
const formLabelWidth = '140px'

</script>

<template>
  <el-dialog :modelValue="showDialog" :title="title" width="500">
    <el-form :model="form">
      <el-form-item
          v-if="'local_ipv6' in form"
          label="IPv6"
          :label-width="formLabelWidth"
      >
        <el-input v-model="form.local_ipv6" autocomplete="off" />
      </el-form-item>

      <el-form-item label="mac" :label-width="formLabelWidth">
        <el-input v-model="form.mac" autocomplete="off" />
      </el-form-item>
      <el-form-item label="tag" :label-width="formLabelWidth">
        <el-select v-model="form.tag_id" placeholder="选择tag">
          <el-option v-for="tag in tags" :label="tag.alias" :value="tag.tag_id"/>
        </el-select>
      </el-form-item>

      <el-form-item
          v-if="'is_gateway' in form"
          label="角色"
          :label-width="formLabelWidth"
      >
        <el-select v-model="form.is_gateway" placeholder="选择角色">
          <el-option label="设备" value="0"/>
          <el-option label="网关" value="1"/>
        </el-select>
      </el-form-item>

      <slot name="extra-columns"></slot>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>
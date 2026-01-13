<template>
  <el-card shadow="never" class="table-card">
    <template #header>
      <div class="card-header">
        <span class="title">{{ title }}</span>
        <div>
          <slot name="actions"></slot>
          <el-button type="primary" :icon="Refresh" :loading="loading" @click="$emit('refresh')">
            刷新
          </el-button>
        </div>

      </div>
    </template>

    <el-table :data="data" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="local_ipv6" label="IPv6 地址">
        <template #default="scope">
          <code class="ipv6-text">{{ scope.row.local_ipv6 || "-" }}</code>
        </template>
      </el-table-column>

      <el-table-column prop="mac" label="MAC 地址">
        <template #default="scope">
          <code class="mac-highlight">{{ scope.row.mac }}</code>
        </template>
      </el-table-column>

      <slot name="extra-columns"></slot>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import type {Device, Gateway, ipv6Neighbor} from "../api.ts";
defineProps<{
  title: string,
  data: (Device | Gateway | ipv6Neighbor)[],
  loading: boolean
}>();
defineEmits(['refresh'])

</script>

<style scoped>
.table-card { margin-bottom: 20px; border-radius: 8px; border: none; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 18px; font-weight: 600; color: #303133; }
.ipv6-text { color: #409EFF; background: #ecf5ff; padding: 2px 6px; border-radius: 4px; }
</style>
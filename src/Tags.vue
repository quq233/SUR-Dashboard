<script setup lang="ts">
import {Refresh} from "@element-plus/icons-vue";
import {type Tag} from "./api.ts";
import {onMounted, type Ref, ref} from "vue";

import {get_tags} from "./api.ts";
const tags: Ref<Tag[]> = ref([])

const fetchData = async () => {
  tags.value=await get_tags()
}
onMounted(() => {
  fetchData()
})

function editTagByID(tag_id: number) {
  const found = tags.value.find(tag => tag.tag_id === tag_id)
  if (found){

  }
}
</script>

<template>
  <el-card shadow="never" class="table-card">
    <template #header>
      <div class="card-header">
        <span class="title">标签管理</span>
        <slot name="actions">
          <el-button type="primary" :icon="Refresh" @click="$emit('refresh')">
            刷新
          </el-button>
        </slot>
      </div>
    </template>

    <el-table :data="tags"  stripe style="width: 100%">
      <el-table-column prop="local_ipv6" label="ID">
        <template #default="scope">
          <code class="ipv6-text">{{ scope.row.tag_id }}</code>
        </template>
      </el-table-column>

      <el-table-column prop="mac" label="名称">
        <template #default="scope">
          <code class="mac-highlight">{{ scope.row.alias }}</code>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <el-button @click="editTagByID(scope.row.tag_id)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>

</style>
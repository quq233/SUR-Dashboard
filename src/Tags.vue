<script setup lang="ts">
import {Refresh} from "@element-plus/icons-vue";
import {type TagDialogState, useDevices} from "./shared.ts";
import TagDialogCard from "./components/TagDialogCard.vue";
import {type Ref, ref} from "vue";

const { tags } = useDevices();

const tagDialogState: Ref<TagDialogState> = ref({
  visible: false,
  isEdit: false,
  title: "",
  form: undefined
})

function editTagByID(tag_id: number) {
  const found = tags.value.find(tag => tag.tag_id === tag_id)
  if (found){
    tagDialogState.value={
      visible: true,
      isEdit: true,
      title: "编辑",
      form: {
        tag_id: found.tag_id,
        alias: found.alias,
        dns: [...found.dns], // 深拷贝数组
      }
    }
  }
}

function addTag() {
  tagDialogState.value={
    visible: true,
    isEdit: false,
    title: "添加tag",
    form: {
      tag_id: 0,
      alias: "",
      dns: ["2400:3200::1"], // 默认 DNS
    }
  }
}
</script>

<template>
  <TagDialogCard
      :handleClose="()=>{
        tagDialogState.visible = false
      }"
      :dialogState="tagDialogState"
  />
  <el-card shadow="never" class="table-card">
    <template #header>
      <div class="card-header">
        <span class="title">标签管理</span>
        <slot name="actions">
          <el-button type="primary" :icon="Refresh" @click="addTag">
            添加
          </el-button>
          <el-button type="primary" :icon="Refresh" @click="$emit('refresh')">
            刷新
          </el-button>
        </slot>
      </div>
    </template>

    <el-table :data="tags" stripe style="width: 100%">
      <el-table-column prop="tag_id" label="ID" width="80">
        <template #default="scope">
          <code class="ipv6-text">{{ scope.row.tag_id }}</code>
        </template>
      </el-table-column>

      <el-table-column prop="alias" label="名称" width="150">
        <template #default="scope">
          <span>{{ scope.row.alias }}</span>
        </template>
      </el-table-column>

      <!-- 新增 DNS 列 -->
      <el-table-column prop="dns" label="DNS 服务器" min-width="200">
        <template #default="scope">
          <el-tag
              v-for="(dns, index) in scope.row.dns"
              :key="index"
              size="default"
              style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ dns }}
          </el-tag>
          <span v-if="!scope.row.dns || scope.row.dns.length === 0" style="color: #999;">
            未设置
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="120">
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
.ipv6-text {
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>
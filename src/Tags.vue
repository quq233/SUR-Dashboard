<script setup lang="ts">
import {Refresh} from "@element-plus/icons-vue";
import {type TagDialogState, useDevices} from "./shared.ts";
import TagDialogCard from "./components/TagDialogCard.vue";
import {type Ref, ref} from "vue";

const { tags } = useDevices();

const tagDialogState: Ref<TagDialogState> = ref({
  visible: false,isEdit: false,title: "",form: undefined
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
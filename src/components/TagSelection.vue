<script setup lang="ts">
import {useDevices} from "../shared.ts";
import {ref, watch, watchEffect} from "vue";

const {tags} = useDevices()
const props = defineProps<{
  tag_id: string,
  onTagSelected: (tag_id: string) => void,
}>()

const currentTagId = ref<string>(props.tag_id)
watch(currentTagId, (newValue) => {
  props.onTagSelected(newValue);
});
</script>

<template>
  <el-form-item label="tag">
    <el-select v-model="currentTagId" placeholder="选择tag">
      <el-option v-for="tag in tags" :label="tag.alias" :value="tag.tag_id"/>
    </el-select>
  </el-form-item>
</template>

<style scoped>

</style>
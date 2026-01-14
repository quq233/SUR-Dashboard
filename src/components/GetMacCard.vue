<script setup lang="ts">

import {DocumentCopy} from "@element-plus/icons-vue";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {getMacFromIPv4} from "../api.ts";
const inputIpv4 = ref("")
const detectedMac = ref("")
const probing = ref(false)
const hasProbed = ref(false) // 记录是否点击过探测

async function getMac() {
  if (!inputIpv4.value) return ElMessage.warning('请输入 IP 地址')

  probing.value = true
  try {
    const res = await getMacFromIPv4(inputIpv4.value)
    detectedMac.value = res || ""
    hasProbed.value = true
    if (res) {
      ElMessage.success('探测成功')
    } else {
      ElMessage.info('未找到 Mac 地址')
    }
  } catch (error) {
    ElMessage.error('探测失败')
  } finally {
    probing.value = false
  }
}

// 复制功能
const copyMac = (text: string) => {
  navigator.clipboard.writeText(text)
  ElMessage.success('已复制到剪贴板')
}
</script>

<template>
  <el-card shadow="never" class="table-card">
    <template #header>
      <div class="card-header">
        <div>
          <span class="title">获取设备的 Mac </span>
          <span style="font-size: 12px; color: var(--el-text-color-secondary);">（请确保设备已唤醒）</span>
        </div>
      </div>
    </template>

    <div style="display: flex; flex-direction: column; gap: 16px;">
      <el-input
          v-model="inputIpv4"
          placeholder="请输入 IPv4 地址 (例如 192.168.1.1)"
          clearable
          style="max-width: 400px;"
      >
        <template #append>
          <el-button @click="getMac" :loading="probing">探测</el-button>
        </template>
      </el-input>

      <div v-if="detectedMac" style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 14px; color: var(--el-text-color-regular);">探测到的 Mac:</span>
        <el-tag type="success" effect="plain" size="large" style="font-family: monospace; font-size: 14px;">
          {{ detectedMac }}
        </el-tag>
        <el-button
            link
            type="primary"
            :icon="DocumentCopy"
            @click="copyMac(detectedMac)"
        >
          复制
        </el-button>
      </div>

      <el-text v-else-if="hasProbed" type="info" size="small">
        未探测到该 IP 对应的 Mac 地址
      </el-text>
    </div>
  </el-card>
</template>

<style scoped>
.title { font-size: 18px; font-weight: 600; color: #303133; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
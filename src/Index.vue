<template>
  <el-card shadow="never" class="table-card">
    <template #header>
      <div class="card-header">
        <span style="font-weight: bold; margin-right: 8px;">欢迎使用SUR Dashboard</span>
      </div>
    </template>

    <!-- Daemon 控制面板 -->
    <el-card shadow="hover" style="margin-bottom: 20px;">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-weight: bold;">📡 广播任务控制</span>
          <el-tag :type="broadcastStatus.running ? 'success' : 'info'" size="small">
            {{ broadcastStatus.running ? '运行中' : '已暂停' }}
          </el-tag>
        </div>
      </template>

      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- 状态信息 -->
        <div class="status-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="任务状态">
              <el-tag :type="broadcastStatus.running ? 'success' : 'info'">
                {{ broadcastStatus.running ? '运行中' : '已暂停' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="下次运行时间">
              {{ formatNextRunTime(broadcastStatus.next_run_time) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 控制按钮 -->
        <div class="control-buttons" style="display: flex; gap: 12px;">
          <el-button
              type="success"
              :icon="VideoPlay"
              :disabled="broadcastStatus.running"
              :loading="loading"
              @click="handleStart"
          >
            启动任务
          </el-button>

          <el-button
              type="warning"
              :icon="VideoPause"
              :disabled="!broadcastStatus.running"
              :loading="loading"
              @click="handleStop"
          >
            暂停任务
          </el-button>

          <el-button
              type="primary"
              :icon="Pointer"
              :disabled="!broadcastStatus.running"
              :loading="loading"
              @click="handleTriggerNow"
          >
            立即执行
          </el-button>

          <el-button
              :icon="Refresh"
              :loading="loading"
              @click="refreshStatus"
          >
            刷新状态
          </el-button>
        </div>
      </div>
    </el-card>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { VideoPlay, VideoPause, Pointer, Refresh } from '@element-plus/icons-vue';
import {broadcastApi} from "./api.ts";


interface BroadcastStatus {
  running: boolean;
  next_run_time: string | null;
}

const broadcastStatus = ref<BroadcastStatus>({
  running: false,
  next_run_time: null,
});

const loading = ref(false);
let statusInterval: number | null = null;

// 格式化下次运行时间
const formatNextRunTime = (time: string | null) => {
  if (!time) return '无';
  try {
    const date = new Date(time);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (e) {
    return time;
  }
};

// 获取任务状态
const refreshStatus = async () => {
  try {
    loading.value = true;
    const { data } = await broadcastApi.getStatus();
    broadcastStatus.value = data;
  } catch (error) {
    ElMessage.error('获取状态失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 启动任务
const handleStart = async () => {
  try {
    loading.value = true;
    await broadcastApi.start();
    ElMessage.success('任务已启动');
    await refreshStatus();
  } catch (error) {
    ElMessage.error('启动失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 停止任务
const handleStop = async () => {
  try {
    loading.value = true;
    await broadcastApi.stop();
    ElMessage.warning('任务已暂停');
    await refreshStatus();
  } catch (error) {
    ElMessage.error('暂停失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 立即触发
const handleTriggerNow = async () => {
  try {
    loading.value = true;
    await broadcastApi.triggerNow();
    ElMessage.success('任务已触发，即将执行');
    await refreshStatus();
  } catch (error) {
    ElMessage.error('触发失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 自动刷新状态
onMounted(() => {
  refreshStatus();
  // 每5秒自动刷新一次状态
  statusInterval = window.setInterval(refreshStatus, 5000);
});

onUnmounted(() => {
  if (statusInterval) {
    clearInterval(statusInterval);
  }
});
</script>

<style scoped>
.table-card {
  margin: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-info {
  margin-bottom: 8px;
}

.control-buttons {
  display: flex;
  flex-wrap: wrap;
}
</style>
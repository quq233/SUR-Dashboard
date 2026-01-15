<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { auth } from "./shared.ts";

const router = useRouter();
const token = ref('');
const loading = ref(false); // 已在逻辑中启用状态

const handleLogin = async () => {
  if (!token.value.trim()) {
    ElMessage.warning('请输入 Token');
    return;
  }

  loading.value = true;
  try {
    const result = await auth(token.value);
    if (result.success) {
      ElMessage.success('欢迎回来');
      await router.push('/');
    } else {
      ElMessage.error(result.message || '验证失败');
    }
  } catch (error) {
    ElMessage.error('网络请求异常');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-wrapper">
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>

    <el-card class="login-card" shadow="always">
      <div class="card-content">
        <header class="login-header">
          <h2 class="title">SUR-Dashboard</h2>
          <p class="subtitle">请验证您的访问权限</p>
        </header>

        <el-form @submit.prevent="handleLogin" label-position="top">
          <el-form-item label="安全令牌 (Token)">
            <el-input
                v-model="token"
                type="password"
                placeholder="请输入您的 Token"
                show-password
                clearable
                class="custom-input"
                @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button
                type="primary"
                :loading="loading"
                class="login-button"
                @click="handleLogin"
            >
              {{ loading ? '验证中...' : '进入控制台' }}
            </el-button>
          </el-form-item>
        </el-form>

        <footer class="login-footer">
          <small>quq233/SUR-Dashboard</small>
        </footer>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
/* 容器：渐变背景 + 居中 */
.login-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #f0f2f5;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

/* 背景装饰圆点 */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}
.circle-1 { width: 300px; height: 300px; top: -50px; left: -50px; }
.circle-2 { width: 200px; height: 200px; bottom: -20px; right: -20px; }

/* 登录卡片：磨砂玻璃效果 */
.login-card {
  position: relative;
  z-index: 1;
  width: 420px;
  border: none;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s ease-out;
}

/* 头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: #2d3436;
  letter-spacing: 1px;
}

.subtitle {
  margin-top: 8px;
  color: #636e72;
  font-size: 14px;
}



/* 按钮样式优化 */
.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(to right, #667eea, #764ba2);
  border: none;
  transition: transform 0.2s, opacity 0.2s;
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.login-button:active {
  transform: translateY(0);
}

/* 页脚 */
.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #b2bec3;
}

/* 入场动画 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 适配移动端 */
@media (max-width: 480px) {
  .login-card {
    width: 90%;
  }
}
</style>
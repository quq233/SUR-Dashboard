<script setup lang="ts">
import { ref } from 'vue'
import {useRouter} from "vue-router";
const router = useRouter()

interface Page{
  title: string
  path: string
}
const pages : Page[] = [
  {title: "发现", path: "/scan"},
  /*{title: "设备管理", path: "/device"},
  {title: "网关管理", path: "/gateway"},*/
  {title: "标签管理", path: "/tag"},
]
const activeIndex = ref(pages[0]?.path)
const handleSelect = (key: string) => {
  //console.log(key, keyPath)
  router.push(key)
}
</script>

<template>
    <el-container class="app-container">
      <el-header>
        <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            :ellipsis="false"
            @select="handleSelect"
        >

          <el-menu-item v-for="page in pages" :index="page.path">
            {{ page.title }}
          </el-menu-item>
        </el-menu>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>

    </el-container>
</template>

<style scoped>
/* 让容器撑满页面高度 */
.app-container {
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column; /* 纵向排列 header 和 main */
}

/* 确保 el-main 能够独立滚动（如果内容很多） */
.el-main {
  padding: 20px;
  overflow-y: auto;
  flex: 1; /* 自动撑开剩余空间 */
}
</style>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useRouter} from "vue-router";
const router = useRouter()

interface Page{
  title: string
  path: string
}
const pages : Page[] = [
  {title: '首页', path:'/'},
  {title: "设备&网关管理", path: "/scan"},
  {title: "标签管理", path: "/tag"},
]
const activeIndex = ref(pages[0]?.path)
const handleSelect = (key: string) => {
  //console.log(key, keyPath)
  router.push(key)
}

import {authed, deauth, useDevices} from "./shared.ts";
import Login from "./Login.vue";

const { fetchData} = useDevices();

onMounted(() => {
  fetchData()
})
</script>

<template>
    <el-container v-if="authed" class="app-container">
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
          <el-menu-item @click="deauth()">
            登出
          </el-menu-item>
        </el-menu>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>

    </el-container>
    <Login v-else/>
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
</style>

<template>
  <header class="header" :class="{ 'header-fixed': isScrolled }" ref="headerRef">
    <div class="header-content container">
      <div class="logo">
        <span>DocToQuiz</span>
      </div>

      <!-- 桌面端导航 -->
      <nav class="desktop-nav" v-if="!isMobile">
        <div class="user-info" v-if="!isLoggedIn">
          <span class="username">{{ props.username }}</span>
          <img class="avatar" :src="props.avatar" alt="用户头像" />
        </div>
        <div class="auth-buttons">
          <el-button type="" @click="login">登录</el-button>
          <el-button type="primary" @click="register">注册</el-button>
        </div>
      </nav>

      <!-- 移动端菜单按钮 -->
      <ShrinkButton style="width: 16px;height: 16px;" v-else type="primary" icon="Menu" @click="drawerVisible = true">
      </ShrinkButton>
    </div>

    <!-- 移动端抽屉菜单 -->
    <el-drawer title="用户菜单" v-model="drawerVisible" direction="rtl" size="100%">
      <template #default>
        <div class="mobile-user-info" v-if="isLoggedIn">
          <img class="avatar" :src="props.avatar" alt="用户头像" />
          <span class="username">{{ props.username }}</span>
        </div>
        <div class="mobile-auth-buttons" v-else>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="" @click="register">注册</el-button>
        </div>
      </template>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, } from 'vue';

const props = withDefaults(defineProps<{
  username: string,
  avatar: string
}>(), {
    username: "访客",
    avatar: `@/../public/${Math.ceil(Math.random() * 10) % 4 + 140}.webp`
});


// 组件状态
const headerRef = ref<HTMLElement | null>(null);
const isScrolled = ref(false);
const drawerVisible = ref(false);
const isMobile = ref(false);

// 用户状态
const isLoggedIn = ref(false);


// 响应式处理
const handleResize = () => {
    isMobile.value = window.innerWidth < 768;
};

// 滚动处理
const handleScroll = () => {
    if (headerRef.value) {
        isScrolled.value = window.scrollY > 10;
    }
};

// 生命周期钩子
onMounted(() => {
    handleResize();
    handleScroll();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
});

// 登录注册方法
const login = () => {
    // console.log('登录');
    //   drawerVisible.value = false;
};

const register = () => {
    // console.log('注册');
    //   drawerVisible.value = false;
};
</script>

<style scoped lang="scss">
.header {
  background-color: white;

  transition: all 0.3s ease;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 10px;

  &-fixed {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e2e2e3;
  }
}

.container {
  width: 100%;
  // margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 16px;
  font-weight: 600;
  color: #3C3C43;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;

  .username {
    font-size: 16px;
    color: #333;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.auth-buttons {
  display: flex;
  gap: 10px;
}

.mobile-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .username {
    font-size: 18px;
    color: #333;
  }
}

.mobile-auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}
</style>
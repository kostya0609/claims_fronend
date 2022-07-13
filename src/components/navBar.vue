<template>
  <div>
    <el-menu
        :default-active="activeIndex"
        mode="horizontal"
        :router=true
    >
      <el-menu-item v-for="(item,key) in menu" :index="item.path" :key="key">{{item.text}}</el-menu-item>
      <el-menu-item v-if="activeIndex=='/nrt_claims/list' && userRole" class="menu-right-element" index="/nrt_claims/list/add">
        <el-button
          class="menu-right-element-button"
          @click="claimId = null"
        >
          Добавить прензию
        </el-button>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {ref, reactive, watchEffect, inject} from 'vue';
import {useRoute} from 'vue-router'

export default {
  name: "navBar",
  setup(){
    const claimId     = inject('claimId')
    const userRole    = inject('userRole')
    const route       = useRoute()
    const menu        = reactive([
        {path : '/nrt_claims/list',   text : 'Претензии НРТ'},
        {path : '/nrt_claims/report', text : 'Отчет'},
    ]);
    const activeIndex = ref('/nrt_claims/list')

    userRole.value === 'admin' ? menu.push({path : '/nrt_claims/admin',  text : 'Управление доступом'}) : '';

    watchEffect(() => {
      activeIndex.value = route.path
    })

    return {menu, activeIndex, claimId, userRole}
  },



}
</script>

<style scoped>

</style>
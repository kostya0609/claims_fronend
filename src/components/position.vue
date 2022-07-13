<template>
  <div class="body-wrapper">
    <el-row>
      <el-col :span="20">
      </el-col>
      <el-col :span="4">
        <el-button
            @click="addPosition"
            class="claim-save-element-button"
            v-if="isVisible"
        >
          Добавить позицию
        </el-button>
      </el-col>
    </el-row>
    <el-row v-if="value.length > 0">
      <el-col :span="4">
        <label>Причина претензии</label>
      </el-col>
      <el-col :span="3">
        <label>Артикул</label>
      </el-col>
      <el-col :span="3">
        <label>Код</label>
      </el-col>
      <el-col :span="7">
        <label>Наименование</label>
      </el-col>
      <el-col :span="3">
        <label>Количество</label>
      </el-col>
      <el-col :span="3">
        <label>Сумма претензии</label>
      </el-col>
      <el-col :span="1">
        <label><br/></label>
      </el-col>
    </el-row>
    <Element v-for="(el, index) in value" :key="index" v-model:value="value[index]" :index="index" @deletePosition="deletePosition"/>
    <el-row>
      <el-col :span="4">
      </el-col>
      <el-col :span="3">

      </el-col>
      <el-col :span="3">

      </el-col>
      <el-col :span="7">

      </el-col>
      <el-col :span="3" align="center">
        <label>{{totalQuantity}}</label>
      </el-col>
      <el-col :span="3" align="center">
        <label>{{totalSum}}</label>
      </el-col>
      <el-col :span="1">
        <label><br/></label>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Element from './element'
import {computed, inject, ref} from "vue";
export default {
  name  : "position",
  props : ['value'],
  emits : ['deletePosition', 'addPosition'],
  components: {
    Element,
  },
  setup(props, context){
    const userRole    = inject('userRole');
    const claimStatus = inject('claimStatus');

    const totalQuantity = computed(() => {
      let kol = null;
      props.value.forEach(el => {
        kol += Number(el.quantity)
      })
      return kol
    })

    const totalSum = computed(() => {
      let kol = null;
      props.value.forEach(el => {
        kol += Number(el.sum)
      })
      return kol ? kol.toFixed(2) : null
    })

    function addPosition(){
      context.emit('addPosition')
    };
    function deletePosition(index){
      context.emit('deletePosition', index)
    };

    const isVisible = computed(() => {
      let visible = false;
      if (userRole.value === 'admin' || (userRole.value === 'editor' && claimStatus.value !== 'completed')) visible = true
      return visible
    });
    return{addPosition, deletePosition, isVisible, totalQuantity, totalSum}
  },
}

</script>

<style scoped>

</style>
<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-select
            v-model="value.reason_claim"
            :class="value.errors.reason_claim ? 'invalid' : ''"
            style="width: 100%"
            placeholder="Установить"
            :disabled="isDisable"
        >
          <el-option
              v-for="item in reasonList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <small v-if="value.errors.reason_claim">{{ value.errors.reason_claim}}</small>
      </el-col>
      <el-col :span="3">
        <el-input
            :class="value.errors.article ? 'invalid' : ''"
            v-model="value.article"
            placeholder="Артикул"
            :disabled="isDisable"
        >
          <small v-if="value.errors.article">{{ value.errors.article}}</small>
        </el-input>
      </el-col>
      <el-col :span="3">
        <el-input
            :class="value.errors.code ? 'invalid' : ''"
            v-model="value.code"
            placeholder="Код"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="value.errors.code">{{ value.errors.code}}</small>
      </el-col>
      <el-col :span="7">
        <el-input
            :class="value.errors.name ? 'invalid' : ''"
            v-model="value.name"
            placeholder="Наименование"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="value.errors.name">{{ value.errors.name}}</small>
      </el-col>
      <el-col :span="3">
        <el-input
            :class="value.errors.quantity ? 'invalid' : ''"
            v-model="value.quantity"
            type="number"
            min="0"
            placeholder="Количество"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="value.errors.quantity">{{ value.errors.quantity}}</small>
      </el-col>
      <el-col :span="3">
        <el-input
            :class="value.errors.sum ? 'invalid' : ''"
            v-model="value.sum"
            type="number"
            min="0"
            placeholder="Сумма"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="value.errors.sum">{{ value.errors.sum}}</small>
      </el-col>
      <el-col :span="1">
        <el-button
            @click="deletePosition"
            v-if="!isDisable"
        >
          X
        </el-button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import {computed, inject, reactive, watchEffect} from 'vue'
export default {
  name: "element",
  props :['value', 'index'],
  emits :['deletePosition'],
  setup(props, context){
    const userRole    = inject('userRole');
    const claimStatus = inject('claimStatus');


    const reasonList   = reactive([
      {value : 'defective', label : 'Брак'},
      {value : 'shortage',  label : 'Недостача'},
      {value : 'surplus',   label : 'Излишки'}
    ]);
    function deletePosition(){
      context.emit('deletePosition', props.index)
    }

    const isDisable = computed(() => {
      let disable = true;
      if (userRole.value === 'admin' || (userRole.value === 'editor' && claimStatus.value !== 'completed')) disable = false
      return disable
    })

    watchEffect(() => {
      props.value.reason_claim ? props.value.errors.reason_claim = null : '';
      props.value.article      ? props.value.errors.article = null : '';
      props.value.code         ? props.value.errors.code = null : '';
      props.value.name         ? props.value.errors.name = null : '';
      props.value.quantity     ? props.value.errors.quantity = null : '';
      props.value.sum          ? props.value.errors.sum = null : '';
    })

    return{reasonList, deletePosition, isDisable}
  },
}
</script>

<style scoped>

</style>
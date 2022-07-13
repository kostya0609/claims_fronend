<template>
  <div class="body-wrapper">
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Дата внесения в журнал</label>
        <el-date-picker
            v-model="value.date_created"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="userRole!=='admin'"
        >
        </el-date-picker>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Дата продажи товара</label>
        <el-date-picker
            v-model="value.date_selling"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Статус претензии</label>
        <el-select
            v-model="value.status"
            style="width: 100%"
            placeholder="Установить"
            :disabled="isDisable">
          <el-option
              v-for="item in value.statusesList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
      </el-select>
      </el-col>
      <el-col :span="1">

      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Ссылка на ЭСЗ/П в СЭД </label>
        <el-input
          v-model="value.link_ESZ"
          :class="errors.link_ESZ ? 'invalid' : ''"
          placeholder="Вставьте ссылку"
          :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.link_ESZ">{{errors.link_ESZ}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Вид претензии</label>
        <el-select
            v-model="value.type"
            :class="errors.type ? 'invalid' : ''"
            style="width: 100%"
            placeholder="Установить"
            :disabled="isDisable"
        >
          <el-option
              v-for="item in typesList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <small v-if="errors.type">{{errors.type}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"><sup>**</sup>Дата принятия решения по претензии</label>
        <el-date-picker
            v-model="value.date_solution"
            :class="errors.date_solution ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.date_solution">{{errors.date_solution}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Подразделение</label>
        <el-select
            v-model="value.department"
            :class="errors.department ? 'invalid' : ''"
            filterable
            remote
            reserve-keyword
            :remote-method="searchDepartment"
            style="width: 100%"
            placeholder="Установить"
            :disabled="isDisable"
        >
          <el-option
              v-for="item in value.departmentsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <small v-if="errors.department">{{errors.department}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"><sup>**</sup>Утверждающее решение</label>
        <el-select
            v-model="value.solution_id"
            :class="errors.solution_id ? 'invalid' : ''"
            style="width: 100%"
            placeholder="Установить"
            :disabled="isDisable"
        >
          <el-option
              v-for="item in value.solutionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <small v-if="errors.solution_id">{{errors.solution_id}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Сотрудник</label>
        <el-input
            v-model="value.creator"
            placeholder="ФИО"
            :disabled="isDisable"
        >
        </el-input>
      </el-col>
      <el-col :span="1">

      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Комментарий</label>
        <el-input
            v-model="value.comment"
            type="textarea"
            rows="3"
            placeholder="Введите комментарий"
            :disabled="isDisable"
        ></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Поставщик</label>
         <el-input
            v-model="value.contragent"
            :class="errors.contragent ? 'invalid' : ''"
            placeholder="Введите поставщика"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.contragent">{{errors.contragent}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"><sup>***</sup>Дата закрытия</label>
        <el-date-picker
            v-model="value.date_final"
            :class="errors.date_final ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.date_final">{{errors.date_final}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Кому выставлена претензия</label>
        <el-input
            v-model="value.supplier"
            :class="errors.supplier ? 'invalid' : ''"
            placeholder="Введите кому выставлена претензия"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.supplier">{{errors.supplier}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"><sup>***</sup>Документ, утверждающий решение</label>
        <el-input
            v-model="value.document_solution"
            :class="errors.document_solution ? 'invalid' : ''"
            placeholder="Введите текст"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.document_solution">{{errors.document_solution}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Дата выставления претензии</label>
        <el-date-picker
            v-model="value.date_claim"
            :class="errors.date_claim ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.date_claim">{{errors.date_claim}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Срок для закрытия претензии</label>
        <el-date-picker
            v-model="value.term_closing"
            :class="errors.term_closing ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="userRole!=='admin'"
        >
        </el-date-picker>
        <small v-if="errors.term_closing">{{errors.term_closing}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Срок получения ответа по претензии</label>
        <el-date-picker
            v-model="value.term_answer"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><sup>*</sup>Срок выставления претензии</label>
        <el-date-picker
            v-model="value.term_claim"
            :class="errors.term_claim ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.term_claim">{{errors.term_claim}}</small>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {reactive, inject, computed} from 'vue'
export default {
  name  : "info",
  props : ['value', 'errors'],
  setup(props){
    const loadJson    = inject('loadJson');
    const userRole    = inject('userRole');
    const claimStatus = inject('claimStatus');

    const typesList = reactive([
      {value : 'acceptance', label : 'Приемка'},
      {value : 'return',     label : 'Возврат от покупателя'},
      {value : 'presale',    label : 'Предпродажная подготовка'},
    ]);

    function searchDepartment(query){
      let url = '/claims/search/department';
      if (query !== '')
        search(query,'department', url);
    };

    async function search(query, key, url){
      let result = await loadJson(url, {q: query});
      if (result.status === 'success') {
        if (key === 'department') {
          props.value.departmentsList.length = 0;
          result.data.forEach(el => props.value.departmentsList.push(el));
        };
      };
    };

    const isDisable = computed(() => {
      let disable = true;
      if (userRole.value === 'admin' || (userRole.value === 'editor' && claimStatus.value !== 'completed')) disable = false
      return disable
    });


    return { typesList, isDisable, userRole, searchDepartment}
  },
}
</script>

<style scoped>

</style>
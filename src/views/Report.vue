<template>
  <div
      class="body-wrapper"
      v-loading = "loading"
      element-loading-text="Загрузка данных..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-row>
    <el-col :span="6">
      <label class="add_claims_label">Дата начала периода</label>
      <el-date-picker
          v-model="dateStart"
          :class="errors.dateStart ? 'invalid' : ''"
          style="width: 100%"
          type="date"
          format="DD.MM.YYYY"
          valueFormat="DD.MM.YYYY"
          placeholder="Выберите дату"
      >
      </el-date-picker>
      <small v-if="errors.dateStart">{{errors.dateStart}}</small>
    </el-col>
    <el-col :span="1">
    </el-col>
    <el-col :span="6">
      <label class="add_claims_label">Дата окончания периода </label>
      <el-date-picker
          v-model="dateFinal"
          :class="errors.dateFinal ? 'invalid' : ''"
          style="width: 100%"
          type="date"
          format="DD.MM.YYYY"
          valueFormat="DD.MM.YYYY"
          placeholder="Выберите дату"
      >
      </el-date-picker>
      <small v-if="errors.dateFinal">{{errors.dateFinal}}</small>
    </el-col>
    <el-col :span="1">
      </el-col>
    <el-col :span="6">
        <label class="add_claims_label">Срок для закрытия претензии</label>
        <el-date-picker
            v-model="term_closing"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
        >
        </el-date-picker>
      </el-col>
  </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Статус претензии</label>
        <el-select
            v-model="status"
            style="width: 100%"
            placeholder="Установить"
        >
          <el-option
              v-for="item in statusesList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Вид претензии</label>
        <el-select
            v-model="type"
            style="width: 100%"
            placeholder="Установить"
        >
          <el-option
              v-for="item in typesList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Утверждающее решение</label>
        <el-select
            v-model="solution_id"
            style="width: 100%"
            placeholder="Установить"
        >
          <el-option
              v-for="item in solutionsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Подразделение</label>
        <el-select
            v-model="department"
            filterable
            remote
            reserve-keyword
            :remote-method="searchDepartment"
            style="width: 100%"
            placeholder="Установить"
        >
          <el-option
              v-for="item in departmentsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Сотрудник</label>
        <el-select
            v-model="user"
            filterable
            remote
            reserve-keyword
            :remote-method="searchUser"
            style="width: 100%"
            placeholder="Установить"
        >
          <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"><br/></label>
        <el-button
            icon="el-icon-download"
            class="claim-save-element-button"
            @click="submit"
        >
          Сформировать отчет
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {ref, reactive, watchEffect, inject} from 'vue'
export default {
  name: "Report",
  setup(){
    const loadJson  = inject('loadJson');
    const notify    = inject('notify');

    const svg             = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
    const loading         = ref(false);

    const dateStart        = ref(null);
    const dateFinal        = ref(null);
    const status           = ref(null);
    const statusesList     = [
      {value : 'created',   label : 'Создана'},
      {value : 'agreement', label : 'Согласование решения'},
      {value : 'execution', label : 'Исполнение решения'},
      {value : 'rework',    label : 'На доработке подразделения'},
    ];
    const department       = ref (null);
    const departmentsList  = reactive([]);
    const type             = ref(null);
    const typesList        = reactive([
      {value : 'acceptance', label : 'Приемка'},
      {value : 'return',     label : 'Возврат от покупателя'},
      {value : 'presale',    label : 'Предпродажная подготовка'},
    ]);
    const solution_id      = ref(null);
    const solutionsList    = reactive([]);
    const term_closing     = ref(null);
    const user             = ref(null);
    const userList         = reactive([]);

    const errors = reactive({
      dateStart : null,
      dateFinal : null,
    });

    function searchDepartment(query){
      let url = '/claims/search/department';
      if (query !== '')
        search(query,'department', url);
    };

    function searchUser(query){
      let url = '/claims/search/user';
      if (query !== '')
        search(query,'user', url);
    };

    async function search(query, key, url){
      let result = await loadJson(url, {q: query});
      if (result.status === 'success') {
        if (key === 'department') {
          departmentsList.length = 0;
          result.data.forEach(el => departmentsList.push(el));
        };
        if (key === 'user') {
          userList.length = 0;
          result.data.forEach(el => userList.push(el));
        };
      };
    };

    async function getData() {
      loading.value = true;
      //ниже получили список Утверждающих решений
      let result = await loadJson('/claims/get-solutions', {});
      if (result.status === 'success') {
        solutionsList.length = 0;
        result.data.forEach(el => solutionsList.push(el));
      }
      loading.value = false;
    };
    getData();

    async function submit(){
        try {
          let result = await loadJson('/claims/report', {
            date_start : dateStart.value, date_final : dateFinal.value,
            status : status.value, department : department.value, type : type.value,
            solution_id : solution_id.value, term_closing : term_closing.value, creator_id : user.value,
          }, '', true); //параметры - url, объкт с данными(id файла), type (если указать 'file' то это для отправки файла и отсылаемые данные уйдут не json-ом а как форма), downLoadRequest - если true то результат не будет преобразован через json )
          let blob      = await result.blob();
          let url       = URL.createObjectURL(blob);
          let link      = document.createElement('a');
          link.href     = url;
          link.download = 'отчет за период с '+dateStart.value + ' по ' + dateFinal.value + '.xlsx';
          link.click();
          URL.revokeObjectURL(link.href);
        }catch(e){
          notify('Ошибка загрузки файла', e.message, e.status)
        }

        // dateStart.value ? '' : errors.dateStart = 'Необходимо указать дату начала периода';
        // dateFinal.value ? '' : errors.dateFinal = 'Необходимо указать дату окончания периода';

    }

    watchEffect(() => {
      dateStart.value ? errors.dateStart = null : '';
      dateFinal.value ? errors.dateFinal = null : '';
    })

    return{
      dateStart, dateFinal, status, statusesList, department, departmentsList,
      type, typesList, solution_id, solutionsList, term_closing, user, userList,
      errors, svg, loading,
      searchDepartment, searchUser, submit
    }
  },
}
</script>

<style scoped>

</style>
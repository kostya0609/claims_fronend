<template>
  <div v-loading = "loading"
       element-loading-text="Загрузка данных..."
       :element-loading-spinner="svg"
       element-loading-svg-view-box="-10, -10, 50, 50"
  >
  <Grid
      :name="name"
      @gridReady="getData"
  />

<!--    <el-button @click="sendDefaultFilterData">-->
<!--      Загрузить дефолтовый фильтр-->
<!--    </el-button>-->

<!--    <el-button @click="addAdmins">-->
<!--      Загрузить дефолтовых админов-->
<!--    </el-button>-->

  </div>
</template>

<script>
import {provide, inject, ref, reactive, computed} from 'vue';
import { useRouter } from 'vue-router';
import initGrid from '@/vdg3/use/initGrid';
import Grid from '@/vdg3/components/grid.n.vue';

import dayjs from "dayjs";

export default {
  name: "List",
  components: {
    Grid
  },
  setup() {
    const domain   = inject('domain');
    const userId   = inject('userId')
    const loadJson = inject('loadJson');
    const notify   = inject('notify');

    const router   = useRouter();
    const claimId  = inject('claimId')
    const name     = ref('claimsList');
    const content  = reactive({
      setting         : true,
      header          : {
        id: {
          name: 'Номер',
          width: 100,
          show: true,
          sort: 100,
          contentSort: 'asc'
        },
        date_created: {
          name: 'Дата внесения в журнал',
          width: 200,
          show: true,
          sort: 200,
          contentSort: 'asc'
        },
        status: {
          name: 'Статус претензии',
          width: 200,
          show: true,
          sort: 300,
          contentSort: 'asc'
        },
        type: {
          name: 'Вид претензии',
          width: 200,
          show: true,
          sort: 400,
          contentSort: 'asc'
        },
        department: {
          name: 'Подразделение',
          width: 300,
          show: true,
          sort: 500,
        },
        creator_id: {
          name: 'Сотрудник',
          width: 300,
          show: true,
          sort: 600,
          contentSort: 'asc'
        },
        contragent: {
          name: 'Поставщик',
          width: 300,
          show: true,
          sort: 700,
          contentSort: 'asc'
        },
        supplier: {
          name: 'Кому выставлена претензия',
          width: 300,
          show: true,
          sort: 800,
          contentSort: 'asc'
        },
        date_claim: {
          name: 'Дата выставления претензии',
          width: 300,
          show: true,
          sort: 900,
          contentSort: 'asc'
        },
        term_closing: {
          name: 'Срок для закрытия претензии',
          width: 300,
          show: true,
          sort: 1000,
          contentSort: 'asc'
        },
        term_answer: {
          name: 'Срок получения ответа по претензии',
          width: 300,
          show: true,
          sort: 1100,
          contentSort: 'asc'
        },
        term_claim: {
          name: 'Срок выставления претензии',
          width: 300,
          show: true,
          sort: 1100,
          contentSort: 'asc'
        },
        date_selling: {
          name: 'Дата продажи',
          width: 300,
          show: true,
          sort: 1200,
          contentSort: 'asc'
        },
        link_ESZ: {
          name: 'Ссылка на ЭСЗ/П в СЭД',
          width: 300,
          show: true,
          sort: 1300,
        },
        date_solution: {
          name: 'Дата принятия решения по претензии',
          width: 300,
          show: true,
          sort: 1400,
          contentSort: 'asc'
        },
        solution_id: {
          name: 'Утверждающее решение',
          width: 300,
          show: true,
          sort: 1500,
          contentSort: 'asc'
        },
        comment: {
          name: 'Комментарий',
          width: 400,
          show: true,
          sort: 1600,
        },
        date_final: {
          name: 'Дата закрытия',
          width: 300,
          show: true,
          sort: 1700,
          contentSort: 'asc'
        },
        document_solution: {
          name: 'Документ, утверждающий решение',
          width: 300,
          show: true,
          sort: 1800,
        },
      },
      context         : [
        {
          text: 'Открыть претензию',
          function: (e, row) => {
            claimId.value = row.row.id[0].value;
            router.push({name:'detail', params: { id: row.row.id[0].value }});
          }
        }
      ],
      pagination      : {
        show: 'full',
        changeSize : function(value){
          getData();
        },
        changePage : function(value){
          getData();
        }
      },
      filter          : {
        profiles: [],
        show: true,
        showProfiles: true,
        filter : function(data){
          let normalFilter = {};
          for (let key in data){
            if ((data[key].type === 'number' || data[key].type === 'date')         && data[key].min)                normalFilter[key] = data[key];
            if ((data[key].type === 'list'   || data[key].type === 'searchList')   && data[key].value.length > 0 )  normalFilter[key] = data[key];
          }
          getData(normalFilter)
        },
        clear : function(data){
          getData(data)
        }
      },
      gridId          : null,
      networkSetting  : {
        domain: '', //домен для модуля грида может отличаться от домена основного приложения. Если домен тут не указать, то примениться домен приложения
        module: 'Claims',
        userId: userId.value,
      },
      loading         : false,
      loadJson        : function (url, data) {
        return fetch(
            content.networkSetting.domain ? content.networkSetting.domain + url : domain.value + url,
            {
              method: 'post',
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
              body: JSON.stringify(data, function (key, val) {
                return (typeof val === 'function') ? '' + val : val;
              })
            }
        ).then(res => {
          return new Promise((resolve, reject) => {
            if (!res.ok)
              throw new Error('Response server - status code ' + res.status);
            else {
              res.json().then(json => {
                resolve(json)
              }).catch(err => {
                reject(err);
              })
            }
          })
        }).catch(err => {
          return new Promise((resolve, reject) => {
            reject({status: 'error', message: 'Некорректный ответ сервера', system: err.message})
          })
        });
      },
      sortContent     : function (sort) {
        getData({}, sort)
      },
    });

    const svg      = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

    const dataGrid = initGrid(content);
    const loading  = computed(() => { return dataGrid.loading })

    provide(name.value, dataGrid);

    async function getData(filter = {}, sort = {}) {
      dataGrid.loading = true;
      //ниже запросили данные для поля решения
      let solutions = await loadJson('/claims/get-solutions', {});
      if (solutions.status === 'success') {
        dataGrid.filter.data.solution_id ? dataGrid.filter.data.solution_id.option = solutions.data : '';
      }

      //ниже запросили элементы для таблицы
      let gridElements = [];
      let result = await loadJson('/claims/list', {
        count  : dataGrid.pagination.defaultSize,
        page   : dataGrid.pagination.page,
        filter : filter,
        sort   : sort.name ? sort : {name : 'id', order : 'asc'} ,
      });
      if (result.status == 'success') {
        gridElements = result.data
        dataGrid.pagination.total = result.total;
      }

      dataGrid.methods.addElements(gridElements);
      dataGrid.loading = false;
    };

    //ниже чтоб на бэк залить дефолтовый фильтр... надо выше раскоментить нужную кнопку
    async function sendDefaultFilterData() {
      //создаст моковый дефолтный фильтр. запустить один раз при разработке, чтоб он записался на бэк
      let defaultFilterData = {
        id: {
          show: true,
          type: 'number',
          name: 'Номер',
          min: '',
          max: '',
          operation: '=',
        },
        date_created: {
          show: true,
          type: 'date',
          name: 'Дата внесения в журнал',
          min: '',
          max: '',
          operation: '=',
        },
        status: {
          show: true,
          type: 'list',
          name: 'Статус претензии',
          multiple: true,
          value: [],
          option: [
            {value: 'created', label: 'Создана'},
            {value: 'agreement', label: 'Согласование решения'},
            {value: 'execution', label: 'Исполнение решения'},
            {value: 'rework', label: 'На доработке подразделения'},
          ],
        },
        type: {
          show: true,
          type: 'list',
          name: 'Вид претензии',
          multiple: true,
          value: [],
          option: [
            {value: 'acceptance', label: 'Приемка'},
            {value: 'return', label: 'Возврат от покупателя'},
            {value: 'presale', label: 'Предпродажная подготовка'},
          ],
        },
        department: {
          show: true,
          type: 'searchList',
          name: 'Подразделение',
          multiple: true,
          value: [],
          option: [],
          query: async function (data) {
            let result = await grid.loadJson('/claims/search/department', {
              q: data,
            });
            if (result.status == 'success') return result.data
          },
        },
        creator_id: {
          show: true,
          type: 'searchList',
          name: 'Сотрудник',
          multiple: true,
          value: [],
          option: [],
          query: async function (data) {
            let result = await grid.loadJson('/claims/search/user', {
              q: data,
            });
            if (result.status == 'success') return result.data
          },
        },
        contragent: {
          show: false,
          type: 'searchList',
          name: 'Поставщик',
          multiple: true,
          value: [],
          option: [],
          query: async function (data) {
            let result = await grid.loadJson('/claims/search/company', {
              q: data,
            });
            if (result.status == 'success') return result.data
          },
        },
        supplier: {
          show: false,
          type: 'searchList',
          name: 'Кому выставлена претензия',
          multiple: true,
          value: [],
          option: [],
          query: async function (data) {
            let result = await grid.loadJson('/claims/search/company', {
              q: data,
            });
            if (result.status == 'success') return result.data
          },
        },
        date_claim: {
          show: false,
          type: 'date',
          name: 'Дата выставления претензии',
          min: '',
          max: '',
          operation: '=',
        },
        term_closing: {
          show: false,
          type: 'date',
          name: 'Срок для закрытия претензии',
          min: '',
          max: '',
          operation: '=',
        },
        term_claim: {
          show: false,
          type: 'date',
          name: 'Срок выставления претензии',
          min: '',
          max: '',
          operation: '=',
        },
        term_answer: {
          show: false,
          type: 'date',
          name: 'Срок получения ответа по претензии',
          min: '',
          max: '',
          operation: '=',
        },
        date_selling: {
          show: false,
          type: 'date',
          name: 'Дата продажи',
          min: '',
          max: '',
          operation: '=',
        },
        date_solution: {
          show: false,
          type: 'date',
          name: 'Дата принятия решения по претензии',
          min: '',
          max: '',
          operation: '=',
        },
        solution_id: {
          show: false,
          type: 'list',
          name: 'Утверждающее решение',
          multiple: true,
          value: [],
          option: [],
        },
        date_final: {
          show: false,
          type: 'date',
          name: 'Документ, утверждающий решение',
          min: '',
          max: '',
          operation: '=',
        },
      };
      let result = await loadJson('/grid/filter/preset/default/add', {
        grid_name: name.value,
        module: dataGrid.networkSetting.module,
        data: {...defaultFilterData},
      });
      notify('Загрузка дефолтового фильтра', result.message, result.status)
    }

    //ниже чтоб на бэк залить дефолтовых админов... надо выше раскоментить нужную кнопку
    async function addAdmins(){
      let result = await loadJson('/claims/add-admins', {});
      notify('Загрузка дефолтовых админов', result.message, result.status)
    };


    return {dataGrid, name, loading, svg, getData, sendDefaultFilterData, addAdmins}
  },
}
</script>

<style scoped>

</style>
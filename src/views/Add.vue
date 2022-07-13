<template>
  <div v-loading = "loading"
       element-loading-text="Загрузка данных..."
       :element-loading-spinner="svg"
       element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <h3>Создание претензии</h3>
    <el-tabs type="border-card" v-model="page">
      <el-tab-pane v-for="(item, key) in menu" :label="item" :name="key" :key="key" disabled>
      </el-tab-pane>
      <Info v-if="page === 'info' && !loading" v-model:value="infoClaim" :errors="errors"/>
      <el-row style="padding: 15px" >
        <el-col :span="6">
          <el-button
              @click="saveClaim"
              class="claim-save-element-button"
          >
            Сохранить
          </el-button>
        </el-col>
      </el-row>
    </el-tabs>
  </div>
</template>

<script>
import {ref, reactive, inject, watchEffect, watch} from "vue";
import { useRouter } from 'vue-router';
import Info from '../components/info'

export default {
  name: "AddClaim",
  components: {
    Info
  },
  setup(){
    const claimId     = inject('claimId');
    const claimStatus = inject('claimStatus');
    const loadJson    = inject('loadJson');
    const userId      = inject('userId');
    const userFIO     = inject('userFIO');
    const notify      = inject('notify');
    const solutions   = inject('solutions')

    const router          = useRouter();
    const page            = ref('info');
    const menu            = reactive({
      info     : 'Претензия',
      document : 'Документы и сканы',
      position : 'Позиции претензии'
    });
    const infoClaim       = reactive({
      date_created      : new Date().toLocaleDateString(),
      date_selling      : null,
      status            : 'created',
      statusesList      : [
        {value : 'created',   label : 'Создана'},
      ],
      link_ESZ          : null,
      type              : null,
      date_solution     : null,
      department        : null,
      departmentsList   : [],
      solution_id       : null,
      solutionsList     : [],
      creator           : null,
      comment           : null,
      contragent        : null,
      date_final        : null,
      supplier          : null,
      document_solution : null,
      date_claim        : '',
      term_closing      : null,
      term_claim        : null,
      term_answer       : null,
    });

    const errors          = reactive({
      type              : null,
      department        : null,
      contragent        : null,
      supplier          : null,
      date_claim        : null,
      term_closing      : null,
      term_claim        : null,
      link_ESZ          : null,
      date_solution     : null,
      solution_id       : null,
      date_final        : null,
      document_solution : null,
    });
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

    async function getData(){
      loading.value = true;
      infoClaim.creator = userFIO.value;

      //ниже получили список Утверждающих решений
      let result = await loadJson('/claims/get-solutions', {});
      if (result.status === 'success') {
        infoClaim.solutionsList.length = 0;
        result.data.forEach(el => infoClaim.solutionsList.push(el));
      }

      //если нет решений то закинуть их на бэк и по новой запросить
      if (result.data.length == 0 ) {
        // отправить
        let result = await loadJson('/claims/set-solutions', {solutions});
        // и запросить
        result = await loadJson('/claims/get-solutions', {});
        if (result.status === 'success') {
          infoClaim.solutionsList.length = 0;
          result.data.forEach(el => infoClaim.solutionsList.push(el));
        }
      }
      loading.value = false;
   };
    getData()

    async function saveClaim(){
      let claimToSend ={}
      for (let key in infoClaim){
          if(infoClaim[key] && key !== 'statusesList' && key !== 'departmentsList' && key !== 'solutionsList') {
            claimToSend[key] = infoClaim[key]
          }
      }
      claimToSend.creator = userId.value

      loading.value = true
      let result = await loadJson('/claims/add',  claimToSend);
      if (result.status =='success') {
        claimId.value = result.id
        claimStatus.value = 'created';
        await router.push({name:'detail', params: { id: claimId.value }})
      }
      loading.value = false
      notify('Создание претензии', result.message, result.status)

    };

    watchEffect(() => {
      infoClaim.date_claim ? infoClaim.term_closing = new Date(new Date(infoClaim.date_claim.split('.').reverse().join('.')).getTime() + 3600*24*1000*70).toLocaleDateString() : '';
    })

    return {
      infoClaim, page, menu, claimId, loading, svg, errors,
      saveClaim,
    }
  },
}
</script>

<style scoped>

</style>
<template>
  <div v-loading = "loading"
       element-loading-text="Загрузка данных..."
       :element-loading-spinner="svg"
       element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <h3>Работа с претензией  №  {{claimId}}.</h3>
    <h3>Статус претензии  - {{map(claimStatus)}}.</h3>
    <el-tabs type="border-card" v-model="page">
      <el-tab-pane v-for="(item, key) in menu" :label="item" :name="key" :key="key">
      </el-tab-pane>
      <Info     v-if="page === 'info' && !loading"     v-model:value="infoClaim" :errors="errors"/>
      <Document v-if="page === 'document' && !loading" v-model:value="documentClaim" :errors="errors"/>
      <Position v-if="page === 'position' && !loading" v-model:value="positionClaim" @addPosition="addPosition" @deletePosition="deletePosition"/>
      <el-row style="padding: 15px" v-if="(positionClaim.length > 0 || page==='info' || page ==='document') && isVisible">
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
import {ref, reactive, inject, watchEffect, computed} from "vue";
import Info from '../components/info'
import Document from '../components/document'
import Position from '../components/position'

export default {
  name: "Detail",
  components: {
    Info, Document, Position
  },
  setup(){
    const claimId         = inject('claimId')
    const claimStatus     = inject('claimStatus');
    const loadJson        = inject('loadJson');
    const userId          = inject('userId');
    const userRole        = inject('userRole');
    const notify          = inject('notify');
    const solutions       = inject('solutions')

    const page            = ref('info');
    const menu            = reactive({
      info     : 'Претензия',
      document : 'Документы и сканы',
      position : 'Позиции претензии'
    });

    const infoClaim       = reactive({
      date_created      : null,
      date_selling      : null,
      status            : null,
      statusesList      : [
        {value : 'created',   label : 'Создана'},
        {value : 'agreement', label : 'Согласование решения'},
        {value : 'execution', label : 'Исполнение решения'},
        {value : 'rework',    label : 'На доработке подразделения'},
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
    });
    const documentClaim   = reactive({
      actNumber       : null,
      actDate         : null,
      actFile         : null,
      actFileList     : [],
      actId           : null,

      CFNumber        : null,
      CFDate          : null,
      CFFile          : null,
      CFFileList      : [],
      CFId            : null,

      comActNumber    : null,
      comActDate      : null,
      comActFile      : null,
      comActFileList  : [],
      comActId        : null,

      claimNumber     : null,
      claimFile       : null,
      claimFileList   : [],
      claimId         : null,

      warrantyNumber  : null,
      warrantyFile    : null,
      warrantyFileList: [],
      warrantyId      : null,

      SNNumber        : null,
      SNFile          : null,
      SNFileList      : [],
      SNId            : null,

      SCNumber        : null,
      SCFile          : null,
      SCFileList      : [],
      SCId            : null,

      IRFile          : null,
      IRFileList      : [],
      IRId            : null,

      MDDescription   : null,
      MDFiles         : [],
      MDFileList      : [],
      MDFilesSave     : [],
      MDId            : null,
    });
    const positionClaim   = reactive([
      // {
      //   reason_claim  : null,
      //   article       : null,
      //   code          : null,
      //   name          : null,
      //   quantity      : null,
      //   sum           : null,
      //   errors        : {},
      // }
    ]);

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

      actNumber         : null,
      actDate           : null,
      actFileList       : null,

      CFNumber          : null,
      CFDate            : null,
      CFFileList        : null,

      comActNumber      : null,
      comActDate        : null,
      comActFileList    : null,

      claimNumber       : null,
      claimDate         : null,
      claimFileList     : null,

      warrantyNumber    : null,
      warrantyFile      : null,
      warrantyFileList  : null,

      SNNumber          : null,
      SNFile            : null,
      SNFileList        : null,

      SCNumber          : null,
      SCFile            : null,
      SCFileList        : null,

      MDDescription     : null,
      MDFiles           : null,
      MDFileList        : null,
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

    const isSave          = ref(false);
    const partSave        = ref(false);

    function addPosition(){
      positionClaim.push(
          {
            reason_claim  : null,
            article       : null,
            code          : null,
            name          : null,
            quantity      : null,
            sum           : null,
            errors        : {},
            isSaved       : false,
          }
      )
    };
    function deletePosition(index){
      positionClaim.splice(index, 1)
    };
    function map(key){
      let dictionary = {
        reason_claim  : 'Причина претензии',
        article       : 'Артикул',
        code          : 'Код',
        name          : 'Наименование',
        quantity      : 'Количество',
        sum           : 'Сумма претензии',
        created       : 'Создана',
        agreement     : 'Согласование решения',
        execution     : 'Исполнение решения',
        rework        : 'На доработке подразделения',
        completed     : 'Отработана',
      }
      return dictionary[key]
    };

    async function getData(){
      loading.value = true

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

      //ниже получили ВСЕ по претензии
      result = await loadJson('/claims/get', {claim_id: claimId.value});
      if (result.status === 'success') {
        //ниже информация по претензии
        infoClaim.date_created      = result.data.date_created;
        infoClaim.date_selling      = result.data.date_selling;
        infoClaim.status            = result.data.status;
        infoClaim.link_ESZ          = result.data.link_ESZ;
        infoClaim.type              = result.data.type;
        infoClaim.date_solution     = result.data.date_solution;
        infoClaim.department        = result.data.department.value;
        infoClaim.solution_id       = result.data.solution_id;
        infoClaim.creator           = result.data.creator;
        infoClaim.comment           = result.data.comment;
        infoClaim.contragent        = result.data.contragent;
        infoClaim.date_final        = result.data.date_final;
        infoClaim. supplier         = result.data.supplier;
        infoClaim.document_solution = result.data.document_solution;
        infoClaim.date_claim        = result.data.date_claim;
        infoClaim.term_closing      = result.data.term_closing;
        infoClaim.term_claim        = result.data.term_claim;
        infoClaim.term_answer       = result.data.term_answer;

        // ниже данные для options в search_list
        if (result.data.department.value){
          infoClaim.departmentsList.length = 0;
          infoClaim.departmentsList.push({value : result.data.department.value, label : result.data.department.label})
         }

        //ниже сканы и документы
        if (result.data.scans.length > 0){
          await result.data.scans.forEach(el => {
            switch (el.type) {
              case 'act':      {
                documentClaim.actNumber = el.number;
                documentClaim.actDate   = el.date;
                documentClaim.actId     = el.id;
                documentClaim.actFileList.push(el.file);
                break
              }
              case 'CF':       {
                documentClaim.CFNumber = el.number;
                documentClaim.CFDate   = el.date;
                documentClaim.CFId     = el.id;
                documentClaim.CFFileList.push(el.file);
                break
              }
              case 'comAct':   {
                documentClaim.comActNumber = el.number;
                documentClaim.comActDate   = el.date;
                documentClaim.comActId     = el.id;
                documentClaim.comActFileList.push(el.file);
                break
              }
              case 'claim':    {
                documentClaim.claimNumber = el.number;
                documentClaim.claimId     = el.id;
                documentClaim.claimFileList.push(el.file);
                break
              }
              case 'warranty': {
                documentClaim.warrantyNumber = el.number;
                documentClaim.warrantyId     = el.id;
                documentClaim.warrantyFileList.push(el.file);
                break
              }
              case 'SN':       {
                documentClaim.SNNumber = el.number;
                documentClaim.SNId     = el.id;
                documentClaim.SNFileList.push(el.file);
                break
              }
              case 'SC':       {
                documentClaim.SCNumber = el.number;
                documentClaim.SCId     = el.id;
                documentClaim.SCFileList.push(el.file);
                break
              }
              case 'IR':       {
                documentClaim.IRId     = el.id;
                documentClaim.IRFileList.push(el.file);
                break
              }
            }
          })
        }

        //ниже описание и фото дифектов
        if(result.data.defects.length > 0){
          documentClaim.MDFileList.length = 0;
          documentClaim.MDFilesSave.length = 0;
          await result.data.defects.forEach(el => {
            documentClaim.MDDescription = el.description;
            documentClaim.MDId = el.id;
            el.files.forEach(file =>{
              documentClaim.MDFileList.push(file);
              documentClaim.MDFilesSave.push(file)
            })
          })
        }

        //ниже позиции претензии
        if (result.data.products.length > 0) {
          positionClaim.length = 0;
          await result.data.products.forEach(el => {
            positionClaim.push({
              reason_claim  : el.reason_claim,
              article       : el.article,
              code          : el.code,
              name          : el.name,
              quantity      : el.quantity,
              sum           : el.sum,
              errors        : {},
              isSaved       : true,
            })
          })
        }

        //ниже обновили актуальный статус претензии для логики приложения
        claimStatus.value = result.data.status;
      };

      //ниже работа с доступными статусами исходя из текущего статуса
      switch (result.data.status) {
        case 'created'    : {
          infoClaim.statusesList.length = 0;
          infoClaim.statusesList.push({ value : 'created',   label : 'Создана'});
          infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
          infoClaim.statusesList.push({ value : 'agreement', label : 'Согласование решения'});
          break
        }
        case 'agreement'  : {
          infoClaim.statusesList.length = 0;
          infoClaim.statusesList.push({ value : 'agreement', label : 'Согласование решения'});
          infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
          infoClaim.statusesList.push({ value : 'execution', label : 'Исполнение решения'});

          break
        }
        case 'execution'  : {
          infoClaim.statusesList.length = 0;
          infoClaim.statusesList.push({ value : 'execution', label : 'Исполнение решения'});
          infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
          infoClaim.statusesList.push({value : 'completed',  label : 'Отработана'});
          break
        }
        case 'rework'     : {
          infoClaim.statusesList.length = 0;
          infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
          infoClaim.statusesList.push({ value : 'agreement', label : 'Согласование решения'});
          infoClaim.statusesList.push({ value : 'execution', label : 'Исполнение решения'});
          break
        }
        case 'completed'  : {
          infoClaim.statusesList.length = 0;
          infoClaim.statusesList.push({value : 'completed',  label : 'Отработана'});
          break
        }
      };

      loading.value = false;
    };
    getData()

    function isValid(){
      let valid = true;
      let message = 'Необходимо заполнить обязятельные поля претензии!'

      if (infoClaim.status == 'agreement' || infoClaim.status == 'execution' || infoClaim.status == 'completed') {
        if(!infoClaim.type){ valid = false; errors.type = 'Необходимо заполнить тип'}
        if(!infoClaim.department){ valid = false; errors.department = 'Необходимо заполнить подразделение'}
        if(!infoClaim.contragent){ valid = false; errors.contragent = 'Необходимо заполнить поставщика'}
        if(!infoClaim.supplier){ valid = false; errors.supplier = 'Необходимо заполнить кому выставлена'}
        if(!infoClaim.date_claim){ valid = false; errors.date_claim = 'Необходимо заполнить дату выставления'}
        if(!infoClaim.term_closing){ valid = false; errors.term_closing = 'Необходимо заполнить срок для закрытия'}
        if(!infoClaim.term_claim){ valid = false; errors.term_claim = 'Необходимо заполнить срок выставления'}
        if(!infoClaim.link_ESZ){ valid = false; errors.link_ESZ = 'Необходимо заполнить ссылку на ЭСЗ/П в СЭД'}

        if(positionClaim.length > 0){
            positionClaim.forEach(el => {
              if (!el.isSaved){
                valid = false;
                message = 'Необходимо заполнить обязательные поля и добавить позиции товара во вкладке - Позиции претензии и сохранить их'
              }
            })
          //if (!positionClaim[0].reason_claim){valid = false; message = 'Необходимо заполнить данные по позиции товара во вкладке - Позиции претензии'}
        } else {valid = false; message = 'Необходимо заполнить обязательные поля и добавить позиции товара во вкладке - Позиции претензии'}

      }//если статус -  согласование решения

      if (infoClaim.status == 'execution' || infoClaim.status == 'completed') {
        if(!infoClaim.date_solution){ valid = false; errors.date_solution = 'Необходимо заполнить дату принятия решения'}
        if(!infoClaim.solution_id){ valid = false; errors.solution_id = 'Необходимо заполнить утверждающее решение'}
      }// если статус Исполнение решения

      if (infoClaim.status == 'completed') {
        if(!infoClaim.date_final){ valid = false; errors.date_final = 'Необходимо заполнить дату закрытия'}
        if(!infoClaim.document_solution){ valid = false; errors.document_solution = 'Необходимо заполнить документ, утверждающий решение'}
      }// если статус Отработана

      if (!valid) notify('Ошибка изменения статуса претензии!', message, 'error')

      return valid
    };

    async function saveClaim(){
      if (page.value === 'info'){
        if (isValid()){
          let claimToSend ={}
          for (let key in infoClaim){
            if(infoClaim[key] && key !== 'creator' && key !== 'statusesList' && key !== 'departmentsList') {
              claimToSend[key] = infoClaim[key]
            }
          }
          claimToSend.creator = userId.value

          loading.value = true
          let result = await loadJson('/claims/edit',  {
            ...claimToSend, claim_id : claimId.value
          });
          if (result.status =='success') {
            claimStatus.value = claimToSend.status;
            //ниже работа с доступными статусами исходя из текущего статуса
            switch (infoClaim.status) {
              case 'created'    : {
                infoClaim.statusesList.length = 0;
                infoClaim.statusesList.push({ value : 'created',   label : 'Создана'});
                infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
                infoClaim.statusesList.push({ value : 'agreement', label : 'Согласование решения'});
                break
              }
              case 'agreement'  : {
                infoClaim.statusesList.length = 0;
                infoClaim.statusesList.push({ value : 'agreement', label : 'Согласование решения'});
                infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
                infoClaim.statusesList.push({ value : 'execution', label : 'Исполнение решения'});
                break
              }
              case 'execution'  : {
                infoClaim.statusesList.length = 0;
                infoClaim.statusesList.push({ value : 'execution', label : 'Исполнение решения'});
                infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
                infoClaim.statusesList.push({value : 'completed',  label : 'Отработана'});
                break
              }
              case 'rework'     : {
                infoClaim.statusesList.length = 0;
                infoClaim.statusesList.push({value : 'rework',     label : 'На доработке подразделения'});
                infoClaim.statusesList.push({ value : 'agreement', label : 'Согласование решения'});
                infoClaim.statusesList.push({ value : 'execution', label : 'Исполнение решения'});
                break
              }
              case 'completed'  : {
                infoClaim.statusesList.length = 0;
                infoClaim.statusesList.push({value : 'completed',  label : 'Отработана'});
                break
              }
            };

          }
          loading.value = false

          notify('Редактирование претензии', result.message, result.status)
        }// если форма валидна
      };

      if (page.value === 'document'){
        loading.value = true
        let result = null;
        partSave.value = false;

        if(documentClaim.actDate && documentClaim.actNumber && (documentClaim.actFile || documentClaim.actFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'act');
          data.append('number', documentClaim.actNumber);
          data.append('date', documentClaim.actDate);
          documentClaim.actFile ? data.append('file', documentClaim.actFile.raw) : '';
          documentClaim.actId ? data.append('scan_id', documentClaim.actId) : '';
          result = await loadJson(documentClaim.actId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.actId = result.id; documentClaim.actFileList[0].id = result.file_id}
          isSave.value = true;
        } else {
            if (documentClaim.actDate || documentClaim.actNumber || documentClaim.actFile || documentClaim.actFileList.length > 0){
              documentClaim.actDate ? ''    : errors.actDate = 'Необходимо указать дату';
              documentClaim.actNumber ? ''  : errors.actNumber = 'Необходимо указать номер';
              if (!documentClaim.actFile && documentClaim.actFileList.length == 0) errors.actFileList = 'Необходим файл';
              partSave.value = true;
            } else {
                  if (documentClaim.actId){
                    result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.actId,});
                    if (result.status === 'success') documentClaim.actId = null
                  }
            }
        }

        if(documentClaim.CFNumber && documentClaim.CFDate && (documentClaim.CFFile || documentClaim.CFFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'CF');
          data.append('number', documentClaim.CFNumber);
          data.append('date', documentClaim.CFDate);
          documentClaim.CFFile ?  data.append('file', documentClaim.CFFile.raw) : '';
          documentClaim.CFId ? data.append('scan_id', documentClaim.CFId) : '';
          result = await loadJson(documentClaim.CFId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.CFId = result.id; documentClaim.CFFileList[0].id = result.file_id; }
          isSave.value = true;
        } else {
          if (documentClaim.CFDate || documentClaim.CFNumber || documentClaim.CFFile || documentClaim.CFFileList.length > 0){
            documentClaim.CFDate ? ''    : errors.CFDate = 'Необходимо указать дату';
            documentClaim.CFNumber ? ''  : errors.CFNumber = 'Необходимо указать номер';
            if (!documentClaim.CFFile && documentClaim.CFFileList.length == 0) errors.CFFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.CFId){
              result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.CFId,});
              if (result.status === 'success') documentClaim.CFId = null
            }
          }
        }

        if(documentClaim.comActNumber && documentClaim.comActDate && (documentClaim.comActFile || documentClaim.comActFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'comAct');
          data.append('number', documentClaim.comActNumber);
          data.append('date', documentClaim.comActDate);
          documentClaim.comActFile ? data.append('file', documentClaim.comActFile.raw) : '';
          documentClaim.comActId ? data.append('scan_id', documentClaim.comActId) : '';
          result = await loadJson(documentClaim.comActId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.comActId = result.id; documentClaim.comActFileList[0].id = result.file_id;}
          isSave.value = true;
        } else {
          if (documentClaim.comActDate || documentClaim.comActNumber || documentClaim.comActFile || documentClaim.comActFileList.length > 0){
            documentClaim.comActDate ? ''    : errors.comActDate = 'Необходимо указать дату';
            documentClaim.comActNumber ? ''  : errors.comActNumber = 'Необходимо указать номер';
            if (!documentClaim.comActFile && documentClaim.comActFileList.length == 0) errors.comActFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.comActId){
              result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.comActId,});
              if (result.status === 'success') documentClaim.comActId = null
            }
          }
        }

        if(documentClaim.claimNumber && (documentClaim.claimFile || documentClaim.claimFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'claim');
          data.append('number', documentClaim.claimNumber);
          documentClaim.claimFile ? data.append('file', documentClaim.claimFile.raw) : '';
          documentClaim.claimId ? data.append('scan_id', documentClaim.claimId) : '';
          result = await loadJson(documentClaim.claimId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.claimId = result.id; documentClaim.claimFileList[0].id = result.file_id;}
          isSave.value = true;
        } else {
          if (documentClaim.claimNumber || documentClaim.claimFile || documentClaim.claimFileList.length > 0){
            documentClaim.claimNumber ? ''  : errors.claimNumber = 'Необходимо указать номер';
            if (!documentClaim.claimFile && documentClaim.claimFileList.length == 0) errors.claimFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.claimId){
              result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.claimId});
              if (result.status === 'success') documentClaim.claimId = null
            }
          }
        }

        if(documentClaim.warrantyNumber && (documentClaim.warrantyFile || documentClaim.warrantyFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'warranty');
          data.append('number', documentClaim.warrantyNumber);
          documentClaim.warrantyFile ? data.append('file', documentClaim.warrantyFile.raw) : '';
          documentClaim.warrantyId ? data.append('scan_id', documentClaim.warrantyId) : '';
          result = await loadJson(documentClaim.warrantyId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.warrantyId = result.id; documentClaim.warrantyFileList[0].id = result.file_id;}
          isSave.value = true;
        } else {
          if (documentClaim.warrantyNumber || documentClaim.warrantyFile || documentClaim.warrantyFileList.length > 0){
            documentClaim.warrantyNumber ? ''  : errors.warrantyNumber = 'Необходимо указать номер';
            if (!documentClaim.warrantyFile && documentClaim.warrantyFileList.length == 0) errors.warrantyFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.warrantyId){
              result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.warrantyId,});
              if (result.status === 'success') documentClaim.warrantyId = null
            }
          }
        }

        if(documentClaim.SNNumber && (documentClaim.SNFile || documentClaim.SNFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'SN');
          data.append('number', documentClaim.SNNumber);
          documentClaim.SNFile ? data.append('file', documentClaim.SNFile.raw) : '';
          documentClaim.SNId ? data.append('scan_id', documentClaim.SNId) : '';
          result = await loadJson(documentClaim.SNId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.SNId = result.id; documentClaim.SNFileList[0].id = result.file_id;}
          isSave.value = true;
        } else {
          if (documentClaim.SNNumber || documentClaim.SNFile || documentClaim.SNFileList.length > 0){
            documentClaim.SNNumber ? ''  : errors.SNNumber = 'Необходимо указать номер';
            if (!documentClaim.SNFile && documentClaim.SNFileList.length == 0) errors.SNFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.SNId){
              result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.SNId,});
              if (result.status === 'success') documentClaim.SNId = null
            }
          }
        }

        if(documentClaim.SCNumber && (documentClaim.SCFile || documentClaim.SCFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'SC');
          data.append('number', documentClaim.SCNumber);
          documentClaim.SCFile ? data.append('file', documentClaim.SCFile.raw) : '';
          documentClaim.SCId ? data.append('scan_id', documentClaim.SCId) : '';
          result = await loadJson(documentClaim.SCId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.SCId = result.id; documentClaim.SCFileList[0].id = result.file_id;}
          isSave.value = true;
        } else {
          if (documentClaim.SCNumber || documentClaim.SCFile || documentClaim.SCFileList.length > 0){
            documentClaim.SCNumber ? ''  : errors.SCNumber = 'Необходимо указать номер';
            if (!documentClaim.SCFile && documentClaim.SCFileList.length == 0) errors.SCFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.SCId){
              result = await loadJson('/claims/scans/delete', {scan_id  : documentClaim.SCId});
              if (result.status === 'success') documentClaim.SCId = null
            }
          }
        }

        if(documentClaim.IRFile || documentClaim.IRFileList.length > 0){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('type', 'IR');
          documentClaim.IRFile ? data.append('file', documentClaim.IRFile.raw) : '';
          documentClaim.IRId ? data.append('scan_id', documentClaim.IRId) : '';
          result = await loadJson(documentClaim.IRId ? '/claims/scans/edit' : '/claims/scans/add', data, 'file');
          if (result.status === 'success') {documentClaim.IRId = result.id; documentClaim.IRFileList[0].id = result.file_id;}
          isSave.value = true;
        } else {
          if (documentClaim.IRId){
            result = await loadJson('/claims/scans/delete', {scan_id : documentClaim.IRId});
            if (result.status === 'success') documentClaim.IRId = null
          }
        }

        if(documentClaim.MDDescription && (documentClaim.MDFiles.length > 0 || documentClaim.MDFileList.length > 0)){
          let data = new FormData()
          data.append('claim_id', claimId.value);
          data.append('description', documentClaim.MDDescription);

          if (documentClaim.MDFiles.length > 0){
            for(let i = 0; i < documentClaim.MDFiles.length; i++){
              data.append('files['+i+']', documentClaim.MDFiles[i].raw);
            }
          }

          if (documentClaim.MDFilesSave.length > 0){
            for(let i = 0; i < documentClaim.MDFilesSave.length; i++){
              data.append('files_save['+i+']', documentClaim.MDFilesSave[i].id);
            }
          }

          documentClaim.MDId ? data.append('defect_id', documentClaim.MDId) : '';
          result = await loadJson(documentClaim.MDId ? '/claims/defects/edit' : '/claims/defects/add', data, 'file');
          if (result.status === 'success') {
            documentClaim.MDId = result.id;
            if (result.files_id.length > 0) result.files_id.forEach((el, index) => {documentClaim.MDFileList[index].id = result.files_id[index]})
          }
          isSave.value = true;
        } else {
          if (documentClaim.MDDescription || documentClaim.MDFiles.length > 0 || documentClaim.MDFileList.length > 0){
            documentClaim.MDDescription ? ''  : errors.MDDescription = 'Необходимо описание брака';
            if (documentClaim.MDFiles.length == 0 && documentClaim.MDFileList.length == 0) errors.MDFileList = 'Необходим файл';
            partSave.value = true;
          } else {
            if (documentClaim.MDId){
              result = await loadJson('/claims/defects/delete', {defect_id : documentClaim.MDId});
              if (result.status === 'success') documentClaim.MDId = null
            }
          }
        }

        loading.value = false

        if (isSave.value) {
          notify('Редактирование претензии', partSave.value ? 'Частично успешно, проверьте заполнение полей!' : 'Успешно', partSave.value ? 'warning' : 'success');
          isSave.value = false; partSave.value = false;
        }

      }

      if (page.value === 'position'){

        let isValid = true;
        positionClaim.forEach((el, index) => {
          if (isValid) {
            for (let key in el){
              if (!el[key] && key!=='isSaved' && key!=='errors'){
                isValid = false;
                positionClaim[index].errors[key] = 'Необходимо заполнить '+ map(key);
                break
              }
            }
          }
        })
        if (!isValid) return;


        loading.value = true;
        let result = await loadJson('/claims/products/set',  {
          claim_id : claimId.value,
          data     : positionClaim,
        });

        if (result.status == 'success')  positionClaim.forEach((el, index) => positionClaim[index].isSaved = true);

        loading.value = false;
        notify('Редактирование претензии', result.message, result.status)
      };
    };

    const isVisible = computed(() => {
      let visible = false;
      if (userRole.value === 'admin' || (userRole.value === 'editor' && claimStatus.value !== 'completed')) visible = true
      return visible
    });

    watchEffect(() => {
      infoClaim.date_claim ? infoClaim.term_closing = new Date(new Date(infoClaim.date_claim.split('.').reverse().join('.')).getTime() + 3600*24*1000*70).toLocaleDateString() : '';

      infoClaim.type              ? errors.type = null : '';
      infoClaim.department        ? errors.department = null : '';
      infoClaim.contragent        ? errors.contragent = null : '';
      infoClaim.supplier          ? errors.supplier = null : '';
      infoClaim.date_claim        ? errors.date_claim = null : '';
      infoClaim.term_closing      ? errors.term_closing = null : '';
      infoClaim.term_claim        ? errors.term_claim = null : '';
      infoClaim.link_ESZ          ? errors.link_ESZ = null : '';
      infoClaim.date_solution     ? errors.date_solution = null : '';
      infoClaim.solution_id       ? errors.solution_id = null : '';
      infoClaim.date_final        ? errors.date_final = null : '';
      infoClaim.document_solution ? errors.document_solution = null : '';

      documentClaim.actDate              ? errors.actDate = null : '';
      documentClaim.actNumber            ? errors.actNumber = null : '';
      documentClaim.actFile              ? errors.actFileList = null : '';
      documentClaim.actFileList > 0      ? errors.actFileList = null : '';

      documentClaim.CFDate               ? errors.CFDate = null : '';
      documentClaim.CFNumber             ? errors.CFNumber = null : '';
      documentClaim.CFFile               ? errors.CFFileList = null : '';
      documentClaim.CFFileList > 0       ? errors.CFFileList = null : '';

      documentClaim.comActDate           ? errors.comActDate = null : '';
      documentClaim.comActNumber         ? errors.comActNumber = null : '';
      documentClaim.comActFile           ? errors.comActFileList = null : '';
      documentClaim.comActFileList > 0   ? errors.comActFileList = null : '';

      documentClaim.claimNumber          ? errors.claimNumber = null : '';
      documentClaim.claimFile            ? errors.claimFileList = null : '';
      documentClaim.claimFileList > 0    ? errors.claimFileList = null : '';

      documentClaim.warrantyNumber       ? errors.warrantyNumber = null : '';
      documentClaim.warrantyFile         ? errors.warrantyFileList = null : '';
      documentClaim.warrantyFileList > 0 ? errors.warrantyFileList = null : '';

      documentClaim.SNNumber             ? errors.SNNumber = null : '';
      documentClaim.SNFile               ? errors.SNFileList = null : '';
      documentClaim.SNFileList > 0       ? errors.SNFileList = null : '';

      documentClaim.SCNumber             ? errors.SCNumber = null : '';
      documentClaim.SCFile               ? errors.SCFileList = null : '';
      documentClaim.SCFileList > 0       ? errors.SCFileList = null : '';

      documentClaim.MDDescription        ? errors.MDDescription = null : '';
      documentClaim.MDFiles              ? errors.MDFileList = null : '';
      documentClaim.MDFileList > 0       ? errors.MDFileList = null : '';
    })


    return {
      infoClaim, documentClaim, positionClaim,
      page, menu, claimId, claimStatus, loading, svg, errors, isSave,
      addPosition, deletePosition, map,
      saveClaim,
      isVisible,
    }
  },


}
</script>

<style scoped>

</style>
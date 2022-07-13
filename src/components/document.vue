<template>
  <div class="body-wrapper">
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Номер акта ТОРГ-2(АОБ)</label>
        <el-input
            :class="errors.actNumber ? 'invalid' : ''"
            v-model="value.actNumber"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.actNumber">{{errors.actNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Дата акта ТОРГ-2 (АОБ)</label>
        <el-date-picker
            v-model="value.actDate"
            :class="errors.actDate ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.actDate">{{errors.actDate}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Cкан Акта ТОРГ-2<br/></label>
        <el-upload
            v-if="value.actFileList.length === 0"
            action=""
            ref="uploadAct"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadActBtn"
            :on-change="actFile"
            :file-list="value.actFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
            class="claim-load-scan-button"
            :disabled="!value.actFileList[0].id"
            @click="downLoadFile(value.actFileList[0])"
          >
            {{value.actFileList[0].name}}
          </el-button>
          <el-button
            @click="value.actFileList.length = 0; value.actFile = null"
            class="claim-delete-scan-button"
            :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.actFileList">{{errors.actFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Номер Cф, ТН/УПД</label>
        <el-input
            v-model="value.CFNumber"
            :class="errors.CFNumber ? 'invalid' : ''"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.CFNumber">{{errors.CFNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Дата Сфб ТН/УПД</label>
        <el-date-picker
            v-model="value.CFDate"
            :class="errors.CFDate ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.CFDate">{{errors.CFDate}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Скан Сф, ТН/УПД</label>
        <el-upload
            v-if="value.CFFileList.length === 0"
            action=""
            ref="uploadCF"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadCFBtn"
            :on-change="CFFile"
            :file-list="value.CFFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button"
              :disabled="!value.CFFileList[0].id"
              @click="downLoadFile(value.CFFileList[0])"
          >
            {{value.CFFileList[0].name}}
          </el-button>
          <el-button
              @click="value.CFFileList.length = 0; value.CFFile = null"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.CFFileList">{{errors.CFFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Номер Коммерческого акта</label>
        <el-input
            v-model="value.comActNumber"
            :class="errors.comActNumber ? 'invalid' : ''"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.comActNumber">{{errors.comActNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Дата Коммерческого акта</label>
        <el-date-picker
            v-model="value.comActDate"
            :class="errors.comActDate ? 'invalid' : ''"
            style="width: 100%"
            type="date"
            format="DD.MM.YYYY"
            valueFormat="DD.MM.YYYY"
            placeholder="Выберите дату"
            :disabled="isDisable"
        >
        </el-date-picker>
        <small v-if="errors.comActDate">{{errors.comActDate}}</small>
        </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Скан Коммерческого акта</label>
        <el-upload
            v-if="value.comActFileList.length === 0"
            action=""
            ref="uploadComAct"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadComActBtn"
            :on-change="comActFile"
            :file-list="value.comActFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button"
              :disabled="!value.comActFileList[0].id"
              @click="downLoadFile(value.comActFileList[0])"
          >
            {{value.comActFileList[0].name}}
          </el-button>
          <el-button
              @click="value.comActFileList.length = 0; value.comActFile =null;"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.comActFileList">{{errors.comActFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Заявление покупателя</label>
        <el-input
            v-model="value.claimNumber"
            :class="errors.claimNumber ? 'invalid' : ''"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.claimNumber">{{errors.claimNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Скан Заявления покупателя</label>
        <el-upload
            v-if="value.claimFileList.length === 0"
            action=""
            ref="uploadClaim"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadClainBtn"
            :on-change="claimFile"
            :file-list="value.claimFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button"
              :disabled="!value.claimFileList[0].id"
              @click="downLoadFile(value.claimFileList[0])"
          >
            {{value.claimFileList[0].name}}
          </el-button>
          <el-button
              @click="value.claimFileList.length = 0; value.claimFile = null"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.claimFileList">{{errors.claimFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Номер гарантийного талона</label>
        <el-input
            v-model="value.warrantyNumber"
            :class="errors.warrantyNumber ? 'invalid' : ''"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.warrantyNumber">{{errors.warrantyNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Скан Гарантийного талона</label>
        <el-upload
            v-if="value.warrantyFileList.length === 0"
            action=""
            ref="uploadWarranty"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadWarrantyBtn"
            :on-change="warrantyFile"
            :file-list="value.warrantyFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button"
              :disabled="!value.warrantyFileList[0].id"
              @click="downLoadFile(value.warrantyFileList[0])"
          >
            {{value.warrantyFileList[0].name}}
          </el-button>
          <el-button
              @click="value.warrantyFileList.length = 0; value.warrantyFile = null"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.warrantyFileList">{{errors.warrantyFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Серийный номер товара</label>
        <el-input
            v-model="value.SNNumber"
            :class="errors.SNNumber ? 'invalid' : ''"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.SNNumber">{{errors.SNNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Скан Серийного номера товара</label>
        <el-upload
            v-if="value.SNFileList.length === 0"
            action=""
            ref="uploadSN"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadSNBtn"
            :on-change="SNFile"
            :file-list="value.SNFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button"
              :disabled="!value.SNFileList[0].id"
              @click="downLoadFile(value.SNFileList[0])"
          >
            {{value.SNFileList[0].name}}
          </el-button>
          <el-button
              @click="value.SNFileList.length = 0; value.SNFile = null"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.SNFileList">{{errors.SNFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Номер заключения сервисного центра / стороннего СЦ </label>
        <el-input
            v-model="value.SCNumber"
            :class="errors.SCNumber ? 'invalid' : ''"
            placeholder="Введите номер"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.SCNumber">{{errors.SCNumber}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label"> Скан Заключения</label>
        <el-upload
            v-if="value.SCFileList.length === 0"
            action=""
            ref="uploadSC"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadSCBtn"
            :on-change="SCFile"
            :file-list="value.SCFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              icon="el-icon-download"
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button claim-load-scan-button-80"
              :disabled="!value.SCFileList[0].id"
              @click="downLoadFile(value.SCFileList[0])"
          >
            {{value.SCFileList[0].name}}
          </el-button>
          <el-button
              @click="value.SCFileList.length = 0; value.SCFile"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <small v-if="errors.SCFileList">{{errors.SCFileList}}</small>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label"><br/></label>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Скан акта обнаружения и осмотра</label>
        <el-upload
            v-if="value.IRFileList.length === 0"
            action=""
            ref="uploadIR"
            :auto-upload="false"
            :limit = "1"
            :on-exceed="uploadIRBtn"
            :on-change="IRFile"
            :file-list="value.IRFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              icon="el-icon-download"
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            Загрузить
          </el-button>
        </el-upload>
        <div class="two_fields" v-else>
          <el-button
              class="claim-load-scan-button claim-load-scan-button-80"
              :disabled="!value.IRFileList[0].id"
              @click="downLoadFile(value.IRFileList[0])"
          >
            {{value.IRFileList[0].name}}
          </el-button>
          <el-button
              @click="value.IRFileList.length = 0; value.IRFile = null;"
              class="claim-delete-scan-button"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <label class="add_claims_label">Описание заявленного брака</label>
        <el-input
            v-model="value.MDDescription"
            :class="errors.MDDescription ? 'invalid' : ''"
            type="textarea"
            rows="4"
            placeholder="Введите текст"
            :disabled="isDisable"
        >
        </el-input>
        <small v-if="errors.MDDescription">{{errors.MDDescription}}</small>
      </el-col>
      <el-col :span="1">
      </el-col>
      <el-col :span="6">
        <label class="add_claims_label">Фотографии брака</label>
        <div v-for = "(item, idx) in value.MDFileList" :key="idx" class="two_fields">
          <el-button
              class="claim-load-scan-button"
              @click="downLoadFile(value.MDFileList[idx])"
              :disabled="!value.MDFileList[idx].id"
          >
            {{value.MDFileList[idx].name}}
          </el-button>
          <el-button
              class="claim-delete-scan-button"
              @click="value.MDFileList.splice(idx, 1); value.MDFiles.splice(idx, 1)"
              :disabled="isDisable"
          >
            X
          </el-button>
        </div>
        <el-upload
            action=""
            ref="upload"
            :auto-upload="false"
            :on-change="MDFilesChange"
            :on-remove="MDFilesRemove"
            :file-list="value.MDFileList"
            :on-preview = 'downLoadFile'
            :show-file-list="false"
            :disabled="isDisable"
        >
          <el-button
              icon="el-icon-download"
              class="claim-load-scan-button"
              :disabled="isDisable"
          >
            {{value.MDFileList.length == 0 ? 'Загрузить' : 'Загрузить еще'}}
          </el-button>
        </el-upload>
        <small v-if="errors.MDFileList">{{errors.MDFileList}}</small>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {computed, inject, ref} from 'vue'
import { genFileId } from 'element-plus'
export default {
name  : "info",
props : ['value', 'errors'],
setup(props){
  const userRole    = inject('userRole');
  const claimStatus = inject('claimStatus');
  const loadJson    = inject('loadJson');
  const notify      = inject('notify');

   //Act -> акт ТОРГ
  const uploadAct  = ref();
  const uploadActBtn = (files) => {
    uploadAct.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadAct.value.handleStart(file)

  };
  const actFile = (file) => {
    props.value.actFile = file
  };

  // CF -> счет фактура
  const uploadCF = ref();
  const uploadCFBtn = (files) => {
    uploadCF.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadCF.value.handleStart(file)
  };
  const CFFile = (file) => {
    props.value.CFFile = file
  };

  // сomAct -> коммерческий акт
  const uploadComAct = ref();
  const uploadComActBtn = (files) => {
    uploadComAct.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadComAct.value.handleStart(file)
  };
  const comActFile = (file) => {
    props.value.comActFile = file
  };

  // Claim -> заявление покупателя
  const uploadClaim = ref();
  const uploadClainBtn = (files) => {
    uploadClaim.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadClaim.value.handleStart(file)
  };
  const claimFile = (file) => {
    props.value.claimFile = file
  };

  //Warranty -> гарантийный талон
  const uploadWarranty  = ref();
  const uploadWarrantyBtn = (files) => {
    uploadWarranty.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadWarranty.value.handleStart(file)
  };
  const warrantyFile = (file) => {
    props.value.warrantyFile = file
  };

  // SN -> serial number / серийный номер
  const uploadSN  = ref();
  const uploadSNBtn = (files) => {
    uploadSN.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadSN.value.handleStart(file)
  };
  const SNFile = (file) => {
    props.value.SNFile = file
  };

  // SC -> service center / сервисный центр
  const uploadSC  = ref();
  const uploadSCBtn = (files) => {
    uploadSC.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadSC.value.handleStart(file)
  };
  const SCFile = (file) => {
    props.value.SCFile = file
  };

  //IR ->  inspection report / акт осмотра
  const uploadIR  = ref();
  const uploadIRBtn = (files) => {
    uploadIR.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    uploadIR.value.handleStart(file)
  };
  const IRFile = (file) => {
    props.value.IRFile = file
  };

  // MD -> marriage description /описание брака
  const uploadMD  = ref();
  const MDDescription = ref(null);
  const MDFilesChange = (file) => {
    props.value.MDFiles.push(file);
  };
  const MDFilesRemove = (file) => {
    props.value.MDFiles = props.value.MDFiles.filter(el => el.uid !== file.uid);
    props.value.MDFilesSave = props.value.MDFilesSave.filter(el => el.uid !== file.uid);
  };

  const downLoadFile = async(file) =>{
    if(file.id) {
      try {
        let result = await loadJson('/claims/load-file', {file_id : file.id}, '', true); //параметры - url, объкт с данными(id файла), type (если указать 'file' то это для отправки файла и отсылаемые данные уйдут не json-ом а как форма), downLoadRequest - если true то результат не будет преобразован через json )
        let blob      = await result.blob();
        let url       = URL.createObjectURL(blob);
        let link      = document.createElement('a');
        link.href     = url;
        link.download = file.name;

        link.click();
        URL.revokeObjectURL(link.href);
      }catch(e){
        notify('Ошибка загрузки файла', e.message, e.status)
      }
    } else {
      notify('Ошибка загрузки файла', 'Этот файл недоступен для скачивания. Так как был только что добавлен.', 'error')
    }
  };

  const isDisable = computed(() => {
    let disable = true;
    if (userRole.value === 'admin' || (userRole.value === 'editor' && claimStatus.value !== 'completed')) disable = false
    return disable

  })

  return {
    uploadAct, uploadActBtn, actFile, downLoadFile,
    uploadCF,  uploadCFBtn, CFFile,
    uploadComAct, uploadComActBtn, comActFile,
    uploadClaim, uploadClainBtn, claimFile,
    uploadWarranty, uploadWarrantyBtn, warrantyFile,
    uploadSN, uploadSNBtn, SNFile,
    uploadSC, uploadSCBtn, SCFile,
    uploadIR, uploadIRBtn, IRFile,
    uploadMD, MDDescription, MDFilesChange, MDFilesRemove,
    isDisable,
  }
}

}







</script>

<style scoped>

</style>
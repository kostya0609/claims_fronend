<template>
  <div class="body-wrapper"
       v-loading = "loading"
       element-loading-text="Загрузка данных..."
       :element-loading-spinner="svg"
       element-loading-svg-view-box="-10, -10, 50, 50"
  >
    <el-row :gutter="24">
      <el-col :span="12">
        <h3>Администраторы</h3>
      </el-col>
      <el-col :span="12">
        <h3>Редакторы</h3>
      </el-col>
    </el-row>

    <el-row :gutter="24">
      <el-col :span="7">
        <el-select
            v-model="admin"
            :class="errors.admin ? 'invalid' : ''"
            style="width: 100%"
            filterable
            :remote-method="searchAdmin"
            remote
            reserve-keyword
            placeholder="Укажите ФИО"
        >
          <el-option
            v-for="item in adminsList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <small v-if="errors.admin">{{ errors.admin}}</small>
      </el-col>
      <el-col :span="3">
        <el-button
            class="claim-save-element-button"
            @click="addAdmin"
            icon="el-icon-circle-plus"
            >
          Добавить
        </el-button>
      </el-col>
      <el-col :span="2">
      </el-col>

      <el-col :span="7">
        <el-select
            v-model="editor"
            :class="errors.editor ? 'invalid' : ''"
            :remote-method="searchEditor"
            style="width: 100%"
            filterable
            remote
            reserve-keyword
            placeholder="Укажите ФИО"
        >
          <el-option
              v-for="item in editorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
        <small v-if="errors.editor">{{ errors.editor}}</small>
      </el-col>
      <el-col :span="3">
        <el-button
            class="claim-save-element-button"
            @click="addEditor"
            icon="el-icon-circle-plus"
        >
          Добавить
        </el-button>
      </el-col>
    </el-row>

    <el-row :gutter="24" >
      <el-col :span="10">
        <el-table
          style="width: 100%"
          :data="admins"
        >
          <el-table-column
              prop="label"
          >
          </el-table-column>
          <el-table-column
              align="right"
          >
            <template #default="scope">
              <el-button
                  type="danger"
                  @click="removeAdmin(scope.$index)"
              >
                X
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="2">
      </el-col>
      <el-col :span="10">
        <el-table
            :data="editors"
            style="width: 100%"
        >
          <el-table-column
              prop="label"
          >
          </el-table-column>
          <el-table-column
              align="right"
          >
            <template #default="scope">
              <el-button
                  type="danger"
                  @click="removeEditor(scope.$index)"
              >
                X
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import {ref, reactive, inject, watchEffect} from 'vue';
import  {ElMessageBox }  from 'element-plus';
export default {
  name: "Admin",
  setup(){
    const loadJson    = inject('loadJson');
    const notify      = inject('notify');
    const userId      = inject('userId');

    const adminsId    = ref(null);
    const admin       = ref(null);
    const admins      = reactive([]);
    const adminsList  = reactive([]);

    const editorsId   = ref(null);
    const editor      = ref(null);
    const editors     = reactive([]);
    const editorList  = reactive([]);

    const svg         = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
    const loading     = ref(false);

    const errors      = reactive({
      admin  : null,
      editor : null,
    })

    async function searchAdmin(query){
      let url = '/claims/search/user';
      let result = await loadJson(url, {q: query});
      if (result.status === 'success') {
        adminsList.length = 0;
        result.data.forEach(el => adminsList.push(el));
      };
    };
    async function searchEditor(query){
      let url = '/claims/search/user';
      let result = await loadJson(url, {q: query});
      if (result.status === 'success') {
        editorList.length = 0;
        result.data.forEach(el => editorList.push(el));
      };
    };

    async function addAdmin(){
      if (admin.value) {
        admins.push({value : admin.value, label : 'не важно'});
        await updateAdmin();
      }
        else errors.admin = 'Необходимо указать ФИО';
    };
    function removeAdmin(index){
      ElMessageBox.confirm('Вы уверены, что хотите удалить администратора?')
          .then(async () => {
            admins.splice(index,1);
            await updateAdmin();
          })
          .catch(() => {})
    };
    async function updateAdmin(){
      loading.value = true;
      let id = [];
      id = admins.map(el => {return el.value});

      let result = await loadJson('/claims/role/set', {role_id : adminsId.value, users  : id, user_id : userId.value});
      if (result.status == 'success') {
        admin.value = null;
        await getData();
      };
      loading.value = false;
      notify('Добавление администратора', result.message, result.status);
    };

    async function addEditor(){
      if (editor.value){
        editors.push({value : editor.value, label : 'не важно'});
        await updateEditor();
      }

        else errors.editor = 'Необходимо указать ФИО';

    };
    function removeEditor(index){
      ElMessageBox.confirm('Вы уверены, что хотите удалить редактора?')
        .then(async() => {
            editors.splice(index,1);
            await updateEditor();
        })
        .catch(() => {})
    };
    async function updateEditor(){
      loading.value = true;
      let id = [];
      id = editors.map(el => {return el.value});
      let result = await loadJson('/claims/role/set', {role_id : editorsId.value, users  : id, user_id : userId.value});
      if (result.status == 'success') {
          editor.value = null;
          await getData();
      };
      loading.value = false;
      notify('Добавление редактора', result.message, result.status)
    };

    async function getData(){
      loading.value = true;
      let result = await loadJson('/claims/role/get', {user_id : userId.value});
      if (result.status == 'success' && result.data.length > 0){
        result.data.forEach(el => {
          if (el.name == 'admin'){
            adminsId.value = el.id;
            admins.length = 0;
            el.users.forEach(item =>admins.push(item));
          }
          if (el.name == 'editor'){
            editorsId.value = el.id;
            editors.length = 0;
            el.users.forEach(item =>editors.push(item));
          }
        })

      }
      loading.value = false;
    };
    getData()

    watchEffect(() => {
      admin.value  ? errors.admin  = null : '';
      editor.value ? errors.editor = null : '';
    })

    return{
      admin, admins, adminsList, editor, editors, editorList, errors,
      svg, loading,
      searchAdmin, searchEditor,
      updateAdmin, addAdmin, removeAdmin,
      updateEditor, addEditor, removeEditor
    }
  },
}
</script>

<style scoped>

</style>
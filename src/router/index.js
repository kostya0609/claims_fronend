import { createRouter, createWebHistory } from 'vue-router'
import List from '../views/List'
import Detail from '../views/Detail'
import Add from '../views/Add'
import Report from '../views/Report'
import Admin from '../views/Admin'

const routes = [
  {
    path      : '/nrt_claims/list',
    name      : 'list',
    component : List,
    // alias     : '/'
  },
  {
    path      : '/nrt_claims/list/add',
    name      : 'add',
    component : Add,
  },
  {
    path      : '/nrt_claims/list/detail/:id',
    name      : 'detail',
    component : Detail,
  },
  {
    path      : '/nrt_claims/report',
    name      : 'report',
    component : Report,
  },
  {
    path      : '/nrt_claims/admin',
    name      : 'admin',
    component : Admin,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

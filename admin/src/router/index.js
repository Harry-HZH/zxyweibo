import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../views/Main.vue'
import Account from '../views/Account.vue'
import CurrentHot from '../views/CurrentHot'
import CurrentHotMap from '../views/CurrentHotMap'
import PastHot from '../views/PastHot'
import PastHotMap from '../views/PastHotMap'
import PastHotArticle from '../views/PastHotArticle'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      { path: '/admin/account', component: Account, name: 'account' },
      { path: '/hotsearch/current', component: CurrentHot },
      { path: '/hotsearch/currentmap', component: CurrentHotMap },
      { path: '/hotsearch/past', component: PastHot },
      { path: '/hotsearch/pastmap', component: PastHotMap },
      { path: '/hotsearch/pasthotarticle/:url', component: PastHotArticle, props: true, name: 'pasthotarticle' },

    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

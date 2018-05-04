import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/components/Dashboard";
import NewTask from "@/components/NewTask";
import EditTask from "@/components/EditTask";
import ViewCols from "@/components/ViewCols";
import Login from "@/components/Login";
import Register from "@/components/Register";
import firebase from "firebase";
Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: {
        requiresGuest: true
      }
    },
    // {
    //   path: "/register",
    //   name: "register",
    //   component: Register,
    //   meta: {
    //     requiresGuest: true
    //   }
    // },
    {
      path: "/new",
      name: "new-task",
      component: NewTask,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/edit/:task_id",
      name: "edit-task",
      component: EditTask,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/cols",
      name: "view-cols",
      component: ViewCols,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: "/login",
        // query: {
        //   redirect: to.fullPath
        // }
      });
    } else {
      // Proceed to route
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login      
      if (to.name=="login"){
        next({
          path: '/'
          
        });
      }else{
        next();
      }
      
    } else {
      // Proceed to route
      next();
    }
  } else {
    // Proceed to route
    next();
  }
});

export default router;

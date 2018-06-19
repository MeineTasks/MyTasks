import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/components/Dashboard";
import NewTask from "@/components/NewTask";
import EditTask from "@/components/EditTask";
import ViewCols from "@/components/ViewCols";
import Login from "@/components/Login";
import Register from "@/components/Register";
import AdminDash from "@/components/admn";
import ViewAll from "@/components/ViewAll";
import ViewProjects from "@/components/ProjectView";
import ViewWeek from "@/components/WeekView";
import ViewGantt from "@/components/ViewGantt";
import ViewUsers from "@/components/viewUsers";


import firebase from "firebase";
Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      meta: {
        requiresAuth: true
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
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: {
        requiresGuest: true
      }
    },
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
    },
    {
      path: "/admn",
      name: "admin",
      component: AdminDash,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/all",
      name: "viewall",
      component: ViewAll,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/projects",
      name: "viewprojects",
      component: ViewProjects,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/week",
      name: "viewweek",
      component: ViewWeek,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/gantt",
      name: "viewgantt",
      component: ViewGantt,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/users",
      name: "viewusers",
      component: ViewUsers,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard #1
  if (to.matched.some(record => record.meta.requiresAuth)) {
    //console.log("#1")
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      //console.log("#1.1")
      // Go to login
      next({
        path: "/login"
        // query: {
        //   redirect: to.fullPath
        // }
      });
    } else {
      // Proceed to route
      //console.log("#1.2")
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    //console.log("#2")
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      //console.log("#2.1")
      // Go to login
      if (to.name == "login") {
        //console.log("#2.1.1")
        next({
          path: "/view/cols",
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        //console.log("#2.1.2")
        next({ path: "/" });
      }
    } else {
      // Proceed to route
      //console.log("#2.2")
      next();
    }
  } else {
    //console.log("#3")
    // Proceed to route
    next();
  }
});

export default router;

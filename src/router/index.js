import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/components/Dashboard";
import iTime from "@/components/iTime";
import Backlog from "@/components/BackLog";

// import ViewAll from "@/components/ViewAll";
// import MyActive from "@/components/MyActive";
// import ViewGantt from "@/components/ViewGantt";

import ViewUsers from "@/components/viewUsers";
import ViewProjCat from "@/components/viewProjCat";

import NewTask from "@/components/NewTask_Mng";
import NewPrivateTask from "@/components/NewPrivateTask";

import EditTask from "@/components/EditTask";
import EditTask_MNG from "@/components/EditTask_Mng";

import Login from "@/components/Login";
// import Register from "@/components/Register";
import AdminDash from "@/components/admn";

import firebase from "firebase";
// import db from "../components/firebaseInit";
import RTDB from "../components/firebaseInitRTDB";
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
      path: "/itime",
      name: "iTime",
      component: iTime,
      meta: {
        requiresAuth: true
      }
    },
    // {
    //   path: "/view/all",
    //   props: true,
    //   name: "viewall",
    //   component: ViewAll,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: "/view/cols",
    //   name: "view-cols",
    //   component: MyActive,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    // {
    //   path: "/view/gantt",
    //   name: "viewgantt",
    //   component: ViewGantt,
    //   meta: {
    //     requiresAuth: true
    //   }
    // },
    {
      path: "/backlog",
      name: "backlog",
      component: Backlog,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/view/users",
      name: "viewusers",
      component: ViewUsers,
      meta: {
        requiresAuth: true,
        requiresMng: false
      }
    },
    {
      path: "/view/projcat",
      name: "viewprojcat",
      component: ViewProjCat,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/new",
      name: "new-task",
      component: NewTask,
      meta: {
        requiresAuth: true,
        requiresMng: true
      }
    },
    {
      path: "/AddNew",
      name: "new-privateTask",
      component: NewPrivateTask,
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
      path: "/edit_mng/:task_id",
      name: "edit-task_mng",
      component: EditTask_MNG,
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
    // {
    //   path: "/register",
    //   name: "register",
    //   component: Register,
    //   meta: {
    //     requiresGuest: true
    //   }
    // },
    {
      path: "/admn",
      name: "admin",
      component: AdminDash,
      meta: {
        requiresAuth: true
      }
    }
  ]
});

// Nav Guard
router.beforeEach((to, from, next) => {
  //remove previous tooltips
  $(".material-tooltip").remove();
  // console.log(to,from,next)
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
      // only for managers
      if (to.matched.some(record => record.meta.requiresMng)) {
        var UID = firebase.auth().currentUser.uid;

        RTDB.ref("/USERS/")
          .orderByKey()
          .equalTo(UID)
          .once("value", querySnapshot => {
            if (
              querySnapshot.val()[UID].isManager ||
              firebase.auth().currentUser.email == "ciprian.ciresaru@ipsos.com"
            ) {
              next();
            } else {
              next({
                path: "/"
              });
            }
          });

        // db.collection("Users")
        //   .doc(firebase.auth().currentUser.uid)
        //   .get()
        //   .then(doc => {
        //     if (doc.data().isManager) {
        //       next();
        //     } else {
        //       next({
        //         path: "/"
        //       });
        //     }
        //   });
      } else {
        next();
      }
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
          path: "/",
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

<template>
  <div id="app">   
    <Navbar :isManager="isManager" :isLoggedIn="isLoggedIn" />
    <div style="margin-top:10px">
      <router-view
      :tasksDashboard="tasksDashboard"      
      :tasksMyActive="tasksMyActive"
      
      :chartData="chartData"
      :isLoggedIn="isLoggedIn"
      :isManager="isManager"
      />
    </div>    
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import db from "./components/firebaseInit";
import firebase from "firebase";
import RTDB from "./components/firebaseInitRTDB";

export default {
  name: "App",
  components: { Navbar },
  data() {
    return {
      isLoggedIn: false,
      isManager: false,
      userEmail: "",
      hasDone: false,
      viewDone: null,
      tasksDashboard: [],
      tasksAllview: [],
      tasksMyActive: [],
      logData: [],
      chartData: []
    };
  },
  mounted() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      var vueObj = this;
      var UID = firebase.auth().currentUser.uid;
      // SET manager
      RTDB.ref("/USERS/")
        .orderByKey()
        .equalTo(UID)
        .once("value", querySnapshot => {
          if (querySnapshot.val()[UID].isManager) {
            vueObj.isManager = true;
          }
        });

      RTDB.ref("/USERS/" + UID + "/TASKS/")
        .orderByChild("t_isActive")
        .equalTo(true)
        .on("value", querySnapshot => {
          vueObj.tasksDashboard = [];
          //this.tasksAllview = [];

          function taskCalculated(Deadline) {
            var aziEOD = new Date().setHours(24);
            var aziSOD = new Date().setHours(0);
            var Calculated = { tCategory: null, tDelayed: null };
            // console.log(Deadline)
            // console.log(new Date(Deadline))
            if (Deadline == null || Deadline == "") {
              Calculated.tCategory = "1";
              Calculated.tDelayed = false;
            } else if (new Date(Deadline) < new Date(aziSOD)) {
              Calculated.tCategory = "2";
              Calculated.tDelayed = true;
            } else if (new Date(Deadline) < new Date(aziEOD)) {
              Calculated.tCategory = "2";
              Calculated.tDelayed = false;
            } else {
              Calculated.tCategory = "3";
              Calculated.tDelayed = false;
            }
            return Calculated;
          }
          // console.log(querySnapshot.val());
          const queryOBJ = querySnapshot.val();
          for (var prop in queryOBJ) {
            var tskCalculated = taskCalculated(queryOBJ[prop].tDeadline);

            // console.log(queryOBJ[prop].tName);
            const data = {
              id: prop,
              task_name: queryOBJ[prop].tName,
              task_description: queryOBJ[prop].tDescription.replace(
                /\n/g,
                "<br/>"
              ),
              task_projectCategory: queryOBJ[prop].tProjCateg,
              task_project: queryOBJ[prop].tProject,
              task_attachement: queryOBJ[prop].tAttach
                ? queryOBJ[prop].tAttach
                : [],
              task_deadline: queryOBJ[prop].tDeadline,
              task_FTE: queryOBJ[prop].tFTE ? queryOBJ[prop].tFTE : "none",
              task_status: queryOBJ[prop].tStatus,
              task_completed: queryOBJ[prop].tStatus == "Completed",
              task_canceled: queryOBJ[prop].tStatus == "Canceled",
              task_inProgress: queryOBJ[prop].tStatus == "In progress",
              task_onHold: queryOBJ[prop].tStatus == "On hold",
              t_isPrivate: queryOBJ[prop].tProjCateg == "Personal",
              task_isActive: queryOBJ[prop].t_isActive,
              task_Category: tskCalculated.tCategory,
              task_Delayed: tskCalculated.tDelayed
            };

            vueObj.tasksDashboard.push(data);
          }

          this.tasksMyActive = this.tasksDashboard.filter(function(task) {
            return (
              task.task_status == "In progress" || task.task_status == "On hold"
            );
          });
          this.SetGraphic();
        });
    }
  },
  BKP_mounted() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      db.collection(firebase.auth().currentUser.uid)
        .where("t_isActive", "==", true)
        .onSnapshot(querySnapshot => {
          this.tasksDashboard = [];
          //this.tasksAllview = [];

          function taskCalculated(Deadline) {
            var aziEOD = new Date().setHours(24);
            var aziSOD = new Date().setHours(0);
            var Calculated = { tCategory: null, tDelayed: null };
            // console.log(Deadline)
            // console.log(new Date(Deadline))
            if (Deadline == null || Deadline == "") {
              Calculated.tCategory = "1";
              Calculated.tDelayed = false;
            } else if (new Date(Deadline) < new Date(aziSOD)) {
              Calculated.tCategory = "2";
              Calculated.tDelayed = true;
            } else if (new Date(Deadline) < new Date(aziEOD)) {
              Calculated.tCategory = "2";
              Calculated.tDelayed = false;
            } else {
              Calculated.tCategory = "3";
              Calculated.tDelayed = false;
            }
            return Calculated;
          }

          querySnapshot.forEach(doc => {
            var tskCalculated = taskCalculated(doc.data().tDeadline);
            const data = {
              id: doc.id,
              task_name: doc.data().tName,
              task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
              task_projectCategory: doc.data().tProjCateg,
              task_project: doc.data().tProject,
              task_attachement: doc.data().tAttach,
              task_deadline: doc.data().tDeadline,
              task_FTE: doc.data().tFTE ? doc.data().tFTE : "none",
              task_status: doc.data().tStatus,
              task_completed: doc.data().tStatus == "Completed",
              task_canceled: doc.data().tStatus == "Canceled",
              task_inProgress: doc.data().tStatus == "In progress",
              task_onHold: doc.data().tStatus == "On hold",
              t_isPrivate: doc.data().tProjCateg == "Personal",
              task_isActive: doc.data().t_isActive,
              task_Category: tskCalculated.tCategory,
              task_Delayed: tskCalculated.tDelayed
            };
            this.tasksDashboard.push(data);
          });
          // filter data
          // this.tasksDashboard = this.tasksAllview.filter(function(task) {
          //   return task.task_isActive == true;
          // });

          this.tasksMyActive = this.tasksDashboard.filter(function(task) {
            return (
              task.task_status == "In progress" || task.task_status == "On hold"
            );
          });

          this.SetGraphic();
        });
    }
  },
  methods: {
    SetGraphic() {
      this.chartData = [];

      var C_inProgress = 0;
      var C_OnHold = 0;
      var C_Complete = 0;
      this.tasksDashboard.forEach(task => {
        if (task.task_inProgress) {
          C_inProgress++;
        }
        if (task.task_onHold) {
          C_OnHold++;
        }
        if (task.task_completed) {
          C_Complete++;
        }
      });
      this.chartData.push(["In progress", C_inProgress]);
      this.chartData.push(["On hold", C_OnHold]);
      this.chartData.push(["Completed", C_Complete]);
    }
  }
};
</script>
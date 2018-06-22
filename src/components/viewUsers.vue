<template>
    <div id="dashboard" style="margin: 0px 25px;">
        <!-- filter -->
        <div class="row z-depth-2 filterContainer brown lighten-4">
            Filter by status:
            <div class="input-field col s12">
                <span @click="GetFire_ForTasks(opt)" v-for="opt in nStatusesList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedStatus==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
            </div>
        </div>
        <!-- user tasks -->
        <div v-for="user in UsersAndArrays" v-bind:key="user.id" class="z-depth-1">
            <div v-if="user.OBJ.tasks.length>0" class="row  valign-wrapper" style="border-bottom: #484545 solid 1px; ">
                <!-- first coll -->
                <div class="col m2">
                    <span class="chip">
                    {{user.OBJ.name}}
                </span>
                    <div class="row"><b>{{user.OBJ.tasks.length}}</b> tasks</div>
                    <div class="row red-text"><b>{{sumFTA(user.OBJ.tasks)}}</b> FTE</div>
                </div>
                <!-- second coll -->
                <div class="col m10">
                    <!-- card container structure -->
                    <div v-for="task in user.OBJ.tasks" v-bind:key="task.id" class="col m2 s12" v-bind:class="{'OnHold':task.task_status=='On hold'}">
                        <div class="card blue-grey darken-1">
                            <!-- card tittle -->
                            <div class="card-content white-text">
                                <!-- project category -->
                               <span class="truncate tooltip"> 
                                  {{task.task_project}}
                                  <!-- <span class="tooltiptext">
                                      [{{task.task_ProjCat}}]: {{task.task_project}}
                                    </span>
                                    <span>
                                      [{{task.task_ProjCat}}]: {{task.task_project}}
                                    </span> -->                                  
                                 </span>
                                <span class="card-title truncate cyan-text tooltip"> 
                                  <span class="tooltiptext">
                                    {{task.task_name}}
                                  </span>
                                  <span>
                                    {{task.task_name}}
                                  </span>                                  
                                </span>
                                <div class="row" style="margin-left:0px">
                                    <div class="chip col">{{task.task_status}}</div>
                                    <span class="col">{{task.task_deadline}}</span>
                                    <span v-if="task.task_FTE!=undefined && task.task_FTE!=''" class="red-text col">{{task.task_FTE}} FTE</span>
                                </div>
                                <hr/>
                                <!-- START icon container -->
                                <div class="row iconContainer">
                                    <div class="col m3 tooltip">
                                      <span class="tooltiptext2">Edit</span>
                                        <router-link v-bind:to="{name:'edit-task_mng',params:{task_id:task.id},query:{uid:task.task_owner} }">
                                            <i class="fas fa-edit"></i>
                                        </router-link>
                                    </div>
                                    <div v-if="task.task_status!='Completed' && task.task_status!='Canceled'" class="col m3">
                                      <span v-bind:class="{'myBtn':!task.task_completed}" class="tooltip">
                                        <span class="tooltiptext2">Complete</span>
                                        <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                                      </span>
                                    </div>
                                    <div class="col m3">
                                        <span class="myBtn tooltip">
                                            <span class="tooltiptext2">In progress/on hold</span>
                                            <i @click="StartStop(task)" v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'" class="far"></i>
                                        </span>
                                    </div>
                                     <div class="col m3">
                                        <span class="myBtn tooltip">
                                            <span class="tooltiptext2">Cancel</span>
                                            <i @click="CancelTask(task)" class="fas fa-ban"></i>
                                        </span>
                                    </div>
                                </div>
                                <!-- END icon container -->
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="fixed-action-btn">
          <router-link to ="/new" class="btn-floating btn-large red">
            <i class="fa fa-plus"></i>
          </router-link>
        </div>
    </div>
</template>

<script>
import db from "./firebaseInit";
import firebase from "firebase";

var moment = require("moment");

export default {
  name: "userview",
  data() {
    return {
      //   users: fireList.OwnersList,
      nStatusesList: [
        "All active",
        "In progress",
        "On hold",
        "Completed",
        "Canceled"
      ],
      UsersAndArrays: [],
      nSelectedStatus: null
    };
  },
  mounted() {
    this.GetFire_users();
  },
  methods: {
    GetFire_users() {
      var objVue = this;
      db
        .collection("Users")
        .where("isOwner", "==", true)
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            const data = {
              OBJ: {
                name: LstItem.data().Label,
                tasks: [],
                UID: LstItem.id
              }
            };

            objVue.UsersAndArrays.push(data);
          });
          function sortTasks(a, b) {
            if (a.OBJ.name < b.OBJ.name) return -1;
            if (a.OBJ.name > b.OBJ.name) return 1;
            return 0;
          }
          objVue.UsersAndArrays.sort(sortTasks);

          objVue.GetFire_ForTasks("All active");
        });
    },
    GetFire_ForTasks(opt) {
      var objVue = this;
      objVue.nSelectedStatus = opt;

      objVue.UsersAndArrays.forEach(itm => {
        objVue.GetFire_userTasks(itm.OBJ);
      });
    },
    GetFire_userTasks(OBJ) {
      var objVue = this;
      db
        .collection(OBJ.UID)
        .where("t_isActive", "==", true)
        .onSnapshot(querySnapshot => {
          // reset
          OBJ.tasks = [];

          var queryString;
          queryString =
            objVue.nSelectedStatus == undefined ||
            objVue.nSelectedStatus == "All active"
              ? "doc.data().tStatus == 'In progress' || doc.data().tStatus == 'On hold'"
              : "doc.data().tStatus == '" + objVue.nSelectedStatus + "'";

          querySnapshot.forEach(doc => {
            //custom filter

            if (eval(queryString)) {
              const data = {
                id: doc.id,
                task_name: doc.data().tName,
                task_description: doc
                  .data()
                  .tDescription.replace(/\n/g, "<br/>"),
                task_start: moment(doc.data().tStart, "YYYY-MM-DD").format(
                  "DD-MMM"
                ),
                task_deadline: moment(
                  doc.data().tDeadline,
                  "YYYY-MM-DD"
                ).format("DD-MMM"),
                task_FTE: doc.data().tFTE,
                task_wkNo: moment(doc.data().tDeadline, "YYYY-MM-DD").week(),
                task_project: doc.data().tProject,
                task_ProjCat: doc.data().tProjCateg,
                task_status: doc.data().tStatus,
                task_owner: OBJ.UID
              };
              //   objVue.tasks_test.push(data);
              // objVue[TaskArray].push(data)
              OBJ.tasks.push(data);
            }
          });
          // call next function
        });
    },
    CompleteTask(task) {
      if (!task.task_completed) {
        db
          .collection(task.task_owner)
          .doc(task.id)
          .update({
            tStatus: "Completed",
            tClosedDate:moment().format("YYYY-MM-DD")
          })
          .catch(function(error) {
            console.error("Error writing document CompleteTask: ", error);
          });
      }
    },
      CancelTask(task) {
      if (!task.task_completed) {
        db
          .collection(task.task_owner)
          .doc(task.id)
          .update({
            tStatus: "Canceled"
          })
          .catch(function(error) {
            console.error("Error writing document CompleteTask: ", error);
          });
      }
    },
    StartStop(task) {
      var newStatus =
        task.task_status == "In progress" ? "On hold" : "In progress";
      db
        .collection(task.task_owner)
        .doc(task.id)
        .update({
          tStatus: newStatus
        })
        .then(docRef => {
          db
            .collection("Log")
            .add({
              date:
                new Date().toString().slice(0, 9) +
                " " +
                new Date(new Date()).toString().split(" ")[4],
              tName: task.task_name,
              updated: "Status:" + task.task_status + "##" + newStatus,
              user: firebase.auth().currentUser.email
            })
            .catch(function(error) {
              console.error("Error adding document ChangedInfo: ", error);
            });
        })
        .catch(function(error) {
          console.error("Error writing document CompleteTask: ", error);
        });
    },
    sumFTA(TaskArray) {
      var sum = 0;
      TaskArray.forEach(task => {
        if (
          task.task_FTE != undefined &&
          task.task_FTE != "TBD" &&
          task.task_FTE != null &&
          task.task_FTE != "" &&
          task.task_status == "In progress"
        ) {
          // console.log(task.task_FTE)
          sum += parseFloat(task.task_FTE);
        }
      });
      return sum.toFixed(2);
    }
  }
};
</script>

<style scoped>
.card{
  margin-bottom: 3px !important;
}
.card-title{
  line-height: normal !important;
  font-size: 20px !important;
  margin-bottom: 0px !important;
}
.card-content {
  padding: 5px !important;
}
.card-content > .row{
  margin-bottom: 0px !important;
  padding: 0px !important;
}
.Delayed {
  color: #ee6e73;
}
.row {
  /* margin-bottom: 0px !important;   */
  padding: 5px;
  margin-bottom: 8px !important;
}
.col .row {
  margin-left: 0px !important;
}
.myBtn {
  cursor: pointer;
  border-radius: 4px;
  width: 20px;
  height: 20px;
}
.fas,
.far {
  opacity: 0.6;
}
.fas:not(.fa-clipboard-check):hover {
  opacity: 1;
}
.far:hover {
  opacity: 1;
}
.fa-edit {
  color: #26a69a;
  opacity: 0.6;
}
.fa-ban{
  color:#fb9d9d;
}
.fa-clipboard-check {
  color: #a5a5a5;
}

.tooltiptext {
  visibility: hidden;
  font-size: 20px;
  background-color: #484545;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 3px;
  top: -15px;

  /* Position the tooltip */
  position: absolute;
  
}
.tooltiptext2 {
  
  visibility: hidden;
  font-size: 12px;
  background-color: #484545;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  top: 80px;
  white-space: nowrap;

  /* Position the tooltip */
  position: absolute;
}

.tooltip:hover .tooltiptext,.tooltip:hover .tooltiptext2 {
  visibility: visible;
  z-index: 100;
}
.tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 10%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #484545 transparent transparent transparent;
}
.OnHold {
  opacity: 0.6;
}
.fa-stop-circle {
  color: #ff9800;
}
.fa-play-circle {
  color: #9cffa0;
}
.iconContainer {
  text-align: center;
}
.mySingle {
  cursor: pointer;
}
.mySingleSelected {
  background: teal;
  color: white;
}
.filterContainer {
  padding: 5px;
  margin-top: 5px;
}
</style>


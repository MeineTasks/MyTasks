<template>
  <div id="dashboard">         
    <div class="fixed-action-btn">
      <router-link to ="/new" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
    <div class="row">
       <div style="background: #f2f2f2" class="col m4 s12">
        <center><h3>No date</h3></center>
        <!-- vue component structure 1 -->
        <div v-for="task in ViewCat1" v-bind:key="task.id" class="col s6" v-bind:class="{'OnHold':task.task_status=='On hold'}">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title truncate cyan-text tooltip"> 
                <span class="tooltiptext">
                  {{task.task_name}}
                </span>
                {{task.task_name}}
              </span>
              <span v-html="task.task_description"></span>
              <hr/>
              <div class="row" style="margin-left:0px">
                <div class="chip col">{{task.task_status}}</div>
                <span class="col">{{task.task_deadline}}</span>
               </div>
              <hr/>
              <!-- START icon container -->
              <div class="row iconContainer">
                <div class="col m4">
                  <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                    <i class="fas fa-edit"></i>
                  </router-link>    
                </div>
                <div class="col m4">                  
                  <span v-bind:class="{'myBtn':!task.task_completed}">
                    <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                  </span>
                </div>
                 <div class="col m4">                  
                  <span class="myBtn">
                    <i @click="StartStop(task)" v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'" class="far"></i>
                  </span>
                </div>                
              </div>
              <!-- END icon container -->
            </div>           
          </div>
        </div>
      </div>
      <div style="background: #d9cfc7" class="col m4 s12">
        <center><h3>Today</h3></center>
        <!-- vue component structure 2-->
        <div v-bind:class="{'OnHold':task.task_status=='On hold'}" v-for="task in ViewCat2" v-bind:key="task.id" class="col s6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title truncate cyan-text tooltip"> 
                <span class="tooltiptext">
                  {{task.task_name}}
                </span>
                {{task.task_name}}
              </span>
              <span v-html="task.task_description"></span>
              <hr/>
              <div class="row" style="margin-left:0px">
                <div class="chip col">{{task.task_status}}</div>
                <span v-bind:class="{'Delayed':task.task_Delayed}" class="col">{{task.task_deadline}}</span>
               </div>
              <hr/>
             <!-- START icon container -->
              <div class="row iconContainer">
                <div class="col m4">
                  <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                    <i class="fas fa-edit"></i>
                  </router-link>    
                </div>
                <div class="col m4">                  
                  <span v-bind:class="{'myBtn':!task.task_completed}">
                    <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                  </span>
                </div>
                 <div class="col m4">                  
                  <span class="myBtn">
                    <i @click="StartStop(task)" v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'" class="far"></i>
                  </span>
                </div>                
              </div>
              <!-- END icon container -->
            </div>           
          </div>
        </div>
      </div>
      <div style="background:#a69992" class="col m4 s12">
        <center><h3>Future</h3></center>
        <!-- vue component structure 3 -->
        <div v-bind:class="{'OnHold':task.task_status=='On hold'}" v-for="task in ViewCat3" v-bind:key="task.id" class="col s6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title truncate cyan-text tooltip"> 
                <span class="tooltiptext">
                  {{task.task_name}}
                </span>
                {{task.task_name}}
              </span>
              <span v-html="task.task_description"></span>
              <hr/>
              <div class="row" style="margin-left:0px">
                <div class="chip col">{{task.task_status}}</div>
                <span class="col">{{task.task_deadline}}</span>
               </div>
              <hr/>
             <!-- START icon container -->
              <div class="row iconContainer">
                <div class="col m4">
                  <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                    <i class="fas fa-edit"></i>
                  </router-link>    
                </div>
                <div class="col m4">                  
                  <span v-bind:class="{'myBtn':!task.task_completed}">
                    <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                  </span>
                </div>
                 <div class="col m4">                  
                  <span class="myBtn">
                    <i @click="StartStop(task)" v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'" class="far"></i>
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
</template>

<script>
import firebase from "firebase";
import db from "./firebaseInit";

export default {
  name: "view-cols",
  data() {
    return {
      tasks: []
    };
  },
  created() {
    db
      .collection(firebase.auth().currentUser.uid)
      .where("t_isActive", "==", true)
      // .orderBy("tDeadline", "asc")
      //.where("tStatus", "==", "In progress")
      .onSnapshot(querySnapshot => {
        this.tasks = [];

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
          if (
            doc.data().tStatus == "In progress" ||
            doc.data().tStatus == "On hold"
          ) {
            var tskCalculated = taskCalculated(doc.data().tDeadline);
            const data = {
              id: doc.id,
              task_name: doc.data().tName,
              task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
              task_deadline: doc.data().tDeadline,
              task_status: doc.data().tStatus,
              task_completed: doc.data().tStatus == "Completed",
              task_canceled: doc.data().tStatus == "Canceled",
              task_Category: tskCalculated.tCategory,
              task_Delayed: tskCalculated.tDelayed
            };
            this.tasks.push(data);
          }
        });
      });
  },
  computed: {
    ViewCat1: function() {
      return this.tasks.filter(function(task) {
        return task.task_Category == "1";
      });
    },
    ViewCat2: function() {
      return this.tasks.filter(function(task) {
        return task.task_Category == "2";
      });
    },
    ViewCat3: function() {
      return this.tasks.filter(function(task) {
        return task.task_Category == "3";
      });
    }
  },
  mounted() {
    // alert("S")
    // $('.tooltipped').tooltip();
  },
  methods: {
    CompleteTask(task) {
      if (!task.task_completed) {
        db
          .collection(firebase.auth().currentUser.uid)
          .doc(task.id)
          .update({
            tStatus: "Completed"
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
                updated: "Status:" + task.task_status + "##Completed",
                user: firebase.auth().currentUser.email
              })
              .catch(function(error) {
                console.error("Error adding document ChangedInfo: ", error);
              });
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
        .collection(firebase.auth().currentUser.uid)
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
    }
  }
};
</script>

<style scoped>
.card-content {
  padding: 10px !important;
}
.Delayed {
  color: #ee6e73;
}
.row {
  margin-bottom: 0px !important;
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
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
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
</style>

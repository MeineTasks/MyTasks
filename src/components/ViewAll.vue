<template>
  <div id="dashboard" style="margin: 0px 50px;">    
    <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m2 s12">Description</h6>   
        <h6 class="col m2 s12">Project</h6>     
        <h6 class="col m2 s12">Status</h6>
        <h6 class="col m2 s12">Deadline</h6>        
        <h6 class="col m1 s12">Is active</h6>
        <h6 class="col iconContainer">
          <!-- <span class="red-text">Close</span> -->
          <span class="white-text">Edit</span>
        </h6>
    </div>
    <!-- view in progress -->
    <div v-bind:class="{'notActive':!task.task_isActive}" v-for="task in tasks" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><b>{{task.task_name}}</b></div>
        <div class="col m2 s12 tskDetails" v-html="task.task_description"></div>     
        <div class="col m2 s12 truncate"><i>{{task.task_project}}</i></div>   
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>     
        <div class="col m1 s12">{{task.task_isActive}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
          <!-- <div class="col ">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div> -->
          <div class="col ">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div> 
    </div>
    <!-- add new -->
        <div class="fixed-action-btn">
          <router-link to ="/AddNew" class="btn-floating btn-large blue">
            <i class="fa fa-plus-square"></i>
          </router-link>
        </div>
  </div>
  
</template>

<script>
import db from "./firebaseInit";
import firebase from "firebase";

export default {
  name: "dashboard",
  data() {
    return {
      isLoggedIn: false,
      hasDone: false,
      viewDone: null,
      tasks: [],
      logData: []
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      db
        .collection(firebase.auth().currentUser.uid)
        .orderBy("t_isActive","desc")
        .onSnapshot(querySnapshot => {
          this.tasks = [];
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              task_name: doc.data().tName,
              task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
              task_deadline: doc.data().tDeadline,
              task_status: doc.data().tStatus,
              task_project:doc.data().tProject,
              task_isActive:doc.data().t_isActive
            };
            this.tasks.push(data);
          });
        });      
    }
  },  
  methods: {
    CloseTask(task) {
      db
        .collection(firebase.auth().currentUser.uid)
        .doc(task.id)
        .set({ t_isActive: false }, { merge: true })
        .then(docRef => {
            console.log("task closed")
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    }
  }
};
</script>

<style scoped>
.Completed {
  opacity: 0.7;
  background: #cff1d0 !important;
}
.Canceled > div {
  text-decoration: line-through;
  opacity: 0.5;
}
.inProgress {
  background: #d6e9fd !important;
}
.secondary-content {
  margin-right: 5px;
  float: right;
}
.row {
  margin-bottom: 5px !important;
}
.logTigle {
  color: teal;
}

.sidenav > li {
  padding: 5px;
  background: #ececec;
}
.iconContainer {
  float: right;
  text-align: right;
}
.fa-trash-alt {
  color: #f5764e;
}
.fa-edit {
  color: #00bcd4;
}
.fas {
  opacity: 0.6;
}
.fas:hover {
  opacity: 1;
}
.notActive{
    background: lightgray
}
.tskDetails{
  display: block;
  overflow: hidden;
  word-break: break-word;
}
</style>



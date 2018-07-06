<template>
  <div id="dashboard" style="margin: 0px 50px;">    
    <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m4 s12">Description</h6>        
        <h6 class="col m2 s12">Project</h6>        
        <h6 class="col m2 s12">Status</h6>
        <h6 class="col m1 s12">Deadline</h6>        
        <h6 class="col m1 iconContainer">
          <span class="red-text">Archive</span>
          <span class="white-text">Edit</span>
        </h6>
    </div>
    <!-- view in progress -->
    <div v-bind:class="[{'Completed':task.ViewInProgress},{'Canceled':task.task_canceled},{'inProgress':task.task_inProgress}]" v-for="task in ViewInProgress" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
        <div class="col m4 s12 tskDetails" v-html="task.task_description"></div>        
        <div class="col m2 s12 truncate"><i>{{task.task_project}}</i></div>        
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
          <div class="col ">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div>
          <div class="col ">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div>   
               
    </div>
    <!-- view on hold  -->
    <div v-bind:class="[{'Completed':task.ViewInProgress},{'Canceled':task.task_canceled},{'inProgress':task.task_inProgress}]" v-for="task in ViewOnHold" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
        <div class="col m4 s12 tskDetails" v-html="task.task_description"></div>
        <div class="col m2 s12 truncate"><i>{{task.task_project}}</i></div>        
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
          <div class="col ">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div>
          <div class="col ">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div>       
    </div>
    <hr/>
    <!-- view Completed  -->
    <div v-bind:class="[{'Completed':task.ViewInProgress},{'Canceled':task.task_canceled},{'inProgress':task.task_inProgress}]" v-for="task in ViewCompleted" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
        <div class="col m4 s12 tskDetails" v-html="task.task_description"></div>
        <div class="col m2 s12 truncate"><i>{{task.task_project}}</i></div>         
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
          <div class="col ">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div>
          <div class="col ">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div>         
    </div>
     <!-- view Canceled  -->
    <div v-bind:class="[{'Completed':task.ViewInProgress},{'Canceled':task.task_canceled},{'inProgress':task.task_inProgress}]" v-for="task in ViewCanceled" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
        <div class="col m4 s12 tskDetails" v-html="task.task_description"></div>
        <div class="col m2 s12 truncate"><i>{{task.task_project}}</i></div>        
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
          <div class="col ">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div>
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
        .where("t_isActive", "==", true)
        .onSnapshot(querySnapshot => {
          this.tasks = [];
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              task_name: doc.data().tName,
              task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
              task_project:doc.data().tProject,              
              task_deadline: doc.data().tDeadline,
              task_status: doc.data().tStatus,
              task_completed: doc.data().tStatus == "Completed",
              task_canceled: doc.data().tStatus == "Canceled",
              task_inProgress: doc.data().tStatus == "In progress",
              task_onHold: doc.data().tStatus == "On hold"
            };
            this.tasks.push(data);
          });
        });
     
    }
  },
  computed: {
    ViewOnHold: function() {
      return this.tasks.filter(function(task) {
        return task.task_onHold == true;
      });
    },
    ViewInProgress: function() {
      return this.tasks.filter(function(task) {
        return task.task_inProgress == true;
      });
    },
    ViewCompleted: function() {
      return this.tasks.filter(function(task) {
        return task.task_completed == true;
      });
    },
    ViewCanceled: function() {
      return this.tasks.filter(function(task) {
        return task.task_canceled == true;
      });
    }
  },
  updated() {
    // $(".sidenav").sidenav();
    $('.tooltipped').tooltip();
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
.tskDetails{
  display: block;
  overflow: hidden;
  word-break: break-word;
}
</style>



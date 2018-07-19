<template>
  <div id="dashboard" style="margin: 0px 50px;">    
    <div class="row hide-on-small-only myHeader">
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m3 s12">Description</h6>   
        <h6 class="col m1 s12">Category</h6>     
        <h6 class="col m2 s12">Attachments</h6>
        <h6 class="col m1 s12">Status</h6>
        <h6 class="col m1 s12">Deadline</h6>        
        <h6 class="col m1 s12">Is archived</h6>
        <h6 class="col iconContainer">
          <!-- <span class="red-text">Close</span> -->
          <span >Edit</span>
        </h6>
    </div>
    <!-- view in progress -->
    <div v-bind:class="[{'notActive':task.task_isActive},task.task_status.replace(' ','')]" v-for="task in tasks" v-bind:key="task.id" class="row z-depth-1">                
        <div class="col m2 s12"><span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
        <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>     
        <div class="col m1 s12 truncate"><i>{{task.task_projectCategory}}</i></div>
        <div class="col m2 s12">
              <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
              <span id="Attachment_span" v-html="attach" >                
              </span>
            </div>
        </div>
        <div class="col m1 s12"><i>{{task.task_status}}</i></div>
        <div class="col m1 s12">{{task.task_deadline}}</div>     
        <div class="col m1 s12">{{task.task_isActive}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
          <!-- <div class="col ">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div> -->
          <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Edit</span>">
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
  updated() {
    // $(".sidenav").sidenav();
    $('.tooltipped').tooltip();
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
              task_projectCategory:doc.data().tProjCateg,
              task_project:doc.data().tProject,
              task_attachement:doc.data().tAttach,
              task_isActive:!doc.data().t_isActive
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
            $(".material-tooltip").removeAttr("style")
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    }
  }
};
</script>

<style scoped>
h6{
  font-weight: 500
}

.Inprogress {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #a0cfff;
  border-bottom: solid 1px lightgrey;
}
.Onhold {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #FFC107;
  border-bottom: solid 1px lightgrey;
}
.Completed {
  opacity: 0.7;
  /* background: #cff1d0 !important; */
   border-left: solid 7px #69c56c;
  border-bottom: solid 1px lightgrey;
}

.Canceled{
  border-left: solid 7px lightgrey;
  border-bottom: solid 1px lightgrey;
}
.Canceled > div {
  text-decoration: line-through;
  opacity: 0.5;
}
.secondary-content {
  margin-right: 5px;
  float: right;
}
.row {
  margin-bottom: 3px !important;
  background-color: white !important
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
.info2{
  color: red !important
}
.myHeader{ 
 border-bottom: solid 2px black
}
</style>



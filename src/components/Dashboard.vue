<template>
  <div id="dashboard" style="margin: 0px 50px;">    
    <div class="row hide-on-small-only myHeader">      
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m3 s12">Description</h6>
        <h6 class="col m1 s12">Category</h6>
        <h6 class="col m2 s12">Attachments</h6>
        <h6 class="col m1 s12">Status</h6>
        <h6 class="col m1 s12">Deadline</h6>
        <h6 class="col m iconContainer">
          <span class="">Quick actions</span>
        </h6>
    </div>
    <!-- view in progress -->
    <div v-for="task in ViewInProgress" v-bind:key="task.id" class="row inProgress">        
        <div class="col m2 s12"><span ><b>{{task.task_name}}</b></span></div>
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
        <!-- icons  -->
        <div v-if="isLoggedIn" class="col iconContainer" >
          
          <div v-if="task.t_isPrivate" class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Delete</span>">
            <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
          </div>

          <!-- <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Archive</span>">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div> -->
          <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Edit</span>">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div>   
               
    </div>
    <!-- view on hold  -->
    <div v-for="task in ViewOnHold" v-bind:key="task.id" class="row OnHold">        
        <div class="col m2 s12"><span><b>{{task.task_name}}</b></span></div>
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
        <!-- icons   -->
        <div v-if="isLoggedIn" class="col iconContainer" >
          <div v-if="task.t_isPrivate" class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Delete</span>">
            <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
          </div>
          <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Archive</span>">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div>
          <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Edit</span>">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div>       
    </div>
    <hr/>
    <!-- view Completed  -->
    <div v-for="task in ViewCompleted" v-bind:key="task.id" class="row Completed">        
        <div class="col m2 s12"><span><b>{{task.task_name}}</b></span></div>
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
        <!-- icons   -->
        <div v-if="isLoggedIn" class="col iconContainer" >
          <div v-if="task.t_isPrivate" class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Delete</span>">
            <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
          </div>
          <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Archive</span>">
            <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
          </div>
          <div class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Edit</span>">
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>  
          </div>
        </div>         
    </div>
     <!-- view Canceled  -->
    <div v-for="task in ViewCanceled" v-bind:key="task.id" class="row Canceled">        
        <div class="col m2 s12 truncate"><span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
        <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>
        <div class="col m1 s12 truncate"><i>{{task.task_project}}</i></div>
         <div class="col m2 s12">
              <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
              <span id="Attachment_span" v-html="attach" >                
              </span>
            </div>
        </div>
        <div class="col m1 s12"><i>{{task.task_status}}</i></div>
        <div class="col m1 s12">{{task.task_deadline}}</div>     
        <div v-if="isLoggedIn" class="col iconContainer" >
           <div v-if="task.t_isPrivate" class="col tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Delete</span>">
            <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
          </div>
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
              task_projectCategory:doc.data().tProjCateg,
              task_project:doc.data().tProject,    
              task_attachement:doc.data().tAttach,
              task_deadline: doc.data().tDeadline,
              task_status: doc.data().tStatus,              
              task_completed: doc.data().tStatus == "Completed",
              task_canceled: doc.data().tStatus == "Canceled",
              task_inProgress: doc.data().tStatus == "In progress",
              task_onHold: doc.data().tStatus == "On hold",
              t_isPrivate:doc.data().tProjCateg == "Personal"
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
            $(".material-tooltip").removeAttr("style");
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
      DeleteTask(task) {

      if (window.confirm("The task will be permanently deleted, are you sure?")){
          db
          .collection(firebase.auth().currentUser.uid)
          .doc(task.id)
            .delete()
            .then(function() {
                $(".material-tooltip").removeAttr("style");
            });
      }
    }
  }
};
</script>

<style scoped>
h6{
  font-weight: 500
}
.inProgress {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #a0cfff;
  border-bottom: solid 1px lightgrey;
}
.OnHold {
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
  margin-bottom: 5px !important;
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
  color: #8a4f3b;
}
.fa-edit {
  color: #00bcd4;
}
.DelIcn{
  color:#ea1010
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
.myHeader{
 border-bottom: solid 2px black
}

</style>
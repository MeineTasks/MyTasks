<template>
  <div id="dashboard">         
    <div class="fixed-action-btn">
      <router-link to ="/new" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
    <div class="row">
       <div style="background: #c6f3e3" class="col m4 s12">
        <center><h3>Cip</h3></center>
        <!-- vue component structure -->
        <div v-bind:class="[{'Completed':task.task_completed},{'Canceled':task.task_canceled}]" v-for="task in ViewCat1" v-bind:key="task.id" class="col s6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title truncate cyan-text"> {{task.task_name}} </span>
              <span v-html="task.task_description"></span>
              <hr/>
              <div class="row" style="margin-left:0px">
                <div class="chip col">{{task.task_status}}</div>
                <span class="col">{{task.task_deadline}}</span>
               </div>
              <hr/>
              <div class="row">
                <div class="col m4">
                  <router-link class="right" v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                    <i class="fas fa-edit"></i>
                  </router-link>    
                </div>
                <div class="col m4">                  
                  <span v-bind:class="{'myBtn':!task.task_completed}">
                    <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                  </span>
                </div>
              </div>
            </div>           
          </div>
        </div>
      </div>
      <div style="background: #c6eef3" class="col m4 s12">
        <center><h3>Pipo</h3></center>
        <!-- vue component structure -->
        <div v-bind:class="[{'Completed':task.task_completed},{'Canceled':task.task_canceled}]" v-for="task in ViewCat2" v-bind:key="task.id" class="col s6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title truncate cyan-text"> {{task.task_name}} </span>
              <span v-html="task.task_description"></span>
              <hr/>
              <div class="row" style="margin-left:0px">
                <div class="chip col">{{task.task_status}}</div>
                <span class="col">{{task.task_deadline}}</span>
               </div>
              <hr/>
              <div class="row">
                <div class="col m4">
                  <router-link class="right" v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                    <i class="fas fa-edit"></i>
                  </router-link>    
                </div>
                <div class="col m4">                  
                  <span v-bind:class="{'myBtn':!task.task_completed}">
                    <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                  </span>
                </div>
              </div>
            </div>           
          </div>
        </div>
      </div>
      <div style="background: #eab7ac" class="col m4 s12">
        <center><h3>Ana</h3></center>
        <!-- vue component structure -->
        <div v-bind:class="[{'Completed':task.task_completed},{'Canceled':task.task_canceled}]" v-for="task in ViewCat3" v-bind:key="task.id" class="col s6">
          <div class="card blue-grey darken-1">
            <div class="card-content white-text">
              <span class="card-title truncate cyan-text"> {{task.task_name}} </span>
              <span v-html="task.task_description"></span>
              <hr/>
              <div class="row" style="margin-left:0px">
                <div class="chip col">{{task.task_status}}</div>
                <span class="col">{{task.task_deadline}}</span>
               </div>
              <hr/>
              <div class="row">
                <div class="col m4">
                  <router-link class="right" v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                    <i class="fas fa-edit"></i>
                  </router-link>    
                </div>
                <div class="col m4">                  
                  <span v-bind:class="{'myBtn':!task.task_completed}">
                    <i @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" class="fas"></i>
                  </span>
                </div>
              </div>
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
      .collection("Tasks")
      //.orderBy("tStatus", "desc")
      .where("tStatus", "==", "In progress")
      .onSnapshot(querySnapshot => {
        this.tasks = [];
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            task_name: doc.data().tName,
            task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
            task_deadline: doc.data().tDeadline,
            task_owner: doc.data().tOwner,
            task_status: doc.data().tStatus,
            task_completed: doc.data().tStatus == "Completed",
            task_canceled: doc.data().tStatus == "Canceled"
          };
          this.tasks.push(data);
        });
      });
  },
  computed: {
    ViewCat1: function() {
      return this.tasks.filter(function(task) {
        return task.task_owner == "Cip";
      });
    },
    ViewCat2: function() {
      return this.tasks.filter(function(task) {
        return task.task_owner == "Pipo";
      });
    },
    ViewCat3: function() {
      return this.tasks.filter(function(task) {
        return task.task_owner == "Ana";
      });
    }
  },
  methods: {
    CompleteTask(task) {
      if (!task.task_completed) {
        db
          .collection("Tasks")
          .doc(task.id)
          .update({
            tStatus: "Completed"
          })
          .then(docRef => {
            db
              .collection("Log")
              .add({
                date: new Date().toString().slice(0,9) +" "+new Date(new Date()).toString().split(' ')[4],
                tName: task.task_name,
                updated:
                  "Status:" +
                  task.task_status +
                  "##Completed",
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
  }
};
</script>
<style scoped>
.card-content {
  padding: 10px !important;
}
.Completed {
  opacity: 0.7;
}
.Canceled {
  text-decoration: line-through;
  opacity: 0.5;
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
.fas {
  opacity: 0.6;
}
.fas:not(.fa-clipboard-check):hover {
  opacity: 1;
}
.fa-edit {
  color: #26a69a;
  opacity: 0.6;
}
.fa-clipboard-check {
  color: #a5a5a5;
}
</style>

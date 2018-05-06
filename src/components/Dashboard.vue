<template>
  <div id="dashboard" style="margin: 0px 50px;">    
    <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m3 s12">Description</h6>        
        <h6 class="col m2 s12">Status</h6>
        <h6 class="col m2 s12">Deadline</h6>        
        <h6 class="col secondary-content"><span class="secondary-content white-text"> Edit</span></h6>
    </div>
    <div v-bind:class="[{'Completed':task.task_completed},{'Canceled':task.task_canceled},{'inProgress':task.task_inProgress}]" v-for="task in tasks" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><b>{{task.task_name}}</b></div>
        <div class="col m3 s12" v-html="task.task_description"></div>        
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>        
        <router-link v-if="isLoggedIn" class="col secondary-content" v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
          <i class="fas fa-edit secondary-content"></i>
        </router-link>         
    </div>    

    <div v-if="isLoggedIn" class="fixed-action-btn">
      <router-link to ="/new" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </router-link>
    </div>
    <div style="margin-bottom:100px"></div> 

    <div v-if="isLoggedIn" class="fixed-action-btn" style="left:23px;width:150px">
    <span data-target="slide-out" class="sidenav-trigger btn-floating btn-large">
      <i class="fas fa-eye"></i>
    </span>
    </div>

    <ul id="slide-out" class="sidenav" style="width: 50vw;">
      <h5>Updates:</h5>
     <li v-for="log in logData" class="container"  v-bind:key="log.id" style="margin-top: 5px;line-height: unset">
       Task: <span class="logTigle">{{log.log_name}}</span><br/>
       Updated: {{log.log_date}}<br/>
       By: {{log.log_user}}<br/>
        <span v-for="update in log.log_updated" v-bind:key="update.id">
         <b><i>{{update.campName}}</i></b> > <span v-html="update.campValues"></span><br/>
        </span>
     </li>
    </ul>
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
      tasks: [],
      logData: []
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      db
        .collection(firebase.auth().currentUser.uid)
        .orderBy("tStatus", "desc")
        .onSnapshot(querySnapshot => {
          this.tasks = [];
          querySnapshot.forEach(doc => {
            const data = {
              id: doc.id,
              task_name: doc.data().tName,
              task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
              task_deadline: doc.data().tDeadline,
              task_status: doc.data().tStatus,
              task_completed: doc.data().tStatus == "Completed",
              task_canceled: doc.data().tStatus == "Canceled",
              task_inProgress: doc.data().tStatus == "In progress"
            };
            this.tasks.push(data);
          });
        });

      db
        .collection("Log")
              .doc(firebase.auth().currentUser.uid)
              .collection("LogCollection")
        .orderBy("date")
        .onSnapshot(querySnapshot => {
          this.logData = [];
          var logDataObj = [];

          querySnapshot.forEach(doc => {
            logDataObj = [];
            const data = {
              id: doc.id,
              log_date: doc.data().date,
              log_name: doc.data().tName,
              log_updated: logDataObj,
              log_user: doc.data().user
            };
            var logUpdates = doc.data().updated;
            logUpdates.split("||").forEach(camp => {
              camp.split(":");
              logDataObj.push({
                campName: camp.split(":")[0],
                campValues:
                  "<b>from</b> " +
                  camp.split(":")[1].split("##")[0] +
                  " <b>to</b> " +
                  camp.split(":")[1].split("##")[1]
              });
            });
            this.logData.push(data);
          });
        });
    }
  },
  mounted() {
    $(".sidenav").sidenav();
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
</style>



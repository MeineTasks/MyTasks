<template>
  <div id="edit-task" class="container">
    <h3>Edit task</h3>
    <div class="row">
      <form @submit.prevent="updateTask" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input placeholder="Task name" type="text" v-model="task_name"
              required>
            <label class="active">Name:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea id="textarea1" placeholder="Task details" v-model="task_details"
              required />
            <label for="textarea1" class="active">Details:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="StartDate" type="date" placeholder="start date"
              v-model="task_start">
            <label class="active">Start date:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="DeadLine" type="date" placeholder="Task deadline"
              v-model="task_deadline">
            <label class="active">Deadline:</label>
          </div>
        </div>  
        <div class="row">
          <div class="input-field col s12">
           <select required style="display:block" v-model="task_status">
              <option v-for="status in Statuses" v-bind:key="status.id"
                v-bind:value="status">{{status}}</option>
            </select>
            <label class="active">Status:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
           <select required style="display:block" v-model="task_project">
              <option v-for="project in Projects" v-bind:key="project.id"
                v-bind:value="project">{{project}}</option>
            </select>
            <label class="active">Project:</label>
          </div>
        </div>
         <div v-if="task_project=='IQConcepts'" class="row">
          <div class="input-field col s12">
           <select style="display:block" v-model="task_env">
              <option v-for="env in Environments" v-bind:key="env.id"
                v-bind:value="env">{{env}}</option>
            </select>
            <label class="active">On environment:</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <select required style="display:block" v-model="task_isActive">
              <option>Yes</option>
              <option>No</option>
            </select>
            <label class="active">Is active:</label>            
          </div>
        </div>
        <button type="submit" class="btn">Save</button>
        <router-link to="/view/cols" class="btn grey">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import db from "./firebaseInit";
import fireList from "./fireLists";

export default {
  name: "edit-task",
  data() {
    return {
      task_name: null,
      task_details: null,
      task_start:null,   
      task_deadline: null,      
      task_status: null,
      task_project:null,
      task_isActive:null,
      task_env:null,
      orig_task_name: null,
      orig_task_details: null,
      orig_task_start:null,      
      orig_task_deadline: null,      
      orig_task_status: null,      
      Statuses:fireList.statusesList,
      Projects:fireList.myProjectsList,
      Environments:fireList.envList
    };
  },
  methods: {
    updateTask() {
      //validate end start times
      if (new Date($("#DeadLine").val())<new Date($("#StartDate").val())){
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border","solid red 1px")
        return false;
      }

      db
        .collection(firebase.auth().currentUser.uid)
        .doc(this.$route.params.task_id)
        .set({
          tName: this.task_name,
          tDescription: this.task_details,      
          tStart:this.task_start,    
          tDeadline: this.task_deadline,          
          tStatus: this.task_status,
          tProject:this.task_project,
          tEnvironment:this.task_env?this.task_env:"",
          t_isActive:this.task_isActive=="Yes"
        })
        .then(docRef => {
          //log the info
          var ChangedInfo = "";
          if (this.orig_task_name != this.task_name) {
            ChangedInfo =
              ChangedInfo +
              "Task name:" +
              this.orig_task_name +
              "##" +
              this.task_name +
              "||";
          }
          if (this.orig_task_details != this.task_details) {
            ChangedInfo =
              ChangedInfo +
              "Details:" +
              this.orig_task_details +
              "##" +
              this.task_details +
              "||";
          }
          if (this.orig_task_deadline != this.task_deadline) {
            ChangedInfo =
              ChangedInfo +
              "Deadline:" +
              this.orig_task_deadline +
              "##" +
              this.task_deadline +
              "||";
          }
          if (this.orig_task_start != this.task_start) {
            ChangedInfo =
              ChangedInfo +
              "Start:" +
              this.orig_task_start +
              "##" +
              this.task_start +
              "||";
          }     
          if (this.orig_task_status != this.task_status) {
            ChangedInfo =
              ChangedInfo +
              "Status:" +
              this.orig_task_status +
              "##" +
              this.task_status +
              "||";
          }
          //  console.log(ChangedInfo.slice(0,-2))
          //log the change
          if (ChangedInfo != "") {
            db
              .collection("Log")
              .doc(firebase.auth().currentUser.uid)
              .collection("LogCollection")
              .add({
                date: new Date().toString().slice(0,10) +" "+new Date(new Date()).toString().split(' ')[4],
                tName: this.task_name,
                updated: ChangedInfo.slice(0, -2)
              })
              .catch(function(error) {
                console.error("Error adding document ChangedInfo: ", error);
              });
          }
          this.$router.push("/view/cols");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    }
  },
  created() {
    db
      .collection(firebase.auth().currentUser.uid)
      .doc(this.$route.params.task_id)
      .get()
      .then(doc => {
        this.task_name = doc.data().tName;
        this.task_details = doc.data().tDescription;    
        this.task_start= doc.data().tStart;
        this.task_deadline = doc.data().tDeadline;        
        this.task_status = doc.data().tStatus;
        this.task_project=doc.data().tProject;
        this.task_env=doc.data().tEnvironment;
        this.task_isActive = doc.data().t_isActive?"Yes":"No";
        this.orig_task_name = this.task_name;        
        this.orig_task_details = this.task_details;        
        this.orig_task_start=this.task_start;
        this.orig_task_deadline = this.task_deadline;        
        this.orig_task_status = this.task_status;
      }); 
  }
};
</script>

<style>
textarea {
  margin-top: 10px;
  height: 107px;
}
.row{
  margin:10px 0px;
}
</style>


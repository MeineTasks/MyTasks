<template>
<div id="new-task" class="container">
  <h3>Add new task</h3>
  <div class="row">
      <form @submit.prevent="saveTask" class="col s12">
          <div class="row">
              <div class="input-field col s12">
                  <input placeholder="Task name" type="text" v-model="task_name" required>
                  <label class="active">Name:</label>
              </div>
          </div>
         <!-- timings -->
          <div class="row">
              <div class="input-field col">
                  <input id="StartDate" type="date" placeholder="start date" v-model="task_start">
                  <label class="active">Start date:</label>
              </div>
              <div class="input-field col">
                  <input id="DeadLine" type="date" placeholder="Task deadline" v-model="task_deadline">
                  <label class="active">Deadline:</label>
              </div>              
          </div>
          
          <!-- status -->
          <div class="row">
              <label class="active">Status:</label>
              <div class="input-field col s12">
                  <span @click="nSelectedStatus=opt" v-for="opt in nStatusesList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedStatus==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
              </div>
          </div>
         
           <div class="row">
              <span v-if="!showDetails" @click="showDetails=true" class="waves-effect waves-light btn-small black-text blue-grey lighten-4">Add details</span>
              <span v-if="showDetails" @click="showDetails=false" class="waves-effect waves-light btn-small blue-grey lighten-2">Hide details</span>
              <div v-if="showDetails" class="input-field col s12">
                  <textarea id="textarea1" placeholder="Task details" v-model="task_details" required />
                  <label for="textarea1" class="active">Details:</label>
              </div>
          </div>
          <button type="submit" class="btn brown lighten-1">Save</button>
          <router-link to="/view/cols" class="btn grey">Cancel</router-link>
      </form>
  </div>
</div>
</template>

<script>
import db from "./firebaseInit";
import fireList from "./fireLists";
import firebase from "firebase";

var moment = require("moment");

export default {
  name: "new-task",
  data() {
    return {      
      showDetails: false,

      task_name: null,
      task_details: "",
      task_start: moment().weekday(1).format("YYYY-MM-DD"),
      task_deadline: moment().weekday(5).format("YYYY-MM-DD"),
      task_status: null,
      
      Statuses: fireList.statusesList,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress",

      
    };
  },
  methods: {
    SetDeadline() {
      this.task_deadline = moment(this.task_start, "YYYY-MM-DD")
        .weekday(5)
        .format("YYYY-MM-DD");
    },   
    saveTask() {
      //validate end start times
      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }
  
      db
        .collection(firebase.auth().currentUser.uid)
        .add({
          tName: this.task_name,
          tDescription: this.task_details, //(this.task_details) ? this.task_details : '',
          tStart: this.task_start,
          tDeadline: this.task_deadline,
          tProjCateg: "Personal",
          
          tStatus: this.nSelectedStatus,          
          // tOwner:this.SelectedOwner,
          t_isActive: true,
          isPrivate:true
        })
        .then(docRef => this.$router.push("/"))
        .catch(error => console.log(err));
    },

  }
};
</script>
<style scoped>
textarea {
  margin-top: 10px;
  height: 107px;
}
input[type="date"] {
  width: 150px;
}
.mySingle {
  cursor: pointer;
}
.mySingleSelected {
  background: teal;
  color: white;
}
</style>

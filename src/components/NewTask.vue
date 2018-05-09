<template>
  <div id="new-task" class="container">
    <h3>Add new task</h3>
    <div class="row">
      <form @submit.prevent="saveTask" class="col s12">
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
            <input type="date" placeholder="Task deadline"
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

export default {
  name: "new-task",
  data() {
    return {
      task_name: null,
      task_details: null,      
      task_deadline: null,      
      task_status: null,
      Statuses: fireList.statusesList
    };
  },
  methods: {
    saveTask() {
      db
        .collection(firebase.auth().currentUser.uid)
        .add({
          tName: this.task_name,
          tDescription: this.task_details,          
          tDeadline: this.task_deadline,
          tStatus: this.task_status,
          t_isActive:true
        })
        .then(docRef => this.$router.push("/"))
        .catch(error => console.log(err));
    }
  }
};
</script>
<style>
textarea {
  margin-top: 10px;
  height: 107px;
}
</style>

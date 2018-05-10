<template>
  <div id="dashboard" style="margin: 0px 50px;">   
      <!-- select project -->
         <div class="row">
          <div class="input-field col s12">
           <select style="display:block;width: 150px;"  @change="GetData()" v-model="SelectedProject">
              <option v-for="project in Projects" v-bind:key="project.id"
                v-bind:value="project">{{project}}</option>
            </select>
            <label class="active">View Project:</label>
          </div>
        </div>
      
    <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m2 s12">Description</h6>   
        <h6 class="col m2 s12">Project</h6>     
        <h6 class="col m2 s12">Status</h6>
        <h6 class="col m2 s12">Deadline</h6>        
        <h6 class="col m1 s12">Is active</h6>       
    </div>
    <!-- view in progress -->
    <div v-bind:class="{'notActive':!task.task_isActive}" v-for="task in tasks" v-bind:key="task.id" class="row z-depth-2">        
        <div class="col m2 s12 truncate"><b>{{task.task_name}}</b></div>
        <div class="col m2 s12" v-html="task.task_description"></div>     
        <div class="col m2 s12 truncate"><i>{{task.task_project}}</i></div>   
        <div class="col m2 s12"><i>{{task.task_status}}</i></div>
        <div class="col m2 s12">{{task.task_deadline}}</div>     
        <div class="col m1 s12">{{task.task_isActive}}</div>              
               
    </div>
  </div>
  
</template>

<script>
import db from "./firebaseInit";
import firebase from "firebase";
import fireList from "./fireLists";

export default {
  name: "viewProject",
  data() {
    return {      
      tasks: [],
      SelectedProject:null,
      Projects:fireList.projectsList
    };
  },  
  methods: {
    GetData() {
        console.log(fireList.membersList)
      db
        .collection(firebase.auth().currentUser.uid)
        .where("tProject","==",this.SelectedProject)
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
  }

}
</script>

<style>

</style>

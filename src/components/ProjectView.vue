<template>
  <div id="dashboard" style="margin: 0px 50px;">   
      <!-- select project -->
         <div class="row">
          <div class="input-field col s12">
           <select style="display:block;width:150px;background:#e4e3e2;height:35px;margin-top:5px;"  @change="GetData()" v-model="SelectedProject">
              <option v-for="project in Projects" v-bind:key="project.id"
                v-bind:value="project">{{project}}</option>
            </select>
            <label class="active">View Project:</label>
          </div>
        </div>
      
    <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
        <h6 class="col m2 s12">Task name</h6>
        <h6 class="col m4 s12">Description</h6>           
        <h6 class="col m2 s12">Status</h6>
        <h6 class="col m2 s12">Deadline</h6>        
        
    </div>
    <!-- view in progress -->
    <div v-if="hasCip" class="row">
      <span class="chip">Cip</span>
      <div v-bind:class="{'notActive':!task.task_isActive}" v-for="task in tasksCip" v-bind:key="task.id" class="row z-depth-2">        
          <div class="col m2 s12 truncate"><b>{{task.task_name}}</b></div>
          <div class="col m4 s12" v-html="task.task_description"></div>                     
          <div class="col m2 s12"><i>{{task.task_status}}</i></div>
          <div class="col m2 s12">{{task.task_deadline}}</div>                                   
      </div>
    </div>
    <div v-if="hasTest" class="row">
      <span class="chip">Test</span>
      <div v-bind:class="{'notActive':!task.task_isActive}" v-for="task in tasksTest" v-bind:key="task.id" class="row z-depth-2">        
          <div class="col m2 s12 truncate"><b>{{task.task_name}}</b></div>
          <div class="col m4 s12" v-html="task.task_description"></div>                     
          <div class="col m2 s12"><i>{{task.task_status}}</i></div>
          <div class="col m2 s12">{{task.task_deadline}}</div>                                   
      </div>
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
      tasksCip: [],
      hasCip:false,
      tasksTest: [],
      hasTest:false,
      SelectedProject: null,
      Projects: fireList.projectsList
    };
  },
  methods: {
    GetData() {
      //console.log(fireList.membersList)      
      db
          .collection("YqRVNtuUu3aAHt6g2YW05OxIsj42")
          .where("t_isActive", "==", true)
          .where("tProject", "==", this.SelectedProject)        
          .orderBy("tDeadline")
          .onSnapshot(querySnapshot => {            
            this.tasksCip = [];
            this.hasCip=false;
              querySnapshot.forEach(doc => {
                this.hasCip=true;
                        const data = {
                          id: doc.id,
                          task_name: doc.data().tName,
                          task_description: doc
                            .data()
                            .tDescription.replace(/\n/g, "<br/>"),
                          task_deadline: doc.data().tDeadline,
                          task_owner: "Cip",
                          task_status: doc.data().tStatus,
                          task_project: doc.data().tProject,
                          task_isActive: doc.data().t_isActive
                        };
                        this.tasksCip.push(data);
                      });
          })
      db
          .collection("YPPNyRXLbXZhfgZ6i4ITY68kqY02")
          .where("t_isActive", "==", true)
          .where("tProject", "==", this.SelectedProject)
          .orderBy("tDeadline")
          .onSnapshot(querySnapshot => {
            this.tasksTest=[];
            this.hasTest=false;
              querySnapshot.forEach(doc => {
                this.hasTest=true;
                        const data = {
                          id: doc.id,
                          task_name: doc.data().tName,
                          task_description: doc
                            .data()
                            .tDescription.replace(/\n/g, "<br/>"),
                          task_deadline: doc.data().tDeadline,
                          task_owner: "test",
                          task_status: doc.data().tStatus,
                          task_project: doc.data().tProject,
                          task_isActive: doc.data().t_isActive
                        };
                        this.tasksTest.push(data);
                      });
          })    
    }
  }
};
</script>

<style scoped>
.row{
      margin-bottom: 3px !important;
}
</style>

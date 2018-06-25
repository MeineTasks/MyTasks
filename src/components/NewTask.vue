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
              <select v-model="task_fte" style="display:inline;width:70px" >
                <option v-for="fta in FTAarray" v-bind:key="fta.id"
                  v-bind:value="fta">{{fta}}</option>
              </select> 
              <span>FTE</span>
          </div>
          <!-- projects category -->
          <div class="row">
              <label class="active">Category:</label>
              <div class="input-field col s12">
                  <span @click="SelectedProjCat=opt,getProjects()" v-for="opt in ProjectsCat" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProjCat==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  <a @click="showNewProjCat=true" v-if="!showNewProjCat" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
                  <input v-if="showNewProjCat" v-model="AddNewProjCat" v-on:keydown.enter.prevent="addProjCategory" v-on:keydown.esc.prevent="DelProjCategory" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
              </div>
          </div>

          <!-- project list -->
          <div v-if="showProject" class="row">
              <label class="active">Project:</label>
              <div  class="input-field col s12">
                  <span @click="SelectedProj=opt" v-for="opt in ProjectsList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProj==opt}" class="mySingle chip">
                {{opt}}
              </span>
                  <a @click="showNewProj=true" v-if="!showNewProj" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>                  
                   <input v-if="showNewProj" v-model="AddNewProj" v-on:keydown.enter.prevent="addProj" v-on:keydown.esc.prevent="DelProj" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
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
          <!-- Owners -->
          <div v-if="showOwner" class="row">
              <label class="active">Owner:</label>
              <div class="input-field col s12">
                  <span @click="SelectedOwner=opt,GetUserFTE()" v-for="opt in ownersList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedOwner.Label==opt.Label}" class="mySingle chip">
                    {{opt.Label}}
                  </span>
              </div>
              <div v-if="userFTE!=null" class="red-text" >
                    <!-- {{GetUserFTE()}} -->
                   Active workload: <b>{{userFTE}}</b> FTE
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
      FTAarray: fireList.FTEList,
      task_fte: null,
      showDetails: false,
      showProject: false,
      showNewProj: false,
      showNewProjCat: false,
      showOwner:true,

      task_name: null,
      task_details: "",
      task_start: moment().weekday(1).format("YYYY-MM-DD"),
      task_deadline: moment().weekday(5).format("YYYY-MM-DD"),
      task_status: null,
      task_project: null,
      task_env: null,
      Statuses: fireList.statusesList,

      userTaskArr:[],
      userFTE:null,

      ProjectsCat: [],
      AddNewProjCat: null,
      SelectedProjCat: null,

      ProjectsList: [],
      SelectedProj: null,
      AddNewProj: null,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress",

      ownersList: fireList.OwnersList,
      SelectedOwner: { Label: null, UID: null }
    };
  },
  methods: {
    SetDeadline() {
      this.task_deadline = moment(this.task_start, "YYYY-MM-DD")
        .weekday(5)
        .format("YYYY-MM-DD");
    },
    GetUserFTE(){
      var objVue = this;
      // console.log(objVue.SelectedOwner.Label)
      if (objVue.SelectedOwner.Label!=null){

      db
        .collection(objVue.SelectedOwner.UID)
        .where("t_isActive", "==", true)
        .where("tStatus", "==", "In progress")
        .onSnapshot(querySnapshot => {
          // reset
          objVue.userTaskArr = [];
          querySnapshot.forEach(doc => {
             //custom filter            
              const data = {
                id: doc.id,
                task_name: doc.data().tName,                
                task_FTE: doc.data().tFTE,
                
              };
              //   objVue.tasks_test.push(data);
              // objVue[TaskArray].push(data)
              objVue.userTaskArr.push(data);            
          });
          // call next function
          var sum = 0;
          objVue.userFTE=null
           objVue.userTaskArr.forEach(task =>{              
                if (
                  task.task_FTE != undefined &&
                  task.task_FTE != "TBD" &&
                  task.task_FTE != null &&
                  task.task_FTE != "" 
                ) {
                  // console.log(task.task_FTE)
                  sum += parseFloat(task.task_FTE);
                }
           })
              objVue.userFTE=sum.toFixed(2);
        });

      }
    },   
    saveTask() {
      //validate end start times
      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }
      //validate mandatory fields
      if (
        (this.SelectedProj == null && this.SelectedProjCat!="Personal")||
        this.SelectedProjCat == null ||
        this.nSelectedStatus == null ||
        this.SelectedOwner == null
      ) {
        var message = [];
        var msg = "Please select ";
        var delimit;

        if (this.SelectedProjCat == null) {
          message.push("Project Category");
        }
        if (this.SelectedProj == null && this.SelectedProjCat!="Personal") {
          message.push("Project");
        }
        if (this.nSelectedStatus == null) {
          message.push("Status");
        }
        if (this.SelectedOwner == null) {
          message.push("Owner");
        }

        console.log(message);
        message.forEach(function(i, x) {
          delimit = x < message.length - 1 ? ", " : "";
          msg = msg + i + delimit;
        });

        M.toast({ html: msg });
        return false;
      }

      db
        .collection(this.SelectedOwner.UID)
        .add({
          tName: this.task_name,
          tDescription: this.task_details, //(this.task_details) ? this.task_details : '',
          tStart: this.task_start,
          tDeadline: this.task_deadline,
          tProject: this.SelectedProj,
          tProjCateg: this.SelectedProjCat,
          tStatus: this.nSelectedStatus,
          tFTE:this.task_fte,
          tOwner:this.SelectedOwner,
          t_isActive: true,
          isPrivate:this.SelectedProjCat=="Personal"?true:false
        })
        .then(docRef => this.$router.push("/"))
        .catch(error => console.log(err));
    },

    addProjCategory() {
      var vueObj = this;
      db
        .collection("DropDowns/InnoPipeline/Projects")
        .doc(vueObj.AddNewProjCat)
        .set({
          Projects: []
        })
        .then(function() {
          vueObj.showNewProjCat = false;
        });
    },
    DelProjCategory(opt) {
      var vueObj = this;
      if (vueObj.AddNewProjCat != null) {
        db
          .collection("DropDowns/InnoPipeline/Projects")
          .doc(vueObj.AddNewProjCat)
          .delete()
          .then(function() {
            vueObj.AddNewProjCat = null;
            vueObj.showNewProjCat = false;
          });
      } else {
        vueObj.showNewProjCat = false;
      }
    },
    getProjects() {
      var vueObj = this;

      // backlog
      if (vueObj.SelectedProjCat=="xBacklog"){
        vueObj.ownersList.forEach( owner=>{
          // console.log(owner)
          if (owner.UID=="backlog"){
            vueObj.SelectedOwner=owner  
            vueObj.SelectedProj="Backlog"
            vueObj.nSelectedStatus="On hold"
            return true
          }
        })
      }else{
        //reset backlog
          vueObj.SelectedOwner={ Label: null, UID: null }  
          vueObj.SelectedProj=null
          vueObj.nSelectedStatus="In progress"
      }


      //personal tasks
      if (vueObj.SelectedProjCat=="Personal"){
        vueObj.showProject = false;
        vueObj.showOwner = false;
        vueObj.task_fte="TBD"
        
        var myUID=firebase.auth().currentUser.uid

        vueObj.ownersList.forEach( owner=>{
          // console.log(owner)
          if (owner.UID==myUID){
            vueObj.SelectedOwner=owner  
            return true
          }
        })
        

      }else{
        vueObj.showOwner = true

      db
        .collection(
          "DropDowns/InnoPipeline/Projects/" + vueObj.SelectedProjCat + "/Proj"
        )
        .onSnapshot(querySnapshot => {
          vueObj.ProjectsList = [];

          querySnapshot.forEach(doc => {
            vueObj.ProjectsList.push(doc.id);
          });
          vueObj.showProject = true;
        });
      }
      
    },
    addProj() {
      var vueObj = this;
      db
        .collection(
          "DropDowns/InnoPipeline/Projects/" + vueObj.SelectedProjCat + "/Proj"
        )
        .doc(vueObj.AddNewProj)
        .set({
          Projects: null
        })
        .then(function() {
          vueObj.showNewProj = false;
        });
    },
    DelProj() {
      var vueObj = this;
      db
        .collection(
          "DropDowns/InnoPipeline/Projects/" + vueObj.SelectedProjCat + "/Proj"
        )
        .doc(vueObj.AddNewProj)
        .delete()
        .then(function() {
          vueObj.showNewProj = false;
        });
    }
  },
  mounted() {
    var objVue = this;
    db
      .collection("DropDowns/InnoPipeline/Projects")
      .onSnapshot(querySnapshot => {
        objVue.ProjectsCat = [];
        querySnapshot.forEach(doc => {
          objVue.ProjectsCat.push(doc.id);
        });
        objVue.ProjectsCat.sort();
      });
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

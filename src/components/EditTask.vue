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
        <!-- details -->
        <div class="row">
          <div class="input-field col s12" >
            <label for="textarea1" class="active">Details:</label>
            <textarea id="textarea1" placeholder="Task details" v-model="task_details"/>
            
           <div class="helperfield row">
              <label for="linkDetail" class="col">URL:</label>
              <input id="linkDetail" class="col m4" type="text" v-model="detail_link">
              
              <label for="linkDetail"  class="col">Caption:</label>
              <input id="linkhyper" class="col m2" type="text" v-model="detail_title">
              
              <a @click="AddHyperlink()" class="waves-effect waves-light btn-small col cyan darken-2"   style="margin-right: 10px;">
                <i class="material-icons">public</i>              
                Add attachment hyperlink
              </a>              
            </div>
            
          </div>
        </div>
        <!-- timings -->
        <div class="row">
          <div class="input-field col">
            <input id="StartDate" type="date" placeholder="start date"
              v-model="task_start">
            <label class="active">Start date:</label>
          </div>
          <div class="input-field col">
            <input id="DeadLine" type="date" placeholder="Task deadline"
              v-model="task_deadline">
            <label class="active">Deadline:</label>
          </div>
          <select v-model="task_FTE" style="display:inline;width:70px" >
                <option v-for="fta in FTAarray" v-bind:key="fta.id"
                  v-bind:value="fta">{{fta}}</option>
              </select> 
              <span>FTE</span>
        </div>        
        <!-- projects category -->
          <!-- <div class="row">
              <label class="active">Category:</label>
              <div class="input-field col s12">
                  <span @click="SelectedProjCat=opt,getProjects()" v-for="opt in ProjectsCat" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProjCat==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  <a @click="showNewProjCat=true" v-if="!showNewProjCat" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
                  <input v-if="showNewProjCat" v-model="AddNewProjCat" v-on:keydown.enter.prevent="addProjCategory" v-on:keydown.esc.prevent="DelProjCategory" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
              </div>
          </div> -->

          <!-- project list -->
          <!-- <div class="row">
              <label class="active">Project:</label>
              <div v-if="showProject" class="input-field col s12">
                  <span @click="SelectedProj=opt" v-for="opt in ProjectsList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProj==opt}" class="mySingle chip">
                {{opt}}
              </span>
                  <a @click="showNewProj=true" v-if="!showNewProj" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>                  
                   <input v-if="showNewProj" v-model="AddNewProj" v-on:keydown.enter.prevent="addProj" v-on:keydown.esc.prevent="DelProj" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
              </div>
          </div> -->
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
          <!-- <div class="row">
              <label class="active">Owner:</label>
              <div class="input-field col s12">
                  <span @click="SelectedOwner=opt" v-for="opt in ownersList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedOwner.Label==opt.Label}" class="mySingle chip">
                    {{opt.Label}}
                  </span>
              </div>
          </div> -->
        <div class="row">
          <div class="input-field col s12">
            <select required style="display:block;width:70px;margin-top: 10px;" v-model="task_isActive">
              <option>Yes</option>
              <option>No</option>
            </select>
            <label class="active">Is archived:</label>  
            <span class="info">
              By setting this to <b>Yes</b> the task will only be visible in 'My All' view
            </span>
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
var moment = require("moment");

export default {
  name: "edit-task",
  data() {
    return {
      FTAarray: fireList.FTEList,
      task_FTE: null,
      showDetails: false,
      showProject: true,
      showNewProj: false,
      showNewProjCat: false,
      detail_link:"",
      detail_title:"",

      task_name: null,
      task_details: "",
      task_start: null,
      task_deadline: null,
      task_status: null,
      task_project: null,
      task_env: null,
      task_isActive: null,
      // Statuses: fireList.statusesList,

      // ProjectsCat: [],
      // AddNewProjCat: null,
      // SelectedProjCat: null,

      // ProjectsList: [],
      // SelectedProj: null,
      // AddNewProj: null,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress"

      // ownersList: fireList.OwnersList,
      // SelectedOwner: { Label: null, UID: null }
    };
  },
  methods: {
    updateTask() {
      //validate end start times
      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }

      db
        .collection(firebase.auth().currentUser.uid)
        .doc(this.$route.params.task_id)
        .update({
          tName: this.task_name,
          tDescription: this.task_details,
          tStart: this.task_start,
          tDeadline: this.task_deadline,
          // tFTE: this.task_FTE,
          // tProject: this.SelectedProj,
          // tProjCateg: this.SelectedProjCat,
          tStatus: this.nSelectedStatus,
          // tOwner:this.SelectedOwner,
          // tEnvironment:this.task_env?this.task_env:"",
          ModifiedBy:firebase.auth().currentUser.uid,
          ModifiedDate:moment().format("YYYY-MM-DD HH:MM"),
          t_isActive: this.task_isActive == "No"
        })
        .then(docRef => {       
          console.log("task update done")
          this.$router.push("/view/cols");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
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
    },
    AddHyperlink(){
     if (this.detail_link!=""){
        var title=this.detail_title?this.detail_title:"Click here"

        this.task_details=this.task_details+"\n\n"+"Attachement: <a href='"+this.detail_link+"' target='_blank'>"+title+"</a>"
        this.detail_link=""
        this.detail_title=""
      }else{
        M.toast({ html: "URL field should not be empty" });
      }
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
        this.task_start = doc.data().tStart;
        this.task_deadline = doc.data().tDeadline;
        this.task_FTE = doc.data().tFTE;
        this.nSelectedStatus = doc.data().tStatus;
        this.SelectedProjCat = doc.data().tProjCateg;
        this.SelectedProj = doc.data().tProject;
        // this.SelectedOwner=doc.data().tOwner?doc.data().tOwner:{ Label: null, UID: null };
        this.task_env = doc.data().tEnvironment;
        this.task_isActive = doc.data().t_isActive ? "No" : "Yes";

        // this.orig_task_name = this.task_name;
        // this.orig_task_details = this.task_details;
        // this.orig_task_start=this.task_start;
        // this.orig_task_deadline = this.task_deadline;
        // this.orig_task_status = this.task_status;
        this.getProjects();
      });

    $(".material-tooltip").css("opacity",0)
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
.info{
  color: darkgray;
  font-style: italic;
  border-left: solid 5px darkgray;
  padding-left: 5px;
}
label{
  margin-bottom: 5px
}
</style>


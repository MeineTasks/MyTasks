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
          <span v-if="!showDetails" @click="showDetails=true" class="waves-effect waves-light btn-small black-text blue-grey lighten-4">Add details</span>
          <span v-if="showDetails" @click="showDetails=false" class="waves-effect waves-light btn-small blue-grey lighten-2">Hide details</span>
          <div v-if="showDetails" class="input-field col s12">
            <textarea id="textarea1" placeholder="Task details" v-model="task_details"
              required />
            <label for="textarea1" class="active">Details:</label>
          </div>
        </div> 
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
        </div>
        <!-- projects category -->
        <div class="row">
          <label class="active" >Category:</label>
          <div class="input-field col s12">            
            <span @click="nSelectedProjCat=opt,getProjects()" v-for="opt in ProjectsCat" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedProjCat==opt}" class="mySingle chip">
              {{opt}}
            </span>
            <a @click="showNewProjCat=true" v-if="!showNewProjCat" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
          <input v-if="showNewProjCat" v-model="AddNewProjCat" v-on:keyup.tab="addProjCategory()" type="text">
          </div>
        </div>  

        <!-- project list -->
        <div v-if="showProject" class="row">
          <label class="active" >Project:</label>
          <div class="input-field col s12">            
            <span @click="nSelectedProj=opt" v-for="opt in nProjectsList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedProj==opt}" class="mySingle chip">
              {{opt}}
            </span>
            <a @click="showNewProj=true" v-if="!showNewProj" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
          <input v-if="showNewProj" v-on:keyup.tab="addProj" type="text">
          </div>
        </div> 
        <div class="row">
          <label class="active" >Status:</label>
          <div class="input-field col s12">            
            <span @click="nSelectedStatus=opt" v-for="opt in nStatusesList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedStatus==opt}" class="mySingle chip">
                {{opt}}
              </span>
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
      showDetails:false,
      showProject:false,
      showNewProj:false,
      showNewProjCat:false,
      task_name: null,
      task_details: null, 
      task_start:null,        
      task_deadline: null,      
      task_status: null,
      task_project:null,
      task_env:null,
      Statuses: fireList.statusesList,
      ProjectsCat:fireList.innoProjCat,
      AddNewProjCat:null,
      
      nProjectsList:[],
      nSelectedProjCat:null,
      nSelectedProj:null,
      nStatusesList:fireList.statusesList,
      nSelectedStatus:null
    };
  },
  methods: {
    saveTask() {
      //validate end start times
      if (new Date($("#DeadLine").val())<new Date($("#StartDate").val())){
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border","solid red 1px")
        return false;
      }

      db
        .collection(firebase.auth().currentUser.uid)
        .add({
          tName: this.task_name,
          tDescription: this.task_details,          
          tStart:this.task_start,
          tDeadline: this.task_deadline,
          tStatus: this.task_status,
          tProject:this.task_project,
          t_isActive:true
        })
        .then(docRef => this.$router.push("/"))
        .catch(error => console.log(err));
    },
    getProjects(){
      var vueObj=this
      vueObj.nProjectsList=[]
      
      db.collection("DropDowns/InnoPipeline/Projects")
      .doc(vueObj.nSelectedProjCat)
      .get()       
       .then(doc => {
        // console.log(doc.data())
        doc.data().Projects.forEach(LstItem => {
          // console.log(LstItem)
            vueObj.nProjectsList.push(LstItem);
         });
        vueObj.showProject=true
      });
    },
    addProjCategory(){
      console.log("started")
      var vueObj=this
      db.collection("DropDowns/InnoPipeline/Projects")
      .doc(vueObj.AddNewProjCat)
      .set({
          Projects:[]
      })
      .then(function() {
        console.log("done")
          vueObj.showNewProjCat=false
      })
    },
    addProj(){
      db.collection("DropDowns/InnoPipeline/Projects").set({
          name: "Los Angeles",
          state: "CA",
          country: "USA"
      })
    }
  },
  mounted() {
    // $(".mySingle").click(function(){
    //   $(".mySingle").attr("isSelected",false)
    //   $(this).attr("isSelected",true)
    // })
  }
};
</script>
<style scoped>
textarea {
  margin-top: 10px;
  height: 107px;
}
input[type="date"]{
  width:150px
}
.mySingle{
  cursor: pointer;
}
.mySingleSelected{
  background: teal;
  color:white
}
</style>

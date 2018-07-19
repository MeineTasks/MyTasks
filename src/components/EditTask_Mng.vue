<template>
  <div id="edit-task" class="container">
    <h3>Edit task</h3>
    <div class="row MyContainer">
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
          <div class="input-field col s12">
            <textarea id="textarea1" placeholder="Task details" v-model="task_details"
              />
            <label for="textarea1" class="active">Details:</label>

            
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
          <div class="row">
              <div class="input-field col s12">
              <label class="active">Category:</label>
              <div class="input-field">
                  <span @click="SelectedProjCat=opt,getProjects(true)" v-for="opt in ProjectsCat" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProjCat==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  <a @click="showNewProjCat=true" v-if="!showNewProjCat" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
                  <input v-if="showNewProjCat" v-model="AddNewProjCat" v-on:keydown.enter.prevent="addProjCategory" v-on:keydown.esc.prevent="DelProjCategory" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
                </div>
              </div>
          </div>

          <!-- project list -->
          <div v-if="showProject" class="row">
            <div class="input-field col s12">              
                <label class="active">Project:</label>
                <div class="input-field">
                  <span @click="SelectedProj=opt" v-for="opt in ProjectsList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProj==opt}" class="mySingle chip">
                {{opt}}
              </span>
                  <a @click="showNewProj=true" v-if="!showNewProj" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>                  
                   <input v-if="showNewProj" v-model="AddNewProj" v-on:keydown.enter.prevent="addProj" v-on:keydown.esc.prevent="DelProj" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
                </div>
            </div>  
          </div>
          <!-- status -->
          <div class="row">
              <div class="input-field col s12">
              <label class="active">Status:</label>
                <div class="input-field">
                  <span @click="nSelectedStatus=opt" v-for="opt in nStatusesList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedStatus==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  </div>
              </div>
          </div>
          <!-- Owners -->
          <div class="row">
            <div class="input-field col s12">
            <label class="active">Owner:</label>
               <div class="input-field">
                <div v-if="!showUsers" >
                  <b>{{initialOwner.Label}}</b><br/>
                  <a @click="showUsers=true" style="z-index:0" class="btn waves-effect waves-light blue darken-3">
                    <i class="material-icons right">assignment_ind</i>Change owner
                  </a>
                </div>

                <div v-if="showUsers" class="row">
                    <div class="input-field col s12">
                        <span @click="SelectedOwner=opt" v-for="opt in ownersList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedOwner.UID==opt.UID}" class="mySingle chip">
                          {{opt.Label}}
                        </span>
                    </div>
                </div>
              </div>
              </div>
            </div>

        <div class="row">
          <div class="input-field col s12">
            <label class="active">Is archived:</label>
            <div class="input-field">
              <select required style="display:block;width:150px" v-model="task_isActive">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>  
            <span class="info">
              By setting this to <b>Yes</b> the task will only be visible in 'My All' view
            </span>
          </div>
        </div>
          <!-- Created by -->
          <div class="row">
              <div class="input-field col s12">
                <label class="active">Created by:</label>
                <div class="input-field">
                 <span @click="SelectedManager=mng" v-for="mng in ManagersArray" v-bind:key="mng.id" v-bind:class="{'mySingleSelected':SelectedManager==mng}" class="mySingle chip">
                    {{mng.OBJ.name}}
                  </span>
                </div>  
              </div>
          </div>
          <!-- Attachement -->
            <!-- details -->
        <div class="row">
          <div class="input-field col s12">
            <label for="textarea1" class="active">Attachment:</label>
            <div v-for="attach in task_attachement" v-bind:key="attach.id">
              <span id="Attachment_span" v-html="attach" >                
              </span>              
              <i class="fas fa-minus-square red-text" style="cursor:pointer" @click="RemoveHyperlink(attach)"></i>
            </div>
            <div style="margin-top:10px" class="helperfield row">
                <div class="input-field col m4">
                  <label for="linkDetails" class="col">File URL path:</label>
                  <input id="linkDetails" type="text" v-model="detail_link">
                </div>
                <div class="col m2 input-field">
                  <label for="linkhyper"  class="col">Link caption:</label>
                  <input id="linkhyper" type="text" v-model="detail_title">
                </div>
                <a @click="AddHyperlink()" class="waves-effect waves-light btn-small col cyan darken-2" style="margin-right: 10px;">
                  <i class="material-icons">public</i>              
                  Add attachment hyperlink
                </a>              
            </div>
          </div>
        </div>
     <!-- navigation -->
        <div class="row MyFixed" style="width:100%">
          <div class="col left" style="margin-left:37px;z-index:100">
            <button type="submit" class="btn">Save</button>
            <router-link  v-bind:to="{name:$route.query.mnext}" class="btn grey">Cancel</router-link>
          </div>
          <a @click="DeleteTask" class="btn waves-effect waves-light red darken-4 right"><i class="material-icons right">delete_forever</i>Delete</a>
        </div>
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
      task_FTE: "",
      showDetails: false,
      showProject: true,
      showNewProj: false,
      showNewProjCat: false,
      showUsers:false,

      detail_link:"",
      detail_title:"",
      task_attachement:[],

      task_name: null,
      task_details: "",
      task_start: null,
      task_deadline: null,
      task_status: null,
      task_project: null,
      task_env: null,
      task_isActive: null,
      task_createdBy:null,
      Statuses: fireList.statusesList,

      ManagersArray:[],
      SelectedManager:null,

      ProjectsCat: [],
      AddNewProjCat: null,
      SelectedProjCat: null,

      ProjectsList: [],
      SelectedProj: null,
      AddNewProj: null,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress",

      ownersList: fireList.OwnersList,
      SelectedOwner: { Label: null, UID: null },
      initialOwner: { Label: null, UID: null }
    };
  },
  methods: {
    SetDeadline() {
      this.task_deadline = moment(this.task_start, "YYYY-MM-DD")
        .weekday(5)
        .format("YYYY-MM-DD");
    },
    moveTask(){
      var objVue = this;

      db
        .collection(this.$route.query.uid)
        .doc(this.$route.params.task_id)

    },
    updateTask() {
      var vueObj=this
      var original
      //validate end start times
      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }
      //validari
      var message = [];
      var msg = "Please select ";
      var delimit;

        //project
      if (
        this.SelectedProj == null &&
        !(
          this.SelectedProjCat == "Personal" ||
          this.SelectedProjCat == "xBacklog"
        )
      ) {
        message.push("Project");
      }
      if (this.showUsers) {
        // Owner
        if (this.SelectedOwner.UID == null) {
          message.push("Owner");
        }
      }
         //validate mandatory fields
      // console.log(message);
      if (message.length > 0) {
        message.forEach(function(i, x) {
          delimit = x < message.length - 1 ? ", " : "";
          msg = msg + i + delimit;
        });

        M.toast({ html: msg });
        return false;
      }
      
      
      
      if (vueObj.SelectedOwner.UID!= vueObj.initialOwner.UID) {
        // move existing task
        console.log("reasignare")
          db
          .collection(vueObj.$route.query.uid)
          .doc(vueObj.$route.params.task_id)
          .get()
          .then(doc => {
            // save on new user
            db
            .collection(vueObj.SelectedOwner.UID)
            .doc(vueObj.$route.params.task_id)
            .set(doc.data())
            .then( updt =>{
              // update new task
                db
                .collection(vueObj.SelectedOwner.UID)
                .doc(vueObj.$route.params.task_id)
                .update({
                    tName: vueObj.task_name,
                    tDescription: vueObj.task_details,
                    tStart: vueObj.task_start,
                    tDeadline: vueObj.task_deadline,
                    tFTE: vueObj.task_FTE,
                    tProject: vueObj.SelectedProj,
                    tProjCateg: vueObj.SelectedProjCat,
                    tStatus: vueObj.nSelectedStatus,
                    tAttach:vueObj.task_attachement,
                    tClosedDate: vueObj.nSelectedStatus=="Completed" ? moment().format("YYYY-MM-DD"):"",
                    tOwner:vueObj.SelectedOwner,
                    // tEnvironment:vueObj.task_env?vueObj.task_env:"",
                    ModifiedBy:firebase.auth().currentUser.uid,
                    ModifiedDate:moment().format("YYYY-MM-DD HH:MM"),                    
                    t_isActive: vueObj.task_isActive == "No"
                })
                .then( final=>{
                    db
                    .collection(vueObj.$route.query.uid)
                    .doc(vueObj.$route.params.task_id)
                    .delete()
                    .then( navig=>{                      
                      vueObj.$router.push({name:vueObj.$route.query.mnext})
                      console.log("task removed from old user")
                    })

                })
                 .catch(function(error) {
                  console.error("Error writing document: ", error);
                });
                // console.log("done")

            }

            )
            
          })
       
        
      }else{
        // save the update
        db
          .collection(this.$route.query.uid)
          .doc(this.$route.params.task_id)
          .update({
            tName: this.task_name,
            tDescription: this.task_details,
            tStart: this.task_start,
            tDeadline: this.task_deadline,
            tFTE: this.task_FTE,
            tProject: this.SelectedProj,
            tProjCateg: this.SelectedProjCat,
            tStatus: this.nSelectedStatus,
            tClosedDate: this.nSelectedStatus=="Completed" ? moment().format("YYYY-MM-DD"):"",  tAttach:this.task_attachement,
            // tOwner:this.SelectedOwner,
            // tEnvironment:this.task_env?this.task_env:"",
            CreatedBy:this.SelectedManager.OBJ.UID,
            ModifiedBy:firebase.auth().currentUser.uid,
            ModifiedDate:moment().format("YYYY-MM-DD"),
            t_isActive: this.task_isActive == "No"
          })
         // .set({tAttach:JSON.stringify(vueObj.task_attachement)},{ merge: true })
          .then(docRef => {       
            // console.log("task update done")
            vueObj.$router.push({name:vueObj.$route.query.mnext})
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }  
    
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
    DeleteTask(){
      var vueObj = this;
      if (window.confirm("The task will be permanently deleted, are you sure?")){
          db
            .collection(this.$route.query.uid)
            .doc(this.$route.params.task_id)
            .delete()
            .then(function() {
                // vueObj.$router.push("/view/projcat");
                vueObj.$router.push({name:vueObj.$route.query.mnext})
            });
      }
    },
    getProjects(remProj) {
      var vueObj = this;
      if (vueObj.SelectedProjCat!='xBacklog' && remProj){
        vueObj.SelectedProj=null
      }

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
        //add https
        if (this.detail_link.indexOf("http")==-1){
          this.detail_link="https://"+this.detail_link
        }
        this.task_attachement.push("<a href='"+this.detail_link+"' target='_blank'>"+title+"</a>")

        // this.task_attachement=this.task_attachement+"\n\n"+"Attachement: <a href='"+this.detail_link+"' target='_blank'>"+title+"</a>"
        this.detail_link=""
        this.detail_title=""

      }else{
        M.toast({ html: "URL field should not be empty" });
      }
    },
    RemoveHyperlink(attch){
      var index=this.task_attachement.indexOf(attch)
        this.task_attachement.splice(index,1)
    }
  },
  created() {
    var objVue=this
    
    db
      .collection(this.$route.query.uid)
      .doc(this.$route.params.task_id)
      .get()
      .then(doc => {
        
        this.task_name = doc.data().tName;
        this.task_details = doc.data().tDescription;
        this.task_start = doc.data().tStart;
        this.task_deadline = doc.data().tDeadline;
        this.task_FTE = doc.data().tFTE?doc.data().tFTE:"";
        this.nSelectedStatus = doc.data().tStatus;
        this.SelectedProjCat = doc.data().tProjCateg;
        this.SelectedProj = doc.data().tProject;
        this.SelectedOwner=doc.data().tOwner?doc.data().tOwner:{ Label: null, UID: null };
        this.initialOwner=this.SelectedOwner;
        this.task_attachement=doc.data().tAttach?doc.data().tAttach:[];
        this.task_createdBy=doc.data().CreatedBy;
        
        this.task_isActive = doc.data().t_isActive ? "No" : "Yes";

        // this.orig_task_name = this.task_name;
        // this.orig_task_details = this.task_details;
        // this.orig_task_start=this.task_start;
        // this.orig_task_deadline = this.task_deadline;
        // this.orig_task_status = this.task_status;
        if (this.SelectedProjCat=='xBacklog'){
          this.task_start= moment().weekday(1).format("YYYY-MM-DD");
          this.task_deadline= moment().weekday(5).format("YYYY-MM-DD");
          // this.showUsers=true
        }
        this.getProjects();
      });

      //set managers
        db
        .collection("Users")
        .where("isManager", "==", true)
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            const data = {
              OBJ: {
                name: LstItem.data().Label,
                UID: LstItem.id
              }
            };

            objVue.ManagersArray.push(data);
          });
          function sortMNG(a, b) {
            if(b.OBJ.name=="All") return 1;
            if (a.OBJ.name < b.OBJ.name) return -1;
            if (a.OBJ.name > b.OBJ.name) return 1;
            return 0;
          }

          //  objVue.ManagersArray.push({OBJ:{UID:"All",name:"All"}})
           objVue.ManagersArray.sort(sortMNG);

           objVue.ManagersArray.forEach(owner => {              
              if (owner.OBJ.UID ==  objVue.task_createdBy) {
                objVue.SelectedManager = owner;
                return true;
              }
            });
        }) 
       $(".material-tooltip").remove()
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
.MyFixed{
  position: fixed;
  bottom: -17px;
  left: 13px;
  width: 100%;
  padding: 10px;
      background: #424242b5;
      z-index: 999;
}
.MyContainer{
  background-color: white;
  padding: 10px
}
</style>


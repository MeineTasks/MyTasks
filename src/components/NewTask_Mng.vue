<template>
<div id="new-task" class="container">
  <h3>Add new tasks</h3>
  <div class="row">
      <form @submit.prevent="saveTask" class="col s12">
          <div class="row">
              <div class="input-field col s12">
                  <input placeholder="Task name" type="text" v-model="task_name" required>
                  <label class="active">Name:</label>
              </div>
          </div>
         <!-- timings -->
          <div class="row" v-if="showDates">
              <div class="input-field col">
                  <input @change="updateDeadline()" id="StartDate" type="date" placeholder="start date" v-model="task_start">
                  <label class="active">Start date:</label>
              </div>
              <div class="input-field col">
                  <input id="DeadLine" type="date" placeholder="Task deadline" v-model="task_deadline">
                  <label class="active">Deadline:</label>
              </div>
              <span>Estimated FTE </span>
              <select v-model="task_fte" style="display:inline;width:70px" >
                <option v-for="fta in FTAarray" v-bind:key="fta.id"
                  v-bind:value="fta">{{fta}}</option>
              </select>
          </div>
          <!-- recurency  -->
          <div class="row">
            <blockquote>If you want to set recurrencies select the below option.<br/>If enabled you will be able to select multiple owners, and at Save a task will be created for each selecte owner for the following X weeks.</blockquote>
             <label>
              <input type="checkbox" class="filled-in" v-model="UseRecurency" />
              <span>Use recurency</span>
            </label>
            <div v-if="UseRecurency" class="input-field">
                <span>Number of recurrencies:</span>
                    <select v-model="Recurencies" style="display:inline;width:70px">
                      <option v-for="x in 10" :key="x" :value="x">{{x}}</option>                  
                    </select>
              </div>
          </div>
          <!-- projects category -->
          <div class="row">
              <label class="active">Category:</label>
              <div class="input-field col s12">
                  <span @click="clickCat(opt)" v-for="opt in ProjectsCat" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProjCat==opt}" class="mySingle chip">
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
          <div v-if="showStatus" class="row">
              <label class="active">Status:</label>
              <div class="input-field col s12">
                  <span @click="SelectedStatus=opt,clickStatus()" v-for="opt in Statuses" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedStatus==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
              </div>
          </div>
           <!-- feedBack -->
          <div class="row">
             <label>
                <input type="checkbox" class="filled-in" checked="checked" v-model="task_feedback"/>
                <span>Request feedback</span>
              </label>
              <div v-if="task_feedback">
                <input placeholder="Feedback email" type="text" class="col m2 validate" v-model="task_fbkEmail" required>
                 <span id="emailDomain">@ipsos.com</span>
              </div>
              
          </div> 
          <!-- Owners -->
          <div v-if="showOwner" class="row">
              <label class="active">Owner:</label>
              <div class="input-field col s12">
                  <span @click="clickUser(opt)" v-for="opt in ownersList" v-bind:key="opt.id" 
                  v-bind:class="{'mySingleSelected':SelectedOwners.findIndex(x => x.UID === opt.UID)>-1}" class="mySingle chip">
                    {{opt.Label}}
                  </span>
              </div>
              <div v-if="userFTE!=null" class="red-text" >
                    <!-- {{GetUserFTE()}} -->
                   Active workload: <b>{{userFTE}}</b> FTE
              </div>
             
          </div>
           <!-- priority -->
          <div class="row" v-if="showPriority">
              <div class="input-field col s12">
              <label class="active">Priority:</label>
                <div class="input-field">
                  <span @click="Selected_Priority=opt" v-for="opt in PiorityArr" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':Selected_Priority==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  </div>
              </div>
          </div>
           <div class="row">
              <span v-if="!showDetails" @click="showDetails=true" class="waves-effect waves-light btn-small black-text blue-grey lighten-4">Add details</span>
              
              <span v-if="showDetails" @click="showDetails=false" class="waves-effect waves-light btn-small blue-grey lighten-2">Hide details</span>
              <div v-if="showDetails" class="input-field col s12">
                  <label for="textarea1" class="active">Details:</label>
                  <textarea id="textarea1" placeholder="Task details" v-model="task_details" required />
              </div>
          </div>
         <!-- Attachement -->
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

          <button type="submit" class="btn brown lighten-1">Save</button>
          <router-link v-bind:to="{name:$route.query.mnext}" class="btn grey">Cancel</router-link>
      </form>
  </div>
</div>
</template>

<script>
import fireList from "./fireLists";
import firebase from "firebase";

import RTDB from "./firebaseInitRTDB";
import EventBus from "../eventBus";
var moment = require("moment");

export default {
  name: "new-task-mng",
  data() {
    return {
      FTAarray: fireList.FTEList,
      PiorityArr:["Low","Normal","High"],
      Statuses: fireList.statusesList,
      ownersList: fireList.OwnersList,
      
      UseRecurency:false,
      Recurencies:1,

      showDetails: false,
      showProject: false,
      showNewProj: false,
      showNewProjCat: false,
      showOwner: true,
      showDates: true,
      showStatus: true,
      showPriority:false,

      detail_link: "",
      detail_title: "",

      task_name: null,
      task_details: "",
      task_start: moment()
        .weekday(1)
        .format("YYYY-MM-DD"),
      task_deadline: moment()
        .weekday(5)
        .format("YYYY-MM-DD"),      
      task_attachement: [],
      
      task_fte: null,
      task_feedback:false,
      task_fbkEmail:"",

      userTaskArr: [],
      userFTE: null,

      ProjectsCat: [],
      AddNewProjCat: null,

      ProjectsList: [],
      AddNewProj: null,

      SelectedProjCat: null,
      SelectedProj: null,
      SelectedStatus: "Not started",
      Selected_Priority:"Normal",
      SelectedOwners:[],
      createdByLabel:"",      
      // SelectedOwner: { Label: null, UID: null }
    };
  },
  created(){
    let currUserLabel = RTDB.ref("/USERS/" + firebase.auth().currentUser.uid + "/Label")
    currUserLabel.once("value", querySnapshot => {
      this.createdByLabel=querySnapshot.val();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      this.createdByLabel="";
    })
  },
  methods: {
    updateDeadline() {
      if (this.task_start!=""){
        this.task_deadline = moment(this.task_start, "YYYY-MM-DD")
          .weekday(5)
          .format("YYYY-MM-DD");
      }
    },
    GetUserFTE() {
      var objVue = this;
      
      if (objVue.SelectedOwners.length==1) {
        RTDB.ref("/USERS/" + objVue.SelectedOwners[0].UID + "/TASKS/")
          .orderByChild("t_isActive")
          .equalTo(true)
          // .orderByChild("tStatus")
          // .equalTo("In progress")
          .once("value", querySnapshot => {
            objVue.userTaskArr = [];
            const queryOBJ = querySnapshot.val();
            for (var prop in queryOBJ) {
              if (queryOBJ[prop].tStatus == "In progress") {
                const data = {
                  id: prop,
                  task_name: queryOBJ[prop].tName,
                  task_FTE: queryOBJ[prop].tFTE
                };
                objVue.userTaskArr.push(data);
              }
            }
            // call next function
            var sum = 0;
            objVue.userFTE = null;
            objVue.userTaskArr.forEach(task => {
              if (
                task.task_FTE != undefined &&
                task.task_FTE != "TBD" &&
                task.task_FTE != null &&
                task.task_FTE != ""
              ) {
                // console.log(task.task_FTE)
                sum += parseFloat(task.task_FTE);
              }
            });
            objVue.userFTE = sum.toFixed(2);
          });
      }
    },
    saveTask() {
      // validation ****************
      var message = [];
      var msg = "Please select ";
      var delimit;

      //validate end start times
      if (this.showDates) {
        if (new Date(this.task_deadline) < new Date(this.task_start)) {
          M.toast({ html: 'Start date should be sooner than Deadline' });
          $("#StartDate,#DeadLine").css("border", "solid red 1px");
          return false;
        }
      } else {
        this.task_start = "";
        this.task_deadline = "";
        this.task_fte = "TBD";
      }

      // Project category
      if (this.SelectedProjCat == null) {
        message.push("Project Category");
      }
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
      if (this.showOwner) {
        // Owner
        if (this.SelectedOwners.length==0) {
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
      if (this.detail_link != "") {
        M.toast({ html: "Attachment URL should be empty" });
        return false;
      }
      //feedback
      if (this.task_feedback && this.task_fbkEmail.indexOf(".")==-1){        
        M.toast({ html: "Email should contain at least one dot" });
        return false;
      }
      
      if(this.UseRecurency){
        let vueObj=this
        // for each recurency 
        for(var i=0; i<this.Recurencies; i++){
          // console.log(moment(this.task_start,"YYYY-MM-DD").add(i,'w').format("YYYY-MM-DD"))
          // for each owner
          this.SelectedOwners.forEach(owner=>{
            // console.log(owner.Label)
            RTDB.ref("/USERS/" + owner.UID + "/TASKS/")
            .push({
              tName: vueObj.task_name,
              tDescription: vueObj.task_details, //(this.task_details) ? this.task_details : '',
              tStart: moment(vueObj.task_start,"YYYY-MM-DD").add(i,'w').format("YYYY-MM-DD"),
              tDeadline: moment(vueObj.task_deadline,"YYYY-MM-DD").add(i,'w').format("YYYY-MM-DD"),
              tProject: vueObj.SelectedProj,
              tProjCateg: vueObj.SelectedProjCat,
              tStatus: vueObj.SelectedStatus,
              tFTE: vueObj.task_fte ? vueObj.task_fte : "TBD",
              tFbk:vueObj.task_feedback,
              tPriority:vueObj.Selected_Priority,
              tFbkEmail:vueObj.task_fbkEmail.replace("@ipsos.com","")+"@ipsos.com",
              tOwner: owner,
              tAttach: vueObj.task_attachement,
              t_isActive: true,
              isPrivate: vueObj.SelectedProjCat == "Personal" ? true : false,
              CreatedBy: firebase.auth().currentUser.uid,
              CreatedDate: moment().format("YYYY-MM-DD")
            })
            // .then(docRef => {              
            //   this.$router.push({ name: this.$route.query.mnext });
            // })
            .catch(error => console.log(err));
          })
        }
        this.SelectedOwners.forEach(owner=>{
          let emailBody =` A new recurrent task was assigned in MeineTasks:<br/><br/>
          
          Task name : ${this.task_name}<br/>
          Task category: ${this.SelectedProjCat}<br/>
          Task project: ${this.SelectedProj}<br/>
          Task details: ${this.task_details}<br/>
          Task start date: ${this.task_start}<br/>
          Number of weeks: ${this.Recurencies}<br/>
          Task created by: ${this.createdByLabel}<br/>
          `;
          let emailSubject = `New Task assigned to ${owner.Label}`
          let emailCC=['IISCompetenceTasks@ipsos.com']
          let emailTO=[this.$parent.emailMap[owner.UID]]
          console.log(emailTO)
          let data={
            "mailto":emailTO,
            "mailBody":emailBody,
            "emailSubject":emailSubject,
            "mailCC":emailCC
          }
          EventBus.$emit('sendEmail',data, false);
        })
        this.$router.push({ name: this.$route.query.mnext });
      }else{
      // return true;
        RTDB.ref("/USERS/" + this.SelectedOwners[0].UID + "/TASKS/")
          .push({
            tName: this.task_name,
            tDescription: this.task_details, //(this.task_details) ? this.task_details : '',
            tStart: this.task_start,
            tDeadline: this.task_deadline,
            tProject: this.SelectedProj,
            tProjCateg: this.SelectedProjCat,
            tStatus: this.SelectedStatus,
            tFTE: this.task_fte ? this.task_fte : "TBD",
            tFbk:this.task_feedback,
            tPriority:this.Selected_Priority,
            tFbkEmail:this.task_fbkEmail.replace("@ipsos.com","")+"@ipsos.com",
            tOwner: this.SelectedOwners[0],
            tAttach: this.task_attachement,
            t_isActive: true,
            isPrivate: this.SelectedProjCat == "Personal" ? true : false,
            CreatedBy: firebase.auth().currentUser.uid,
            CreatedDate: moment().format("YYYY-MM-DD")
          })
          .then(docRef => {
            RTDB.ref("/LISTS/").off();
            let emailBody =` A new task was assigned in MeineTasks:<br/><br/>
            
            Task name : ${this.task_name}<br/>
            Task category: ${this.SelectedProjCat}<br/>
            Task project: ${this.SelectedProj}<br/>
            Task details: ${this.task_details}<br/>
            Task start date: ${this.task_start}<br/>
            Task end date: ${this.task_deadline}<br/>
            Task created by: ${this.createdByLabel}<br/>
            `;
            let emailSubject = `New Task assigned to ${this.SelectedOwners[0].Label}`
            let emailCC=['IISCompetenceTasks@ipsos.com']
            let emailTO=[this.$parent.emailMap[this.SelectedOwners[0].UID]]
            console.log(emailTO)
            let data={
              "mailto":emailTO,
              "mailBody":emailBody,
              "emailSubject":emailSubject,
              "mailCC":emailCC
            }
            EventBus.$emit('sendEmail',data, true);                          
          })
          .catch(error => console.log(err));
      }
    },
    AddHyperlink() {
      if (this.detail_link != "") {
        var title = this.detail_title ? this.detail_title : "Click here";
        //add https
        if (this.detail_link.indexOf("http") == -1) {
          this.detail_link = "https://" + this.detail_link;
        }

        this.task_attachement.push(
          "<a href='" + this.detail_link + "' target='_blank'>" + title + "</a>"
        );

        // this.task_attachement=this.task_attachement+"\n\n"+"Attachement: <a href='"+this.detail_link+"' target='_blank'>"+title+"</a>"
        this.detail_link = "";
        this.detail_title = "";
      } else {
        M.toast({ html: "URL field should not be empty" });
      }
    },
    RemoveHyperlink(attch) {
      var index = this.task_attachement.indexOf(attch);
      this.task_attachement.splice(index, 1);
    },
    addProjCategory() {
      var vueObj = this;
      RTDB.ref("/LISTS/Projects/")
        .update({ [vueObj.AddNewProjCat]: { 0: "" } })
        .then(function() {
          vueObj.showNewProjCat = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    DelProjCategory(opt) {
      var vueObj = this;

      if (vueObj.AddNewProjCat != null) {
        RTDB.ref("/LISTS/Projects/" + vueObj.AddNewProjCat + "/")
          .remove()
          .then(function() {
            vueObj.AddNewProjCat = null;
            vueObj.showNewProjCat = false;
          });
      } else {
        vueObj.showNewProjCat = false;
      }
    },
    clickCat(opt) {
      var vueObj = this;
      this.SelectedProjCat=opt

      // defaults
      var getProjects = true;

      vueObj.showOwner = true;
      vueObj.SelectedProj = null;
      vueObj.showPriority=false;
      vueObj.showStatus = true;
      vueObj.showDates = true;      

      // backlog
      if (vueObj.SelectedProjCat == "xBacklog") {
        getProjects = false;
        vueObj.SelectedStatus = "Not allocated";
        vueObj.showOwner = false;
        // vueObj.task_start=null
        // vueObj.task_deadline=null
        vueObj.showPriority=true
        vueObj.showStatus = false;
        vueObj.SelectedProj = "Backlog";
        vueObj.SelectedStatus = "Not allocated";
        vueObj.Selected_Priority="Normal"
        vueObj.task_fte = null;
        vueObj.showDates = false;
        vueObj.SelectedOwners=[ { Label: "xBacklog", UID: "backlog" }];
      }

      //personal tasks
      if (vueObj.SelectedProjCat == "Personal") {
        getProjects = false;
        // vueObj.showProject = false;
        vueObj.showOwner = false;
        vueObj.task_fte = "TBD";
        vueObj.showStatus = false;

        var myUID = firebase.auth().currentUser.uid;

        vueObj.ownersList.forEach(owner => {
          // console.log(owner)
          if (owner.UID == myUID) {
            vueObj.SelectedOwners = []
            vueObj.SelectedOwners.push(owner);
            return true;
          }
        });
      }
      if (getProjects) {
        RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/").on(
          "value",
          querySnapshot => {
            vueObj.ProjectsList = [];
            querySnapshot.forEach(doc => {
              if (doc.val() != "") {
                vueObj.ProjectsList.push(doc.val());
              }
            });
            vueObj.showProject = true;
          }
        );
      } else {
        vueObj.showProject = false;
      }
    },
    clickStatus() {
      var vueObj = this;
      // default
      vueObj.showOwner = true;
      vueObj.showPriority=false

      if (vueObj.SelectedStatus == "Not allocated") {
        vueObj.showOwner = false;
        vueObj.showDates = false;
        vueObj.showPriority=true        
        vueObj.SelectedOwners=[{ Label: "xBacklog", UID: "backlog" }]
      } 
    },
    clickUser(opt) {
      this.showDates = true;
      if (this.UseRecurency){
        this.userFTE=null
        var index = this.SelectedOwners.indexOf(opt);
        if (index == -1) {
          this.SelectedOwners.push(opt)
        }else{
           this.SelectedOwners.splice(index,1)
        }
      }else{
        this.SelectedOwners=[]
        this.SelectedOwners.push(opt)
        
        this.GetUserFTE()
      }

      // this.GetUserFTE();
    },
    addProj() {
      var vueObj = this;
      RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/")
        .push(vueObj.AddNewProj)
        .then(function() {
          vueObj.showNewProj = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    DelProj() {
      var vueObj = this;
      var TasksArr;
      RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/").once(
        "value",
        querySnapshot => {
          TasksArr = querySnapshot.val();
          // remove proj from db obj
          delete TasksArr[
            Object.keys(TasksArr).find(
              key => TasksArr[key] === vueObj.AddNewProj
            )
          ];
          //make the update
          RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/")
            .set(TasksArr)
            .then(ceva => {
              vueObj.showNewProj = false;
              console.log("done");
            });
        }
      );
    }
  },
  mounted() {
    var objVue = this;
    RTDB.ref("/LISTS/Projects/").on("value", querySnapshot => {
      objVue.ProjectsCat = [];
      const queryOBJ = querySnapshot.val();
      for (var prop in queryOBJ) {
        objVue.ProjectsCat.push(prop);
      }
      objVue.ProjectsCat.sort();
    });

    // db.collection("DropDowns/InnoPipeline/Projects").onSnapshot(
    //   querySnapshot => {
    //     objVue.ProjectsCat = [];
    //     querySnapshot.forEach(doc => {
    //       objVue.ProjectsCat.push(doc.id);
    //     });
    //     objVue.ProjectsCat.sort();
    //   }
    // );
  },
  watch: {
    UseRecurency:function(){
      this.SelectedOwners=[]
    }
  }
};
</script>
<style scoped>
.container{
  background-color: white;
  padding: 5px;
}
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
#emailDomain{
  top: 10px;
    position: relative;
    color: gray
}
</style>

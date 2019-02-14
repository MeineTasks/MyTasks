<template>
  <div id="dashboard" style="margin: 0px 50px;">
    <div class="row hide-on-small-only myHeader blue-grey lighten-4">
      <h6 v-for="itm in Header" :key="itm.txt" class="col s12" 
        :class="[itm.m,{'sorted':itm.txt==HSorted},{'clickable':itm.hasSort}]" 
        @click="HeaderClick(itm)">
          {{itm.txt}}
      </h6>
      <!-- <h6 class="col m2 s12 clickable" @click="DoSort('task_name')">Task name</h6>
      <h6 class="col m3 s12 clickable">Description</h6>
      <h6 class="col m1 s12 clickable truncate">Project</h6>
      <h6 class="col m2 s12 clickable truncate">Attachments</h6>
      <h6 class="col m1 s12 clickable truncate" @click="DoSort('task_priority')">Priority</h6>
      <h6 class="col m1 s12 clickable truncate">Deadline</h6>
      <h6 class="col m1 s12 clickable truncate">FTE</h6> -->
      <h6 class="col m1 iconContainer">
        <span class="truncate">Quick actions</span>
      </h6>
    </div>
    <!-- view not started  -->
    <div v-for="task in tasksBackLog" v-bind:key="task.id" class="row" :class="task.task_priority">
      <div class="col m2 s12">
        <span>
          <b>{{task.task_name}}</b>
        </span>
      </div>
      <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>
      <div class="col m1 s12">
        <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
          <span id="Attachment_span" v-html="attach"></span>
        </div>
      </div>
      <div class="col m1 s12 truncate">
        <i>{{task.task_project}}</i>
      </div>
      <div class="col m1 s12">
        <span class="chip" :class="'ch_'+task.task_priority">{{task.task_priority}}</span>
      </div>
      <div class="col m1 s12">{{task.task_deadline}}</div>
      <div class="col m1 s12">{{task.task_FTE}}</div>
      <div class="col m1 s12">
        <span  v-if="task.task_vol.length!=0">
          <span class="chip truncate" v-for="om in task.task_vol" :key="om">{{om}}</span>
        </span>
        
        </div>
      <!-- icons   -->
      <div v-if="isLoggedIn" class="col iconContainer">
        <div
          class="col tooltipped"
          data-position="top"
          data-tooltip="<span style='font-size:small'>Add me</span>"
        >
          <i v-if="!task.task_iVol" class="blue-text material-icons" @click="VolMe(task)">person_add</i>
        </div>
          <i v-if="task.task_iVol" class="red-text fas fa-user-minus" @click="VolMe(task)"></i>          
      </div>
    </div>
    
    <!-- add new -->
        <div v-if="isManager" class="fixed-action-btn">
          <router-link v-bind:to="{name:'new-task',query:{mnext:'viewprojcat'}}" class="btn-floating btn-large red">
            <i class="fa fa-plus"></i>
          </router-link>
        </div>
    <!-- grafic -->
    <!-- <div class="row GraphContainer">
      <div class="col m12 s12">
        <center>
          <pie-chart
            :data="chartData"
            :colors="['#bcaaa4','#a0cfff', '#FFC107', '#69c56c']"
            :download="true"
            :donut="true"
            height="200px"
            legend="bottom"
          ></pie-chart>
        </center>
      </div>
    </div> -->
  </div>
</template>

<script>
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";

export default {
  name: "backlog",
  props: { isLoggedIn: Boolean,isManager: Boolean  },
  data() {
    return {
      // isLoggedIn: false,
      Header:[
        {txt:"Task name",m:"m2",sby:"task_name",hasSort:true},
        {txt:"Description",m:"m3",sby:"task_description",hasSort:true},
        {txt:"Attachment",m:"m1 truncate",sby:"",hasSort:false},
        {txt:"Project",m:"m1 truncate",sby:"task_project",hasSort:true},
        {txt:"Priority",m:"m1 truncate",sby:"task_priority",hasSort:true},
        {txt:"Deadline",m:"m1 truncate",sby:"task_deadline",hasSort:true},
        {txt:"FTE",m:"m1 truncate",sby:"task_FTE",hasSort:true},
        {txt:"Volunteers",m:"m1 truncate",sby:"task_vol",hasSort:true},
        
        ],
      HSorted:"Task name",
      tasksBackLog:[],
      hasDone: false,
      viewDone: null,
      currUserName:null,
      // tasks: this.tasksBackLog,
      SortBy:"task_priority"
    };
  },
  mounted(){
      var vueObj = this;
      
      RTDB.ref("/USERS/"+firebase.auth().currentUser.uid+"/Label/").once("value",res=>{
        this.currUserName=res.val()
      })

       RTDB.ref("/USERS/backlog/TASKS/")
        .orderByChild("t_isActive")
        .equalTo(true)
        .on("value", querySnapshot => {
          vueObj.tasksBackLog = [];
          //this.tasksAllview = [];
          
          // console.log(querySnapshot.val());
          const queryOBJ = querySnapshot.val();
          for (var prop in queryOBJ) {
            if (queryOBJ[prop].tStatus=="Not allocated"){

              // console.log(queryOBJ[prop].tName);
              const data = {
                id: prop,
                task_name: queryOBJ[prop].tName,
                task_description: queryOBJ[prop].tDescription.replace(
                  /\n/g,
                  "<br/>"
                ),
                task_projectCategory: queryOBJ[prop].tProjCateg,
                task_project: queryOBJ[prop].tProject,
                task_attachement: queryOBJ[prop].tAttach
                  ? queryOBJ[prop].tAttach
                  : [],
                task_deadline: queryOBJ[prop].tDeadline,
                task_FTE: queryOBJ[prop].tFTE ? queryOBJ[prop].tFTE : "none",
                task_priority:queryOBJ[prop].tPriority ? queryOBJ[prop].tPriority : "",
                task_usedFTE: queryOBJ[prop].tFTEused ? queryOBJ[prop].tFTEused : null,
                task_status: queryOBJ[prop].tStatus,
                task_vol:queryOBJ[prop].tVol ? queryOBJ[prop].tVol :[],// ["Stefania Domnisoru","Ovidiu Calburean"],                
                
                task_isActive: queryOBJ[prop].t_isActive,
                
              };
              data.task_iVol=data.task_vol.indexOf(this.currUserName)>-1,
  
              vueObj.tasksBackLog.push(data);
            }
            

          }
          vueObj.tasksBackLog.sort(vueObj.sortMNG)
          
          // this.SetGraphic();
        });
      

  },
  updated() {
    //   // $(".sidenav").sidenav();
    // console.log("updated");
    $(".tooltipped").tooltip();
    //   // this.SetGraphic();
  },
  
  methods: {
    VolMe(task){
      if(!task.task_iVol){  
          task.task_vol.push(this.currUserName)
          task.task_iVol=true
      }else{
          let index =  task.task_vol.indexOf(this.currUserName);
          if( index!=-1){
            task.task_vol.splice(index, 1);
            task.task_iVol=false
          }
      }
       RTDB.ref("/USERS/backlog/TASKS/"+task.id).update({
         tVol: task.task_vol
       }).then(clbk=>{
          M.toast({ html: `Task was updated` });
       }
       )
    },
    HeaderClick(itm){
      if (itm.hasSort){
        this.DoSort(itm.sby)
        this.HSorted=itm.txt
      }
    },
    DoSort(by){
      this.SortBy=by
      this.tasksBackLog.sort(this.sortMNG)
    },

    sortMNG(a, b) {          
          if (a[this.SortBy]  < b[this.SortBy]) return -1;
          if (a[this.SortBy]  > b[this.SortBy]) return 1;
          return 0;
    },
   
    CloseTask(task) {
      RTDB.ref(
        "/USERS/" + firebase.auth().currentUser.uid + "/TASKS/" + task.id + "/"
      )
        .update({
          t_isActive: false
        })
        .then(stat => {
          $(".material-tooltip").removeAttr("style");
          console.log("update done");
        });
    },
    DeleteTask(task) {
      if (
        window.confirm(
          "The task: \n*** " +
            task.task_name +
            " ***\nwill be permanently deleted, are you sure?"
        )
      ) {
        RTDB.ref(
          "/USERS/" +
            firebase.auth().currentUser.uid +
            "/TASKS/" +
            task.id +
            "/"
        )
          .remove()
          .then(stat => {
            $(".material-tooltip").removeAttr("style");
          });
      }
    }
  }
};
</script>

<style scoped>
h6 {
  font-weight: 500;
}
.ch_High {  
  background: #f79d7a;  
}
.ch_Normal {  
  background: #bfddfa;
}
.ch_Low{
  background: #ffd863;
}
.High {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #f55e23;
  border-bottom: solid 1px lightgrey;
}
.Normal {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #a0cfff;
  border-bottom: solid 1px lightgrey;
}
.Low{
  border-left: solid 7px #ffc107;
  border-bottom: solid 1px lightgrey;
}
.secondary-content {
  margin-right: 5px;
  float: right;
}
.row {
  margin-bottom: 5px !important;
  background-color: white ;  
}
.row:hover {  
    background-color: #add8e636;    
    box-shadow: 0px 0px 19px 1px rgba(0,0,0,0.75);
}
.logTigle {
  color: teal;
}

.sidenav > li {
  padding: 5px;
  background: #ececec;
}
.iconContainer {
  float: right;
  text-align: right;
}
.fa-eye-slash {
  color: #8a4f3b;
}
.fa-edit {
  color: #00bcd4;
}
.DelIcn {
  color: #ea1010;
}
.fas {
  opacity: 0.6;
}
.fas:hover {
  opacity: 1;
}
.tskDetails {
  display: block;
  overflow: hidden;
  word-break: break-word;
}
.myHeader {
  border-bottom: solid 2px black;
}
.truncate {
  padding-bottom: 3px;
}
.GraphContainer {
  margin-top: 30px;
  padding: 5px;
}
.clickable{
  cursor: pointer;
}
.sorted::before{
      content: "\2193";
    color: #024e4d;
    font-size: 20px;
    font-weight: bold;
}
</style>
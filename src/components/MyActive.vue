<template>
  <div id="dashboard">
    <div class="row">
      <div class="col m2 s12">
        <center>
          <h3>No date</h3>
        </center>
        <!-- vue component structure 1 -->
        <div
          v-for="task in ViewCat1"
          v-bind:key="task.id"
          class="col s12"
        >
          <div
            class="card"
            v-bind:class="task.task_status.replace(' ','')+'Bar'"
          >
            <div class="card-content">
              <span class="MyTitle">
                <span>
                  {{task.task_name}}
                </span>
              </span>
              <span
                class="tskDetails"
                v-html="task.task_description"
              ></span>
              <div v-if="task.task_attachement.length!=0">
                <hr />
                <span class="cyan-text">Attachments:</span>
                <div
                  class="Attachment_spans"
                  v-for="attach in task.task_attachement"
                  v-bind:key="attach.id"
                >
                  <span
                    class="attSpan"
                    v-html="attach"
                  ></span>
                </div>
              </div>
              <!-- status and deadline -->
              <hr />
              <div
                class="row valign-wrapper"
                style="margin-left:0px"
              >
                <div
                  class="chip col truncate"
                  v-bind:class="task.task_status.replace(' ','')"
                >{{task.task_status}}</div>
                <span class="col myDates valign-wrapper">
                  <span class="col">{{task.task_deadline}}</span>
                  <span
                    v-if="task.task_FTE!='TBD' && task.task_FTE!='none'"
                    class="col red-text"
                  >{{task.task_FTE}} FTE</span>
                </span>
              </div>
              <hr />
              <!-- START icon container -->
              <div class="row iconContainer">
                <div class="col m4 s4">
                  <router-link
                    class="tooltipped"
                    data-position="top"
                    data-tooltip="Edit"
                    v-bind:to="{name:'edit-task',params:{task_id:task.id}}"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                </div>
                <div class="col m4 s4">
                  <span
                    class="myBtn tooltipped"
                    data-position="top"
                    data-tooltip="Complete"
                  >
                    <i
                      @click="CompleteTask(task)"
                      v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'"
                      class="fas"
                    ></i>
                  </span>
                </div>
                <div class="col m4 s4">
                  <span
                    class="myBtn tooltipped"
                    data-position="top"
                    data-tooltip="Start/Stop"
                  >
                    <i
                      @click="StartStop(task)"
                      v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'"
                      class="far"
                    ></i>
                  </span>
                </div>
              </div>
              <!-- END icon container -->
            </div>
          </div>
        </div>
      </div>
      <div class="col m5 s12">
        <center>
          <h3>Today</h3>
        </center>
        <!-- vue component structure 2-->
        <div
          v-for="task in ViewCat2"
          v-bind:key="task.id"
          class="col m6 s12"
        >
          <div
            class="card"
            v-bind:class="task.task_status.replace(' ','')+'Bar'"
          >
            <div class="card-content">
              <span class="MyTitle">
                <span>
                  {{task.task_name}}
                </span>
              </span>
              <span
                class="tskDetails"
                v-html="task.task_description"
              ></span>
              <div v-if="task.task_attachement.length!=0">
                <hr />
                <span class="cyan-text">Attachments:</span>
                <div
                  class="Attachment_spans"
                  v-for="attach in task.task_attachement"
                  v-bind:key="attach.id"
                >
                  <span
                    class="attSpan"
                    v-html="attach"
                  ></span>
                </div>
              </div>
              <hr />
              <!-- status and deadilne -->
              <div
                class="row valign-wrapper"
                style="margin-left:0px"
              >
                <div
                  class="chip col truncate"
                  v-bind:class="task.task_status.replace(' ','')"
                >{{task.task_status}}</div>
                <span class="col myDates valign-wrapper">
                  <span class="col">{{task.task_deadline}}</span>
                  <span
                    v-if="task.task_FTE!='TBD' && task.task_FTE!='none'"
                    class="col red-text"
                  >{{task.task_FTE}} FTE</span>
                </span>
              </div>
              <hr />
              <!-- START icon container -->
              <div class="row iconContainer">
                <div class="col m4 s4">
                  <router-link
                    class="tooltipped"
                    data-position="top"
                    data-tooltip="Edit"
                    v-bind:to="{name:'edit-task',params:{task_id:task.id}}"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                </div>
                <div class="col m4 s4">
                  <span
                    class="myBtn tooltipped"
                    data-position="top"
                    data-tooltip="Complete"
                  >
                    <i
                      @click="CompleteTask(task)"
                      v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'"
                      class="fas"
                    ></i>
                  </span>
                </div>
                <div class="col m4 s4">
                  <span
                    class="myBtn tooltipped"
                    data-position="top"
                    data-tooltip="Start/Stop"
                  >
                    <i
                      @click="StartStop(task)"
                      v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'"
                      class="far"
                    ></i>
                  </span>
                </div>
              </div>
              <!-- END icon container -->
            </div>
          </div>
        </div>
      </div>
      <div class="col m5 s12">
        <center>
          <h3>Future</h3>
        </center>
        <!-- vue component structure 3 -->
        <div
          v-for="task in ViewCat3"
          v-bind:key="task.id"
          class="col m6 s12"
        >
          <div
            class="card"
            v-bind:class="task.task_status.replace(' ','')+'Bar'"
          >
            <div class="card-content">
              <span class="MyTitle">
                <span>
                  {{task.task_name}}
                </span>
              </span>
              <span
                class="tskDetails"
                v-html="task.task_description"
              ></span>
              <div v-if="task.task_attachement.length!=0">
                <hr />
                <span class="cyan-text">Attachments:</span>
                <div
                  class="Attachment_spans"
                  v-for="attach in task.task_attachement"
                  v-bind:key="attach.id"
                >
                  <span
                    class="attSpan"
                    v-html="attach"
                  ></span>
                </div>
              </div>
              <hr />
              <!-- status and deadilne -->
              <div
                class="row valign-wrapper"
                style="margin-left:0px"
              >
                <div
                  class="chip col truncate"
                  v-bind:class="task.task_status.replace(' ','')"
                >{{task.task_status}}</div>
                <span class="col myDates valign-wrapper">
                  <span class="col">{{task.task_deadline}}</span>
                  <span
                    v-if="task.task_FTE!='TBD' && task.task_FTE!='none'"
                    class="col red-text"
                  >{{task.task_FTE}} FTE</span>
                </span>
              </div>
              <hr />
              <!-- START icon container -->
              <div class="row iconContainer">
                <div class="col m4 s4">
                  <router-link
                    class="tooltipped"
                    data-position="top"
                    data-tooltip="Edit"
                    v-bind:to="{name:'edit-task',params:{task_id:task.id}}"
                  >
                    <i class="fas fa-edit"></i>
                  </router-link>
                </div>
                <div class="col m4 s4">
                  <span
                    class="myBtn tooltipped"
                    data-position="top"
                    data-tooltip="Complete"
                  >
                    <i
                      @click="CompleteTask(task)"
                      v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'"
                      class="fas"
                    ></i>
                  </span>
                </div>
                <div class="col m4 s4">
                  <span
                    class="myBtn tooltipped"
                    data-position="top"
                    data-tooltip="Start/Stop"
                  >
                    <i
                      @click="StartStop(task)"
                      v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'"
                      class="far"
                    ></i>
                  </span>
                </div>
              </div>
              <!-- END icon container -->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- add new -->
    <div class="fixed-action-btn">
      <router-link
        to="/AddNew"
        class="btn-floating btn-large blue"
      >
        <i class="fa fa-plus-square"></i>
      </router-link>
    </div>
    <!-- Modal Structure -->
    <modal
      :FTAarray="FTAarray"
      :UsedFTAarray="UsedFTAarray"      
      :GotTarget="GotTarget"
      :targetTask="targetTask"
      infoType="UsedOnly"

      v-on:updateFTE="updateFTEs($event)"
      v-on:AddInfo="AddInfo($event)"
    ></modal>
    </div>
</template>

<script>
import firebase from "firebase";
import fireList from "./fireLists";
import RTDB from "./firebaseInitRTDB";
import modal from "./Modal"

var moment = require("moment");

export default {
  name: "MyActive",
  props: { tasksMyActive: Array },
  components: { modal },
  data () {
    return {
      // tasks: []
      FTAarray: fireList.FTEList,
      UsedFTAarray: fireList.usedFTEArrList,
      GotTarget:false,
      displayFTA: true,
      hours: null,
      targetTask:null,
    };
  },
  mounted () {
    $(".tooltipped").tooltip();    
    $(".modal").modal();
  },

  computed: {
    ViewCat1: function () {
      return this.tasksMyActive.filter(function (task) {
        return task.task_Category == "1";
      });
    },
    ViewCat2: function () {
      return this.tasksMyActive.filter(function (task) {
        return task.task_Category == "2";
      });
    },
    ViewCat3: function () {
      return this.tasksMyActive.filter(function (task) {
        return task.task_Category == "3";
      });
    }
  },
  methods: {
    AddInfo(){
              
        let updObj={}        
            updObj.tStatus= this.targetTask.newStatus
            updObj.tFTEused= this.targetTask.task_usedFTE

        if (this.targetTask.newStatus=="Completed")
          {
            updObj.tClosedDate= moment().format("YYYY-MM-DD")
            }



          RTDB.ref(
            "/USERS/" + firebase.auth().currentUser.uid + "/TASKS/" + this.targetTask.id + "/"
          ).update(updObj);        

      
        // this.task_FTE= null
        // this.hours= null
      
    },
    updateFTEs(val){
      this.targetTask.task_usedFTE=val
    },
    // updateFTE (type) {
    //   if (type == 'fte') {

    //     this.hours = 40 * this.targetTask.task_usedFTE
    //   } else {
    //      this.targetTask.task_usedFTE = (this.hours / 40).toFixed(2)
    //   }
    // },
    CompleteTask (task) {
      this.targetTask=task
      this.hours=40 * this.targetTask.task_usedFTE
      this.GotTarget=true
      this.targetTask.newStatus ="Completed"

        M.Modal.getInstance($("#modal1")).open()
      // if (this.targetTask.newStatus!="In progress"){
      // }else{
      //   if (!task.task_completed) {
      //     RTDB.ref(
      //       "/USERS/" +
      //       firebase.auth().currentUser.uid +
      //       "/TASKS/" +
      //       task.id +
      //       "/"
      //     ).update(
      //       {
      //         tStatus: "Completed",
      //         tClosedDate: moment().format("YYYY-MM-DD")
      //       },
      //       function (error) {
      //         if (error) {
      //           console.log(error);
      //         } else {
      //           $(".material-tooltip").removeAttr("style");
      //           console.log("update done");
      //         }
      //       }
      //     );
      //   }
      // }
      
    },
    StartStop (task) {
      this.targetTask=task
      this.hours=40 * this.targetTask.task_usedFTE
      this.GotTarget=true
      this.targetTask.newStatus =
            task.task_status == "In progress" ? "On hold" : "In progress"; 

      if (this.targetTask.newStatus!="In progress"){
        M.Modal.getInstance($("#modal1")).open()
      }else{
                
          
          RTDB.ref(
            "/USERS/" + firebase.auth().currentUser.uid + "/TASKS/" + task.id + "/"
          ).update({
            tStatus: this.targetTask.newStatus            
          });  
      }
      
    }
  }
};
</script>

<style scoped>
h3 {
  border-bottom: 2px solid #424242;
  padding-bottom: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #747a80;
}
.card,
.card-title,
.card-content {
  font-family: "Segoe UI", "Segoe UI Web", "Segoe UI Symbol",
    "wf_segoe-ui_normal", "Helvetica Neue", "BBAlph";
  font-size: 15px;
}
.card-title {
  font-family: "Segoe UI", "Segoe UI Web", "Segoe UI Symbol",
    "wf_segoe-ui_normal", "Helvetica Neue", "BBAlph";
  font-size: 15px;
  color: rgba(0, 0, 0, 0.87) !important;
  font-weight: 600;
}
.tskDetails {
  font-size: 13px;
  display: block;
  overflow: hidden;
  word-break: break-word;
  color: #747a80;
}
.card-content {
  padding: 10px !important;
  display: block;
  overflow: hidden;
}
.Delayed {
  color: #ffab29;
}
.row {
  margin-bottom: 0px !important;
}
.myBtn {
  cursor: pointer;
  border-radius: 4px;
  width: 20px;
  height: 20px;
}
.fas,
.far {
  opacity: 0.8;
}
.fas:not(.fa-clipboard-check):hover {
  opacity: 1;
}
.far:hover {
  opacity: 1;
}
.fa-edit {
  color: #5cc7bd;
  opacity: 0.6;
}
.fa-clipboard-check {
  color: #a5a5a5;
}
.fa-check {
  color: #a5a5a5;
}

.fa-stop-circle {
  color: #ff9800;
}
.fa-play-circle {
  color: #06d210;
}
.iconContainer {
  text-align: center;
}

.Inprogress {
  background-color: #a0cfff;
}
.Onhold {
  background-color: #ffc107;
}
.Notstarted {
  background-color: #bcaaa4;
}
.InprogressBar {
  border-left: 5px solid #a0cfff;
}
.OnholdBar {
  border-left: 5px solid #ffc107;
}
.NotstartedBar {
  border-left: 5px solid #bcaaa4;
}
.MyTitle {
  font-weight: 500;
}
.col {
  padding: 0 5px !important;
}
.myDates {
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 5px;
  margin-right: 5px;
}
.chip {
  margin-right: 0px !important;
}
</style>
<style>
.attSpan a {
  color: limegreen;
  text-decoration: underline;
}
</style>

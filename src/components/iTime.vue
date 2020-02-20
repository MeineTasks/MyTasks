<template>
  <div id="dashboard" style="margin: 0px 50px;">
    <div class="row">
      <input id="DateInp" type="week" placeholder="start date" v-model="weekFilter" />
      <div class="btn" @click="GetFireTask()">Get tasks</div>
    </div>
    <div class="progress" v-if="isLoading">
      <div class="indeterminate"></div>
    </div>
    <div class="row" v-if="iReady">
      <div v-for="(iRec,key) in itimeObj" :key="key" class="row">
        <div v-for="(recList,keyList) in iRec.List" :key="keyList">
          <div class="row iHead">
            <span>{{iRec.LblProj}}</span>
            <span class="separator">></span>
            <span>{{keyList}}</span>
            <span class="separator">=</span>
            <span>{{GetSum(recList.tasks)}} hours</span>
          </div>
          <div class="row">
            <div class="taskCard col s3" v-for="(task,indx) in recList.tasks" :key="indx">
              <div class="taskTitle">
                <h6>{{task.task_name}}</h6>
              </div>
              <div>{{task.task_projectCategory}}</div>
              <div>{{task.task_project}}</div>
              <div class="taskUsed">
                Used Fte:
                <b>{{task.task_usedFTE*40}} hours</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="Luk" style="display:none" v-html="GenItimeOut()"></div>
      <div class="btn-flat blue" @click="SendToitime()">Send to iTime</div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";
import fireList from "./fireLists";
// import modal from "./Modal";

var moment = require("moment");

export default {
  name: "iTime",
  props: { isLoggedIn: Boolean },
  // components: { modal },
  data() {
    return {
      fireTasks: [],
      isLoading: false,
      iReady: false,
      weekFilter: "",
      MapObj: {
        Automations: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Product research and development"
          }
        },
        "Creative Excellence": {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P26126108",
            proj: "P26126108 - cptence sup other inno&npd",
            task: "Implementation"
          }
        },
        "Cross-SL (business)": {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P26126108",
            proj: "P26126108 - cptence sup other inno&npd",
            task: "Implementation"
          }
        },
        "Cross-SL (internal)": {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P26126108",
            proj: "P26126108 - cptence sup other inno&npd",
            task: "Implementation"
          }
        },
        Innovation: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P26126108",
            proj: "P26126108 - cptence sup other inno&npd",
            task: "Implementation"
          }
        },
        Internal: {
          proj: ["EDM1", "EDM2", "Askia"],
          EDM1: {
            ikey: "P2612319",
            proj: "P2612319 - iis internal ws4 edm1",
            task: "Implementation"
          },
          EDM2: {
            ikey: "P2612320",
            proj: "P2612320 - iis internal ws4 edm2",
            task: "Implementation"
          },
          Askia: {
            ikey: "P2611404",
            proj: "P2611404 - askia initiative",
            task: "Implementation"
          },
          hasOth: true,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Implementation"
          }
        },
        IT: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Implementation"
          }
        },
        MIS: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Implementation"
          }
        },
        MSU: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P26126108",
            proj: "P26126108 - cptence sup other inno&npd",
            task: "Implementation"
          }
        },
        Oth: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Implementation"
          }
        },
        Picasso: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P26145001",
            proj: "P26145001 - picasso",
            task: "Implementation"
          }
        },
        Production: {
          proj: ["Custom request - chargeable", "Picasso", "Trainings"],
          "Custom request - chargeable": {
            ikey: "SID",
            proj: "Project Job-Book number",
            task: "Other tasks on project (Chargeable)"
          },

          Picasso: {
            ikey: "P26145001",
            proj: "P26145001 - picasso",
            task: "Implementation"
          },
          Trainings: {
            ikey: "P2612306",
            proj: "P2612306 - competence support",
            task: "Training (trainer)"
          },
          hasOth: true,
          iObj: {
            ikey: "P2612306",
            proj: "P2612306 - competence support",
            task: "Implementation"
          }
        },
        QA: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Implementation"
          }
        },
        Quality: {
          proj: [],
          hasOth: false,
          iObj: {
            ikey: "P2612506",
            proj: "P2612506 - competence, automation & innov",
            task: "Implementation"
          }
        },
        RAES: {
          proj: ["Programmatic Sample"],
          "Programmatic Sample": {
            ikey: "P2611955",
            proj: "P2611955 - it-a&e-programmatic sample",
            task: "Implementation"
          },
          hasOth: true,
          iObj: {
            ikey: "P26126105",
            proj: "P26126105 - cpetence sup raes initiatives",
            task: "Implementation"
          }
        }
      },
      itimeObj: {}
    };
  },
  created() {
    //get active
    // this.GetFireTask(true);
    let vueObj = this;
    $(document).ready(function() {
      $("#DateInp").on("change", function(evt) {
        vueObj.weekFilter = evt.target.value;
      });
    });
  },
  mounted() {
    // $(".modal").modal();
    // $(".datepicker").datepicker();
  },
  methods: {
    GetSum(tasks) {
      let sum = 0;
      tasks.forEach(task => {
        if (task.task_usedFTE != null) {
          sum += parseFloat(task.task_usedFTE);
        }
      });
      return (sum * 40).toFixed(2);
    },
    SendToitime() {
      let email = firebase.auth().currentUser.email;
      let body = this.GenItimeOut().replace(/\&/g, "##");
      console.log(body);
      let subj =
        'Trigger iTime for week "' +
        this.weekFilter +
        '", "' +
        moment(this.weekFilter)
          .day(7)
          .format("DD-MM-YYYY") +
        '" started';
      window.open("mailto:" + email + "?subject=" + subj + "&body=" + body);
    },
    GetFireTask() {
      this.fireTasks = [];
      if (this.weekFilter == "") {
        M.toast({ html: "Week filter is null" });
        return false;
      }
      var UID = firebase.auth().currentUser.uid;
      // var UID = "RQS8CP3AqyYGLjolErv1JPD3OE53";
      var vueObj = this;
      vueObj.isLoading = true;

      RTDB.ref("/USERS/" + UID + "/TASKS/")
        .orderByChild("t_isActive")
        .equalTo(true)
        .once("value", querySnapshot => {
          const queryOBJ = querySnapshot.val();

          for (var prop in queryOBJ) {
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
              task_start: queryOBJ[prop].tStart,
              task_deadline: queryOBJ[prop].tDeadline,
              task_FTE: queryOBJ[prop].tFTE ? queryOBJ[prop].tFTE : "none",
              task_usedFTE: queryOBJ[prop].tFTEused
                ? queryOBJ[prop].tFTEused
                : null,
              task_status: queryOBJ[prop].tStatus,
              task_isActive: queryOBJ[prop].t_isActive ? "No" : "Yes",
              task_creatorUID: queryOBJ[prop].CreatedBy,
              t_isPrivate: queryOBJ[prop].tProjCateg == "Personal"
            };

            vueObj.fireTasks.push(data);
          }
          vueObj.isLoading = false;
          vueObj.ParseTasks();
        });
    },
    ParseTasks() {
      let vueObj = this;
      this.iReady = false;
      this.itimeObj = {};

      this.fireTasks.forEach(elm => {
        //check in range

        if (
          moment(vueObj.weekFilter)
            .day(1)
            .format("YYYY-MM-DD") != elm.task_start
        ) {
          return false;
        }
        let tCat = elm.task_projectCategory;
        let tProj = elm.task_project;
        let iTimeKey = null;
        let iProj = null;
        let iTask = null;
        // get the key
        if (vueObj.MapObj.hasOwnProperty(tCat)) {
          let projArr = vueObj.MapObj[tCat].proj;
          //check if projects
          if (projArr.length > 0) {
            // proj found get prop key
            if (projArr.indexOf(tProj) > -1) {
              iTimeKey = vueObj.MapObj[tCat][tProj].ikey;
              iProj = vueObj.MapObj[tCat][tProj].proj;
              iTask = vueObj.MapObj[tCat][tProj].task;
            } else {
              // check for oth
              if (vueObj.MapObj[tCat].hasOth) {
                iTimeKey = vueObj.MapObj[tCat].iObj.ikey;
                iProj = vueObj.MapObj[tCat].iObj.proj;
                iTask = vueObj.MapObj[tCat].iObj.task;
              }
            }
          } else {
            iTimeKey = vueObj.MapObj[tCat].iObj.ikey;
            iProj = vueObj.MapObj[tCat].iObj.proj;
            iTask = vueObj.MapObj[tCat].iObj.task;
          }
        }
        if (iTimeKey != null) {
          if (vueObj.itimeObj.hasOwnProperty(iTimeKey)) {
            // check for task
            if (vueObj.itimeObj[iTimeKey].List.hasOwnProperty(iTask)) {
              vueObj.itimeObj[iTimeKey].List[iTask].tasks.push(elm);
            } else {
              vueObj.itimeObj[iTimeKey].List[iTask] = {
                tasks: [elm]
              };
            }
          } else {
            vueObj.itimeObj[iTimeKey] = {
              LblProj: iProj,
              List: {
                [iTask]: { tasks: [elm] }
              }
            };
          }
        } else {
          console.log(elm);
        }
      });
      this.iReady = true;
    },
    GenItimeOut() {
      let vueObj = this;
      let OutArr = [];
      Object.keys(vueObj.itimeObj).forEach(key => {
        let iRec = vueObj.itimeObj[key];

        Object.keys(iRec.List).forEach(keyList => {
          const OutItime = {};

          let recList = iRec.List[keyList];

          (OutItime.itimeProj = iRec.LblProj),
            (OutItime.itimeAct = keyList),
            (OutItime.hours = vueObj.GetSum(recList.tasks));
          OutArr.push(OutItime);
        });
      });
      return JSON.stringify(OutArr);
    }
  }
};
</script>

<style scoped>
h6 {
  font-weight: 500;
}
#CompletedContainer {
  background: white;
}
.Inprogress {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #a0cfff;
  border-bottom: solid 1px lightgrey;
}
.Notstarted {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #bcaaa4;
  border-bottom: solid 1px lightgrey;
}
.Onhold {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #ffc107;
  border-bottom: solid 1px lightgrey;
}
.Completed {
  opacity: 0.7;
  /* background: #cff1d0 !important; */
  border-left: solid 7px #69c56c;
  border-bottom: solid 1px lightgrey;
}

.Canceled {
  border-left: solid 7px lightgrey;
  border-bottom: solid 1px lightgrey;
}
.Canceled > div {
  text-decoration: line-through;
  opacity: 0.5;
}

.secondary-content {
  margin-right: 5px;
  float: right;
}
.row {
  margin-bottom: 5px !important;
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

.clickable {
  cursor: pointer;
}
.sortedASC_false::before {
  content: "\2191";
  color: #024e4d;
  font-size: 20px;
  font-weight: bold;
}
.sortedASC_true::before {
  content: "\2193";
  color: #024e4d;
  font-size: 20px;
  font-weight: bold;
}
.tblRow:hover {
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.75);
}

.modal {
  top: 1% !important;
  max-height: unset;
  width: 80%;
  max-height: 95vh;
}
.mySingle {
  cursor: pointer;
}
.mySingleSelected {
  background: teal;
  color: white;
}
.NameEdit:hover {
  transform: scale(1.05);
  color: blue;
  text-decoration: underline;
  transition: all 50ms;
}
#TotalFTE {
  font-weight: bold;
  background-color: #dedede !important;
}
.iHead {
  background: lightgrey;
  font-weight: bold;
}
.taskCard {
  background: white;
  border: solid 1px grey;
  border-radius: 5px;
  margin: 5px;
}
.separator {
  margin: 0 10px;
}
</style>

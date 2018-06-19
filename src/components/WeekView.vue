<template>
  <div id="dashboard" style="margin: 0px 25px;">   
      <!-- select project -->
        
    <!-- view in weeks -->
    <ul class="collapsible">
    <li v-for="week in weeks" v-bind:key="week.id">
    <div class="collapsible-header">
        <span class="weekNoH">{{week.no}} - (<b>{{week.text}}</b>)</span>
        <div class="right" style="margin-left: auto;">No of tasks : {{CountTasksInWeek(week)}}</div>
    </div>
    <div class="collapsible-body">
        <!-- table header  -->
        <div class="row z-depth-3 teal darken-1 white-text hide-on-small-only">
            <h6 class="col m2 s12">Task name</h6>
            <h6 class="col m6 s12">Description</h6>            
            <h6 class="col m1 s12">Start</h6>
            <h6 class="col m1 s12">Deadline</h6>
            <h6 class="col m1 s12">Owner</h6>
            <h6 class="col m1 s12">FTE</h6>
        </div>
        <ul class="collapsible">
          <li>
            <div class="collapsible-header" style="padding:1px 10px">See user load <i class="fas fa-eye teal-text lighten-5"></i> </div>
            <div class="collapsible-body teal lighten-5">
              <div>Ana: 1 fte</div>
              <div>Cip: 0 fte</div>
            </div>
          </li>
        </ul>
        <!-- ASI data -->
        <div class="grupContainer ASI_Container z-depth-1" v-if="week.weekData.ASI.InWork.length>0 || week.weekData.ASI.OnHold.length>0">
            <center><b>ASI initiatives: {{SumFTAinWeek(week,"ASI")}} FTE</b> </center>
            <!-- In work -->
            <div v-if="week.weekData.ASI.InWork.length>0"><b>In Work:</b></div>
            <div v-for="groupProj in week.weekData.ASI.InWork" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
            <br/>
            <!-- on hold -->
            <div v-if="week.weekData.ASI.OnHold.length>0"><b>On hold:</b></div>
            <div v-for="groupProj in week.weekData.ASI.OnHold" v-bind:key="groupProj.id">
                <!-- projects -->
               <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
        </div>
        
        <!-- MKT data -->
        <div v-if="week.weekData.MKT.InWork.length>0 || week.weekData.MKT.OnHold.length>0" class="grupContainer MKT_Container z-depth-1">          
            <center><b>MKT initiatives: {{SumFTAinWeek(week,"MKT")}} FTE</b> </center>
            <!-- In work -->
            <div v-if="week.weekData.MKT.InWork.length>0"><b>In Work:</b></div>
            <div v-for="groupProj in week.weekData.MKT.InWork" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
            <br/>
            <!-- on hold -->
            <div v-if="week.weekData.MKT.OnHold.length>0"><b>On hold:</b></div>
            <div v-for="groupProj in week.weekData.MKT.OnHold" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
        </div>
        
        <!-- Gaps data -->
        <div v-if="week.weekData.Gaps.InWork.length>0 || week.weekData.Gaps.OnHold.length>0" class="grupContainer Gaps_Container z-depth-1">          
            <center><b>Gaps initiatives: {{SumFTAinWeek(week,"Gaps")}} FTE</b> </center>
            <!-- In work -->
            <div v-if="week.weekData.Gaps.InWork.length>0"><b>In Work:</b></div>
            <div v-for="groupProj in week.weekData.Gaps.InWork" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
            <br/>
            <!-- on hold -->
            <div v-if="week.weekData.Gaps.OnHold.length>0"><b>On hold:</b></div>
            <div v-for="groupProj in week.weekData.Gaps.OnHold" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
        </div>
        
        <!-- Oth data -->
        <div v-if="week.weekData.Oth.InWork.length>0 || week.weekData.Oth.OnHold.length>0" class="grupContainer Oth_Container z-depth-1">          
            <center><b>Oth initiatives: {{SumFTAinWeek(week,"Oth")}} FTE</b> </center>
            <!-- In work -->
            <div v-if="week.weekData.Oth.InWork.length>0"><b>In Work:</b></div>
            <div v-for="groupProj in week.weekData.Oth.InWork" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
            <br/>
            <!-- on hold -->
            <div v-if="week.weekData.Oth.OnHold.length>0"><b>On hold:</b></div>
            <div v-for="groupProj in week.weekData.Oth.OnHold" v-bind:key="groupProj.id">
                <!-- projects -->
                <span class="PrjNameConainer">Project name: <span class="PrjName">{{groupProj.proj}}</span></span>  
                <!-- tasks -->
                <div v-for="groupProjTask in groupProj.tasks" v-bind:key="groupProjTask.id" v-bind:class="groupProjTask.task_status=='On hold'?'onHold':'inProgres'" class="row z-depth-2">
                    <div class="col m2 s12 truncate">{{groupProjTask.task_name}}</div>
                    <div class="col m6 s12" v-html="groupProjTask.task_description"></div>                    
                    <div class="col m1 s12">{{groupProjTask.task_start}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_deadline}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_owner}}</div>
                    <div class="col m1 s12">{{groupProjTask.task_FTA}}</div>
                </div>
            </div>
        </div>

    </div>
</li>
    </ul>

    
  </div>
  
</template>

<script>
import db from "./firebaseInit";
import firebase from "firebase";
import fireList from "./fireLists";

var moment = require("moment");

export default {
  name: "viewProject",
  data() {
    return {
      tasks: [],
      tasks_test: [],
      tasks_cip: [],
      tasks_ana: [],
      SelectedProject: null,
      weeks: [],
      Projects: {
        ASI: [],
        Gaps: [],
        MKT: [],
        Oth: []
      }
    };
  },
  methods: {
    SetWeekArray() {
      function compare(a, b) {
        if (parseInt(a.no) < parseInt(b.no)) return -1;
        if (parseInt(a.no) > parseInt(b.no)) return 1;
        return 0;
      }
      //sort weeks ascending
      var objVue = this;
      // sum up tasks
      objVue.tasks = objVue.tasks_test.concat(objVue.tasks_cip);

      // add tasks to weeks
      var weekTargetIns;
      // reset week data - needed for update
      objVue.weeks = [];

      objVue.tasks.forEach(function(i) {
        objVue.pushUnique(objVue.weeks, i.task_wkNo, i.task_project);

        if (objVue.Projects.MKT.indexOf(i.task_project) != -1) {
          if (i.task_status == "In progress") {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .MKT.InWork;
          } else {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .MKT.OnHold;
          }
        } else if (objVue.Projects.ASI.indexOf(i.task_project) != -1) {
          if (i.task_status == "In progress") {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .ASI.InWork;
          } else {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .ASI.OnHold;
          }
        } else if (objVue.Projects.Gaps.indexOf(i.task_project) != -1) {
          if (i.task_status == "In progress") {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .Gaps.InWork;
          } else {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .Gaps.OnHold;
          }
        } else {
          if (i.task_status == "In progress") {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .Oth.InWork;
          } else {
            weekTargetIns = objVue.weeks.find(o => o.no == i.task_wkNo).weekData
              .Oth.OnHold;
          }
        }
        if (!weekTargetIns.find(o => o.proj === i.task_project)) {
          weekTargetIns.push({
            proj: i.task_project,
            tasks: []
          });
        }
        weekTargetIns.find(o => o.proj == i.task_project).tasks.push(i);
      });

      objVue.weeks = objVue.weeks.sort(compare);
      $(document).ready(function() {
        $(".collapsible").collapsible();
      });
    },
    pushUnique(arr, itm, tProj) {
      // create weeks array
      if (!arr.find(o => o.no === itm)) {
        arr.push({
          no: itm,
          text:
            moment()
              .week(itm)
              .weekday(1)
              .format("DD MMM") +
            "-" +
            moment()
              .week(itm)
              .weekday(7)
              .format("DD MMM"),
          weekData: {
            ASI: {
              InWork: [],
              OnHold: []
            },
            MKT: {
              InWork: [],
              OnHold: []
            },
            Gaps: {
              InWork: [],
              OnHold: []
            },
            Oth: {
              InWork: [],
              OnHold: []
            }
          }
        });
      }
    },
    CountTasksInWeek: function(wkno) {
      var sum = 0;
      wkno.weekData.ASI.InWork.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.ASI.OnHold.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.MKT.InWork.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.MKT.OnHold.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.Gaps.InWork.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.Gaps.OnHold.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.Oth.InWork.forEach(function(i) {
        sum += i.tasks.length;
      });
      wkno.weekData.Oth.OnHold.forEach(function(i) {
        sum += i.tasks.length;
      });
      return sum;
    },
    SumFTAinWeek: function(wkno, grup) {
      var sum = 0;
      wkno.weekData[grup].InWork.forEach(function(i) {
        i.tasks.forEach(function(j) {
          if (j.task_FTA != null) {
            sum += parseFloat(j.task_FTA);
          }
        });
      });
      //console.log(sum)
      return sum.toFixed(2);
    },
    sortTasks: function(a, b) {
      if (a.task_deadline < b.task_deadline) return -1;
      if (a.task_deadline > b.task_deadline) return 1;
      return 0;
    },
    GetFire_test: function() {
      var objVue = this;
      //test
      db
        .collection("UserTasks/tasks/YPPNyRXLbXZhfgZ6i4ITY68kqY02")
        .where("t_isActive", "==", true)
        .onSnapshot(querySnapshot => {
          // reset
          objVue.tasks_test = [];
          querySnapshot.forEach(doc => {
            //custom filter
            if (
              (doc.data().tStatus == "In progress" ||
                doc.data().tStatus == "On hold") &&
              doc.data().tDeadline != null
            ) {
              const data = {
                id: doc.id,
                task_name: doc.data().tName,
                task_description: doc
                  .data()
                  .tDescription.replace(/\n/g, "<br/>"),
                task_start: moment(doc.data().tStart, "YYYY-MM-DD").format(
                  "DD-MMM"
                ),
                task_deadline: moment(
                  doc.data().tDeadline,
                  "YYYY-MM-DD"
                ).format("DD-MMM"),
                task_FTA: doc.data().tFTA,
                task_wkNo: moment(doc.data().tDeadline, "YYYY-MM-DD").week(),
                task_status: doc.data().tStatus,
                task_project: doc.data().tProject,
                task_owner: "test"
              };

              objVue.tasks_test.push(data);
            }
          });
          //call next function
          objVue.GetFire_Cip();
        });
    },
    GetFire_Cip: function() {
      var objVue = this;
      //test
      db
        .collection("UserTasks/tasks/YqRVNtuUu3aAHt6g2YW05OxIsj42")
        .where("t_isActive", "==", true)
        .onSnapshot(querySnapshot => {
          //reset
          objVue.tasks_cip = [];

          querySnapshot.forEach(doc => {
            //custom filter
            if (
              (doc.data().tStatus == "In progress" ||
                doc.data().tStatus == "On hold") &&
              doc.data().tDeadline != null
            ) {
              const data = {
                id: doc.id,
                task_name: doc.data().tName,
                task_description: doc
                  .data()
                  .tDescription.replace(/\n/g, "<br/>"),
                task_start: moment(doc.data().tStart, "YYYY-MM-DD").format(
                  "DD-MMM"
                ),
                task_deadline: moment(
                  doc.data().tDeadline,
                  "YYYY-MM-DD"
                ).format("DD-MMM"),
                task_FTA: doc.data().tFTA,
                task_wkNo: moment(doc.data().tDeadline, "YYYY-MM-DD").week(),
                task_status: doc.data().tStatus,
                task_project: doc.data().tProject,
                task_owner: "Cip"
              };

              objVue.tasks_cip.push(data);
            }
          });
          //call next function
          objVue.GetFire_innoProj();
        });
    },
    GetFire_innoProj: function() {
      var objVue = this;
      // get list inno pipeline
      db
        .collection("DropDowns/InnoPipeline/Projects")
        .get()
        .then(querySnapshot => {          
          // reset proj array
          objVue.Projects.ASI = [];
          objVue.Projects.MKT = [];
          objVue.Projects.Gasp = [];
          objVue.Projects.Oth = [];
          // console.log(querySnapshot)

          querySnapshot.forEach(doc => {
            console.log(doc.collection("Proj"))
            if (doc.id == "ASI") {
              // console.log(doc.Proj.data())
              doc.data().Proj.forEach(prj => {
                objVue.Projects.ASI.push(prj);
              });
            } else if (doc.id == "MKT") {
              doc.data().Projects.forEach(prj => {
                objVue.Projects.MKT.push(prj);
              });
            } else if (doc.id == "Gaps") {
              doc.data().Projects.forEach(prj => {
                objVue.Projects.Gaps.push(prj);
              });
            } else {
              doc.data().Projects.forEach(prj => {
                objVue.Projects.Oth.push(prj);
              });
            }
          });
          // at final call make array
          objVue.SetWeekArray();
        });
    }
  },
  created() {
    this.GetFire_test();

    // //Ana
    // db
    //   .collection("fzAuzR6aW0Q4qBvzYMBgP4Iepxw1")
    //   .where("t_isActive", "==", true)
    //   // .get()
    //   // .then(function(querySnapshot) {
    //   // querySnapshot.forEach(function(doc) {
    //   .onSnapshot(querySnapshot => {
    //     objVue.tasks_ana = [];
    //     querySnapshot.forEach(doc => {
    //       //custom filter
    //       if (
    //         (doc.data().tStatus == "In progress" ||
    //           doc.data().tStatus == "On hold") &&
    //         doc.data().tDeadline != null
    //       ) {
    //         const data = {
    //           id: doc.id,
    //           task_name: doc.data().tName,
    //           task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
    //           task_start: moment(doc.data().tStart, "YYYY-MM-DD").format(
    //             "DD-MMM"
    //           ),
    //           task_deadline: moment(doc.data().tDeadline, "YYYY-MM-DD").format(
    //             "DD-MMM"
    //           ),
    //           task_FTA: doc.data().tFTA,
    //           task_wkNo: moment(doc.data().tDeadline, "YYYY-MM-DD").week(),
    //           task_status: doc.data().tStatus,
    //           task_project: doc.data().tProject,
    //           task_owner: "Ana"
    //         };

    //         objVue.tasks_ana.push(data);
    //         objVue.pushUnique(objVue.weeks, data.task_wkNo, data.task_project);
    //       }
    //     });
    //   });
  }
};
</script>

<style scoped>
.row {
  margin-bottom: 3px !important;
}
.collapsible-body {
  padding: 10px !important;
}
.onHold {
  background: #efefef;
}
.inProgres {
  background: #c9fdcf7d;
}
.active .weekNoH::before {
  content: " \25bc ";
}
.grupContainer {
  padding: 5px;
  margin-bottom: 10px;
}
.MKT_Container {
  background: #e8f1f1;
}
.ASI_Container {
  background: #f5f7f7;
}
.Gaps_Container {
  background: #f9fff2;
}
.Oth_Container {
  background: #e8e8e8;
}
.PrjNameContainer {
  background: #f7f7f7;
  padding: 0px 5px;
}
.PrjName {
  /* font-weight: bold; */
  color: darkgreen;
}
</style>

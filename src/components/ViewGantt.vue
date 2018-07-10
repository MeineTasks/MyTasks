<template>
  <div class="main">  
    <span class="title">Upcoming:</span>
    
      <!-- header -->
      <div class="row">
        <div class="leftPanel HeaderRow col m3">
          <span class="col">Name</span>          
        </div>
        <div class="HeaderRow col m9">
          <div v-for="days in headerDates" v-bind:key="days.id" v-html="days" class="col m1 HeaderDays">            
          </div> 
          <div class="col m1 HeaderWkend">Sun</div>
          <div class="col m1 ">Sat</div>
           <div v-for="days in NextHeaderDates" v-bind:key="days.id" v-html="days" class="col m1 NextHeaderDays">            
          </div> 
        </div>        
      </div>
      <!-- task rows  -->
      <div class="row taskRow" v-for="task in inGantt"  v-bind:key="task.id" >
        <div class="leftPanel col m3">          
          <span class="col truncate col m5 tooltipped" data-position="right" v-bind:data-tooltip="'Title: '+task.task_name+'<hr/> Details: '+task.task_description">
            {{task.task_name}}
            <!-- <span class="tooltiptext" v-html="task.task_description"></span> -->
            
          </span>        
            <span class="chip">{{task.task_status}}</span>            
            <div class="col iconContainer" >            
              <div class="col tooltipped" data-position="top" data-tooltip="Edit">
                <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                  <i class="fas fa-edit"></i>
                </router-link>  
              </div>
          </div>  
        </div>
        <div class="col m9">
          <!-- week 1 -->
          <span v-if="task.isInWeek_1">
            <div class="drawBar col" v-bind:class="['m'+task.duration,'offset-m'+task.offset,task.BarClass,task.task_status=='On hold'?'onHold':'']">
              {{task.task_name}}
            </div>
            <div class="arrow-right"></div>
            <div class="col m1 WkndBar" v-bind:class="'offset-m'+(5-task.duration-task.offset)">--</div>
            <div class="col m1 WkndBar">--</div>
          </span>
          <!-- umplutura -->
          <span v-if="!task.isInWeek_1 && task.isInWeek_2">
            <div class="col m5">              
            </div>
            <div class="col m1 WkndBar">--</div>
            <div class="col m1 WkndBar">--</div>
          </span>
          <span v-if="task.isInWeek_2">
            <div class="drawBar col" v-bind:class="['m'+task.NEXTduration,'offset-m'+task.NEXToffset,task.NEXT_BarClass]">
              {{task.task_name}}
            </div>
          </span>
        </div>         
      </div>   

    <!-- backLog -->
    <div class="divider"></div>
    <div v-if="backLog.length>0" class="section">
      <span class="title">BackLog/Remaining:</span>
      <div id="dashboard">    
        <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
            <h6 class="col m2 s12">Task name</h6>
            <h6 class="col m3 s12">Description</h6>        
            <h6 class="col m1 s12">Project</h6>          
            <h6 class="col m2 s12">Attachment</h6>
            <h6 class="col m1 s12">Status</h6>
            <h6 class="col m1 s12">Deadline</h6>        
            <h6 class="col  iconContainer">
              <span class="red-text">Archive</span>
              <span class="white-text">Edit</span>
            </h6>
        </div>
    </div>
      <div v-for="task in backLog" v-bind:key="task.id" class="row z-depth-2">        
          <div class="col m2 s12 truncate">
            <span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name"><b>{{task.task_name}}</b></span></div>
          <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>        
          <div class="col m1 s12 truncate"><i>{{task.task_project}}</i></div>        
          <div class="col m2 s12">
                <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
                <span id="Attachment_span" v-html="attach" >                
                </span>
              </div>
          </div>
          <div class="col m1 s12"><i>{{task.task_status}}</i></div>
          <div class="col m1 s12">{{task.tsk_end_date}}</div>     
          <div class="col iconContainer" >
            <div class="col tooltipped" data-position="top" data-tooltip="Archive">
              <i @click="CloseTask(task)" class="fas fa-trash-alt"></i>
            </div>
            <div class="col tooltipped" data-position="top" data-tooltip="Edit">
              <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
                <i class="fas fa-edit"></i>
              </router-link>  
            </div>
          </div>   
                
      </div>
    </div>
    <!-- add new -->
        <div class="fixed-action-btn">
          <router-link to ="/AddNew" class="btn-floating btn-large blue">
            <i class="fa fa-plus-square"></i>
          </router-link>
        </div>
  </div>
</template>

<script>
// import TableRows from "./ViewGanttRows.vue";
// import TableRowsNEXT from "./ViewGanttRows_NEXT.vue";
import firebase from "firebase";
import db from "./firebaseInit";

var moment = require("moment");

export default {
  // components: { TableRows, TableRowsNEXT },
  data() {
    return {
      headerDates: [],
      NextHeaderDates: [],
      moment: moment,
      tasks: []
    };
  },
    updated() {
    // $(".sidenav").sidenav();
    $('.tooltipped').tooltip();
  },
  created() {
    db
      .collection(firebase.auth().currentUser.uid)
      .where("t_isActive", "==", true)
      // .orderBy("tDeadline", "asc")
      //.where("tStatus", "==", "In progress")
      .onSnapshot(querySnapshot => {
        this.tasks = [];
        querySnapshot.forEach(doc => {
          if (
            doc.data().tStatus == "In progress" ||
            doc.data().tStatus == "On hold"
          ) {
            const data = {
              id: doc.id,
              task_name: doc.data().tName,
              task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
              task_project: doc.data().tProject,
              task_attachement:doc.data().tAttach,
              tsk_start_date: doc.data().tStart,
              tsk_end_date: doc.data().tDeadline,
              task_status: doc.data().tStatus
            };
            this.tasks.push(data);
          }
        });
        this.GrantTasks();
      });
  },
  methods: {
    GrantTasks() {
      var i;
      //Created currWeek header
      for (i = 1; i < 6; i++) {
        this.headerDates.push(
          moment()
            .weekday(i)
            .format("dd<br/>MMMM<br/>Do")
        );
      }
      //Created nexxtWeek header
      for (i = 8; i < 13; i++) {
        this.NextHeaderDates.push(
          moment()
            .weekday(i)
            .format("dd<br/>MMMM<br/>Do")
        );
      }

      var StartOFWeek = moment().weekday(1);
      var EndOFWeek = moment().weekday(5);

      var NEXT_StartOFWeek = moment().weekday(8);
      var NEXT_EndOFWeek = moment().weekday(12);

      var luni = moment().weekday(0);
      var duminica = moment().weekday(7);

      var NEXTluni = moment().weekday(8);
      var NEXTduminica = moment().weekday(14);

      // console.log("StartOFWeek: "+StartOFWeek.format("YYYY-MM-DD"))
      // console.log("EndOFWeek: "+EndOFWeek.format("YYYY-MM-DD"))
      // console.log("luni: "+luni.format("YYYY-MM-DD"))
      // console.log("duminica: "+duminica.format("YYYY-MM-DD"))
      // console.log("NEXTluni: "+NEXTluni.format("YYYY-MM-DD"))
      // console.log("NEXTduminica: "+NEXTduminica.format("YYYY-MM-DD"))

      for (i = 0; i < this.tasks.length; i++) {
        var START = moment(this.tasks[i].tsk_start_date, "YYYY-MM-DD");
        var END = moment(this.tasks[i].tsk_end_date, "YYYY-MM-DD");

        //current week

        //console.log(luni.format("YYYY-MM-DD") + "<" + START.format("YYYY-MM-DD") + "||"+START.format("YYYY-MM-DD") + "<" + duminica.format("YYYY-MM-DD") )

        //alocate weeks
        if (
          (luni.isBefore(START) && START.isBefore(duminica)) ||
          (luni.isBefore(END) && END.isBefore(duminica)) ||
          (START.isBefore(duminica) && duminica.isBefore(END))
        ) {
          // set in weeks
          if (START.isBefore(StartOFWeek.format("YYYY-MM-DD"))) {
            this.tasks[i].InWeek_Start = StartOFWeek.format("YYYY-MM-DD");
            this.tasks[i].StartsBefore = true;
          } else {
            this.tasks[i].InWeek_Start = START.format("YYYY-MM-DD");
          }

          if (END.isBefore(EndOFWeek)) {
            this.tasks[i].InWeek_End = END.format("YYYY-MM-DD");
          } else {
            this.tasks[i].InWeek_End = EndOFWeek.format("YYYY-MM-DD");
            this.tasks[i].EndsAfter = true;
          }
          //this.tasks[i].InWeek_Start=(START.isBefore(StartOFWeek)) ? StartOFWeek.format("YYYY-MM-DD") : START.format("YYYY-MM-DD");
          //this.tasks[i].InWeek_End=(END.isBefore(EndOFWeek)) ? END.format("YYYY-MM-DD") : EndOFWeek.format("YYYY-MM-DD");

          this.tasks[i].duration =
            moment(this.tasks[i].InWeek_End, "YYYY-MM-DD").diff(
              moment(this.tasks[i].InWeek_Start, "YYYY-MM-DD"),
              "days"
            ) + 1;
          this.tasks[i].offset = moment(
            this.tasks[i].InWeek_Start,
            "YYYY-MM-DD"
          ).diff(StartOFWeek.format("YYYY-MM-DD"), "days");

          this.tasks[i].isInWeek_1 = true;
          this.tasks[i].isInGantt = true;
        }

        if (
          (NEXTluni.isBefore(START) && START.isBefore(NEXTduminica)) ||
          (NEXTluni.isBefore(END) && END.isBefore(NEXTduminica)) ||
          (START.isBefore(NEXTduminica) && NEXTduminica.isBefore(END))
        ) {
          if (START.isBefore(NEXT_StartOFWeek.format("YYYY-MM-DD"))) {
            this.tasks[i].NEXT_InWeek_Start = NEXT_StartOFWeek.format(
              "YYYY-MM-DD"
            );
            this.tasks[i].NEXT_StartsBefore = true;
          } else {
            this.tasks[i].NEXT_InWeek_Start = START.format("YYYY-MM-DD");
          }

          if (END.isBefore(NEXT_EndOFWeek)) {
            this.tasks[i].NEXT_InWeek_End = END.format("YYYY-MM-DD");
          } else {
            this.tasks[i].NEXT_InWeek_End = NEXT_EndOFWeek.format("YYYY-MM-DD");
            this.tasks[i].NEXT_EndsAfter = true;
          }
          //this.tasks[i].NEXT_InWeek_Start=(START.isBefore(NEXT_StartOFWeek)) ? NEXT_StartOFWeek.format("YYYY-MM-DD") : START.format("YYYY-MM-DD");
          //this.tasks[i].NEXT_InWeek_End=(END.isBefore(NEXT_EndOFWeek)) ? END.format("YYYY-MM-DD") : NEXT_EndOFWeek.format("YYYY-MM-DD");

          this.tasks[i].NEXTduration =
            moment(this.tasks[i].NEXT_InWeek_End, "YYYY-MM-DD").diff(
              moment(this.tasks[i].NEXT_InWeek_Start, "YYYY-MM-DD"),
              "days"
            ) + 1;
          this.tasks[i].NEXToffset = moment(
            this.tasks[i].NEXT_InWeek_Start,
            "YYYY-MM-DD"
          ).diff(NEXT_StartOFWeek.format("YYYY-MM-DD"), "days");

          this.tasks[i].isInWeek_2 = true;
          this.tasks[i].isInGantt = true;
        }

        if (this.tasks[i].StartsBefore && this.tasks[i].EndsAfter) {
          this.tasks[i].BarClass = "BothStartEnd";
        } else if (this.tasks[i].StartsBefore) {
          this.tasks[i].BarClass = "StartsBefore";
        } else if (this.tasks[i].EndsAfter) {
          this.tasks[i].BarClass = "EndsAfter";
        } else {
          this.tasks[i].BarClass = "Normal";
        }

        if (this.tasks[i].NEXT_StartsBefore && this.tasks[i].NEXT_EndsAfter) {
          this.tasks[i].NEXT_BarClass = "BothStartEnd";
        } else if (this.tasks[i].NEXT_StartsBefore) {
          this.tasks[i].NEXT_BarClass = "StartsBefore";
        } else if (this.tasks[i].NEXT_EndsAfter) {
          this.tasks[i].NEXT_BarClass = "EndsAfter";
        } else {
          this.tasks[i].NEXT_BarClass = "Normal";
        }
      }
    },
    CloseTask(task) {
      db
        .collection(firebase.auth().currentUser.uid)
        .doc(task.id)
        .set({ t_isActive: false }, { merge: true })
        .then(docRef => {
          console.log("task closed");
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    }
  },
  // },
  computed: {
    CurrentWeek: function() {
      return this.tasks.filter(function(task) {
        return task.isInWeek_1;
      });
    },
    NextWeek: function() {
      return this.tasks.filter(function(task) {
        return task.isInWeek_2;
      });
    },
    inGantt: function() {
      return this.tasks.filter(function(task) {
        return task.isInGantt;
      });
    },
    backLog: function() {
      return this.tasks.filter(function(task) {
        return !task.isInGantt;
      });
    }
  }
};
</script>

<style scoped>
.main {
  margin: 10px;
  background: aliceblue;
  padding: 5px;
}
.HeaderDays,
.HeaderWkend {
  border-right: solid;
}
.NextHeaderDays {
  border-left: solid;
}
.HeaderRow {
  background: lightgray;
  box-shadow: 6px 4px 8px 0px;
  border-right: solid;
  padding: 0 !important;
}

#currWeek {
  background: lightgray;
  padding: 5px;
}
#nextWeek {
  background: aliceblue;
  padding: 5px;
}

.WkndBar {
  text-align: center;
}
.tooltiptext {
  visibility: hidden;
  font-size: 15px;
  background-color: #484545;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 3px;
  /* top: -6px; */
  position: absolute;
  z-index: 9999;
  overflow: auto;
  width: 30vw;
}
.tooltip {
  cursor: pointer;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
.drawBar {
  background: #26a69a;
  border-radius: 50px;
  /* border: solid 1px #1b7169; */
  text-align: center;
}

.onHold{
  background:#cac7c7;
}
.taskRow {
  border-bottom: solid #bbb8b8 1px;
  padding-bottom: 5px;
}
.StartsBefore {
  border-radius: 0px 10px 10px 0px;
  background: linear-gradient(to right, #cccccc, #26a69a 10%);
}
.EndsAfter {
  border-radius: 10px 0px 0px 10px;
  background: linear-gradient(to left, #cccccc, #26a69a 10%);
}
.BothStartEnd {
  border-radius: 0px 0px 0px 0px;
  background: linear-gradient(to right, #cccccc, #26a69a, #cccccc);
}
.secondary-content {
  margin-right: 5px;
  float: right;
}
.sidenav > li {
  padding: 5px;
  background: #ececec;
}
.iconContainer {
  float: right;
  text-align: right;
}
.fa-trash-alt {
  color: #f5764e;
}
.fa-edit {
  color: #065ebb;
}
.fas {
  opacity: 0.6;
}
.fas:hover {
  opacity: 1;
}
.section {
  background: #e8e8e8;
}
.tskDetails{
  display: block;
  overflow: hidden;
  word-break: break-word;
}
.title{
    color: darkslateblue;
    background: white;
    border-radius: 50px;
    padding: 2px 10px;
    margin-bottom: 15px;
    display: block;
    text-align: center;
    font-style: italic;
}
</style>


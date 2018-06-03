<template>
  <div id="dashboard" style="margin: 0px 25px;">   
      <!-- select project -->
        
     
    <!-- view in weeks -->
    <ul class="collapsible">
    <li v-for="week in sortedWeek" v-bind:key="week.id">
      <div class="collapsible-header"><span class="weekNoH">{{week.no}} - (<b>{{week.text}}</b>)</span> <div class="right" style="margin-left: auto;">No of items : {{CountTasksInWeek(week.no,tasks)}}</div> </div>      
      
      <div class="collapsible-body">
          <!-- table header  -->
        <div class="row z-depth-3 brown darken-1 white-text hide-on-small-only">      
            <h6 class="col m2 s12">Task name</h6>
            <h6 class="col m6 s12">Description</h6>           
            <h6 class="col m1 s12">Status</h6>
            <h6 class="col m1 s12">Start</h6>
            <h6 class="col m1 s12">Deadline</h6>        
            <h6 class="col m1 s12">Owner</h6>    
        </div> 
        <!-- tasks -->
          <div v-bind:class="task.task_status=='On hold'?'onHold':'inProgres'" v-for="task in tasksInWeek(week.no,tasks)" v-bind:key="task.id" class="row z-depth-2">        
              <div class="col m2 s12 truncate"><b>{{task.task_name}}</b></div>
              <div class="col m6 s12" v-html="task.task_description"></div>                     
              <div class="col m1 s12"><i>{{task.task_status}}</i></div>
              <div class="col m1 s12">{{task.task_start}}</div>
              <div class="col m1 s12">{{task.task_deadline}}</div>                                   
              <div class="col m1 s12">{{task.task_owner}}</div>
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
      tasksAna: [],      
      tasksCip: [],
      tasksPipo: [],
      tasks:[],
      SelectedProject: null,
      weeks:[],
      Projects: fireList.projectsList
    };
  },
  computed: {
    sortedWeek: function() {
      function compare(a, b) {
        if (parseInt(a.no) < parseInt(b.no))
          return -1;
        if (parseInt(a.no) > parseInt(b.no))
          return 1;
        return 0;
      }

      return this.weeks.sort(compare);
    }
  },
  methods:{
    pushUnique(arr,itm){
      // if (arr.indexOf(itm) === -1) arr.push({"no":itm,"text":moment().week(itm).weekday(1).format("DD MMM")+"-" +moment().week(itm).weekday(7).format("DD MMM")});
      if (!arr.find(o => o.no === itm)){
        arr.push({"no":itm,"text":moment().week(itm).weekday(1).format("DD MMM")+"-" +moment().week(itm).weekday(7).format("DD MMM")});
      }
      
    },
    CountTasksInWeek: function (wkno,tasks) {
      // console.log(this.tasksAna)
      return tasks.filter(function (task) {
        return task.task_wkNo == wkno;
      }).length
    },
    tasksInWeek: function (wkno,tasks) {
      // console.log(this.tasksAna)
      return tasks.filter(function (task) {
        return task.task_wkNo == wkno;
      }).sort(this.sortTasks)
    },
    sortTasks: function(a, b) {
        if (a.task_deadline < b.task_deadline )
          return -1;
        if (a.task_deadline > b.task_deadline)
          return 1;
        return 0;
      }
  },
  created() {    
      //console.log(fireList.membersList)  
      //Ana
      db
          .collection("fzAuzR6aW0Q4qBvzYMBgP4Iepxw1")
          .where("t_isActive", "==", true)          
          .onSnapshot(querySnapshot => {            
            this.tasksAna = [];            
              querySnapshot.forEach(doc => {                
                //custom filter
                if ((doc.data().tStatus=="In progress" || doc.data().tStatus=="On hold") && doc.data().tDeadline!="Invalid date"){
                  // if (true) {
                        const data = {
                          id: doc.id,
                          task_name: doc.data().tName,
                          task_description: doc
                            .data()
                            .tDescription.replace(/\n/g, "<br/>"),
                          task_start: moment(doc.data().tStart,"YYYY-MM-DD").format("DD-MMM"),
                          task_deadline: moment(doc.data().tDeadline,"YYYY-MM-DD").format("DD-MMM"),
                          task_wkNo: moment(doc.data().tDeadline,"YYYY-MM-DD").week(),
                          task_status: doc.data().tStatus,
                          task_project: doc.data().tProject,
                          task_owner: "Ana"
                        };
                        this.tasksAna.push(data);
                        this.tasks.push(data);
                        this.pushUnique(this.weeks,data.task_wkNo)
              
                }
              }); 
                  
          })
      //Cip      
      db
          .collection("YqRVNtuUu3aAHt6g2YW05OxIsj42")
          .where("t_isActive", "==", true)          
          .onSnapshot(querySnapshot => {            
            this.tasksCip = [];            
              querySnapshot.forEach(doc => {                
                //custom filter                
                if ((doc.data().tStatus=="In progress" || doc.data().tStatus=="On hold") && doc.data().tDeadline!=null){
                  // if (true) {
                        const data = {
                          id: doc.id,
                          task_name: doc.data().tName,
                          task_description: doc
                            .data()
                            .tDescription.replace(/\n/g, "<br/>"),
                          task_start: moment(doc.data().tStart,"YYYY-MM-DD").format("DD-MMM"),
                          task_deadline: moment(doc.data().tDeadline,"YYYY-MM-DD").format("DD-MMM"),
                          task_wkNo: moment(doc.data().tDeadline,"YYYY-MM-DD").week(),
                          task_status: doc.data().tStatus,
                          task_project: doc.data().tProject,
                          task_owner: "Cip"
                        };
                        this.tasksCip.push(data);
                        this.tasks.push(data);
                        this.pushUnique(this.weeks,data.task_wkNo)
              
                }
              }); 
                  
          })
      //Pipo
      db
          .collection("5k9ubjsQNibn3MXXez1N5Y52IMC3")
          .where("t_isActive", "==", true)          
          .onSnapshot(querySnapshot => {            
            this.tasksPipo = [];            
              querySnapshot.forEach(doc => {                
                //custom filter                
                if ((doc.data().tStatus=="In progress" || doc.data().tStatus=="On hold") && doc.data().tDeadline!=null){
                  // if (true) {
                        const data = {
                          id: doc.id,
                          task_name: doc.data().tName,
                          task_description: doc
                            .data()
                            .tDescription.replace(/\n/g, "<br/>"),
                          task_start: moment(doc.data().tStart,"YYYY-MM-DD").format("DD-MMM"),
                          task_deadline: moment(doc.data().tDeadline,"YYYY-MM-DD").format("DD-MMM"),
                          task_wkNo: moment(doc.data().tDeadline,"YYYY-MM-DD").week(),
                          task_status: doc.data().tStatus,
                          task_project: doc.data().tProject,
                          task_owner: "Pipo"
                        };
                        this.tasksPipo.push(data);
                        this.tasks.push(data);
                        this.pushUnique(this.weeks,data.task_wkNo)
              
                }
              }); 
                  
          })   
     $(document).ready(function(){
      $('.collapsible').collapsible();      
    });
  }
};
</script>

<style scoped>
.row{
      margin-bottom: 3px !important;
}
.collapsible-body{
  padding: 10px !important;
}
.onHold{
  background:#efefef;
}
.inProgres{
  background:#c9fdcf7d;
}
.active .weekNoH::before { 
    content: " \25bc ";
}
</style>

<template>
  <div class="main">  

    <!-- current weeek -->
    <div v-if="CurrentWeek.length>0" id="currWeek">
      Current week:<br/>
      <div class="row">
        <div class="leftPanel HeaderRow col m3">
          <span class="col">Name</span>          
        </div>
        <div class="HeaderRow col m9">
          <div v-for="days in headerDates" v-bind:key="days.id" class="col m2 HeaderDays">
            {{days}}
          </div> 
        </div>
        
      </div>   
      <TableRows v-for="task in CurrentWeek" v-bind:key="task.id" :task="task" ></TableRows>
    </div>
<hr/>
    <!-- next weeek -->
    <div v-if="NextWeek.length>0" id="nextWeek">
      Next week:<br/>
      <div class="row">
        <div class="leftPanel HeaderRow col m3">
          <span class="col">Name</span>          
        </div>
        <div class="HeaderRow col m9">
          <div v-for="days in NextHeaderDates" v-bind:key="days.id" class="col m2 HeaderDays">
            {{days}}
          </div> 
        </div>
        
      </div>   
      <TableRows v-for="task in NextWeek" v-bind:key="task.id" :task="task" ></TableRows>
    </div> 
  </div>
</template>

<script>
import TableRows from "./ViewGanttRows.vue";
import firebase from "firebase";
import db from "./firebaseInit";

var moment = require("moment");

export default {
  components: { TableRows },
  data() {
    return {
      headerDates: [],
      NextHeaderDates: [],
      moment: moment,
      tasks: [],
      currWeek:[],
      nextWeek:[]
    };
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
              start_date: doc.data().tStart,
              end_date: doc.data().tDeadline,
              task_status: doc.data().tStatus,
            };
            this.tasks.push(data);
          }
        });
          this.GrantTasks()
       
       })  
    

  },
  methods: {
      GrantTasks(){
      var i;
      //Created currWeek header
      for (i = 1; i < 6; i++) {
        this.headerDates.push(
          moment()
            .weekday(i)
            .format("MMMM Do")
        );
      };

      for (i = 8; i < 13; i++) {
        this.NextHeaderDates.push(
          moment()
            .weekday(i)
            .format("MMMM Do")
        );
      };  
      
      var StartOFWeek=moment().weekday(1);
      var EndOFWeek=moment().weekday(5);
  
      for (i = 0; i < this.tasks.length; i++) {
        this.tasks[i].StartInWeek=((moment(this.tasks[i].start_date,"YYYY-MM-DD").isBefore(StartOFWeek)) ? StartOFWeek.format("YYYY-MM-DD") : this.tasks[i].start_date);

        this.tasks[i].EndInWeek=((moment(this.tasks[i].end_date,"YYYY-MM-DD").isBefore(EndOFWeek)) ? this.tasks[i].end_date : EndOFWeek.format("YYYY-MM-DD"));

        this.tasks[i].duration = moment(this.tasks[i].EndInWeek,"YYYY-MM-DD").diff(moment(this.tasks[i].StartInWeek,"YYYY-MM-DD"),"days") + 1;
        this.tasks[i].offset=  moment(this.tasks[i].StartInWeek).diff(moment(StartOFWeek.format("YYYY-MM-DD"),"YYYY-MM-DD"),"days");
        
        var duminica=moment().weekday(7);
        var luni=moment().weekday(0);

        var NEXTduminica=moment().weekday(14);
        var NEXTluni=moment().weekday(8);

        var START=moment(this.tasks[i].start_date,"YYYY-MM-DD");      
        var END=moment(this.tasks[i].end_date,"YYYY-MM-DD");

        //console.log(luni.format("YYYY-MM-DD") + "<" + START.format("YYYY-MM-DD") + "||"+START.format("YYYY-MM-DD") + "<" + duminica.format("YYYY-MM-DD") )

        if( (luni.isBefore(START) && START.isBefore(duminica)) || (luni.isBefore(END) && END.isBefore(duminica)) ){
          this.tasks[i].isInWeek=1        
        } else if( (NEXTluni.isBefore(START) && START.isBefore(NEXTduminica)) || (NEXTluni.isBefore(END) && END.isBefore(NEXTduminica)) ){
            this.tasks[i].duration = END.diff(START,"days") + 1;
            this.tasks[i].offset= START.diff(moment().weekday(7),"days"); 
            
            this.tasks[i].isInWeek=2
        }
      }
    }
  },
  computed:{
    CurrentWeek:function(){
       return this.tasks.filter(function(task) {
        return task.isInWeek == 1;
      });
    },
    NextWeek:function(){
       return this.tasks.filter(function(task) {
        return task.isInWeek ==2;
      });
    }
  }
};
</script>

<style scope>
.main {
  margin: 10px;
}
.HeaderDays {  
  border-right: solid;  
}
.HeaderRow{
  background: grey;
  box-shadow: 6px 4px 8px 0px;
  border-right: solid;
}
.drawBar {
  background:#26a69a;
  border-radius: 50px;
}
#currWeek{
  background: lightgray;
  padding: 5px;
}
#nextWeek{
  background: aliceblue;
  padding: 5px;
}

</style>

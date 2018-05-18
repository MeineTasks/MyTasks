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
      <TableRowsNEXT v-for="task in NextWeek" v-bind:key="task.id" :task="task" ></TableRowsNEXT>
    </div> 
  </div>
</template>

<script>
import TableRows from "./ViewGanttRows.vue";
import TableRowsNEXT from "./ViewGanttRows_NEXT.vue";
import firebase from "firebase";
import db from "./firebaseInit";

var moment = require("moment");

export default {
  components: { TableRows,TableRowsNEXT },
  data() {
    return {
      headerDates: [],
      NextHeaderDates: [],
      moment: moment,
      tasks: []
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
              tsk_start_date: doc.data().tStart,
              tsk_end_date: doc.data().tDeadline,
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
      //Created nexxtWeek header
      for (i = 8; i < 13; i++) {
        this.NextHeaderDates.push(
          moment()
            .weekday(i)
            .format("MMMM Do")
        );
      };  
      
      var StartOFWeek=moment().weekday(1);
      var EndOFWeek=moment().weekday(5);      
      
      var NEXT_StartOFWeek=moment().weekday(8);
      var NEXT_EndOFWeek=moment().weekday(12);  

      var luni=moment().weekday(0);
      var duminica=moment().weekday(7);

      var NEXTluni=moment().weekday(8);
      var NEXTduminica=moment().weekday(14);

      // console.log("StartOFWeek: "+StartOFWeek.format("YYYY-MM-DD"))
      // console.log("EndOFWeek: "+EndOFWeek.format("YYYY-MM-DD")) 
      // console.log("luni: "+luni.format("YYYY-MM-DD"))
      // console.log("duminica: "+duminica.format("YYYY-MM-DD"))
      // console.log("NEXTluni: "+NEXTluni.format("YYYY-MM-DD"))
      // console.log("NEXTduminica: "+NEXTduminica.format("YYYY-MM-DD"))

      for (i = 0; i < this.tasks.length; i++) {
        var START=moment(this.tasks[i].tsk_start_date,"YYYY-MM-DD");      
        var END=moment(this.tasks[i].tsk_end_date,"YYYY-MM-DD");

        //current week
        
      

        //console.log(luni.format("YYYY-MM-DD") + "<" + START.format("YYYY-MM-DD") + "||"+START.format("YYYY-MM-DD") + "<" + duminica.format("YYYY-MM-DD") )

        //alocate weeks
        if( (luni.isBefore(START) && START.isBefore(duminica)) || (luni.isBefore(END) && END.isBefore(duminica)) ){ 
          this.tasks[i].InWeek_Start=(START.isBefore(StartOFWeek)) ? StartOFWeek.format("YYYY-MM-DD") : START.format("YYYY-MM-DD");
          this.tasks[i].InWeek_End=(END.isBefore(EndOFWeek)) ? END.format("YYYY-MM-DD") : EndOFWeek.format("YYYY-MM-DD");

          this.tasks[i].duration = moment(this.tasks[i].InWeek_End,"YYYY-MM-DD").diff(moment(this.tasks[i].InWeek_Start,"YYYY-MM-DD"),"days") + 1;
          this.tasks[i].offset=  moment(this.tasks[i].InWeek_Start,"YYYY-MM-DD").diff(StartOFWeek.format("YYYY-MM-DD"),"days");
          
          this.tasks[i].isInWeek_1=1
        };

        if( (NEXTluni.isBefore(START) && START.isBefore(NEXTduminica)) || (NEXTluni.isBefore(END) && END.isBefore(NEXTduminica)) ){
          
          this.tasks[i].NEXT_InWeek_Start=(START.isBefore(NEXT_StartOFWeek)) ? NEXT_StartOFWeek.format("YYYY-MM-DD") : START.format("YYYY-MM-DD");

          this.tasks[i].NEXT_InWeek_End=(END.isBefore(NEXT_EndOFWeek)) ? END.format("YYYY-MM-DD") : NEXT_EndOFWeek.format("YYYY-MM-DD");

          this.tasks[i].NEXTduration =  moment(this.tasks[i].NEXT_InWeek_End,"YYYY-MM-DD").diff(moment(this.tasks[i].NEXT_InWeek_Start,"YYYY-MM-DD"),"days") + 1;
          this.tasks[i].NEXToffset= moment(this.tasks[i].NEXT_InWeek_Start,"YYYY-MM-DD").diff(NEXT_StartOFWeek.format("YYYY-MM-DD"),"days");
            
          this.tasks[i].isInWeek_2=1
        }
      }
    }
  },  
  // },
  computed:{
    CurrentWeek:function(){
       return this.tasks.filter(function(task) {
        return task.isInWeek_1 == 1;
      });
    },
    NextWeek:function(){
       return this.tasks.filter(function(task) {
        return task.isInWeek_2 ==1;
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

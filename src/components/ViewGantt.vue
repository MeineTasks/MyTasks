<template>
  <div class="main">  

    <!-- current weeek -->

    <div class="currWeek">
      Current week:<br/>
      <div class="row">
        <div class="leftPanel col m3">
          <span class="col m3">Name</span>
          <span class="col m6">Descript</span>
        </div>
        <div v-for="days in headerDates" v-bind:key="days.id" class="col m1 header">
          {{days}}
        </div> 
      </div>   
      <TableRows v-for="task in CurrentWeek" v-bind:key="task.id" :task="task" ></TableRows>
    </div>
<hr/>
    <!-- next weeek -->
    <div class="nextWeek">
      Next week:<br/>
      <div class="row">
        <div class="leftPanel col m3">
          <span class="col m3">Name</span>
          <span class="col m6">Descript</span>
        </div>
        <div v-for="days in NextHeaderDates" v-bind:key="days.id" class="col m1 header">
          {{days}}
        </div> 
      </div>   
      <TableRows v-for="task in NextWeek" v-bind:key="task.id" :task="task" ></TableRows>
    </div>
  </div>
</template>

<script>
import TableRows from "./ViewGanttRows.vue";
var moment = require("moment");

export default {
  components: { TableRows },
  data() {
    return {
      headerDates: [],
      NextHeaderDates: [],
      moment: moment,
      tasks: [
        {
          id: 1,
          text: "Task #1",
          start_date: "2018-05-17",
          end_date: "2018-05-19",
          duration: null,
          offset: 1,
          StartInWeek:null,
          EndInWeek:null,
          isInWeek:null
        },
        {
          id: 2,
          text: "Task #2",
          start_date: "2018-05-16",
          end_date: "2018-05-16",
          duration: null,
          offset: 2,
          StartInWeek:null,
          EndInWeek:null,
          isInWeek:null
        },
        {
          id: 3,
          text: "Task #3",
          start_date: "2017-05-13",
          end_date: "2017-05-25",
          duration: null,
          offset: 0,
          StartInWeek:null,
          EndInWeek:null,
          isInWeek:null
        },
        {
          id: 4,
          text: "Task #4",
          start_date: "2018-05-14",
          end_date: "2018-05-15",
          duration: null,
          offset: 0,
          StartInWeek:null,
          EndInWeek:null,
          isInWeek:null
        },
        {
          id: 5,
          text: "Task #5",
          start_date: "2018-05-23",
          end_date: "2018-05-23",
          duration: null,
          offset: 0,
          StartInWeek:null,
          EndInWeek:null,
          isInWeek:null
        }
      ],
      currWeek:[],
      nextWeek:[]
    };
  },  
  mounted() {
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
.header {
  background: grey;
  border: solid;
}
.drawBar {
  background: red;
  border-radius: 50px;
}
</style>

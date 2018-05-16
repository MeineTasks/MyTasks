<template>
  <div class="main">      
    <div class="row">
      <div class="leftPanel col m3">
        <span>Name</span>
        <span>Descript</span>
      </div>
      <div v-for="days in headerDates" v-bind:key="days.id" class="col m1 header">
         {{days}}
      </div> 
    </div>   
    <TableRows v-for="task in tasks" v-bind:key="task.id" :task="task" ></TableRows>  

       
  </div>
</template>

<script>
import TableRows from './ViewGanttRows.vue'
var moment = require("moment");

export default {
  components: {TableRows},
  data() {
    return {      
      headerDates:[],
      moment: moment,
      tasks: [
          {id: 1, text: 'Task #1', start_date: '15-04-2017', duration: "m3", offset: "1"},
          {id: 2, text: 'Task #2', start_date: '18-04-2017', duration: "m1", offset: "2"},
          {id: 3, text: 'Task #3', start_date: '18-04-2017', duration: "m2", offset: "0"}
        ]
    };
  },
   mounted() {     
    var i;
    for (i = 1; i < 6; i++) { 
        this.headerDates.push(moment().weekday(i).format("MMMM Do"))
    }
  }  
};
</script>

<style scope>
.main{
  margin: 10px;
}
.header{
  background: grey;
  border: solid
}
.drawBar{
  background: red;
  border-radius: 50px
}
</style>

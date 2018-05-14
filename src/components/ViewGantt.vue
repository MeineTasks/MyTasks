<template>
  <div class="container row">      
     <div v-for="days in headerDates" v-bind:key="days.id" class="col m2">
         {{days}}
     </div>  
     <div class="col m4 offset-m2" style="background:red">
         test
     </div>  
       <div class="col m6 offset-m4" style="background:red">
         test2
     </div> 
     <div class="row">
        <div class="col m2" style="background:red">
         test3
     </div> 
     </div>
       
  </div>
</template>

<script>
var moment = require("moment");
export default {
  data() {
    return {      
      headerDates:[],
      moment: moment
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

<style>

</style>

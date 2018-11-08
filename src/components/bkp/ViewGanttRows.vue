<template>
  <div class="row">      
      <div class="leftPanel col m3">
        <span class="col tooltip">
          {{task.task_name}}
            <!-- <span class="tooltiptext" v-html="task.task_description"></span> -->
            <span class="tooltiptext">{{task.tsk_start_date}} -- {{task.tsk_end_date}}</span>
          </span>        
      </div>
      <div class="col m9">
        <div class="drawBar col" v-bind:class="['m'+task.duration,'offset-m'+task.offset]">
          {{task.task_name}}
        </div>  
      </div>  
    </div>
</template>

<script>
export default {
  name: 'TableRows',
  props: {
    task: {      
      default: () => null
    }
  }
}
</script>
<style>
.tooltiptext {
    visibility: hidden;
    font-size: 20px;
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
.tooltip{
  cursor: pointer;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  
}

</style>


<template>
  <div class="row">      
      <div class="leftPanel col m3">
        <span class="col tooltip">
          {{task.task_name}}
            <span class="tooltiptext" v-html="task.task_description"></span>
          </span>        
      </div>
      <div class=" col m9">
        <div class="drawBar col" v-bind:class="['m'+task.duration*2,'offset-m'+task.offset*2]">
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
    width: 50vw;
  
}
.tooltip{
  cursor: pointer;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  
}
/* .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 10%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #484545 transparent transparent transparent;
} */
</style>


<template>
  <div class="row">      
      <div class="leftPanel col m3" >
        <span class="col m3">{{task.id}}</span>
        <span class="col m6">{{task.text}}</span>
      </div>
      <div class="drawBar col" v-bind:class="['m'+task.duration,'offset-m'+task.offset]">
        {{task.id}}
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

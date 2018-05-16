<template>
  <div class="row">      
      <div class="leftPanel col m3" >
        <span>{{task.text}}</span>
        <span>Descript</span>
      </div>
      <div class="drawBar col" v-bind:class="[task.duration,'offset-m'+task.offset]">
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

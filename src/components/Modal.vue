<template>
  <div id="modal1" class="modal">
    <div class="modal-content" v-if="GotTarget">
      <h4>Required info</h4>
      <!-- content for USED fte only -->
      <div v-if="infoType=='UsedOnly'">
        <p>Please update the used FTE</p>
        <span v-if="displayFTA" class="FTEcont">          
          <select          
            v-bind:value="targetTask.task_usedFTE"
            style="display:inline;width:70px"
            @change="updateParentFTE($event)"
          >
            <option
              v-for="fta in UsedFTAarray"
              v-bind:key="fta.id"
              v-bind:value="fta"            
            >{{fta}}</option>
          </select>
          <span>FTE</span>
        </span>
        <span v-else>
          <!-- generate hours list -->
          <select v-model="hours" style="display:inline;width:70px" @change="switchType('hours')">
            <option
              v-for="fta in UsedFTAarray"
              v-bind:key="fta.id"
              v-bind:value="fta*40"
            >{{fta*40}}</option>
          </select>
          <span>Hours</span>
        </span>
      </div>
      <!-- content for Both fte  -->
      <div v-if="infoType=='both'">
        <div class="row">
          <p><i>Please update the used FTE</i></p>
          <blockquote>If left blank will set the estimated value</blockquote>
        </div>
        <!-- estimated -->
        <div class="row">
          Estimated :
          <span v-if="displayFTA">
          {{targetTask.task_FTE}} FTE
          </span>
          <span v-else>
          {{estimatedHours}} hours
          </span>
        </div>
        <!-- used -->
        <div class="row">
          Used:         
          <span v-if="displayFTA" class="FTEcont"> 
            <select          
              v-bind:value="targetTask.task_usedFTE"
              style="display:inline;width:70px"
              @change="updateParentFTE($event)"
            >
              <option
                v-for="fta in UsedFTAarray"
                v-bind:key="fta.id"
                v-bind:value="fta"            
              >{{fta}}</option>
            </select>
            <span>FTE</span>
          </span>
          <span v-else>
            <!-- generate hours list -->
            <select v-model="hours" style="display:inline;width:70px" @change="switchType('hours')">
              <option
                v-for="fta in UsedFTAarray"
                v-bind:key="fta.id"
                v-bind:value="fta*40"
              >{{fta*40}}</option>
            </select>
            <span>Hours</span>
          </span>        
        </div> 
      </div>
      <div class="switch">
        <label>
          Hours
          <input @change="switchType('fte')" v-model="displayFTA" type="checkbox">
          <span class="lever"></span>
          FTE
        </label>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn black" @click="AddInfo('close')">Cancel</button>
        <button type="button" class="btn" @click="AddInfo('save')">Save</button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "Modal",
  props: {
    FTAarray: Array,
    UsedFTAarray:Array,
    GotTarget: Boolean,
    targetTask: Object,
    infoType:String
    
  },
  data() {
    return {
      displayFTA: true,
      hours: null,
      estimatedHours:null
      
      
    };
  },
  mounted() {      
     
    // $(".modal").modal();
    // M.Modal.getInstance($("#modal1")).open()
  },
  
  methods: {
    updateParentFTE(evnt){
        //   debugger
        this.$emit("updateFTE",evnt.target.value)
        //   console.log(evnt.target.value)
      },
    switchType(typ) {
      // used
      if (typ == "fte") {
        this.hours = 40 * this.targetTask.task_usedFTE;
      } else {
        this.targetTask.task_usedFTE = (this.hours / 40).toFixed(2);
      }
      // estimated
      if(this.targetTask.task_FTE=="TBD"){
        this.estimatedHours="TBD"
      }else{
        this.estimatedHours= 40 * this.targetTask.task_FTE;
      }
      
    },

    AddInfo(typ) {
      if (typ == "save") {        
        if (this.targetTask.task_usedFTE == null ||this.targetTask.task_usedFTE == "") {
          if(this.infoType=="both" && this.targetTask.task_FTE!="TBD"){
            this.targetTask.task_usedFTE=this.targetTask.task_FTE
          }else{
            M.toast({ html: `Please set used FTE` });
            return false;
          }
        }
        this.$emit("AddInfo");
      }
      M.Modal.getInstance($("#modal1")).close();
    }
  }
};
</script>

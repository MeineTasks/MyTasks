<template>
    <div id="dashboard" style="margin: 0px 25px;">
        <!-- filter -->
        <div class="row z-depth-2 filterContainer brown lighten-4">
            <div class="col m6 s12 " >              
              <span class="tooltipped" data-position="right" 
                data-tooltip="Click for multiple selections">
                Filter by status :</span>
               <div id="listStat">
                 <span 
                  @click="MultiStatus(opt)"
                  
                  v-for="opt in StatusesList" 
                  v-bind:key="opt.id" 
                  v-bind:class="{'mySingleSelected':SelectedStatus.indexOf(opt)>-1}" class="mySingle chip">
                    {{opt}}
                  </span>
               </div> 
              
            </div>
            <!-- Creator filter -->
            <div class="col m6 s12 right" style="text-align:right">
                <span>
                    Filter by creator: 
                </span>
                <div id="listCreator">
                  <span 
                    @click="MultiCreator(mng)" 
                    v-for="mng in FireManagersArray" 
                    v-bind:key="mng.id" 
                    v-bind:class="{'mySingleSelected':SelectedManager.indexOf(mng.OBJ.UID)>-1}" 
                    class="mySingle chip">
                      {{mng.OBJ.name}}
                    </span>                
                </div>
             
            </div>
            <!-- date filter -->
            <div class="col m6 s12">
                <span>Filter by Date &#8594;</span>
                <span v-if="!showDateFilter">
                          No date filter applied: 
                          <a 
                            @click="showDateFilter=true" 
                            class="waves-effect waves-light btn-small"
                          >Add filter<i class="material-icons left">event</i></a>
                        </span>
                    <span v-if="showDateFilter">
                         From:  <input @change="datefilter_setEnd()" class="dateField" type="date" placeholder="start date" v-model="Datefilter_start">
                          - To: 
                          <input class="dateField" type="date" placeholder="end date" v-model="Datefilter_end" >
                          <a @click="ADDTasksIncat()" class="waves-effect waves-light btn-small">Add date filter</a>
                          <a @click="showDateFilter=false,ADDTasksIncat()" class="waves-effect waves-light btn-small  grey darken-2">Remove date filter<i class="material-icons left">event_busy</i></a>
                </span>
            </div>
         
              
        </div>
           <!-- user filter -->
            <div class="row z-depth-1">
              <div class="col m12 s12" >              
              <span class="tooltipped " data-position="right" data-tooltip="Click for multiple selections">Filter by users &#8594;</span>
                <span
                  @click="MultiUser(opt)" 
                  v-for="opt in FireUsersArray" 
                  v-bind:key="opt.id" 
                  v-bind:class="{'mySingleSelected':SelectedUsers.indexOf(opt.OBJ.UID)>-1}" class="mySingle chip">
                    {{opt.OBJ.name}}
                  </span>
            </div>
         </div>
        <!-- user tasks -->
        <div v-for="user in xFilteredUsersArr" v-bind:key="user.id" class="z-depth-1">
            <div  class="row valign-wrapper" style="border-bottom: #484545 solid 1px; ">
                <!-- first coll -->
                <div class="col m2">
                    <span class="chip">
                    {{user.OBJ.name}}
                </span>
                    <div class="row"><b>{{user.OBJ.tasks.length}}</b> tasks</div>
                    <div class="row blue-text"><b>Estimated</b> FTE <b>{{sumFTA(user.OBJ.tasks)}}</b><br/>
                    <span class="red-text"><b>Used</b> FTE <b>{{sumFTAused(user.OBJ.tasks)}}</b></span></div>
                    
                </div>
                <!-- second coll -->
                <div class="col m10">
                    <!-- card container structure -->
                    <div v-for="task in user.OBJ.tasks" v-bind:key="task.id" class="col m2 s12">
                        <div class="card blue-grey" v-bind:class="task.task_status=='In progress'?'darken-2':'lighten-3'">
                            <!-- card tittle -->
                            <div class="card-content white-text">
                                <!-- project category -->
                              <span class="truncate"> 
                                  {{task.task_project}}                                  
                              </span>
                              <span class="task-title" v-bind:class="task.task_status=='In progress'?'cyan-text text-lighten-3':'black-text'"> 
                                  <span class="tooltipped" data-position="top" v-bind:data-tooltip="task.task_name">
                                    {{task.task_name}}
                                  </span>
                              </span>
                                <div class="row" style="margin-left:0px">
                                    <div class="chip col">{{task.task_status}}</div>
                                    <span class="col">{{task.task_deadline_short}}</span>
                                    <br/>
                                    <div v-if="task.task_FTE!=undefined && task.task_FTE!='' && ['In progress','Not started','Not allocated'].indexOf(task.task_status)>=0" class="blue-text col text-lighten-3">{{task.task_FTE}} FTE</div>
                                    <div v-if="task.task_usedFTE!=undefined && task.task_usedFTE!='' && ['In progress','Not started','Not allocated'].indexOf(task.task_status)==-1" class="red-text col">{{task.task_usedFTE}} FTE</div>
                                </div>
                                <hr/>
                                <!-- START icon container -->
                                <div v-if="isManager" class="row iconContainer">
                                    <div class="col m3">                                      
                                        <router-link class="tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Edit</span>" v-bind:to="{name:'edit-task_mng',params:{task_id:task.id},query:{uid:task.task_owner,mnext:'viewusers'} }">
                                            <i class="fas fa-edit"></i>
                                        </router-link>
                                    </div>
                                    <div v-if="task.task_status!='Completed' && task.task_status!='Canceled'" class="col m3">
                                      <span v-bind:class="{'myBtn':!task.task_completed}" >                                        
                                        <i class="tooltipped fas" data-position="top" data-tooltip="<span style='font-size:small'>Complete</span>" @click="CompleteTask(task)" v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'" ></i>
                                      </span>
                                    </div>
                                    <div class="col m3">
                                        <span class="myBtn">                
                                            <i class="tooltipped far" data-position="top" data-tooltip="<span style='font-size:small'>In progress/on hold</span>" @click="StartStop(task)" v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'" ></i>
                                        </span>
                                    </div>
                                     <div class="col m3">
                                        <span class="myBtn tooltip">
                                            <i class="tooltipped fas fa-ban" data-position="top" data-tooltip="<span style='font-size:small'>Cancel</span>" @click="CancelTask(task)" ></i>
                                        </span>
                                    </div>
                                </div>
                                <!-- END icon container -->
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div v-if="isManager" class="fixed-action-btn">
          <router-link v-bind:to="{name:'new-task',query:{mnext:'viewusers'}}" class="btn-floating btn-large red">
            <i class="fa fa-plus"></i>
          </router-link>
        </div>
        <!-- Modal Structure -->
    <div
      id="modal1"
      class="modal"
    >
      <div class="modal-content" v-if="GotTarget">
        <h4>Required info</h4>
        <p>Please set the used FTE</p>
        <span v-if="displayFTA" class="FTEcont">
          <select
            v-model="targetTask.task_usedFTE"
            style="display:inline;width:70px"
            @change="updateFTE('fte')"
          >
            <option
              v-for="fta in FTAarray.filter(itm=>itm!='TBD')"
              v-bind:key="fta.id"
              v-bind:value="fta"
            >{{fta}}</option>
          </select>
          <span>FTE</span>
        </span>
        <span v-else>
          <select
            v-model="hours"
            style="display:inline;width:70px"
            @change="updateFTE('hours')"
          >
            <option
              v-for="fta in FTAarray.filter(itm=>itm!='TBD')"
              v-bind:key="fta.id"
              v-bind:value="fta*40"
            >{{fta*40}}</option>
          </select>
          <span>Hours</span>
        </span>
        <div class="switch">
          <label>
            Hours
            <input
             @change="updateFTE('fte')"
              v-model="displayFTA"
              type="checkbox"
            >
            <span class="lever"></span>
            FTE
          </label>

        </div>
        <div class="modal-footer">
          <button type="button" class="btn black" @click="AddInfo('close')">Close</button>
          <button type="button" class="btn" @click="AddInfo('save')">Save</button>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
// import db from "./firebaseInit";
import firebase from "firebase";
import fireList from "./fireLists";
import RTDB from "./firebaseInitRTDB";

var moment = require("moment");

export default {
  name: "userview",
  props: { isManager: Boolean },
  data() {
    return {
      //   users: fireList.OwnersList,
      showDateFilter: true,
      Datefilter_start:localStorage.getItem("viewUser_FilterStart")?JSON.parse(localStorage.getItem("viewUser_FilterStart")):moment()
        .weekday(1)
        .format("YYYY-MM-DD"),
      Datefilter_end:localStorage.getItem("viewUser_FilterEnd")?JSON.parse(localStorage.getItem("viewUser_FilterEnd")): moment()
        .weekday(5)
        .format("YYYY-MM-DD"),
      StatusesList: fireList.statusesList,
      SelectedStatus: localStorage.getItem("viewUser_StatusesFilterObj")
        ? JSON.parse(localStorage.getItem("viewUser_StatusesFilterObj"))
        : ["In progress", "On hold", "Not allocated"],
      FireUsersArray: [],
      NFireUsersArray: [],
      xFilteredUsersArr: [],
      SelectedUsers: localStorage.getItem("viewUser_SelectedUsersFilterObj")
        ? JSON.parse(localStorage.getItem("viewUser_SelectedUsersFilterObj"))
        : [],
      FireManagersArray: [],

      GotUsers: 0,
      FireProjCatArray: [],
      SelectedManager: localStorage.getItem("viewUser_CreatorsFilterObj")
        ? JSON.parse(localStorage.getItem("viewUser_CreatorsFilterObj"))
        : [],
        FTAarray: fireList.FTEList,
      GotTarget:false,
      displayFTA: true,
      hours: null,
      targetTask:null,
      QActStat:"",
    };
  },
  updated() {    
    $(".tooltipped").tooltip();
  },
  
  mounted() {
    this.GetFire_users();
    $('.modal').modal();
    },
  methods: {
    AddInfo(typ){
      if (typ=='save'){
        if (this.targetTask.task_usedFTE == null){
          M.toast({ html: `Please set used FTE` });
          return false
        }
        //  var newStatus =
        //     this.targetTask.task_status == "In progress" ? "On hold" : "In progress";          
          
          RTDB.ref(
            "/USERS/" + firebase.auth().currentUser.uid + "/TASKS/" + this.targetTask.id + "/"
          ).update({
            tStatus: this.QActStat,
            tFTEused:this.targetTask.task_usedFTE
          });        

      }
        M.Modal.getInstance($("#modal1")).close()
        this.task_FTE= null
        this.hours= null
      
    },
    updateFTE (type) {
      if (type == 'fte') {

        this.hours = 40 * this.targetTask.task_usedFTE
      } else {
         this.targetTask.task_usedFTE = (this.hours / 40).toFixed(2)
      }
    },
    MultiStatus(opt) {
      var objVue = this;
      var index = objVue.SelectedStatus.indexOf(opt);

      if (objVue.SelectedStatus.length == objVue.StatusesList.length) {
        objVue.SelectedStatus = [opt];
      } else {
        if (index == -1) {
          objVue.SelectedStatus.push(opt);
        } else {
          objVue.SelectedStatus.splice(index, 1);
        }
        //select All
        if (objVue.SelectedStatus.length == 0) {
          objVue.StatusesList.forEach(itm => {
            objVue.SelectedStatus.push(itm);
          });
        }
      }
      objVue.ADDTasksIncat();
    },
    MultiUser(opt) {
      var objVue = this;
      var index = objVue.SelectedUsers.indexOf(opt.OBJ.UID);

      if (objVue.SelectedUsers.length == objVue.FireUsersArray.length) {
        objVue.SelectedUsers = [opt.OBJ.UID];
      } else {
        if (index == -1) {
          objVue.SelectedUsers.push(opt.OBJ.UID);
        } else {
          objVue.SelectedUsers.splice(index, 1);
        }
        //select All
        if (objVue.SelectedUsers.length == 0) {
          objVue.FireUsersArray.forEach(itm => {
            objVue.SelectedUsers.push(itm.OBJ.UID);
          });
        }
      }

      objVue.ADDTasksIncat();
    },
    MultiCreator(opt) {
      var objVue = this;
      var index = objVue.SelectedManager.indexOf(opt.OBJ.UID);

      if (objVue.SelectedManager.length == objVue.FireManagersArray.length) {
        objVue.SelectedManager = [opt.OBJ.UID];
      } else {
        if (index == -1) {
          objVue.SelectedManager.push(opt.OBJ.UID);
        } else {
          objVue.SelectedManager.splice(index, 1);
        }
        //select All
        if (objVue.SelectedManager.length == 0) {
          objVue.FireManagersArray.forEach(mng => {
            objVue.SelectedManager.push(mng.OBJ.UID);
          });
        }
      }

      objVue.ADDTasksIncat();
    },
    datefilter_setEnd() {
      this.Datefilter_end = moment(this.Datefilter_start, "YYYY-MM-DD")
        .weekday(5)
        .format("YYYY-MM-DD");
    },
    GetFire_users() {
      var objVue = this;
      RTDB.ref("/USERS/")
        .orderByChild("isOwner")
        .equalTo(true)
        .on("value", querySnapshot => {
          objVue.FireUsersArray=[]
          const queryOBJ = querySnapshot.val();
          for (var prop in queryOBJ) {
            // console.log(queryOBJ[prop].tName);
            const data = {
              OBJ: {
                name: queryOBJ[prop].Label,
                tasks: [],
                UID: prop
              }
            };
            const queryTaskOBJ = queryOBJ[prop].TASKS;
            // add user tasks if active
            
            for (var prop in queryTaskOBJ) {
              if (queryTaskOBJ[prop].t_isActive && !queryTaskOBJ[prop].isPrivate) {
                // queryTaskOBJ[prop].id = prop;
                // data.OBJ.tasks.push(queryTaskOBJ[prop]);            
            
                if (queryTaskOBJ[prop].tOwner.UID=='undefined'){
                  debugger
                }

                const TskData = {
                  id: prop,
                  task_name: queryTaskOBJ[prop].tName,
                  task_description: queryTaskOBJ[prop].tDescription.replace(
                    /\n/g,
                    "<br/>"
                  ),
                  task_start: moment(queryTaskOBJ[prop].tStart, "YYYY-MM-DD"),
                  task_deadline: moment(
                    queryTaskOBJ[prop].tDeadline,
                    "YYYY-MM-DD"
                  ),
                  task_start_short: moment(
                    queryTaskOBJ[prop].tStart,
                    "YYYY-MM-DD"
                  ).format("DD-MMM"),
                  task_deadline_short: moment(
                    queryTaskOBJ[prop].tDeadline,
                    "YYYY-MM-DD"
                  ).format("DD-MMM"),
                  task_FTE: queryTaskOBJ[prop].tFTE,
                  task_usedFTE: queryTaskOBJ[prop].tFTEused,
                  task_wkNo: moment(
                    queryTaskOBJ[prop].tDeadline,
                    "YYYY-MM-DD"
                  ).week(),
                  task_project: queryTaskOBJ[prop].tProject,
                  task_ProjCat: queryTaskOBJ[prop].tProjCateg,
                  task_status: queryTaskOBJ[prop].tStatus,
                  task_owner: queryTaskOBJ[prop].tOwner.UID,
                  task_owner_label: queryTaskOBJ[prop].tOwner.Label,
                  task_isPrivate: queryTaskOBJ[prop].isPrivate,
                  task_Createdby: queryTaskOBJ[prop].CreatedBy
                };

                data.OBJ.tasks.push(TskData);
              }
            }

            objVue.FireUsersArray.push(data);
          }
          function sortTasks(a, b) {
            if (a.OBJ.name < b.OBJ.name) return -1;
            if (a.OBJ.name > b.OBJ.name) return 1;
            return 0;
          }
          objVue.FireUsersArray.sort(sortTasks);
          objVue.ADDTasksIncat();
        });
      //set managers
      RTDB.ref("/USERS/")
        .orderByChild("isManager")
        .equalTo(true)
        .once("value", querySnapshot => {
          const queryOBJ = querySnapshot.val();
          for (var prop in queryOBJ) {
            // console.log(queryOBJ[prop].tName);
            const data = {
              OBJ: {
                name: queryOBJ[prop].Label,
                UID: prop
              }
            };
            objVue.FireManagersArray.push(data);
          }
          function sortMNG(a, b) {
            if (b.OBJ.name == "All") return 1;
            if (a.OBJ.name < b.OBJ.name) return -1;
            if (a.OBJ.name > b.OBJ.name) return 1;
            return 0;
          }
          objVue.FireManagersArray.sort(sortMNG);
        });
    },
    // aici se poate filtra
    ADDTasksIncat() {
      var objVue = this;
      //reset proj cat
      objVue.FireProjCatArray.forEach(cat => {
        cat.tasks = [];
      });
      // update local storage
      localStorage.setItem(
        "viewUser_StatusesFilterObj",
        JSON.stringify(objVue.SelectedStatus)
      );
      localStorage.setItem(
        "viewUser_CreatorsFilterObj",
        JSON.stringify(objVue.SelectedManager)
      );
      localStorage.setItem(
        "viewUser_SelectedUsersFilterObj",
        JSON.stringify(objVue.SelectedUsers)
      );
      localStorage.setItem(
        "viewUser_FilterStart",
        JSON.stringify(objVue.Datefilter_start)
      );
       localStorage.setItem(
        "viewUser_FilterEnd",
        JSON.stringify(objVue.Datefilter_end)
      );
      // filter displayed information

      // setup filters
      var queryString = "";
      //status filter
      if (objVue.SelectedStatus.length > 0) {
        queryString = "(";
        objVue.SelectedStatus.forEach(stat => {
          queryString = queryString + "task.task_status == '" + stat + "' || ";
        });
        // remove last ||
        queryString = queryString.substring(0, queryString.length - 4);
        queryString = queryString + ") &&";
      }

      // remove private tasks
      queryString =
        queryString +
        "(task.task_isPrivate == undefined || task.task_isPrivate == false)";

      // created by filter
      if (objVue.SelectedManager.length > 0) {
        // queryString =  queryString +  " && task.task_Createdby=='" + objVue.SelectedManager.OBJ.UID + "'";
        queryString = queryString + " && (";
        objVue.SelectedManager.forEach(mng => {
          queryString =
            queryString + "task.task_Createdby == '" + mng + "' || ";
        });
        // remove last ||
        queryString = queryString.substring(0, queryString.length - 4);
        queryString = queryString + ")";
      }

      // date filter
      if (objVue.showDateFilter) {
        queryString = queryString + "&& ";
        queryString =
          queryString +
          "(( moment(objVue.Datefilter_start,'YYYY-MM-DD').isSameOrBefore(moment(task.task_start,'YYYY-MM-DD')) && moment(task.task_start,'YYYY-MM-DD').isSameOrBefore(moment(objVue.Datefilter_start,'YYYY-MM-DD')) )";
        queryString = queryString + "|| ";
        queryString =
          queryString +
          "( moment(task.task_deadline,'YYYY-MM-DD').isSameOrBefore(moment(objVue.Datefilter_end,'YYYY-MM-DD')) && moment(objVue.Datefilter_start,'YYYY-MM-DD').isSameOrBefore(moment(task.task_deadline,'YYYY-MM-DD')) ))";
      }
      // console.log(queryString);

      // for all selected users allocate in categories
      var indx = 0;
      // reset
      objVue.xFilteredUsersArr = [];

      objVue.FireUsersArray.forEach(itm => {
        if (objVue.SelectedUsers.indexOf(itm.OBJ.UID) > -1) {
          objVue.xFilteredUsersArr.push({
            OBJ: { UID: itm.OBJ.UID, name: itm.OBJ.name, tasks: [] }
          });

          itm.OBJ.tasks.forEach(task => {
            // FILTER tasks ***********
            if (eval(queryString)) {
              // allocate in array
              objVue.xFilteredUsersArr[indx].OBJ.tasks.push(task);
            }
          });
          indx++;
        }
      });

      //sort tasks
      function sortMYTasks(a, b) {
        if (a.task_project < b.task_project) return -1;
        if (a.task_project > b.task_project) return 1;
        return 0;
      }
      objVue.FireProjCatArray.forEach(itm => {
        itm.tasks.sort(sortMYTasks);
      });
    },
    CompleteTask(task) {
      this.targetTask=task
      this.hours=40 * this.targetTask.task_usedFTE
      this.GotTarget=true

      this.QActStat="Completed"
       if (task.task_status=="In progress"){
        M.Modal.getInstance($("#modal1")).open()
      }else{

        if (!task.task_completed) {
          RTDB.ref(
            "/USERS/" + task.task_owner + "/TASKS/" + task.id + "/"
          ).update(
            {
              tStatus: "Completed",
              tClosedDate: moment().format("YYYY-MM-DD")
            },
            function(error) {
              if (error) {
                console.log(error);
              } else {
                $(".material-tooltip").removeAttr("style");
                console.log("update done");
              }
            }
          );
       
        }
      }
    },
     CancelTask(task) {
      this.targetTask=task
      this.hours=40 * this.targetTask.task_usedFTE
      this.GotTarget=true

      this.QActStat="Canceled"
       if (task.task_status=="In progress"){
        M.Modal.getInstance($("#modal1")).open()
      }else{
          if (!task.task_completed) {
          RTDB.ref(
            "/USERS/" + task.task_owner + "/TASKS/" + task.id + "/"
          ).update(
            {
              tStatus: "Canceled"
            },
            function(error) {
              if (error) {
                console.log(error);
              } else {
                $(".material-tooltip").removeAttr("style");
                console.log("update done");
              }
            }
          );

        }
      }

      
    },
     StartStop(task) {
      this.targetTask=task
      this.hours=40 * this.targetTask.task_usedFTE
      this.GotTarget=true

      this.QActStat=task.task_status == "In progress" ? "On hold" : "In progress"
      if (task.task_status=="In progress"){
        M.Modal.getInstance($("#modal1")).open()
      }else{
      // var newStatus =
      //   task.task_status == "In progress" ? "On hold" : "In progress";
      RTDB.ref("/USERS/" + task.task_owner + "/TASKS/" + task.id + "/")
        .update({
          tStatus: this.QActStat
        })
        .then(docRef => {
          $(".material-tooltip").removeAttr("style");
        })
        .catch(function(error) {
          console.error("Error writing document CompleteTask: ", error);
        });
      }
    },
    sumFTA(TaskArray) {
      var sum = 0;
      TaskArray.forEach(task => {
        if (
          task.task_FTE != undefined &&
          task.task_FTE != "TBD" &&
          task.task_FTE != null &&
          task.task_FTE != "" //&&
          //task.task_status == "In progress"
        ) {
          // console.log(task.task_FTE)
          sum += parseFloat(task.task_FTE);
        }
      });
      return sum.toFixed(2);
    },
    sumFTAused(TaskArray) {
      var sum = 0;
      TaskArray.forEach(task => {
        if (
          task.task_usedFTE != undefined &&
          task.task_usedFTE != null &&
          task.task_usedFTE != "" //&&
          //task.task_status == "In progress"
        ) {
          // console.log(task.task_FTE)
          sum += parseFloat(task.task_usedFTE);
        }
      });
      return sum.toFixed(2);
    }
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 3px !important;
}
.card-title {
  line-height: normal !important;
  font-size: 20px !important;
  margin-bottom: 0px !important;
}
.card-content {
  padding: 5px !important;
}
.card-content > .row {
  margin-bottom: 0px !important;
  padding: 0px !important;
}
.Delayed {
  color: #ee6e73;
}
.row {
  /* margin-bottom: 0px !important;   */
  padding: 5px;
  margin-bottom: 8px !important;
}
.col .row {
  margin-left: 0px !important;
}
.myBtn {
  cursor: pointer;
  border-radius: 4px;
  width: 20px;
  height: 20px;
}
.fas,
.far {
  opacity: 0.6;
}
.fas:not(.fa-clipboard-check):hover {
  opacity: 1;
}
.far:hover {
  opacity: 1;
}
.fa-edit {
  color: #26a69a;
  opacity: 0.6;
}
.fa-ban {
  color: #fb9d9d;
}
.fa-clipboard-check {
  color: #a5a5a5;
}

/*
.tooltiptext {
  visibility: hidden;
  font-size: 20px;
  background-color: #484545;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 3px;
  bottom: 150px;
  white-space: normal;

  
  position: absolute;
}
.tooltiptext2 {
  visibility: hidden;
  font-size: 12px;
  background-color: #484545;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  top: 80px;
  white-space: nowrap;

  
  position: absolute;
}

.tooltip:hover .tooltiptext,
.tooltip:hover .tooltiptext2 {
  visibility: visible;
  z-index: 100;
}
.tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 10%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #484545 transparent transparent transparent;
} */

.fa-stop-circle {
  color: #ff9800;
}
.fa-play-circle {
  color: #9cffa0;
}
.iconContainer {
  text-align: center;
}
.mySingle {
  cursor: pointer;
}
.mySingleSelected {
  background: #689aa7;
  color: white;
}
.filterContainer {
  padding: 5px;
  margin-top: 5px;
}
.red-text {
  font-size: small !important;
}
.task-title {
  overflow-wrap: break-word;
  font-size: small;
  height: 40px;
  white-space: unset;
  display: block;
  overflow: hidden;
}
.dateField {
  width: 150px !important;
  height: auto !important;
  border: 1px solid #c4c4c4 !important;
  border-radius: 5px !important;
  background-color: #fff !important;
  padding: 3px 5px !important;
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.1) !important;
}
</style>


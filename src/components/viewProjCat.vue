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
        <!--  tasks -->
        <div v-for="cat in FireProjCatArray" v-bind:key="cat.id" class="z-depth-1">
            <div v-if="cat.tasks.length>0" class="row  valign-wrapper" style="border-bottom: #484545 solid 1px; ">
                <!-- first coll -->
                <div class="col m2">
                    <span class="chip">
                    {{cat.name}}
                </span>
                    <div class="row"><b>{{cat.tasks.length}}</b> tasks</div>
                    <blockquote>
                      <span class="blue-text">Allocated FTE: <b>{{sumFTA(cat.tasks)}}</b></span>
                      <br/>
                      <span v-if="DiFsumFTA(sumFTA(cat.tasks),cat.name)" class="brown-text">Unallocated FTE: <b>{{DiFsumFTA(sumFTA(cat.tasks),cat.name)}}</b></span>
                    </blockquote>
                </div>
                <!-- second coll -->
                <div class="col m10">
                    <!-- card container structure -->
                    <div v-for="task in cat.tasks" v-bind:key="task.id" class="col m2 s12">
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
                                    <div v-if="task.task_FTE!=undefined && task.task_FTE!=''" class="red-text col">{{task.task_FTE}} FTE</div>
                                </div>
                                 <div class="row">
                                  {{task.task_owner_label}}
                                </div>

                                <hr/>
                                <!-- START icon container -->
                                <div v-if="isManager" class="row iconContainer">
                                    <div class="col m3">                                      
                                        <router-link class="tooltipped" data-position="top" data-tooltip="<span style='font-size:small'>Edit</span>" v-bind:to="{name:'edit-task_mng',params:{task_id:task.id},query:{uid:task.task_owner,mnext:'viewprojcat'} }">
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
        <!-- add new -->
        <div v-if="isManager" class="fixed-action-btn">
          <router-link v-bind:to="{name:'new-task',query:{mnext:'viewprojcat'}}" class="btn-floating btn-large red">
            <i class="fa fa-plus"></i>
          </router-link>
        </div>
    </div>
</template>

<script>
// import db from "./firebaseInit";
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";

var moment = require("moment");

export default {
  name: "viewProjcat",
  props: { isManager: Boolean },
  data() {
    return {
      //   users: fireList.OwnersList,
      showDateFilter: false,
      Datefilter_start: moment()
        .weekday(1)
        .format("YYYY-MM-DD"),
      Datefilter_end: moment()
        .weekday(5)
        .format("YYYY-MM-DD"),
      StatusesList: [
        "In progress",
        "On hold",
        "Completed",
        "Canceled",
        "Not allocated"
      ],
      SelectedStatus: localStorage.getItem("viewProj_StatusFilterObj")
        ? JSON.parse(localStorage.getItem("viewProj_StatusFilterObj"))
        : ["In progress", "On hold", "Not allocated"],
      FireUsersArray: [],
      xFilteredUsersArr: [],
      SelectedUsers: localStorage.getItem("viewProj_SelectedUsersFilterObj")
        ? JSON.parse(localStorage.getItem("viewProj_SelectedUsersFilterObj"))
        : [],
      FireManagersArray: [],
      // isManager: false,
      GotUsers: 0,
      FireProjCatArray: [],
      SelectedManager: localStorage.getItem("viewProj_CreatorsFilterObj")
        ? JSON.parse(localStorage.getItem("viewProj_CreatorsFilterObj"))
        : [] //[{ OBJ: { UID: "All", name: "All" } }]
      //
    };
  },
  updated() {    
    $(".tooltipped").tooltip();
  },
  
  mounted() {
    var objVue = this;
     RTDB.ref("/LISTS/Projects/").once("value", querySnapshot => {
      objVue.FireProjCatArray = [];
      const queryOBJ = querySnapshot.val();
      for (var prop in queryOBJ) {
        
        const data = {
            name: prop,
            tasks: []
          };

         objVue.FireProjCatArray.push(data);

      }
      objVue.FireProjCatArray.push({ name: "Old", tasks: [] });
      objVue.FireProjCatArray.sort();
    });



    // db
    //   .collection("DropDowns/InnoPipeline/Projects")
    //   .get()
    //   .then(querySnapshot => {
    //     objVue.FireProjCatArray = [];

    //     querySnapshot.forEach(doc => {
    //       const data = {
    //         name: doc.id,
    //         tasks: []
    //       };

    //       objVue.FireProjCatArray.push(data);
    //     });
    //     objVue.FireProjCatArray.push({ name: "Old", tasks: [] });
    //     objVue.FireProjCatArray.sort();
    //   });

    this.GetFire_users();
  },
  methods: {
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
    // at startup
    GetFire_users() {
      var objVue = this;
      // set users array
      
      // console.log("GetFire_users");
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
            for (var propTsk in queryTaskOBJ) {
              if (queryTaskOBJ[propTsk].t_isActive && !queryTaskOBJ[propTsk].isPrivate) {
                // queryTaskOBJ[propTsk].id = propTsk;
                // data.OBJ.tasks.push(queryTaskOBJ[propTsk]);

                const TskData = {
                  id: propTsk,
                  task_name: queryTaskOBJ[propTsk].tName,
                  task_description: queryTaskOBJ[propTsk].tDescription.replace(
                    /\n/g,
                    "<br/>"
                  ),
                  task_start: moment(queryTaskOBJ[propTsk].tStart, "YYYY-MM-DD"),
                  task_deadline: moment(
                    queryTaskOBJ[propTsk].tDeadline,
                    "YYYY-MM-DD"
                  ),
                  task_start_short: moment(
                    queryTaskOBJ[propTsk].tStart,
                    "YYYY-MM-DD"
                  ).format("DD-MMM"),
                  task_deadline_short: moment(
                    queryTaskOBJ[propTsk].tDeadline,
                    "YYYY-MM-DD"
                  ).format("DD-MMM"),
                  task_FTE: queryTaskOBJ[propTsk].tFTE,
                  task_wkNo: moment(
                    queryTaskOBJ[propTsk].tDeadline,
                    "YYYY-MM-DD"
                  ).week(),
                  task_project: queryTaskOBJ[propTsk].tProject,
                  task_ProjCat: queryTaskOBJ[propTsk].tProjCateg,
                  task_status: queryTaskOBJ[propTsk].tStatus,
                  task_owner: queryTaskOBJ[propTsk].tOwner.UID,
                  task_owner_label: queryTaskOBJ[propTsk].tOwner.Label,
                  task_isPrivate: queryTaskOBJ[propTsk].isPrivate,
                  task_Createdby: queryTaskOBJ[propTsk].CreatedBy
                };

                data.OBJ.tasks.push(TskData);
                // console.log(TskData)
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
          // debugger
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



      // db
      //   .collection("Users")
      //   .where("isOwner", "==", true)
      //   .get()
      //   .then(doc => {
      //     doc.forEach(LstItem => {
      //       const data = {
      //         OBJ: {
      //           name: LstItem.data().Label,
      //           tasks: [],
      //           UID: LstItem.id
      //         }
      //       };

      //       // objVue.xFilteredUsersArr.push(data);
      //       objVue.FireUsersArray.push(data);
      //     });
      //     function sortTasks(a, b) {
      //       if (a.OBJ.name < b.OBJ.name) return -1;
      //       if (a.OBJ.name > b.OBJ.name) return 1;
      //       return 0;
      //     }
      //     objVue.FireUsersArray.sort(sortTasks);

      //     objVue.GetFire_ForTasks();
      //   });

      //set managers
      // db
      //   .collection("Users")
      //   .where("isManager", "==", true)
      //   .get()
      //   .then(doc => {
      //     doc.forEach(LstItem => {
      //       const data = {
      //         OBJ: {
      //           name: LstItem.data().Label,
      //           UID: LstItem.id
      //         }
      //       };

      //       objVue.FireManagersArray.push(data);
      //     });
      //     function sortMNG(a, b) {
      //       // if (b.OBJ.name == "All") return 1;
      //       if (a.OBJ.name < b.OBJ.name) return -1;
      //       if (a.OBJ.name > b.OBJ.name) return 1;
      //       return 0;
      //     }

      //     // objVue.FireManagersArray.push({ OBJ: { UID: "All", name: "All" } });
      //     //  objVue.FireManagersArray.push({OBJ:{UID:"None",name:"None"}})
      //     objVue.FireManagersArray.sort(sortMNG);

      //     // objVue.GetFire_ForTasks("All active");
      //   });
    },
    // GetFire_ForTasks() {
    //   var objVue = this;

    //   //reset number of users
    //   objVue.GotUsers = 0;

    //   // populate user tasks
    //   objVue.FireUsersArray.forEach(itm => {
    //     objVue.GetFire_userTasks(itm.OBJ);
    //   });
    // },
    // GetFire_userTasks(OBJ) {
    //   // console.log("GetFire_user:" + OBJ.UID);
    //   var objVue = this;
    //   // get tasks for each user
    //   db
    //     .collection(OBJ.UID)
    //     .where("t_isActive", "==", true)
    //     .onSnapshot(querySnapshot => {
    //       console.log("onSnapshot");
    //       objVue.AddTasksInFireUsrsArr(OBJ, querySnapshot);
    //     });
    // },
    // AddTasksInFireUsrsArr(OBJ, querySnapshot) {
    //   var objVue = this;
    //   // reset
    //   OBJ.tasks = [];

    //   querySnapshot.forEach(doc => {
    //     // if (eval(queryString)) {
    //     const data = {
    //       id: doc.id,
    //       task_name: doc.data().tName,
    //       task_description: doc.data().tDescription.replace(/\n/g, "<br/>"),
    //       task_start: moment(doc.data().tStart, "YYYY-MM-DD"),
    //       task_deadline: moment(doc.data().tDeadline, "YYYY-MM-DD"),
    //       task_start_short: moment(doc.data().tStart, "YYYY-MM-DD").format(
    //         "DD-MMM"
    //       ),
    //       task_deadline_short: moment(
    //         doc.data().tDeadline,
    //         "YYYY-MM-DD"
    //       ).format("DD-MMM"),
    //       task_FTE: doc.data().tFTE,
    //       task_wkNo: moment(doc.data().tDeadline, "YYYY-MM-DD").week(),
    //       task_project: doc.data().tProject,
    //       task_ProjCat: doc.data().tProjCateg,
    //       task_status: doc.data().tStatus,
    //       task_owner: OBJ.UID,
    //       task_owner_label: OBJ.name,
    //       task_isPrivate: doc.data().isPrivate,
    //       task_Createdby: doc.data().CreatedBy
    //     };
    //     OBJ.tasks.push(data);
    //     // }
    //   });
    //   // call next function if task got for all users
    //   objVue.GotUsers++;
    //   if (
    //     objVue.GotUsers >= objVue.FireUsersArray.length &&
    //     objVue.GotUsers > 0
    //   ) {
    //     objVue.ADDTasksIncat();
    //   }
    // },
    // aici se poate filtra
    ADDTasksIncat() {
      var objVue = this;
      //reset proj cat
      objVue.FireProjCatArray.forEach(cat => {
        cat.tasks = [];
      });
      // update local storage
      localStorage.setItem(
        "viewProj_StatusFilterObj",
        JSON.stringify(objVue.SelectedStatus)
      );
      localStorage.setItem(
        "viewProj_CreatorsFilterObj",
        JSON.stringify(objVue.SelectedManager)
      );
      localStorage.setItem(
        "viewProj_SelectedUsersFilterObj",
        JSON.stringify(objVue.SelectedUsers)
      );
      // filter displayed information

      // FILTER USERS
      var userFilter = objVue.SelectedUsers.length != 0;
      objVue.xFilteredUsersArr = [];

      if (userFilter) {
        // objVue.xFilteredUsersArr = objVue.SelectedUsers;
        objVue.FireUsersArray.forEach(itm => {
          if (objVue.SelectedUsers.indexOf(itm.OBJ.UID) > -1) {
            objVue.xFilteredUsersArr.push(itm);
          }
        });
      } else {
        objVue.xFilteredUsersArr = objVue.FireUsersArray;
      }
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
      objVue.xFilteredUsersArr.forEach(itm => {
        itm.OBJ.tasks.forEach(task => {
          // FILTER tasks ***********
          if (eval(queryString)) {
            // allocate in array
            var taskFound = false;
            
            objVue.FireProjCatArray.forEach(cat => {
              if (cat.name == task.task_ProjCat) {
                // debugger
                cat.tasks.push(task);
                taskFound = true;
              }
            });
            // alocate to old category
            if (!taskFound) {
              objVue.FireProjCatArray.forEach(cat => {
                if (cat.name == "Old") {
                  cat.tasks.push(task);
                }
              });
            }
          }
        });
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
    },
    CancelTask(task) {
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
    },
    StartStop(task) {
      var newStatus =
        task.task_status == "In progress" ? "On hold" : "In progress";
      RTDB.ref("/USERS/" + task.task_owner + "/TASKS/" + task.id + "/")
        .update({
          tStatus: newStatus
        })
        .then(docRef => {
          $(".material-tooltip").removeAttr("style");
        })
        .catch(function(error) {
          console.error("Error writing document CompleteTask: ", error);
        });
    },
    sumFTA(TaskArray) {
      var sum = 0;
      TaskArray.forEach(task => {
        if (
          task.task_FTE != undefined &&
          task.task_FTE != "TBD" &&
          task.task_FTE != null &&
          task.task_FTE != ""
          //&& task.task_status == "In progress"
        ) {
          // console.log(task.task_FTE)
          sum += parseFloat(task.task_FTE);
        }
      });
      return sum.toFixed(2);
    },
    DiFsumFTA(SUM, opt) {
      switch (opt) {
        case "Inno – ASI: Connect":
          return parseFloat(5.3 - SUM).toFixed(2);
          break;
        case "Inno – MKT":
          return parseFloat(2.2 - SUM).toFixed(2);
          break;
        default:
          return false;
      }
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


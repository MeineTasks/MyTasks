    <template>
  <div id="edit-task" class="container">
    <H3>Export DB as JSON</H3>
    <div class="row">
      <b>Step1:</b>
      <button type="button" @click="runF1" class="btn">Get data</button>
    </div>
    <div class="row">
      <div class="input-field col">
        <input id="StartDate" type="date" placeholder="start date" v-model="task_start" />
        <label class="active">Start date:</label>
      </div>
      <div class="input-field col">
        <input id="DeadLine" type="date" placeholder="Task deadline" v-model="task_deadline" />
        <label class="active">Deadline:</label>
      </div>
    </div>
    <!-- <div class="row" v-if="GotUsers >= tasks.length && tasks.length>0">
        <b>Step2:</b> <button type="button" @click="runF2" class="btn blue">Get file</button>
    </div>-->
    <div class="row" v-if="GotUsers">
      <b>Step2:</b> Go to a
      <a href="https://json-csv.com/" target="_blank">online converter</a> and paste the json file content to obtain a CSV
    </div>

    <div class="row" v-if="forCip">
      <hr />
      <H3>Mark older tasks as archived</H3>
      <input class="col s4" type="date" placeholder="start date" v-model="Datefilter_start" />
      <button type="button" @click="DoArchive()" class="btn orange">Archive tasks</button>
    </div>
    <div class="row" v-if="forCip">
      <h3>Move tasks to backup</h3>
      <hr />
      <input class="col s4" type="date" placeholder="start date" v-model="Datefilter_start" />
      <button type="button" @click="MoveToBkp" class="btn red">
        <i class="material-icons left">delete_forever</i> Back it up
      </button>
      <hr />
      <H3>Cip custom export</H3>
      <div class="row">
        <b>Step1:</b>
        <button type="button" @click="runCipF1" class="btn">Cip run function 1</button>
      </div>
      <div class="row">
        <b>Step2:</b>
        <button type="button" @click="runCipF2" class="btn blue">Get file</button>
        <div v-for="el in MyDB" :key="el.id">
          {{el.name}}
          <div v-for="tsk in el.tasks" :key="tsk.id">{{tsk.CreatedBy}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

    <script>
import db from "./old_firebaseInit";
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";
import RTDB_bkp from "./firebaseInit_bkpRTDB";

var moment = require("moment");

export default {
  name: "AdminDashboard",
  data() {
    return {
      tasks: [],
      UsersAndArrays: [],
      GotUsers: false,
      forCip: false,
      MyDB: [],
      task_start: null,
      task_deadline: null,
      FilteredTasks: [],
      Datefilter_start: "2019-02-01"
    };
  },
  created() {
    this.forCip =
      firebase.auth().currentUser.email == "ciprian.ciresaru@ipsos.com";
    //  firebase
    //   .auth()
    //   .signInWithEmailAndPassword(this.email, this.password)
  },
  methods: {
    MoveToBkp() {
      var objVue = this;
      RTDB.ref("USERS").once("value", querySnapshot => {
        const queryOBJ = querySnapshot.val();

        Object.keys(queryOBJ).forEach(oKey => {
          // console.log(queryOBJ[oKey].Label);
          // if (oKey == "3AhFIsBUHnOf8hHUbFzd969PUNA3") {
          objVue.BackupUser(oKey, queryOBJ[oKey].Label);
          // }
        });
      });
    },
    BackupUser(UID, ulabel) {
      var objVue = this;
      let UserTasks = {};
      RTDB_bkp.ref("USERS/" + UID)
        .update({ Label: ulabel })
        .catch(err => {
          console.log(err);
        });

      RTDB.ref("USERS/" + UID + "/TASKS")
        .once("value", querySnapshot => {
          const queryTskOBJ = querySnapshot.val();
          var ActiveDate = moment(this.Datefilter_start, "YYYY-MM-DD");
          // debugger;
          for (var Tprop in queryTskOBJ) {
            if (
              moment(queryTskOBJ[Tprop].tDeadline, "YYYY-MM-DD").isBefore(
                ActiveDate
              ) &&
              !queryTskOBJ[Tprop].t_isActive
            ) {
              console.log(Tprop);
              // move task
              UserTasks[Tprop] = queryTskOBJ[Tprop];
            }
          }
        })
        .then(res => {
          //set label

          //move task
          RTDB_bkp.ref("USERS/" + UID + "/TASKS")
            .update(UserTasks)
            .then(result => {
              console.log("moved", UserTasks);
              // DELETE old tasks
              for (var Tprop in UserTasks) {
                RTDB.ref("USERS/" + UID + "/TASKS/" + Tprop)
                  .remove()
                  // .then(res => {
                  //   console.log("removed" + Tprop);
                  // })
                  .catch(err => {
                    console.log(err);
                  });
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    DoArchive() {
      var objVue = this;

      // this.SetArchiveFlag("YPPNyRXLbXZhfgZ6i4ITY68kqY02", "3UZAOB32TW0HAu9DcTbj")

      RTDB.ref("USERS")
        .once("value", querySnapshot => {
          const queryOBJ = querySnapshot.val();
          var ActiveDate = moment(this.Datefilter_start, "YYYY-MM-DD");

          for (var prop in queryOBJ) {
            const queryTskOBJ = queryOBJ[prop].TASKS;
            for (var Tprop in queryTskOBJ) {
              if (
                moment(queryTskOBJ[Tprop].tDeadline, "YYYY-MM-DD").isBefore(
                  ActiveDate
                ) &&
                queryTskOBJ[Tprop].t_isActive &&
                (queryTskOBJ[Tprop].tStatus == "Completed" ||
                  queryTskOBJ[Tprop].tStatus == "Canceled")
              ) {
                console.log(prop, Tprop);
                // console.log( queryTskOBJ[Tprop]);
                objVue.SetArchiveFlag(prop, Tprop);
              }
            }
          }
        })
        .then(succ => {
          console.log("arhivation complete");
        });
    },
    SetArchiveFlag(UID, TaskID) {
      RTDB.ref("/USERS/" + UID + "/TASKS/" + TaskID + "/").update({
        t_isActive: false
      });
    },
    runF1() {
      this.GetRTDB_users();
    },

    GetFire_users() {
      // var objVue = this;
      // db.collection("Users")
      //   // .where("isManager","==",true)
      //   .get()
      //   .then(doc => {
      //     doc.forEach(LstItem => {
      //       const data = {
      //         OBJ: {
      //           name: LstItem.data().Label,
      //           // tasks: [],
      //           isOwner: LstItem.data().isOwner,
      //           isManager: LstItem.data().isManager,
      //           UID: LstItem.id
      //         }
      //       };
      //       objVue.UsersAndArrays.push(data);
      //     });
      //     function sortTasks(a, b) {
      //       if (a.OBJ.name < b.OBJ.name) return -1;
      //       if (a.OBJ.name > b.OBJ.name) return 1;
      //       return 0;
      //     }
      //     // objVue.UsersAndArrays.sort(sortTasks);
      //     // this.exportDB(this.UsersAndArrays)
      //     objVue.GotUsers = 0;
      //     this.UsersAndArrays.forEach(user => {
      //       objVue.getTasksForUsers(user.OBJ.UID);
      //     });
      //   });
    },
    getTasksForUsers(userID) {
      // var objVue = this;
      // db.collection(userID)
      //   .get()
      //   .then(querySnapshot => {
      //     const data = {
      //       UID: userID,
      //       tasks: []
      //     };
      //     querySnapshot.forEach(task => {
      //       data.tasks.push(task.data());
      //     });
      //     objVue.tasks.push(data);
      //     // objVue.GotUsers++;
      //     // if (objVue.GotUsers >= objVue.tasks.length) {
      //     //  // objVue.exportDB(objVue.tasks);
      //     //  alert("done")
      //     // }
      //   });
    },
    GetRTDB_users() {
      var objVue = this;
      RTDB.ref("USERS")
        .once("value", querySnapshot => {
          objVue.MyDB = querySnapshot.val();

          // filter tasks
          Object.keys(objVue.MyDB).forEach(user => {
            Object.keys(objVue.MyDB[user].TASKS).forEach(task => {
              //  console.log(objVue.MyDB[user].TASKS[task].tStart)
              if (
                moment(
                  objVue.MyDB[user].TASKS[task].tStart,
                  "YYYY-MM-DD"
                ).isAfter(moment(objVue.task_start, "YYYY-MM-DD")) &&
                moment(
                  objVue.MyDB[user].TASKS[task].tDeadline,
                  "YYYY-MM-DD"
                ).isBefore(moment(objVue.task_deadline, "YYYY-MM-DD")) &&
                !objVue.MyDB[user].TASKS[task].isPrivate
              ) {
                objVue.FilteredTasks.push(objVue.MyDB[user].TASKS[task]);
              }
            });
          });
          // debugger
        })
        .then(succ => {
          objVue.exportDB(objVue.FilteredTasks);
        });
    },
    exportDB(myObject) {
      function downloadTextFile(text, name) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
          new Blob([text], { type: `text/${name.split(".").pop()}` })
        );
        a.download = name;
        a.click();
      }
      downloadTextFile(
        JSON.stringify(myObject),
        "dbBKP_" + moment().format("YYYY_MM_DD_HH-SS") + ".json"
      );
      this.GotUsers = true;
    },
    GetFire_ForTasks(opt) {
      // var objVue = this;
      // // objVue.nSelectedStatus = opt;
      // objVue.UsersAndArrays.forEach(itm => {
      //   objVue.GetFire_userTasks(itm.OBJ);
      // });
      // // "YPPNyRXLbXZhfgZ6i4ITY68kqY02" - test
    },
    GetFire_userTasks(OBJ) {
      // var objVue = this;
      // db.collection(OBJ.UID)
      //   .get()
      //   .then(querySnapshot => {
      //     // reset
      //     OBJ.tasks = [];
      //     querySnapshot.forEach(doc => {
      //       db.collection(OBJ.UID)
      //         .doc(doc.id)
      //         .update({ isPrivate: false });
      //       //  OBJ.tasks.push(doc.data());
      //       //update
      //     });
      //     // call next function
      //     // console.log(OBJ.UID+" done")
      //   });
    },

    runCipF1() {
      this.GetRTDB_users();
      // this.Cip_MoveFire_usersTasks();
    },
    Cip_MoveFire_lists() {
      var objVue = this;
      db.collection("DropDowns/InnoPipeline/Projects/")
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            // console.log(LstItem.data());
            var UID = LstItem.id;
            var prjArr = [];
            var updates = {};

            db.collection("DropDowns/InnoPipeline/Projects/" + UID + "/Proj")
              .get()
              .then(prjDoc => {
                prjDoc.forEach(itm => {
                  prjArr.push(itm.id);
                });
                updates["/LISTS/Projects/" + UID + "/"] = prjArr;

                RTDB.ref()
                  .update(updates)
                  .then(stat => {
                    console.log("listsDone");
                  });
              });

            // updates["/LISTS/Projects/" + UID + "/"] = LstItem.data();
            // RTDB.ref()
            //   .update(updates)
            //   .then(stat => {
            //     console.log("listsDone");
            //   });
          });
        });
    },
    Cip_MoveFire_usersTasks() {
      var objVue = this;
      db.collection("Users")
        // .where("Label", "==", "Cip Cir")
        // .where("Label", "==", "Bogdan Trandafir")
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            // console.log(LstItem.data());

            var UID = LstItem.id;
            var updates = {};

            updates["/USERS/" + UID + "/"] = LstItem.data();
            RTDB.ref().update(updates);

            // // read all tasks
            db.collection(UID)
              .get()
              .then(docTask => {
                docTask.forEach(tskItm => {
                  var taskID = tskItm.id;
                  var taskObj = {};
                  taskObj[
                    "/USERS/" + UID + "/TASKS/" + taskID + "/"
                  ] = tskItm.data();
                  RTDB.ref().update(taskObj);
                });
              });
          });
          console.log("cip move user tasks Done");
        });
    },

    GetFire_Cip_users() {
      var objVue = this;
      db.collection("Users")
        // .where("isManager","==",true)
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            const uid = LstItem.id;

            const data = {
              [uid]: {
                name: LstItem.data().Label,
                isOwner: LstItem.data().isOwner,
                isManager: LstItem.data().isManager
              }
            };

            objVue.UsersAndArrays.push(data);
          });
          function sortTasks(a, b) {
            if (a.OBJ.name < b.OBJ.name) return -1;
            if (a.OBJ.name > b.OBJ.name) return 1;
            return 0;
          }
          // objVue.UsersAndArrays.sort(sortTasks);

          // this.exportDB(this.UsersAndArrays)
          objVue.GotUsers = objVue.UsersAndArrays.length;

          // this.UsersAndArrays.forEach(user => {
          //   objVue.getTasksForUsers(user.OBJ.UID);
          // });
        });
    },
    runCipF2() {
      this.exportDB(this.MyDB);
    }
  }
};
</script>


<style>
</style>

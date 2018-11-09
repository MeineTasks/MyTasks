    <template>
    <div id="edit-task" class="container">
       <H3>Export DB as JSON</H3>
      <div class="row">
        <b>Step1:</b> <button type="button" @click="runF1" class="btn">Get data</button>
      </div>
      <div class="row" v-if="GotUsers >= tasks.length && tasks.length>0">        
        <b>Step2:</b> <button type="button" @click="runF2" class="btn blue">Get file</button>
      </div>    
      <div class="row" v-if="GotUsers >= tasks.length && tasks.length>0">            
         <b>Step3:</b> Go to a <a href="https://json-csv.com/" target="_blank">online converter</a> and paste the json file content to obtain a CSV
      </div>      
    
      <div class="row" v-if="forCip">
        <hr>
        <H3>Mark older tasks as archived</H3>
        <button type="button" @click="DoArchive()" class="btn red">Archive tasks</button>
      </div>
      <div class="row" v-if="forCip">
        <hr>
        <H3>Cip custom export</H3>
        <div class="row">
          <b>Step1:</b> <button type="button" @click="runCipF1" class="btn">Cip run function 1</button>
        </div>
        <div class="row" >        
          <b>Step2:</b> <button type="button" @click="runCipF2" class="btn blue">Get file</button>
          <div v-for="el in testArr" :key="el.id">
            {{el.name}}
            <div v-for="tsk in el.tasks" :key="tsk.id">
              {{tsk.CreatedBy}}
            </div>
          </div>
        </div> 
      </div>
      </div>    
    </template>
      
    <script>
import db from "./firebaseInit";
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";

var moment = require("moment");

export default {
  name: "AdminDashboard",
  data() {
    return {
      tasks: [],
      UsersAndArrays: [],
      GotUsers: 0,
      forCip: true,
      testArr: []
    };
  },
  methods: {
    DoArchive() {
      var objVue = this;
      db.collection("Users")
        // .where("isManager","==",true)
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            const data = {
              OBJ: {
                name: LstItem.data().Label,
                // tasks: [],
                // isOwner: LstItem.data().isOwner,
                // isManager: LstItem.data().isManager,
                UID: LstItem.id
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
          objVue.GotUsers = 0;
          //objVue.arhiveTasksForUser("YqRVNtuUu3aAHt6g2YW05OxIsj42");

          this.UsersAndArrays.forEach(user => {
            objVue.arhiveTasksForUser(user.OBJ.UID);
          });
        });
    },
    arhiveTasksForUser(userID) {
      var objVue = this;

      db.collection(userID)
        .get()
        .then(querySnapshot => {
          var ActiveDate = moment("9/1/2018", "MM/DD/YYYY");
          querySnapshot.forEach(task => {
            if (
              moment(task.data().tDeadline, "YYYY-MM-DD").isBefore(
                ActiveDate
              ) &&
              task.data().t_isActive &&
              (task.data().tStatus == "Completed" ||
                task.data().tStatus == "Canceled")
            ) {
              console.log(task.data());
              objVue.SetArchiveFlag(userID, task.id);
            }
          });

          // objVue.tasks.push(data);

          objVue.GotUsers++;
          // if (objVue.GotUsers >= objVue.tasks.length) {
          //  // objVue.exportDB(objVue.tasks);
          //  alert("done")
          // }
        });
    },
    SetArchiveFlag(UID, TaskID) {
      db.collection(UID)
        .doc(TaskID)
        .set({ t_isActive: false }, { merge: true });
    },
    runF1() {
      this.GetFire_users();
    },

    GetFire_users() {
      var objVue = this;
      db.collection("Users")
        // .where("isManager","==",true)
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            const data = {
              OBJ: {
                name: LstItem.data().Label,
                // tasks: [],
                isOwner: LstItem.data().isOwner,
                isManager: LstItem.data().isManager,
                UID: LstItem.id
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
          objVue.GotUsers = 0;

          this.UsersAndArrays.forEach(user => {
            objVue.getTasksForUsers(user.OBJ.UID);
          });
        });
    },
    getTasksForUsers(userID) {
      var objVue = this;

      db.collection(userID)
        .get()
        .then(querySnapshot => {
          const data = {
            UID: userID,
            tasks: []
          };
          querySnapshot.forEach(task => {
            data.tasks.push(task.data());
          });

          objVue.tasks.push(data);

          objVue.GotUsers++;
          // if (objVue.GotUsers >= objVue.tasks.length) {
          //  // objVue.exportDB(objVue.tasks);
          //  alert("done")
          // }
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
    },
    GetFire_ForTasks(opt) {
      var objVue = this;
      // objVue.nSelectedStatus = opt;

      objVue.UsersAndArrays.forEach(itm => {
        objVue.GetFire_userTasks(itm.OBJ);
      });
      // "YPPNyRXLbXZhfgZ6i4ITY68kqY02" - test
    },
    GetFire_userTasks(OBJ) {
      var objVue = this;
      db.collection(OBJ.UID)
        .get()
        .then(querySnapshot => {
          // reset
          OBJ.tasks = [];

          querySnapshot.forEach(doc => {
            db.collection(OBJ.UID)
              .doc(doc.id)
              .update({ isPrivate: false });
            //  OBJ.tasks.push(doc.data());
            //update
          });
          // call next function
          // console.log(OBJ.UID+" done")
        });
    },
    runF1s() {
      var vueobj = this.tasks;
      db.collection("YqRVNtuUu3aAHt6g2YW05OxIsj42")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            //console.log(docs)
            // doc.data() is never undefined for query doc snapshots
            // doc.set({t_isActive: true},{ merge: true })
            vueobj.push(doc.data());
          });
        })
        .then(function() {
          console.log("runF1 done");
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
    runF2() {
      // var objVue=this.tasks

      this.exportDB(this.tasks);
    },

    runCipF1() {
      // this.Cip_GetFire_users();
      this.Cip_MoveFire_usersTasks();
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
        .where("Label", "==", "Bogdan Trandafir")
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            // console.log(LstItem.data());

            var UID = LstItem.id;
            var updates = {};

            // updates["/USERS/" + UID + "/"] = LstItem.data();
            // RTDB.ref().update(updates);

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
    GetRTDB_users() {
      var objVue = this;
      RTDB.ref("USERS")
        // .orderByChild("isManager")
        // .equalTo(true)
        // .once("value")
        .on("value", querySnapshot => {
          objVue.testArr = querySnapshot.val();
          console.log(querySnapshot.val());
          // querySnapshot.forEach(snapshot => {
          //   const data = {
          //     id: snapshot.key,
          //     isOwner: snapshot.val().isOwner,
          //     name: snapshot.val().name
          //   };
          //   objVue.testArr.push(data);
          //   // console.log(snapshot.val());
          //   // console.log(snapshot.key);
          // });
        });
      db.collection("UserTasks")
        .get()
        .then(doc => {
          // console.log(doc)

          doc.forEach(LstItem => {
            debugger;
            console.log(LstItem);
          });
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
      this.exportDB(this.UsersAndArrays);
    }
  }
};
</script>
      
      
<style>
</style>
      
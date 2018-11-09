<template>
  <div id="edit-task" class="container">
    <h3>Edit task</h3>
    <div class="row MyContainer">
      <form @submit.prevent="updateTask" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input placeholder="Task name" type="text" v-model="task_name"
              required>
            <label class="active">Name:</label>
          </div>
        </div>
        <!-- details -->
        <div class="row">
          <div class="input-field col s12">
            <textarea id="textarea1" placeholder="Task details" v-model="task_details"
              />
            <label for="textarea1" class="active">Details:</label>

            
          </div>
        </div>
        <!-- timings -->
        <div class="row">
          <div class="input-field col">
            <input id="StartDate" type="date" placeholder="start date"
              v-model="task_start">
            <label class="active">Start date:</label>
          </div>
          <div class="input-field col">
            <input id="DeadLine" type="date" placeholder="Task deadline"
              v-model="task_deadline">
            <label class="active">Deadline:</label>
          </div>
          <select v-model="task_FTE" style="display:inline;width:70px" >
                <option v-for="fta in FTAarray" v-bind:key="fta.id"
                  v-bind:value="fta">{{fta}}</option>
              </select> 
              <span>FTE</span>
        </div>        
        <!-- projects category -->
          <div class="row">
              <div class="input-field col s12">
              <label class="active">Category:</label>
              <div class="input-field">
                  <span @click="SelectedProjCat=opt,getProjects(true)" v-for="opt in ProjectsCat" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProjCat==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  <a @click="showNewProjCat=true" v-if="!showNewProjCat" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>
                  <input v-if="showNewProjCat" v-model="AddNewProjCat" v-on:keydown.enter.prevent="addProjCategory" v-on:keydown.esc.prevent="DelProjCategory" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
                </div>
              </div>
          </div>

          <!-- project list -->
          <div v-if="showProject" class="row">
            <div class="input-field col s12">              
                <label class="active">Project:</label>
                <div class="input-field">
                  <span @click="SelectedProj=opt" v-for="opt in ProjectsList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedProj==opt}" class="mySingle chip">
                {{opt}}
              </span>
                  <a @click="showNewProj=true" v-if="!showNewProj" class="btn-floating btn-small waves-effect waves-light red"><i class="material-icons">add</i></a>                  
                   <input v-if="showNewProj" v-model="AddNewProj" v-on:keydown.enter.prevent="addProj" v-on:keydown.esc.prevent="DelProj" placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it" type="text">
                </div>
            </div>  
          </div>
          <!-- status -->
          <div class="row">
              <div class="input-field col s12">
              <label class="active">Status:</label>
                <div class="input-field">
                  <span @click="nSelectedStatus=opt" v-for="opt in nStatusesList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':nSelectedStatus==opt}" class="mySingle chip">
                    {{opt}}
                  </span>
                  </div>
              </div>
          </div>
          <!-- Owners -->
          <div class="row">
            <div class="input-field col s12">
            <label class="active">Owner:</label>
               <div class="input-field">
                <div v-if="!showUsers" >
                  <b>{{initialOwner.Label}}</b><br/>
                  <a @click="showUsers=true" style="z-index:0" class="btn waves-effect waves-light blue darken-3">
                    <i class="material-icons right">assignment_ind</i>Change owner
                  </a>
                </div>

                <div v-if="showUsers" class="row">
                    <div class="input-field col s12">
                        <span @click="SelectedOwner=opt" v-for="opt in ownersList" v-bind:key="opt.id" v-bind:class="{'mySingleSelected':SelectedOwner.UID==opt.UID}" class="mySingle chip">
                          {{opt.Label}}
                        </span>
                    </div>
                </div>
              </div>
              </div>
            </div>

        <div class="row">
          <div class="input-field col s12">
            <label class="active">Is archived:</label>
            <div class="input-field">
              <select required style="display:block;width:150px" v-model="task_isActive">
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>  
            <span class="info">
              By setting this to <b>Yes</b> the task will only be visible in 'My All' view
            </span>
          </div>
        </div>
          <!-- Created by -->
          <div class="row">
              <div class="input-field col s12">
                <label class="active">Created by:</label>
                <div class="input-field">
                 <span @click="SelectedManager=mng" v-for="mng in ManagersArray" v-bind:key="mng.id" v-bind:class="{'mySingleSelected':SelectedManager==mng}" class="mySingle chip">
                    {{mng.OBJ.name}}
                  </span>
                </div>  
              </div>
          </div>
          <!-- Attachement -->
            <!-- details -->
        <div class="row">
          <div class="input-field col s12">
            <label for="textarea1" class="active">Attachment:</label>
            <div v-for="attach in task_attachement" v-bind:key="attach.id">
              <span id="Attachment_span" v-html="attach" >                
              </span>              
              <i class="fas fa-minus-square red-text" style="cursor:pointer" @click="RemoveHyperlink(attach)"></i>
            </div>
            <div style="margin-top:10px" class="helperfield row">
                <div class="input-field col m4">
                  <label for="linkDetails" class="col">File URL path:</label>
                  <input id="linkDetails" type="text" v-model="detail_link">
                </div>
                <div class="col m2 input-field">
                  <label for="linkhyper"  class="col">Link caption:</label>
                  <input id="linkhyper" type="text" v-model="detail_title">
                </div>
                <a @click="AddHyperlink()" class="waves-effect waves-light btn-small col cyan darken-2" style="margin-right: 10px;">
                  <i class="material-icons">public</i>              
                  Add attachment hyperlink
                </a>              
            </div>
          </div>
        </div>
     <!-- navigation -->
        <div class="row MyFixed" style="width:100%">
          <div class="col left" style="margin-left:37px;z-index:100">
            <button type="submit" class="btn">Save</button>
            <router-link  v-bind:to="{name:$route.query.mnext}" class="btn grey">Cancel</router-link>
          </div>
          <div class="right">
            <a @click="updateTask('Clone')" class="btn waves-effect waves-light blue-grey lighten-2">
              <span class="right">
                <i class="material-icons">check</i>
                <i class="material-icons">filter_none</i>
              </span>
              Complete & extend |
            </a>
            <a @click="DeleteTask" class="btn waves-effect waves-light red darken-4">
              <i class="material-icons right">delete_forever</i>Delete
            </a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
// import db from "./firebaseInit";
import fireList from "./fireLists";
import RTDB from "./firebaseInitRTDB";

var moment = require("moment");

export default {
  name: "edit-task",
  data() {
    return {
      FTAarray: fireList.FTEList,
      task_FTE: "",
      showDetails: false,
      showProject: true,
      showNewProj: false,
      showNewProjCat: false,
      showUsers: false,

      detail_link: "",
      detail_title: "",
      task_attachement: [],

      task_name: null,
      task_details: "",
      task_start: null,
      task_deadline: null,
      task_status: null,
      task_project: null,
      task_env: null,
      task_isActive: null,
      task_createdBy: null,
      Statuses: fireList.statusesList,

      ManagersArray: [],
      SelectedManager: null,

      ProjectsCat: [],
      AddNewProjCat: null,
      SelectedProjCat: null,

      ProjectsList: [],
      SelectedProj: null,
      AddNewProj: null,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress",

      ownersList: fireList.OwnersList,
      SelectedOwner: { Label: null, UID: null },
      initialOwner: { Label: null, UID: null }
    };
  },
  methods: {
    SetDeadline() {
      this.task_deadline = moment(this.task_start, "YYYY-MM-DD")
        .weekday(5)
        .format("YYYY-MM-DD");
    },
    updateTask(Action) {
      var CloneT = Action == "Clone";

      var vueObj = this;
      var original;
      //validate end start times
      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }
      //validari
      var message = [];
      var msg = "Please select ";
      var delimit;

      //project
      if (
        this.SelectedProj == null &&
        !(
          this.SelectedProjCat == "Personal" ||
          this.SelectedProjCat == "xBacklog"
        )
      ) {
        message.push("Project");
      }
      if (this.showUsers) {
        // Owner
        if (this.SelectedOwner.UID == null) {
          message.push("Owner");
        }
      }
      //validate mandatory fields
      // console.log(message);
      if (message.length > 0) {
        message.forEach(function(i, x) {
          delimit = x < message.length - 1 ? ", " : "";
          msg = msg + i + delimit;
        });

        M.toast({ html: msg });
        return false;
      }

      if (CloneT) {
        vueObj.nSelectedStatus = "Completed";
      }

      if (vueObj.SelectedOwner.UID != vueObj.initialOwner.UID) {
        // move existing task
        console.log("reasignare");
        RTDB.ref(
          "/USERS/" +
            vueObj.$route.query.uid +
            "/TASKS/" +
            vueObj.$route.params.task_id +
            "/"
        ).once("value", querySnapshot => {
          // save on new user
          RTDB.ref(
            "/USERS/" +
              vueObj.SelectedOwner.UID +
              "/TASKS/" +
              vueObj.$route.params.task_id +
              "/"
          )
            .set(querySnapshot.val())
            .then(updt => {
              // update new task
              RTDB.ref(
                "/USERS/" +
                  vueObj.SelectedOwner.UID +
                  "/TASKS/" +
                  vueObj.$route.params.task_id +
                  "/"
              )
                .update({
                  tName: vueObj.task_name,
                  tDescription: vueObj.task_details,
                  tStart: vueObj.task_start,
                  tDeadline: vueObj.task_deadline,
                  tFTE: vueObj.task_FTE ? vueObj.task_FTE : "TBD",
                  tProject: vueObj.SelectedProj,
                  tProjCateg: vueObj.SelectedProjCat,
                  tStatus: vueObj.nSelectedStatus,
                  tAttach: vueObj.task_attachement,
                  tClosedDate:
                    vueObj.nSelectedStatus == "Completed"
                      ? moment().format("YYYY-MM-DD")
                      : "",
                  tOwner: vueObj.SelectedOwner,
                  // tEnvironment:vueObj.task_env?vueObj.task_env:"",
                  ModifiedBy: firebase.auth().currentUser.uid,
                  ModifiedDate: moment().format("YYYY-MM-DD HH:MM"),
                  t_isActive: vueObj.task_isActive == "No"
                })
                .then(final => {
                  RTDB.ref(
                    "/USERS/" +
                      vueObj.$route.query.uid +
                      "/TASKS/" +
                      vueObj.$route.params.task_id +
                      "/"
                  )
                    .remove()
                    // db.colldection(vueObj.$route.query.uid)
                    //   .doc(vueObj.$route.params.task_id)
                    //   .delete()
                    .then(navig => {
                      if (!CloneT) {
                        vueObj.$router.push({
                          name: vueObj.$route.query.mnext
                        });
                        console.log("task removed from old user");
                      }
                    });
                })
                .catch(function(error) {
                  console.error("Error writing document: ", error);
                });
            });
        });

        // db.collectdion(vueObj.$route.query.uid)
        //   .doc(vueObj.$route.params.task_id)
        //   .get()
        //   .then(doc => {
        //     // save on new user
        //     db.colldection(vueObj.SelectedOwner.UID)
        //       .doc(vueObj.$route.params.task_id)
        //       .set(doc.data())
        //       .then(updt => {
        //         // update new task
        //         db.colledction(vueObj.SelectedOwner.UID)
        //           .doc(vueObj.$route.params.task_id)
        //           .update({
        //             tName: vueObj.task_name,
        //             tDescription: vueObj.task_details,
        //             tStart: vueObj.task_start,
        //             tDeadline: vueObj.task_deadline,
        //             tFTE: vueObj.task_FTE ? vueObj.task_FTE : "TBD",
        //             tProject: vueObj.SelectedProj,
        //             tProjCateg: vueObj.SelectedProjCat,
        //             tStatus: vueObj.nSelectedStatus,
        //             tAttach: vueObj.task_attachement,
        //             tClosedDate:
        //               vueObj.nSelectedStatus == "Completed"
        //                 ? moment().format("YYYY-MM-DD")
        //                 : "",
        //             tOwner: vueObj.SelectedOwner,
        //             // tEnvironment:vueObj.task_env?vueObj.task_env:"",
        //             ModifiedBy: firebase.auth().currentUser.uid,
        //             ModifiedDate: moment().format("YYYY-MM-DD HH:MM"),
        //             t_isActive: vueObj.task_isActive == "No"
        //           })
        //           .then(final => {
        //             db.collectdion(vueObj.$route.query.uid)
        //               .doc(vueObj.$route.params.task_id)
        //               .delete()
        //               .then(navig => {
        //                 if (!CloneT) {
        //                   vueObj.$router.push({
        //                     name: vueObj.$route.query.mnext
        //                   });
        //                   console.log("task removed from old user");
        //                 }
        //               });
        //           })
        //           .catch(function(error) {
        //             console.error("Error writing document: ", error);
        //           });
        //         // console.log("done")
        //       });
        //   });
      } else {
        // save the update
        RTDB.ref(
          "/USERS/" +
            this.$route.query.uid +
            "/TASKS/" +
            this.$route.params.task_id +
            "/"
        )
          .update({
            tName: this.task_name,
            tDescription: this.task_details,
            tStart: this.task_start,
            tDeadline: this.task_deadline,
            tFTE: this.task_FTE ? this.task_FTE : "TBD",
            tProject: this.SelectedProj,
            tProjCateg: this.SelectedProjCat,
            tStatus: this.nSelectedStatus,
            tClosedDate:
              this.nSelectedStatus == "Completed"
                ? moment().format("YYYY-MM-DD")
                : "",
            tAttach: this.task_attachement,
            // tOwner:this.SelectedOwner,

            CreatedBy: this.SelectedManager.OBJ.UID,
            ModifiedBy: firebase.auth().currentUser.uid,
            ModifiedDate: moment().format("YYYY-MM-DD"),
            t_isActive: this.task_isActive == "No"
          })
          .then(docRef => {
            // console.log("task update done")
            if (!CloneT) {
              vueObj.$router.push({ name: vueObj.$route.query.mnext });
            }
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      }
      if (CloneT) {
        vueObj.CloneTask();
      }
    },
    addProjCategory() {
      var vueObj = this;
      RTDB.ref("/LISTS/Projects/")
        .update({ [vueObj.AddNewProjCat]: { 0: "" } })
        .then(function() {
          vueObj.showNewProjCat = false;
        })
        .catch(err => {
          console.log(err);
        });
      // db
      //   .colledction("DropDowns/InnoPipeline/Projects")
      //   .doc(vueObj.AddNewProjCat)
      //   .set({
      //     Projects: []
      //   })
      //   .then(function() {
      //     vueObj.showNewProjCat = false;
      //   });
    },
    DelProjCategory(opt) {
      var vueObj = this;
      if (vueObj.AddNewProjCat != null) {
        RTDB.ref("/LISTS/Projects/" + vueObj.AddNewProjCat + "/")
          .remove()
          .then(function() {
            vueObj.AddNewProjCat = null;
            vueObj.showNewProjCat = false;
          });
        // db
        //   .collectdion("DropDowns/InnoPipeline/Projects")
        //   .doc(vueObj.AddNewProjCat)
        //   .delete()
        //   .then(function() {
        //     vueObj.AddNewProjCat = null;
        //     vueObj.showNewProjCat = false;
        //   });
      } else {
        vueObj.showNewProjCat = false;
      }
    },
    DeleteTask() {
      var vueObj = this;
      if (
        window.confirm("This task will be permanently deleted, are you sure?")
      ) {
        RTDB.ref(
          "/USERS/" +
            this.$route.query.uid +
            "/TASKS/" +
            this.$route.params.task_id
        )
          .remove()
          .then(function() {
            // vueObj.$router.push("/view/projcat");
            vueObj.$router.push({ name: vueObj.$route.query.mnext });
          });
      }
    },
    CloneTask() {
      var vueObj = this;
      // create clone
      RTDB.ref(
        "/USERS/" +
          vueObj.SelectedOwner.UID +
          "/TASKS/" +
          vueObj.$route.params.task_id +
          "/"
      ).once("value", querySnapshot => {
        //extend timings with one week
        var TaskObj = querySnapshot.val();
        TaskObj.tStart = moment(TaskObj.tDeadline, "YYYY-MM-DD HH:MM")
          .weekday(8)
          .format("YYYY-MM-DD");
        TaskObj.tDeadline = moment(TaskObj.tDeadline, "YYYY-MM-DD HH:MM")
          .weekday(12)
          .format("YYYY-MM-DD");
        TaskObj.tStatus = "In progress";
        // add new task on same user
        RTDB.ref("/USERS/" + vueObj.$route.query.uid + "/TASKS/")
          .push(TaskObj)
          .then(updt => {
            vueObj.nSelectedStatus = "Completed";
            M.toast({ html: "Clone succesfully created !" });
            vueObj.$router.push({ name: vueObj.$route.query.mnext });
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      });
    },
    getProjects(remProj) {
      var vueObj = this;
      if (vueObj.SelectedProjCat != "xBacklog" && remProj) {
        vueObj.SelectedProj = null;
      }
      RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/").on(
        "value",
        querySnapshot => {
          vueObj.ProjectsList = [];
          querySnapshot.forEach(doc => {
            if (doc.val() != "") {
              vueObj.ProjectsList.push(doc.val());
            }
          });
          vueObj.showProject = true;
        }
      );
    },
    addProj() {
      var vueObj = this;
      RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/")
        .push(vueObj.AddNewProj)
        .then(function() {
          vueObj.showNewProj = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    DelProj() {
      var vueObj = this;
      var TasksArr;
      RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/").once(
        "value",
        querySnapshot => {
          TasksArr = querySnapshot.val();
          // remove proj from db obj
          delete TasksArr[
            Object.keys(TasksArr).find(
              key => TasksArr[key] === vueObj.AddNewProj
            )
          ];
          //make the update
          RTDB.ref("/LISTS/Projects/" + vueObj.SelectedProjCat + "/")
            .set(TasksArr)
            .then(ceva => {
              vueObj.showNewProj = false;
              console.log("done");
            });
        }
      );
    },
    AddHyperlink() {
      if (this.detail_link != "") {
        var title = this.detail_title ? this.detail_title : "Click here";
        //add https
        if (this.detail_link.indexOf("http") == -1) {
          this.detail_link = "https://" + this.detail_link;
        }
        this.task_attachement.push(
          "<a href='" + this.detail_link + "' target='_blank'>" + title + "</a>"
        );

        // this.task_attachement=this.task_attachement+"\n\n"+"Attachement: <a href='"+this.detail_link+"' target='_blank'>"+title+"</a>"
        this.detail_link = "";
        this.detail_title = "";
      } else {
        M.toast({ html: "URL field should not be empty" });
      }
    },
    RemoveHyperlink(attch) {
      var index = this.task_attachement.indexOf(attch);
      this.task_attachement.splice(index, 1);
    }
  },
  created() {
    var objVue = this;
    RTDB.ref(
      "/USERS/" +
        this.$route.query.uid +
        "/TASKS/" +
        this.$route.params.task_id +
        "/"
    ).once("value", querySnapshot => {
      objVue.ProjectsCat = [];
      const queryOBJ = querySnapshot.val();

      objVue.task_name = queryOBJ.tName;
      objVue.task_details = queryOBJ.tDescription;
      objVue.task_start = queryOBJ.tStart;
      objVue.task_deadline = queryOBJ.tDeadline;
      objVue.task_FTE = queryOBJ.tFTE ? queryOBJ.tFTE : "";
      objVue.nSelectedStatus = queryOBJ.tStatus;
      objVue.SelectedProjCat = queryOBJ.tProjCateg;
      objVue.SelectedProj = queryOBJ.tProject;
      objVue.SelectedOwner = queryOBJ.tOwner
        ? queryOBJ.tOwner
        : { Label: null, UID: null };
      objVue.initialOwner = objVue.SelectedOwner;
      objVue.task_attachement = queryOBJ.tAttach ? queryOBJ.tAttach : [];
      objVue.task_createdBy = queryOBJ.CreatedBy;

      objVue.task_isActive = queryOBJ.t_isActive ? "No" : "Yes";

      // this.orig_task_name = this.task_name;
      // this.orig_task_details = this.task_details;
      // this.orig_task_start=this.task_start;
      // this.orig_task_deadline = this.task_deadline;
      // this.orig_task_status = this.task_status;
      if (objVue.SelectedProjCat == "xBacklog") {
        objVue.task_start = moment()
          .weekday(1)
          .format("YYYY-MM-DD");
        objVue.task_deadline = moment()
          .weekday(5)
          .format("YYYY-MM-DD");
        // this.showUsers=true
      }
      objVue.getProjects();
      objVue.ProjectsCat.sort();
    });

    //set managers
    RTDB.ref("/USERS/")
      .orderByChild("isManager")
      .equalTo(true)
      .once("value", querySnapshot => {
        const queryOBJ = querySnapshot.val();
        for (var prop in queryOBJ) {
          const data = {
            OBJ: {
              name: queryOBJ[prop].Label,
              UID: prop
            }
          };
          objVue.ManagersArray.push(data);
        }
        function sortMNG(a, b) {
          if (b.OBJ.name == "All") return 1;
          if (a.OBJ.name < b.OBJ.name) return -1;
          if (a.OBJ.name > b.OBJ.name) return 1;
          return 0;
        }

        objVue.ManagersArray.sort(sortMNG);

        objVue.ManagersArray.forEach(owner => {
          if (owner.OBJ.UID == objVue.task_createdBy) {
            objVue.SelectedManager = owner;
            return true;
          }
        });
      });
    $(".material-tooltip").remove();
  },
  mounted() {
    var objVue = this;
    RTDB.ref("/LISTS/Projects/").on("value", querySnapshot => {
      objVue.ProjectsCat = [];
      const queryOBJ = querySnapshot.val();
      for (var prop in queryOBJ) {
        objVue.ProjectsCat.push(prop);
      }
      objVue.ProjectsCat.sort();
    });
  }
};
</script>

<style scoped>
textarea {
  margin-top: 10px;
  height: 107px;
}
input[type="date"] {
  width: 150px;
}
.mySingle {
  cursor: pointer;
}
.mySingleSelected {
  background: teal;
  color: white;
}
.info {
  color: darkgray;
  font-style: italic;
  border-left: solid 5px darkgray;
  padding-left: 5px;
}
label {
  margin-bottom: 5px;
}
.MyFixed {
  position: fixed;
  bottom: -17px;
  left: 13px;
  width: 100%;
  padding: 10px;
  background: #424242b5;
  z-index: 999;
}
.MyContainer {
  background-color: white;
  padding: 10px;
}
</style>


<template>
  <div id="edit-task" class="container">
    <h3>Edit task</h3>
    <div class="row MyContainer">
      <form @submit.prevent="updateTask" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input placeholder="Task name" type="text" v-model="task_name" required />
            <label class="active">Name:</label>
          </div>
        </div>
        <!-- details -->
        <div class="row">
          <div class="input-field col s12">
            <textarea id="textarea1" placeholder="Task details" v-model="task_details" />
            <label for="textarea1" class="active">Details:</label>
          </div>
        </div>
        <!-- timings -->
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
        <div class="row">
          Task FTE:
          <blockquote>If you close the task (set the status to either Canceled, On hold, Completed) and leave the used FTE blank, will use the value from Estimated if not equal to TBD</blockquote>
        </div>
        <div class="row">
          <div class="col s6 right-align blue-text">
            <!-- FTA estimated-->
            <span v-if="displayFTA" class="FTEcont">
              <select
                v-model="task_FTE"
                style="display:inline;width:70px"
                @change="updateFTE('fte')"
                class="blue-text"
              >
                <option v-for="fta in FTAarray" v-bind:key="fta.id" v-bind:value="fta">{{fta}}</option>
              </select>
              <span>Estimated FTE</span>
            </span>
            <span v-else>
              <select
                v-model="hours"
                style="display:inline;width:70px"
                @change="updateFTE('hours')"
                class="blue-text"
              >
                <option
                  v-for="fta in FTAarray.filter(itm=>itm!='TBD')"
                  v-bind:key="fta.id"
                  v-bind:value="fta*40"
                >{{fta*40}}</option>
              </select>
              <span>Estimated Hours</span>
            </span>
          </div>
          <div class="col s6 green-text">
            <!-- FTA used-->
            <span v-if="displayFTA" class="FTEcont">
              <select
                v-model="task_usedFTE"
                style="display:inline;width:70px"
                @change="updateUsedFTE('fte')"
                class="green-text text-darken-2"
              >
                <option v-for="fta in UsedFTAarray" v-bind:key="fta.id" v-bind:value="fta">{{fta}}</option>
              </select>
              <span>Used FTE</span>
            </span>
            <span v-else>
              <select
                v-model="UsedHours"
                style="display:inline;width:70px"
                @change="updateUsedFTE('hours')"
                class="green-text text-darken-2"
              >
                <option
                  v-for="fta in UsedFTAarray.filter(itm=>itm!='TBD')"
                  v-bind:key="fta.id"
                  v-bind:value="fta*40"
                >{{fta*40}}</option>
              </select>
              <span>Used Hours</span>
            </span>
          </div>
        </div>

        <div class="row">
          <div class="col s6 offset-s4 switch">
            <label>
              Hours
              <input v-model="displayFTA" type="checkbox" />
              <span class="lever"></span>
              FTE
            </label>
          </div>
        </div>

        <!-- projects category -->
        <div class="row">
          <div class="input-field col s12">
            <label class="active">Category:</label>
            <div class="input-field">
              <span
                @click="SelectedProjCat=opt,getProjects(true)"
                v-for="opt in ProjectsCat"
                v-bind:key="opt.id"
                v-bind:class="{'mySingleSelected':SelectedProjCat==opt}"
                class="mySingle chip"
              >{{opt}}</span>
              <a
                @click="showNewProjCat=true"
                v-if="!showNewProjCat"
                class="btn-floating btn-small waves-effect waves-light red"
              >
                <i class="material-icons">add</i>
              </a>
              <input
                v-if="showNewProjCat"
                v-model="AddNewProjCat"
                v-on:keydown.enter.prevent="addProjCategory"
                v-on:keydown.esc.prevent="DelProjCategory"
                placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it"
                type="text"
              />
            </div>
          </div>
        </div>

        <!-- project list -->
        <div v-if="showProject" class="row">
          <div class="input-field col s12">
            <label class="active">Project:</label>
            <div class="input-field">
              <span
                @click="SelectedProj=opt"
                v-for="opt in ProjectsList"
                v-bind:key="opt.id"
                v-bind:class="{'mySingleSelected':SelectedProj==opt}"
                class="mySingle chip"
              >{{opt}}</span>
              <a
                @click="showNewProj=true"
                v-if="!showNewProj"
                class="btn-floating btn-small waves-effect waves-light red"
              >
                <i class="material-icons">add</i>
              </a>
              <input
                v-if="showNewProj"
                v-model="AddNewProj"
                v-on:keydown.enter.prevent="addProj"
                v-on:keydown.esc.prevent="DelProj"
                placeholder="Add a new value and then 'pres Enter' or 'Esc' to remove it"
                type="text"
              />
            </div>
          </div>
        </div>
        <!-- status -->
        <div class="row">
          <div class="input-field col s12">
            <label class="active">Status:</label>
            <div class="input-field">
              <span
                @click="StatusUpdateFTE(opt,true)"
                v-for="opt in nStatusesList"
                v-bind:key="opt.id"
                v-bind:class="{'mySingleSelected':nSelectedStatus==opt}"
                class="mySingle chip"
              >{{opt}}</span>
            </div>
          </div>
        </div>
        <!-- feedBack -->
        <div class="row">
          <label>
            <input type="checkbox" class="filled-in" checked="checked" v-model="task_feedback" />
            <span>Request feedback</span>
          </label>
          <div v-if="task_feedback">
            <input
              placeholder="Feedback email"
              type="text"
              class="col m2 validate"
              v-model="task_fbkEmail"
              required
            />
            <span id="emailDomain">@ipsos.com</span>
          </div>
        </div>
        <!-- priority -->
        <div class="row" v-if="SelectedOwner.Label=='xBacklog'">
          <div class="input-field col s12">
            <label class="active">Priority:</label>
            <div class="input-field">
              <span
                @click="task_priority=opt"
                v-for="opt in PiorityArr"
                v-bind:key="opt.id"
                v-bind:class="{'mySingleSelected':task_priority==opt}"
                class="mySingle chip"
              >{{opt}}</span>
            </div>
          </div>
        </div>
        <!-- Owners -->
        <div class="row">
          <div class="input-field col s12">
            <label class="active">Owner:</label>
            <div class="input-field">
              <div v-if="!showUsers">
                <b>{{initialOwner.Label}}</b>
                <br />
                <a
                  @click="showUsers=true"
                  style="z-index:0"
                  class="btn waves-effect waves-light blue darken-3"
                >
                  <i class="material-icons right">assignment_ind</i>Change owner
                </a>
              </div>

              <div v-if="showUsers" class="row">
                <div class="input-field col s12">
                  <span
                    @click="SelectedOwner=opt"
                    v-for="opt in ownersList"
                    v-bind:key="opt.id"
                    v-bind:class="{'mySingleSelected':SelectedOwner.UID==opt.UID}"
                    class="mySingle chip"
                  >{{opt.Label}}</span>
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
              By setting this to
              <b>Yes</b> the task will only be visible in 'My All' view
            </span>
          </div>
        </div>
        <!-- Created by -->
        <div class="row">
          <div class="input-field col s12">
            <label class="active">Created by:</label>
            <div class="input-field">
              <span
                v-for="mng in ManagersArray"
                v-bind:key="mng.id"
                v-bind:class="{'mySingleSelected':task_createdBy==mng.OBJ.UID}"
                class="mySingle chip"
              >{{mng.OBJ.name}}</span>
            </div>
          </div>
        </div>
        <!-- Attachement -->
        <!-- details -->
        <div class="row">
          <div class="input-field col s12">
            <label for="textarea1" class="active">Attachment:</label>
            <div v-for="attach in task_attachement" v-bind:key="attach.id">
              <span id="Attachment_span" v-html="attach"></span>
              <i
                class="fas fa-minus-square green-text"
                style="cursor:pointer"
                @click="RemoveHyperlink(attach)"
              ></i>
            </div>
            <div style="margin-top:10px" class="helperfield row">
              <div class="input-field col m4">
                <label for="linkDetails" class="col">File URL path:</label>
                <input id="linkDetails" type="text" v-model="detail_link" />
              </div>
              <div class="col m2 input-field">
                <label for="linkhyper" class="col">Link caption:</label>
                <input id="linkhyper" type="text" v-model="detail_title" />
              </div>
              <a
                @click="AddHyperlink()"
                class="waves-effect waves-light btn-small col cyan darken-2"
                style="margin-right: 10px;"
              >
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
            <router-link v-bind:to="{name:$route.query.mnext}" class="btn grey">Cancel</router-link>
          </div>
          <div class="right">
            <span v-if="ShowTweek">
              <label for="taskWeek">Set task week for exended</label>
              <input
                id="taskWeek"
                type="week"
                placeholder="start date"
                @change="VerifyTdate()"
                v-model="taskWeek"
              />
            </span>
            <a
              @click="updateTask('Clone')"
              class="btn waves-effect waves-light blue-grey lighten-2"
              :class="{disabled:disableExtend}"
            >
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
import EventBus from "../eventBus";

var moment = require("moment");

export default {
  name: "edit-task",
  data() {
    return {
      FTAarray: fireList.FTEList,
      UsedFTAarray: fireList.usedFTEArrList,
      PiorityArr: ["Low", "Normal", "High"],
      task_FTE: null,
      task_usedFTE: null,
      ShowFTE: "estimated",
      hours: this.task_FTE * 4,
      UsedHours: this.task_usedFTE * 4,
      displayFTA: true,

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
      task_priority: null,
      task_status: null,
      task_project: null,
      task_feedback: false,
      task_fbkEmail: "",
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

      taskWeek: "",
      disableExtend: false,
      ShowTweek: false,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress",

      ownersList: fireList.OwnersList,
      SelectedOwner: { Label: null, UID: null },
      initialOwner: { Label: null, UID: null },
      createdByLabel:"",
    };
  },
  methods: {
    VerifyTdate() {
      this.disableExtend = true;

      if (
        moment(this.taskWeek)
          .weekday(5)
          .isAfter(moment())
      ) {
        this.disableExtend = false;
      }
    },
    updateUsedFTE(type) {
      if (type == "fte") {
        this.UsedHours = 40 * this.task_usedFTE;
      } else {
        this.task_usedFTE = (this.UsedHours / 40).toFixed(2);
      }
    },
    updateFTE(type) {
      if (type == "fte") {
        this.hours = 40 * this.task_FTE;
      } else {
        this.task_FTE = (this.hours / 40).toFixed(2);
      }
    },
    StatusUpdateFTE(opt, anim) {
      this.nSelectedStatus = opt;
      // let initialShow=this.ShowFTE

      if (opt == "Canceled" || opt == "Completed" || opt == "On hold") {
        this.ShowFTE = "used";
        //   if ((this.task_usedFTE=="TBD" ||this.task_usedFTE=="") && opt=="Completed" ){
        //     this.task_usedFTE=this.task_FTE
        //      $(".FTEcont select").eq(1).css("border", "solid green 1px")
        //   }else{
        //      $(".FTEcont select").eq(1).css("border", "1px solid #f2f2f2")
        //   }
      } else {
        this.ShowFTE = "estimated";
      }
      // if (initialShow!=this.ShowFTE && anim){
      //   setTimeout(function(){ $(".FTEcont").effect( "pulsate", {times:3}, 3000 ) }, 500);
      // }
    },
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
      //feedback
      if (this.task_feedback && this.task_fbkEmail.indexOf(".") == -1) {
        M.toast({ html: "Email should contain at least one dot" });
        return false;
      }

      if (
        this.ShowFTE == "used" &&
        (this.task_usedFTE == null || this.task_usedFTE == "") &&
        this.task_FTE == "TBD"
      ) {
        M.toast({ html: `Used FTE should not be null` });
        $(".FTEcont select")
          .eq(1)
          .css("border", "solid red 1px");
        return false;
      }
      //recodare used FTE pt comozi
      if (
        //this.ShowFTE=='used' &&
        (this.task_usedFTE == null || this.task_usedFTE == "") &&
        this.task_FTE != "TBD" &&
        (this.nSelectedStatus == "Completed" || CloneT)
      ) {
        this.task_usedFTE = this.task_FTE;
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
        // if (this.task_usedFTE=="TBD" ||this.task_usedFTE==""){
        //   this.task_usedFTE=this.task_FTE
        // }
      }

      if (vueObj.SelectedOwner.UID != vueObj.initialOwner.UID) {
        // move existing task
        console.log("reasignare");
        //check for status
        if (
          vueObj.SelectedOwner.UID != "backlog" &&
          vueObj.nSelectedStatus == "Not allocated"
        ) {
          vueObj.nSelectedStatus = "Not started";
        }

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
                  tFTEused: vueObj.task_usedFTE ? vueObj.task_usedFTE : "",
                  tPriority: vueObj.task_priority,
                  tProject: vueObj.SelectedProj,
                  tProjCateg: vueObj.SelectedProjCat,
                  tStatus: vueObj.nSelectedStatus,
                  tFbk: this.task_feedback,
                  tFbkEmail:
                    this.task_fbkEmail.replace("@ipsos.com", "") + "@ipsos.com",
                  tAttach: vueObj.task_attachement,
                  tClosedDate:
                    vueObj.nSelectedStatus == "Completed"
                      ? moment().format("YYYY-MM-DD")
                      : "",
                  tOwner: vueObj.SelectedOwner,
                  // tEnvironment:vueObj.task_env?vueObj.task_env:"",
                  CreatedBy: firebase.auth().currentUser.uid,
                  ModifiedBy: firebase.auth().currentUser.uid,
                  ModifiedDate: moment().format("YYYY-MM-DD HH:MM"),
                  t_isActive: vueObj.task_isActive == "No"
                })
                .then(final => {

                let emailBody =` A new task was assigned in MeineTasks:<br/><br/>
                
                Task name : ${vueObj.task_name}<br/>
                Task category: ${vueObj.SelectedProjCat}<br/>
                Task project: ${vueObj.SelectedProj}<br/>
                Task details: ${vueObj.task_details}<br/>
                Task start date: ${vueObj.task_start}<br/>
                Task end date: ${vueObj.task_deadline}<br/>
                Task created by: ${this.createdByLabel}<br/>
                `;
                let emailSubject = `New Task assigned to ${vueObj.SelectedOwner.Label}`
                let emailCC=['IISCompetenceTasks@ipsos.com']
                let emailTO=[this.$parent.emailMap[vueObj.SelectedOwner.UID]]
                console.log(emailTO)
                let data={
                  "mailto":["alexandru.popescu@ipsos.com"],
                  "mailBody":emailBody,
                  "emailSubject":emailSubject,
                  "mailCC":["alexandru.popescu@ipsos.com"]
                }
                EventBus.$emit('sendEmail',data, false);

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
            tFTEused: this.task_usedFTE ? this.task_usedFTE : "",
            tPriority: this.task_priority,
            tProject: this.SelectedProj,
            tProjCateg: this.SelectedProjCat,
            tStatus: this.nSelectedStatus,
            tFbk: this.task_feedback,
            tFbkEmail:
              this.task_fbkEmail.replace("@ipsos.com", "") + "@ipsos.com",
            tClosedDate:
              this.nSelectedStatus == "Completed"
                ? moment().format("YYYY-MM-DD")
                : "",
            tAttach: this.task_attachement,
            // tOwner:this.SelectedOwner,

            // CreatedBy: firebase.auth().currentUser.uid,
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
        // Changes to the clone

        //extend timings with one week
        var TaskObj = querySnapshot.val();
        if (vueObj.ShowTweek) {
          TaskObj.tStart = moment(vueObj.taskWeek)
            .weekday(1)
            .format("YYYY-MM-DD");
          TaskObj.tDeadline = moment(vueObj.taskWeek)
            .weekday(5)
            .format("YYYY-MM-DD");
        } else {
          TaskObj.tStart = moment(TaskObj.tDeadline, "YYYY-MM-DD HH:MM")
            .weekday(8)
            .format("YYYY-MM-DD");
          TaskObj.tDeadline = moment(TaskObj.tDeadline, "YYYY-MM-DD HH:MM")
            .weekday(12)
            .format("YYYY-MM-DD");
        }

        TaskObj.tStatus = "In progress";
        //AlexP
        TaskObj.tFTE = "TBD";
        TaskObj.tFTEused = "";

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

    let currUserLabel = RTDB.ref("/USERS/" + firebase.auth().currentUser.uid + "/Label")
    currUserLabel.once("value", querySnapshot => {
      this.createdByLabel=querySnapshot.val();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      this.createdByLabel="";
    })

    var objVue = this;
    RTDB.ref(
      "/USERS/" +
        this.$route.query.uid +
        "/TASKS/" +
        this.$route.params.task_id +
        "/"
    ).once("value", querySnapshot => {
      // objVue.ProjectsCat = [];
      const queryOBJ = querySnapshot.val();

      objVue.task_name = queryOBJ.tName;
      objVue.task_details = queryOBJ.tDescription;
      objVue.task_start = queryOBJ.tStart ? queryOBJ.tStart : "";
      objVue.task_deadline = queryOBJ.tDeadline ? queryOBJ.tDeadline : "";
      objVue.task_FTE = queryOBJ.tFTE ? queryOBJ.tFTE : "";
      objVue.task_usedFTE = queryOBJ.tFTEused ? queryOBJ.tFTEused : "";
      objVue.nSelectedStatus = queryOBJ.tStatus;
      objVue.task_priority = queryOBJ.tPriority ? queryOBJ.tPriority : "";
      objVue.SelectedProjCat = queryOBJ.tProjCateg;
      objVue.SelectedProj = queryOBJ.tProject;
      objVue.SelectedOwner = queryOBJ.tOwner
        ? queryOBJ.tOwner
        : { Label: null, UID: null };
      objVue.initialOwner = objVue.SelectedOwner;
      objVue.task_attachement = queryOBJ.tAttach ? queryOBJ.tAttach : [];

      objVue.task_feedback = queryOBJ.tFbk ? queryOBJ.tFbk : false;
      objVue.task_fbkEmail = queryOBJ.tFbkEmail
        ? queryOBJ.tFbkEmail.replace("@ipsos.com", "")
        : "";

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
      // calculate inital FTE
      if (objVue.task_FTE != "TBD") {
        objVue.hours = objVue.task_FTE * 40;
      }
      if (objVue.task_usedFTE != null) {
        objVue.UsedHours = objVue.task_usedFTE * 40;
      }
      this.StatusUpdateFTE(objVue.nSelectedStatus, false);
      if (
        moment(objVue.task_deadline, "YYYY-MM-DD HH:MM")
          .weekday(8)
          .isBefore(moment())
      ) {
        objVue.ShowTweek = true;
        objVue.disableExtend = true;
      }
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

        // objVue.ManagersArray.forEach(owner => {
        //   if (owner.OBJ.UID == objVue.task_createdBy) {
        //     objVue.SelectedManager = owner;
        //     return true;
        //   }
        // });
      });
    $(".material-tooltip").remove();

    //this.UsedFTAarray.splice(2,0,"0")
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
#emailDomain {
  top: 10px;
  position: relative;
  color: gray;
}
</style>


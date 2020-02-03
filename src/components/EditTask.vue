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
            <label for="textarea1" class="active">Details:</label>
            <textarea id="textarea1" placeholder="Task details" v-model="task_details" />
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
          <!-- FTA estimated v-if="ShowFTE=='estimated'"-->
          <span>
            <span v-if="displayFTA" class="FTEcont">
              <select
                v-model="task_FTE"
                style="display:inline;width:70px"
                @change="updateFTE('fte')"
              >
                <option v-for="fta in FTAarray" v-bind:key="fta.id" v-bind:value="fta">{{fta}}</option>
              </select>
              <span>
                <b>Estimated</b> FTE
              </span>
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
              <span>
                <b>Estimated</b> Hours
              </span>
            </span>
          </span>
          <!-- FTA used v-if="ShowFTE=='used'"-->
          <span id="UsedFTE" class="FTEcont">
            <span v-if="displayFTA">
              <select
                v-model="task_usedFTE"
                style="display:inline;width:70px"
                @change="updateUsedFTE('fte')"
              >
                <option v-for="fta in UsedFTAarray" v-bind:key="fta.id" v-bind:value="fta">{{fta}}</option>
              </select>
              <span>
                <b>Used</b> FTE
              </span>
            </span>
            <span v-else>
              <select
                v-model="UsedHours"
                style="display:inline;width:70px"
                @change="updateUsedFTE('hours')"
              >
                <option v-for="fta in FTAarray" v-bind:key="fta.id" v-bind:value="fta*40">{{fta*40}}</option>
              </select>
              <span>
                <b>Used</b> Hours
              </span>
            </span>
          </span>
          <div class="switch">
            <label>
              Hours
              <input v-model="displayFTA" type="checkbox" />
              <span class="lever"></span>
              FTE
            </label>
          </div>
        </div>

        <!-- status -->
        <div class="row">
          <div class="input-field col s12">
            <label class="active">Status:</label>
            <div class="input-field">
              <span
                @click="StatusUpdateFTE(opt,true)"
                v-for="opt in nStatusesList.filter(opt=>opt!='Not allocated')"
                v-bind:key="opt.id"
                v-bind:class="{'mySingleSelected':nSelectedStatus==opt}"
                class="mySingle chip"
              >{{opt}}</span>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="input-field col s12">
            <select
              required
              style="display:block;width:70px;margin-top: 10px;"
              v-model="task_isActive"
            >
              <option>Yes</option>
              <option>No</option>
            </select>
            <label class="active">Is archived:</label>
            <span class="info">
              By setting this to
              <b>Yes</b> the task will only be visible in 'My All' view
            </span>
          </div>
        </div>
        <!-- Attachement -->
        <div class="row">
          <div class="input-field col s12">
            <label for="textarea1" class="active">Attachment:</label>

            <div v-for="attach in task_attachement" v-bind:key="attach.id">
              <span id="Attachment_span" v-html="attach"></span>
              <i
                class="fas fa-minus-square red-text"
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
        <!-- created by -->
        <div class="row">
          <div class="input-field col s12 info">
            <span>
              Task category :
              <b>{{SelectedProjCat}}</b>
            </span>
            <br />
            <span>
              Task created by :
              <b>{{task_createdBy}}</b>
            </span>
          </div>
        </div>
        <!-- navigation -->
        <div class="row MyFixed" style="width:100%">
          <div class="col right" style="margin-left:37px;z-index:100">
            <button type="submit" class="btn">Save</button>
            <router-link to="/" class="btn grey">Cancel</router-link>
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
              class="btn waves-effect waves-light deep-orange accent-3"
              :class="{disabled:disableExtend}"
            >
              <span class="right">
                <i class="material-icons">check</i>
                <i class="material-icons">filter_none</i>
              </span>
              Complete & extend |
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
      UsedFTAarray: fireList.usedFTEArrList,
      task_FTE: null,
      task_usedFTE: null,
      ShowFTE: "estimated",
      hours: this.task_FTE * 4,
      UsedHours: this.task_usedFTE * 4,
      showDetails: false,
      showProject: true,
      showNewProj: false,
      showNewProjCat: false,
      detail_link: "",
      detail_title: "",
      task_attachement: [],

      task_name: null,
      task_details: "",
      task_start: null,
      task_deadline: null,
      task_status: null,
      task_project: null,
      task_isActive: null,
      task_createdBy: null,
      SelectedProjCat: null,
      displayFTA: true,
      taskWeek: "",
      disableExtend: false,
      ShowTweek: false,
      // SelectedProj:null,

      // Statuses: fireList.statusesList,

      // ProjectsCat: [],
      // AddNewProjCat: null,
      // SelectedProjCat: null,

      // ProjectsList: [],
      // SelectedProj: null,
      // AddNewProj: null,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress"

      // ownersList: fireList.OwnersList,
      // SelectedOwner: { Label: null, UID: null }
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
      let initialShow = this.ShowFTE;

      if (opt == "Canceled" || opt == "Completed" || opt == "On hold") {
        this.ShowFTE = "used";
      } else {
        this.ShowFTE = "estimated";
      }
      if (initialShow != this.ShowFTE && anim) {
        setTimeout(function() {
          $(".FTEcont").effect("pulsate", { times: 3 }, 3000);
        }, 500);
      }
    },
    updateTask(Action) {
      var CloneT = Action == "Clone";

      //validate end start times
      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }
      //if (this.ShowFTE=='used' && this.task_usedFTE==null) {
      if (
        this.ShowFTE == "used" &&
        (this.task_usedFTE == null || this.task_usedFTE == "")
      ) {
        M.toast({ html: `Used FTE should not be null` });
        $("#UsedFTE select").css("border", "solid red 1px");
        return false;
      }
      if (CloneT) {
        if (this.task_usedFTE == null || this.task_usedFTE == "") {
          M.toast({ html: `Used FTE should not be null` });
          $("#UsedFTE select").css("border", "solid red 1px");
          return false;
        }
        this.nSelectedStatus = "Completed";
      }
      RTDB.ref(
        "/USERS/" +
          firebase.auth().currentUser.uid +
          "/TASKS/" +
          this.$route.params.task_id +
          "/"
      )

        .update({
          tName: this.task_name,
          tDescription: this.task_details,
          tStart: this.task_start,
          tDeadline: this.task_deadline,
          tFTE: this.task_FTE,
          tFTEused: this.task_usedFTE ? this.task_usedFTE : "",
          // tProject: this.SelectedProj,
          // tProjCateg: this.SelectedProjCat,
          tAttach: this.task_attachement,
          tStatus: this.nSelectedStatus,
          // tOwner:this.SelectedOwner,
          // tEnvironment:this.task_env?this.task_env:"",
          ModifiedBy: firebase.auth().currentUser.uid,
          ModifiedDate: moment().format("YYYY-MM-DD HH:MM"),
          t_isActive: this.task_isActive == "No"
        })
        .then(docRef => {
          console.log("task update done");
          if (!CloneT) {
            this.$router.push("/");
          } else {
            this.CloneTask();
          }
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
    },
    CloneTask() {
      var vueObj = this;
      // create clone
      RTDB.ref(
        "/USERS/" +
          firebase.auth().currentUser.uid +
          "/TASKS/" +
          this.$route.params.task_id +
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

        TaskObj.tStart = moment(TaskObj.tDeadline, "YYYY-MM-DD HH:MM")
          .weekday(8)
          .format("YYYY-MM-DD");
        TaskObj.tDeadline = moment(TaskObj.tDeadline, "YYYY-MM-DD HH:MM")
          .weekday(12)
          .format("YYYY-MM-DD");
        TaskObj.tStatus = "In progress";
        //AlexP
        TaskObj.tFTE = "TBD";
        TaskObj.tFTEused = "";

        // add new task on same user
        RTDB.ref("/USERS/" + firebase.auth().currentUser.uid + "/TASKS/")
          .push(TaskObj)
          .then(updt => {
            // vueObj.nSelectedStatus = "Completed";
            M.toast({ html: "Clone succesfully created !" });
            // vueObj.$router.push({ name: vueObj.$route.query.mnext });
            this.$router.push("/");
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      });
    },
    getProjects() {
      var vueObj = this;
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
    },
    getCreatorLabel(UID) {
      var objVue = this;
      RTDB.ref("/USERS/")
        .orderByKey()
        .equalTo(UID)
        .once("value", querySnapshot => {
          // console.log(querySnapshot.val());
          // debugger;
          objVue.task_createdBy = querySnapshot.val()[UID].Label;
        });
    }
  },
  created() {
    var objVue = this;

    RTDB.ref(
      "/USERS/" +
        firebase.auth().currentUser.uid +
        "/TASKS/" +
        this.$route.params.task_id +
        "/"
    ).once("value", querySnapshot => {
      const queryOBJ = querySnapshot.val();

      objVue.task_name = queryOBJ.tName;
      objVue.task_details = queryOBJ.tDescription;
      objVue.task_start = queryOBJ.tStart;
      objVue.task_deadline = queryOBJ.tDeadline;
      objVue.task_FTE = queryOBJ.tFTE ? queryOBJ.tFTE : "TBD";
      objVue.task_usedFTE = queryOBJ.tFTEused ? queryOBJ.tFTEused : null;
      objVue.nSelectedStatus = queryOBJ.tStatus;
      objVue.SelectedProjCat = queryOBJ.tProjCateg;
      objVue.SelectedProj = queryOBJ.tProject;
      objVue.task_attachement = queryOBJ.tAttach ? queryOBJ.tAttach : [];

      // objVue.SelectedOwner=queryOBJ.tOwner?queryOBJ.tOwner:{ Label: null, UID: null };

      objVue.task_isActive = queryOBJ.t_isActive ? "No" : "Yes";

      objVue.getCreatorLabel(queryOBJ.CreatedBy);

      objVue.getProjects();
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

    $(".material-tooltip").css("opacity", 0);
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
.MyContainer {
  background-color: white;
  padding: 10px;
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
</style>


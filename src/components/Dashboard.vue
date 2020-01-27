<template>
  <div id="dashboard" style="margin: 0px 50px;">
    <div class="row hide-on-small-only myHeader">
      <h6
        v-for="itm in Header"
        :key="itm.txt"
        class="col s12 left"
        :class="[itm.m,itm.txt==HSorted?'sortedASC_'+SortASC:'',{'clickable':itm.hasSort}]"
        @click="HeaderClick(itm)"
      >{{itm.txt}}</h6>
    </div>
    <!-- view active  -->
    <div class="progress" v-if="!gotActive">
      <div class="indeterminate"></div>
    </div>
    <div
      v-for="task in viewActive"
      v-bind:key="task.id"
      class="row tblRow"
      :class="task.task_status.replace(' ','')"
    >
      <div class="col m2 s12 clickable NameEdit" @click="EditTask(task)">
        <span>
          <b>{{task.task_name}}</b>
        </span>
      </div>
      <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>
      <div class="col m1 s12 truncate">
        <i>{{task.task_project}}</i>
      </div>
      <div class="col m1 s12">
        <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
          <span id="Attachment_span" v-html="attach"></span>
        </div>
      </div>
      <div class="col m1 s12">
        <i>{{task.task_status}}</i>
      </div>
      <div class="col m1 s12">{{task.task_deadline}}</div>
      <div class="col m1 s12">
        <span>{{task.task_FTE}}</span>
        <span class="blue-text" v-if="task.task_usedFTE">> {{task.task_usedFTE}}</span>
      </div>
      <!-- icons   -->
      <div v-if="isLoggedIn" class="col m2">
        <!-- delete personal -->
        <div
          v-if="task.t_isPrivate"
          class="col tooltipped"
          data-position="top"
          data-tooltip="<span style='font-size:small'>Delete</span>"
        >
          <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
        </div>
        <!-- user edit -->
        <div
          class="col tooltipped"
          data-position="top"
          data-tooltip="<span style='font-size:small'>Edit</span>"
        >
          <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
            <i class="fas fa-edit"></i>
          </router-link>
        </div>
        <!-- complete -->
        <div
          class="col tooltipped"
          data-position="top"
          data-tooltip="<span style='font-size:small'>Complete</span>"
        >
          <i
            @click="CompleteTask(task)"
            v-bind:class="task.task_completed ? 'fa-clipboard-check' : 'fa-check'"
            class="fas"
          ></i>
        </div>
        <!-- start stop -->
        <div
          class="col tooltipped"
          data-position="top"
          data-tooltip="<span style='font-size:small'>Start/Stop</span>"
        >
          <i
            @click="StartStop(task)"
            v-bind:class="task.task_status=='In progress' ? 'fa-stop-circle' : 'fa-play-circle'"
            class="far"
          ></i>
        </div>
      </div>
    </div>
    <div id="TotalFTE" class="row" v-if="gotActive">
      <div class="col m1 offset-m8">Total FTE:</div>
      <div class="col m1">
        <span :class="{'red-text':GetTotalFTE.estim>1}">{{ GetTotalFTE.estim}}</span>
        <span class="blue-text" v-if=" GetTotalFTE.used">>{{ GetTotalFTE.used}}</span>
      </div>
    </div>

    <hr />
    <div style="margin:5px">
      <a
        @click="ShowCompleted=!ShowCompleted"
        class="waves-effect waves-light btn-floating lighten-2"
        :class="ShowCompleted?'grey':'green'"
      >
        <i v-if="ShowCompleted" class="material-icons left">visibility_off</i>
        <i v-else class="material-icons left">visibility</i>
      </a>
      <span v-if="ShowCompleted">Hide closed</span>
      <span v-else>Show closed</span>
    </div>

    <div id="CompletedContainer" v-if="ShowCompleted">
      <!-- view Completed  -->
      <div
        v-for="task in viewCompleted"
        v-bind:key="task.id"
        class="row"
        :class="task.task_status.replace(' ','')"
      >
        <div class="col m2 s12">
          <span>
            <b>{{task.task_name}}</b>
          </span>
        </div>
        <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>
        <div class="col m1 s12 truncate">
          <i>{{task.task_project}}</i>
        </div>
        <div class="col m1 s12">
          <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
            <span id="Attachment_span" v-html="attach"></span>
          </div>
        </div>
        <div class="col m1 s12">
          <i>{{task.task_status}}</i>
        </div>
        <div class="col m1 s12">{{task.task_deadline}}</div>
        <div class="col m1 s12">{{task.task_FTE}}</div>
        <!-- icons   -->
        <div v-if="isLoggedIn" class="col m2">
          <div
            v-if="task.t_isPrivate"
            class="col tooltipped"
            data-position="top"
            data-tooltip="<span style='font-size:small'>Delete</span>"
          >
            <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
          </div>
          <div
            class="col tooltipped"
            data-position="top"
            data-tooltip="<span style='font-size:small'>Archive</span>"
          >
            <i @click="CloseTask(task)" class="fas fa-eye-slash"></i>
          </div>
          <div
            class="col tooltipped"
            data-position="top"
            data-tooltip="<span style='font-size:small'>Edit</span>"
          >
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- view archived -->
    <div style="margin:5px">
      <a
        @click="ShowArchived=!ShowArchived,GetArchived()"
        class="waves-effect waves-light btn-floating lighten-2"
        :class="ShowArchived?'grey':'green'"
      >
        <i v-if="ShowArchived" class="material-icons left">visibility_off</i>
        <i v-else class="material-icons left">visibility</i>
      </a>
      <span v-if="ShowArchived">Hide archived</span>
      <span v-else>Show archived</span>
    </div>
    <div id="ArchivedContainer" v-if="ShowArchived">
      <div
        v-for="task in viewArchived"
        v-bind:key="task.id"
        class="row"
        :class="task.task_status.replace(' ','')"
      >
        <div class="col m2 s12">
          <span>
            <b>{{task.task_name}}</b>
          </span>
        </div>
        <div class="col m3 s12 tskDetails" v-html="task.task_description"></div>
        <div class="col m1 s12 truncate">
          <i>{{task.task_project}}</i>
        </div>
        <div class="col m1 s12">
          <div v-for="attach in task.task_attachement" v-bind:key="attach.id">
            <span id="Attachment_span" v-html="attach"></span>
          </div>
        </div>
        <div class="col m1 s12">
          <i>{{task.task_status}}</i>
        </div>
        <div class="col m1 s12">{{task.task_deadline}}</div>
        <div class="col m1 s12">{{task.task_FTE}}</div>
        <!-- icons   -->
        <div v-if="isLoggedIn" class="col m2 iconContainer">
          <div
            v-if="task.t_isPrivate"
            class="col tooltipped"
            data-position="top"
            data-tooltip="<span style='font-size:small'>Delete</span>"
          >
            <i @click="DeleteTask(task)" class="material-icons right DelIcn">delete_forever</i>
          </div>

          <div
            class="col tooltipped"
            data-position="top"
            data-tooltip="<span style='font-size:small'>Edit</span>"
          >
            <router-link v-bind:to="{name:'edit-task',params:{task_id:task.id}}">
              <i class="fas fa-edit"></i>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div id="modal2" class="modal">
      <div class="modal-content">
        <h3>Edit task</h3>
        <div class="row MyContainer" v-if="targetTask">
          <form class="col s12">
            <div class="row">
              <div class="input-field col s12">
                <input placeholder="Task name" type="text" v-model="targetTask.task_name" required />
                <label class="active">Name:</label>
              </div>
            </div>
            <!-- details -->
            <div class="row">
              <div class="input-field col s12">
                <label for="textarea1" class="active">Details:</label>
                <textarea
                  id="textarea1"
                  placeholder="Task details"
                  v-model="targetTask.task_description"
                />
              </div>
            </div>
            <!-- timings -->
            <div class="row">
              <div class="input-field col">
                <input
                  id="StartDate"
                  type="date"
                  placeholder="start date"
                  v-model="targetTask.task_start"
                />
                <label class="active">Start date:</label>
              </div>
              <div class="input-field col">
                <input
                  id="DeadLine"
                  type="date"
                  placeholder="Task deadline"
                  v-model="targetTask.task_deadline"
                />
                <label class="active">Deadline:</label>
              </div>

              <div id="FTAcontainer" v-if="targetTask.task_projectCategory!='Personal'">
                <!-- FTA estimated-->
                <span>
                  <span v-if="displayFTA" class="FTEcont">
                    <select
                      v-model="targetTask.task_FTE"
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
                      v-model="targetTask.hours"
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
                <!-- FTA used-->
                <span id="UsedFTE" class="FTEcont">
                  <span v-if="displayFTA">
                    <select
                      v-model="targetTask.task_usedFTE"
                      style="display:inline;width:70px"
                      @change="updateUsedFTE('fte')"
                    >
                      <option
                        v-for="fta in UsedFTAarray"
                        v-bind:key="fta.id"
                        v-bind:value="fta"
                      >{{fta}}</option>
                    </select>
                    <span>
                      <b>Used</b> FTE
                    </span>
                  </span>
                  <span v-else>
                    <select
                      v-model="targetTask.UsedHours"
                      style="display:inline;width:70px"
                      @change="updateUsedFTE('hours')"
                    >
                      <option
                        v-for="fta in UsedFTAarray.filter(itm=>itm!='TBD')"
                        v-bind:key="fta.id"
                        v-bind:value="fta*40"
                      >{{fta*40}}</option>
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
                    v-bind:class="{'mySingleSelected':targetTask.task_status==opt}"
                    class="mySingle chip"
                  >{{opt}}</span>
                </div>
              </div>
            </div>
            <!-- arhived -->
            <div class="row">
              <div class="input-field col s12">
                <select
                  required
                  style="display:block;width:70px;margin-top: 10px;"
                  v-model="targetTask.task_isActive"
                >
                  <option>Yes</option>
                  <option>No</option>
                </select>
                <label class="active">Is archived:</label>
                <span class="info">
                  By setting this to
                  <b>Yes</b> the task will be moved to archived category
                </span>
              </div>
            </div>
            <!-- Attachement -->
            <div class="row">
              <div class="input-field col s12">
                <label for="textarea1" class="active">Attachment:</label>

                <div v-for="attach in targetTask.task_attachement" v-bind:key="attach.id">
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
                  <b>{{targetTask.task_project}}</b> >
                  <b>{{targetTask.task_projectCategory}}</b>
                </span>
                <br />
                <span>
                  Task created by :
                  <b>{{targetTask.task_createdBy}}</b>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn black" @click="cancelUpdate()">Cancel</button>
        <button type="button" class="btn" @click="updateTask()">Save</button>
        <div class="left">
          <a @click="updateTask('Clone')" class="btn waves-effect waves-light deep-orange accent-3">
            <span class="right">
              <i class="material-icons">check</i>
              <i class="material-icons">filter_none</i>
            </span>
            Complete & extend |
          </a>
        </div>
      </div>
    </div>
    <!-- add new -->
    <div class="fixed-action-btn">
      <router-link to="/AddNew" class="btn-floating btn-large blue">
        <i class="fa fa-plus-square"></i>
      </router-link>
    </div>
    <!-- Modal Structure -->
    <modal
      :FTAarray="FTAarray"
      :UsedFTAarray="UsedFTAarray"
      :GotTarget="GotTarget"
      :targetTask="targetTask"
      infoType="UsedOnly"
      v-on:updateFTE="updateFTEs($event)"
      v-on:AddInfo="AddInfo($event)"
    ></modal>
  </div>
</template>

<script>
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";
import fireList from "./fireLists";
import modal from "./Modal";

var moment = require("moment");
export default {
  name: "dashboard",
  props: { isLoggedIn: Boolean },
  components: { modal },
  data() {
    return {
      // isLoggedIn: false,
      FTAarray: fireList.FTEList,
      UsedFTAarray: fireList.usedFTEArrList,

      nStatusesList: fireList.statusesList,
      nSelectedStatus: "In progress",

      ShowFTE: "estimated",
      // hours: this.targetTask.task_FTE * 4,
      // UsedHours:this.targetTask.task_usedFTE * 4,
      showDetails: false,
      showProject: true,
      showNewProj: false,
      showNewProjCat: false,
      detail_link: "",
      detail_title: "",
      task_attachement: [],
      SelectedProjCat: null,
      displayFTA: true,

      targetTask: null,

      Header: [
        { txt: "Task name", m: "m2", sby: "task_name", hasSort: true },
        { txt: "Description", m: "m3", sby: "task_description", hasSort: true },
        {
          txt: "Project",
          m: "m1 truncate",
          sby: "task_project",
          hasSort: true
        },
        { txt: "Attachment", m: "m1 truncate", sby: "", hasSort: false },
        { txt: "Status", m: "m1 truncate", sby: "task_status", hasSort: true },
        {
          txt: "Deadline",
          m: "m1 truncate",
          sby: "task_deadline",
          hasSort: true
        },
        { txt: "FTE", m: "m1 truncate", sby: "task_FTE", hasSort: true },
        { txt: "Quick actions", m: "m2 truncate", sby: "", hasSort: false }
      ],

      HSorted: "Deadline",
      SortBy: "task_deadline",
      SortASC: false,
      tasks_Active: [],
      tasks_Archived: [],
      hasDone: false,
      viewDone: null,
      GotTarget: false,

      hours: null,
      // tasks: this.tasks_Active,
      ShowCompleted: false,
      ShowArchived: false,
      gotActive: false,
      gotArchived: false,
      logData: []
    };
  },
  created() {
    //get active
    this.GetFireTask(true);
  },
  mounted() {
    //modal
    $(".modal").modal();
  },
  computed: {
    GetTotalFTE() {
      let total = {
        used: null,
        estim: null
      };
      this.viewActive.forEach(task => {
        // console.log(parseFloat(task.task_FTE));
        if (task.task_usedFTE != null) {
          total.used += parseFloat(task.task_usedFTE);
        }
        if (parseFloat(task.task_FTE) > 0) {
          total.estim += parseFloat(task.task_FTE);
        }
      });
      if (total.used != null) {
        total.used = total.used.toFixed(2);
      }
      if (total.estim != null) {
        total.estim = total.estim.toFixed(2);
      }

      return total;
    },
    viewActive() {
      return this.tasks_Active
        .filter(function(task) {
          return (
            ["In progress", "On hold", "Not started"].indexOf(
              task.task_status
            ) > -1
          );
        })
        .sort(this.sortMNG);
    },
    viewCompleted() {
      return this.tasks_Active
        .filter(function(task) {
          return (
            ["In progress", "On hold", "Not started"].indexOf(
              task.task_status
            ) == -1
          );
        })
        .sort(this.sortMNG);
    },

    viewArchived() {
      return this.tasks_Archived.sort(this.sortMNG);
    }
  },
  updated() {
    $(".tooltipped").tooltip();
  },
  methods: {
    AddInfo() {
      let updObj = {};
      updObj.tStatus = this.targetTask.newStatus;
      updObj.tFTEused = this.targetTask.task_usedFTE;

      if (this.targetTask.newStatus == "Completed") {
        updObj.tClosedDate = moment().format("YYYY-MM-DD");
      }

      RTDB.ref(
        "/USERS/" +
          firebase.auth().currentUser.uid +
          "/TASKS/" +
          this.targetTask.id +
          "/"
      ).update(updObj);

      // this.task_FTE= null
      // this.hours= null
    },
    updateFTEs(val) {
      this.targetTask.task_usedFTE = val;
    },
    EditTask(task) {
      this.targetTask = JSON.parse(JSON.stringify(task));
      this.targetTask.hours = this.targetTask.task_FTE * 40;
      this.targetTask.UsedHours = this.targetTask.task_usedFTE?this.targetTask.task_usedFTE * 40:null;
      this.targetTask.task_description = this.targetTask.task_description.replace(
        /<br\/>/g,
        "\n"
      );

      this.getCreatorLabel(this.targetTask.task_creatorUID);

      M.Modal.getInstance($("#modal2")).open();
      //remove old validations
      $("#StartDate,#DeadLine,.FTEcont select,#UsedFTE select").css(
        "border",
        "none"
      );
      // M.textareaAutoResize($('#textarea1'));
    },
    cancelUpdate() {
      M.Modal.getInstance($("#modal2")).close();
      this.targetTask = {};
    },
    updateTask(Action) {
      var CloneT = Action == "Clone";
      //validate end start times

      if (new Date($("#DeadLine").val()) < new Date($("#StartDate").val())) {
        M.toast({ html: `Start date should be sooner than Deadline` });
        $("#StartDate,#DeadLine").css("border", "solid red 1px");
        return false;
      }
      if (this.ShowFTE == "used" && this.targetTask.task_usedFTE == null) {
        M.toast({ html: `Used FTE should not be null` });
        $(".FTEcont select").css("border", "solid red 1px");
        return false;
      }
      if (CloneT) {
        if (
          this.targetTask.task_usedFTE == null ||
          this.targetTask.task_usedFTE == ""
        ) {
          M.toast({ html: `Used FTE should not be null` });
          $("#UsedFTE select").css("border", "solid red 1px");
          return false;
        }
        this.targetTask.task_status = "Completed";
      }
      RTDB.ref(
        "/USERS/" +
          firebase.auth().currentUser.uid +
          "/TASKS/" +
          this.targetTask.id +
          "/"
      )

        .update({
          tName: this.targetTask.task_name,
          tDescription: this.targetTask.task_description,
          tStart: this.targetTask.task_start,
          tDeadline: this.targetTask.task_deadline,
          tFTE: this.targetTask.task_FTE,
          tFTEused: this.targetTask.task_usedFTE
            ? this.targetTask.task_usedFTE
            : "",
          // tProject: this.targetTask.SelectedProj,
          // tProjCateg: this.targetTask.SelectedProjCat,
          tAttach: this.targetTask.task_attachement,
          tStatus: this.targetTask.task_status,

          // tOwner:this.SelectedOwner,
          // tEnvironment:this.task_env?this.task_env:"",
          ModifiedBy: firebase.auth().currentUser.uid,
          ModifiedDate: moment().format("YYYY-MM-DD HH:MM"),
          t_isActive: this.targetTask.task_isActive == "No"
        })
        .then(docRef => {
          console.log("task update done");
          if (!CloneT) {
            M.Modal.getInstance($("#modal2")).close();
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
          this.targetTask.id +
          "/"
      ).once("value", querySnapshot => {
        // Changes to the clone

        //extend timings with one week
        var TaskObj = querySnapshot.val();
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

            M.Modal.getInstance($("#modal2")).close();
            // debugger
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });
      });
    },
    getCreatorLabel(UID) {
      // console.log(UID)
      var objVue = this;
      RTDB.ref("/USERS/")
        .orderByKey()
        .equalTo(UID)
        .once("value", querySnapshot => {
          // console.log(querySnapshot.val());
          // debugger;
          objVue.targetTask.task_createdBy = querySnapshot.val()[UID].Label;
        });
    },
    AddHyperlink() {
      if (this.detail_link != "") {
        var title = this.detail_title ? this.detail_title : "Click here";
        //add https
        if (this.detail_link.indexOf("http") == -1) {
          this.detail_link = "https://" + this.detail_link;
        }
        this.targetTask.task_attachement.push(
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
      var index = this.targetTask.task_attachement.indexOf(attch);
      this.targetTask.task_attachement.splice(index, 1);
    },
    updateUsedFTE(type) {
      if (type == "fte") {
        this.targetTask.UsedHours = 40 * this.targetTask.task_usedFTE;
      } else {
        this.targetTask.task_usedFTE = (this.targetTask.UsedHours / 40).toFixed(
          2
        );
      }
    },
    updateFTE(type) {
      if (type == "fte") {
        this.targetTask.hours = 40 * this.targetTask.task_FTE;
      } else {
        this.targetTask.task_FTE = (this.targetTask.hours / 40).toFixed(2);
      }
    },
    GetFireTask(Active) {
      var UID = firebase.auth().currentUser.uid;
      var vueObj = this;

      RTDB.ref("/USERS/" + UID + "/TASKS/")
        .orderByChild("t_isActive")
        .equalTo(Active)
        .on("value", querySnapshot => {
          if (Active) {
            vueObj.tasks_Active = [];
          } else {
            vueObj.tasks_Archived = [];
          }
          const queryOBJ = querySnapshot.val();

          for (var prop in queryOBJ) {
            const data = {
              id: prop,
              task_name: queryOBJ[prop].tName,
              task_description: queryOBJ[prop].tDescription.replace(
                /\n/g,
                "<br/>"
              ),
              task_projectCategory: queryOBJ[prop].tProjCateg,
              task_project: queryOBJ[prop].tProject,
              task_attachement: queryOBJ[prop].tAttach
                ? queryOBJ[prop].tAttach
                : [],
              task_start: queryOBJ[prop].tStart,
              task_deadline: queryOBJ[prop].tDeadline,
              task_FTE: queryOBJ[prop].tFTE ? queryOBJ[prop].tFTE : "none",
              task_usedFTE: queryOBJ[prop].tFTEused
                ? queryOBJ[prop].tFTEused
                : null,
              task_status: queryOBJ[prop].tStatus,
              task_isActive: queryOBJ[prop].t_isActive ? "No" : "Yes",
              task_creatorUID: queryOBJ[prop].CreatedBy,
              t_isPrivate: queryOBJ[prop].tProjCateg == "Personal"
            };

            if (Active) {
              vueObj.tasks_Active.push(data);
            } else {
              vueObj.tasks_Archived.push(data);
            }
          }
          if (Active) {
            vueObj.gotActive = true;
          } else {
            vueObj.gotArchived = true;
          }
        });
    },
    StatusUpdateFTE(opt, anim) {
      this.targetTask.task_status = opt;

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

    sortMNG(a, b) {
      let res = this.SortASC ? 1 : -1;
      if (a[this.SortBy] > b[this.SortBy]) return res;
      if (a[this.SortBy] < b[this.SortBy]) return -res;
      return 0;
    },
    HeaderClick(itm) {
      // debugger;
      if (itm.hasSort) {
        if (this.SortBy == itm.sby) {
          this.SortASC = !this.SortASC;
        } else {
          this.HSorted = itm.txt;
          this.SortBy = itm.sby;
        }
      }
    },
    GetArchived() {
      if (!this.gotArchived) {
        this.GetFireTask(false);
      }
    },

    CloseTask(task) {
      RTDB.ref(
        "/USERS/" + firebase.auth().currentUser.uid + "/TASKS/" + task.id + "/"
      )
        .update({
          t_isActive: false
        })
        .then(stat => {
          $(".material-tooltip").removeAttr("style");
          console.log("update done");
        });
    },
    DeleteTask(task) {
      if (
        window.confirm(
          "The task: \n*** " +
            task.task_name +
            " ***\nwill be permanently deleted, are you sure?"
        )
      ) {
        RTDB.ref(
          "/USERS/" +
            firebase.auth().currentUser.uid +
            "/TASKS/" +
            task.id +
            "/"
        )
          .remove()
          .then(stat => {
            $(".material-tooltip").removeAttr("style");
          });
      }
    },
    CompleteTask(task) {
      if (task.task_projectCategory != "Personal") {
        this.targetTask = JSON.parse(JSON.stringify(task));
        this.hours = 40 * this.targetTask.task_usedFTE;
        this.GotTarget = true;
        this.targetTask.newStatus = "Completed";
        M.Modal.getInstance($("#modal1")).open();
      } else {
        this.targetTask = JSON.parse(JSON.stringify(task));
        this.targetTask.newStatus = "Completed";
        this.AddInfo();
      }
    },
    StartStop(task) {
      this.targetTask = JSON.parse(JSON.stringify(task));
      this.hours = 40 * this.targetTask.task_usedFTE;
      this.GotTarget = true;
      this.targetTask.newStatus =
        task.task_status == "In progress" ? "On hold" : "In progress";

      if (this.targetTask.newStatus != "In progress") {
        M.Modal.getInstance($("#modal1")).open();
      } else {
        RTDB.ref(
          "/USERS/" +
            firebase.auth().currentUser.uid +
            "/TASKS/" +
            task.id +
            "/"
        ).update({
          tStatus: this.targetTask.newStatus
        });
      }
    }
  }
};
</script>

<style scoped>
h6 {
  font-weight: 500;
}
#CompletedContainer {
  background: white;
}
.Inprogress {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #a0cfff;
  border-bottom: solid 1px lightgrey;
}
.Notstarted {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #bcaaa4;
  border-bottom: solid 1px lightgrey;
}
.Onhold {
  /* background: #d6e9fd !important; */
  border-left: solid 7px #ffc107;
  border-bottom: solid 1px lightgrey;
}
.Completed {
  opacity: 0.7;
  /* background: #cff1d0 !important; */
  border-left: solid 7px #69c56c;
  border-bottom: solid 1px lightgrey;
}

.Canceled {
  border-left: solid 7px lightgrey;
  border-bottom: solid 1px lightgrey;
}
.Canceled > div {
  text-decoration: line-through;
  opacity: 0.5;
}

.secondary-content {
  margin-right: 5px;
  float: right;
}
.row {
  margin-bottom: 5px !important;
  background-color: white !important;
}
.logTigle {
  color: teal;
}

.sidenav > li {
  padding: 5px;
  background: #ececec;
}
.iconContainer {
  float: right;
  text-align: right;
}
.fa-eye-slash {
  color: #8a4f3b;
}
.fa-edit {
  color: #00bcd4;
}

.fa-clipboard-check {
  color: #a5a5a5;
}
.fa-check {
  color: #a5a5a5;
}

.fa-stop-circle {
  color: #ff9800;
}
.fa-play-circle {
  color: #06d210;
}
.DelIcn {
  color: #ea1010;
}
.fas {
  opacity: 0.6;
}
.fas:hover {
  opacity: 1;
}
.tskDetails {
  display: block;
  overflow: hidden;
  word-break: break-word;
}
.myHeader {
  border-bottom: solid 2px black;
}
.truncate {
  padding-bottom: 3px;
}
.GraphContainer {
  margin-top: 30px;
  padding: 5px;
}

.clickable {
  cursor: pointer;
}
.sortedASC_false::before {
  content: "\2191";
  color: #024e4d;
  font-size: 20px;
  font-weight: bold;
}
.sortedASC_true::before {
  content: "\2193";
  color: #024e4d;
  font-size: 20px;
  font-weight: bold;
}
.tblRow:hover {
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.75);
}

.modal {
  top: 1% !important;
  max-height: unset;
  width: 80%;
  max-height: 95vh;
}
.mySingle {
  cursor: pointer;
}
.mySingleSelected {
  background: teal;
  color: white;
}
.NameEdit:hover {
  transform: scale(1.05);
  color: blue;
  text-decoration: underline;
  transition: all 50ms;
}
#TotalFTE {
  font-weight: bold;
  background-color: #dedede !important;
}
</style>

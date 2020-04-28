<template>
  <div id="app">
    <Navbar :isManager="isManager" :isLoggedIn="isLoggedIn"/>
    <div style="margin-top:10px">
      <router-view
        :tasksDashboard="tasksDashboard"
        :tasksMyActive="tasksMyActive"
        :chartData="chartData"
        :isLoggedIn="isLoggedIn"
        :isManager="isManager"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
// import db from "./components/firebaseInit";
import firebase from "firebase";
import RTDB from "./components/firebaseInitRTDB";
import EventBus from "./eventBus";

export default {
  name: "App",
  components: { Navbar},
  data() {
    return {
      isLoggedIn: false,
      isManager: false,
      userEmail: "",
      LogedUser:null,
      hasDone: false,
      viewDone: null,
      tasksDashboard: [],
      tasksAllview: [],
      tasksMyActive: [],
      logData: [],
      chartData: [],
      scrollTop:1,
      emailMap:{},
    };
  },
  mounted() {    
     
    if (firebase.auth().currentUser) {
      // this.LogedUser=
      
      this.isLoggedIn = true;
      var vueObj = this;
      var UID = firebase.auth().currentUser.uid;
      // SET manager
      RTDB.ref("/USERS/")
        .orderByKey()
        .equalTo(UID)
        .once("value", querySnapshot => {
          if (
            querySnapshot.val()[UID].isManager ||
            firebase.auth().currentUser.email == "ciprian.ciresaru@ipsos.com"
          ) {
            vueObj.isManager = true;
          }
        });
      //get user emails
      RTDB.ref("/LISTS/EmailMap")
        .orderByKey()
        .once("value", querySnapshot => {
          this.emailMap=querySnapshot.val()
        });
    }
  },
  created(){
    EventBus.$on("sendEmail",(data,moveToNextPage)=>{
      this.sendEmail(data,moveToNextPage);
		})
  }, 
  methods: {
    async sendEmail (
      data={
        "mailto":["alexandru.popescu@ipsos.com"],
        "mailBody":"Placeholder mail body",
        "emailSubject":"Placeholder mail subject",
        "mailCC":["alexandru.popescu@ipsos.com"]
      }, moveToNextPage=true){
      

      let options = {
          method: 'POST',
          headers: new Headers({'content-type': 'application/json'}),
          // mode: 'no-cors'
      };
      options.body = JSON.stringify(data);
      let response  = await fetch('http://comp.ipsosinteractive.com/api/sendmail', options)
      .catch((error) => {
        console.log('Error:', error.message);        
        M.toast({ html: error.message});
        this.$router.push({ name: this.$route.query.mnext });
        return "{\"error\":"+error.message+"}";
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((responseJson) => {
        console.log(responseJson);
        M.toast({ html: responseJson.emailResult});
        if (moveToNextPage)
          this.$router.push({ name: this.$route.query.mnext });
      })
    },
    SetGraphic() {
      this.chartData = [];

      var C_inProgress = 0;
      var C_OnHold = 0;
      var C_NotStarted = 0;
      var C_Complete = 0;

      this.tasksDashboard.forEach(task => {
        if (task.task_inProgress) {
          C_inProgress++;
        }
        if (task.task_notStarted) {
          C_NotStarted++;
        }
        if (task.task_onHold) {
          C_OnHold++;
        }
        if (task.task_completed) {
          C_Complete++;
        }

      });
      this.chartData.push(["Not started", C_NotStarted]);
      this.chartData.push(["In progress", C_inProgress]);
      this.chartData.push(["On hold", C_OnHold]);
      this.chartData.push(["Completed", C_Complete]);

    }
  }
};
</script>
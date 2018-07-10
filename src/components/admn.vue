    <template>
    <div id="edit-task" class="container">
        <H1>Admin area</H1>

        <button type="button" @click="runF1" class="btn">Run f1</button>
        <button v-if="GotUsers >= tasks.length && tasks.length>0" type="button" @click="runF2" class="btn blue">Run f2</button>
    </div>        
    </template>
      
    <script>
import db from "./firebaseInit";
import firebase from "firebase";
var moment = require("moment");

export default {
  name: "AdminDashboard",
  data() {
    return {
      tasks: [],
      UsersAndArrays: [],
      GotUsers:0
  }},
  methods: {
    runF1(){
      this.GetFire_users()
    },

    GetFire_users() {
      var objVue = this;
      db
        .collection("Users")  
        // .where("isManager","==",true)      
        .get()
        .then(doc => {
          doc.forEach(LstItem => {
            
            const data = {
              OBJ: {
                name: LstItem.data().Label,
                // tasks: [],
                isOwner:LstItem.data().isOwner,
                isManager:LstItem.data().isManager,
                UID:LstItem.id
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

          this.UsersAndArrays.forEach(user=>{
            objVue.getTasksForUsers(user.OBJ.UID)            
          })

        });
    },
    getTasksForUsers(userID){
      var objVue = this;

      db
        .collection(userID)
        .get()
        .then(querySnapshot => {
          
          const data={
            UID:userID,
            tasks:[]
          }
          querySnapshot.forEach(task =>{
            data.tasks.push(task.data())
          })

          objVue.tasks.push(data)

          objVue.GotUsers++;
          // if (objVue.GotUsers >= objVue.tasks.length) {
          //  // objVue.exportDB(objVue.tasks);
          //  alert("done")
          // }

        })


    },
    exportDB(myObject){
      function downloadTextFile(text, name) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL( new Blob([text], { type:`text/${name.split(".").pop()}` }) );
        a.download = name;
        a.click();
      }
      downloadTextFile(JSON.stringify(myObject), 'dbBKP_'+moment().format("YYYY_MM_DD_HH-SS")+'.json');
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
      db
        .collection(OBJ.UID)   
        .get()     
        .then(querySnapshot => {
          // reset
          OBJ.tasks = [];          

          querySnapshot.forEach(doc => {
            db.collection(OBJ.UID).doc(doc.id).update({isPrivate:false})
              //  OBJ.tasks.push(doc.data());
               //update


         
          });
          // call next function
          // console.log(OBJ.UID+" done")
        });
    },
    runF1s() {
      var vueobj=this.tasks
      db
        .collection("YqRVNtuUu3aAHt6g2YW05OxIsj42")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            //console.log(docs)
            // doc.data() is never undefined for query doc snapshots
            // doc.set({t_isActive: true},{ merge: true })
           vueobj.push(doc.data())
          });
        })  
        .then(function(){console.log("runF1 done")})      
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    },
    runF2() {
        // var objVue=this.tasks

        this.exportDB(this.tasks);
        
       
    }
  }
};
</script>
      
      
<style>

</style>
      
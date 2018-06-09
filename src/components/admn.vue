    <template>
    <div id="edit-task" class="container">
        <H1>Admin area</H1>

        <button type="button" @click="runF1" class="btn">Run f1</button>
        <button type="button" @click="runF2" class="btn blue">Run f2</button>
    </div>        
    </template>
      
    <script>
import db from "./firebaseInit";
import firebase from "firebase";
export default {
  name: "AdminDashboard",
  data() {
    return {
      tasks: []
  }},
  methods: {
    runF1() {
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
        var vueobj=this.tasks
        
        vueobj.forEach(function(tsk){
              db
                .collection("UserTasks/tasks/YqRVNtuUu3aAHt6g2YW05OxIsj42")
                .add(tsk)
                .then(function(){console.log("runF2 done")})
        })
        
    }
  }
};
</script>
      
      
<style>

</style>
      
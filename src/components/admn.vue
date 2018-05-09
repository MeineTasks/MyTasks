    <template>
    <div id="edit-task" class="container">
        <H1>Admin area</H1>

        <button type="button" @click="updateTask" class="btn">Update Task</button>
    </div>        
    </template>
      
    <script>
import db from "./firebaseInit";
import firebase from "firebase";
export default {
  name: "AdminDashboard",
  methods: {
    updateTask() {
      db
        .collection(firebase.auth().currentUser.uid)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(docs) {
            //console.log(docs)
            // doc.data() is never undefined for query doc snapshots
            // doc.set({t_isActive: true},{ merge: true })
            db
              .collection(firebase.auth().currentUser.uid)
              .doc(docs.id)
              .set({ t_isActive: true }, { merge: true });
          });
        })
        .then(docRef => {
            console.log("all done")
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });
    }
  }
};
</script>
      
      
<style>

</style>
      
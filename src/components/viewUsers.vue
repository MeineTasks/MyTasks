<template>
    
</template>

<script>
import db from "./firebaseInit";
import firebase from "firebase";
import fireList from "./fireLists";

export default {
  name: "userview",
  data() {
    return {
      users: fireList.OwnersList,
      tasks: {}
    };
  },
  mounted() {
    var vueObj = this;
    vueObj.users.forEach(user => {     
        vueObj.tasks[user.UID] = [];
        console.log(user.UID)
    //get tasks
        db
          .collection(user.UID)
          .where("t_isActive", "==", true)
          .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
              vueObj.tasks[user.UID].push(doc.id);
            });
          });

    })
  },
  methods: {
    AddTasksToUsers() {
     
    }
  }
};
</script>

<style scoped>
</style>

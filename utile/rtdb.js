RTDB.ref("/USERS/" + UID + "/TASKS/" + TAKSID + "/")
  // FILTER
  .orderByChild("isManager")
  .equalTo(true)

  //  READ DATA
  .on("value", querySnapshot => {
    console.log("got data");
    const queryOBJ = querySnapshot.val();
    for (var prop in queryOBJ) {
      var tskCalculated = taskCalculated(queryOBJ[prop].tDeadline);

      // console.log(queryOBJ[prop].tName);
      const data = {
        id: prop,
        task_name: queryOBJ[prop].tName
      };
    }
  })

  .once("value", querySnapshot => {
    console.log("got data");
  });
// UPDATE DATA
REF.set(TasksArr).then(ceva => {
  vueObj.showNewProj = false;
  console.log("done");
});

REF.update({ [vueObj.AddNewProjCat]: { 0: "" } })
  .then(function() {
    vueObj.showNewProjCat = false;
  })
  .catch(err => {
    console.log(err);
  });

// ADD data
REF.push({ A: b })
  .then(function() {
    vueObj.showNewProj = false;
  })
  .catch(err => {
    console.log(err);
  });

// DELETE DATA
REF.remove().then(function() {
  // vueObj.$router.push("/view/projcat");
  vueObj.$router.push({ name: vueObj.$route.query.mnext });
});
// ********* object
delete TasksArr[
  Object.keys(TasksArr).find(key => TasksArr[key] === vueObj.AddNewProj)
];

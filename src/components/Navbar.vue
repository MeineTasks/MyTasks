<template>
<div>
  <nav>
    <div class="nav-wrapper brown lighten-1 row">
        <span v-if="isLoggedIn" style="margin-left:20px" class="brand-logo left hide-on-small-only"> 
          <i class="large material-icons tooltipped" style="color:#8bbf8b"  data-position="right" v-bind:data-tooltip="currentUser">account_circle</i>
          <a v-if="isLoggedIn"><button v-on:click="logout" class="btn black">Logout</button></a>
        </span>
        <!-- small screen only -->
        <a class="dropdown-trigger right col s12 hide-on-med-and-up	" href="#!" data-target="dropdown1">Select View<i class="material-icons right">arrow_drop_down</i></a>
        <!-- large screens -->
        <ul class="hide-on-small-only right">
          <li v-if="isLoggedIn"><router-link to="/">My Dashboard</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/view/all">My All</router-link></li>  
          <li v-if="isLoggedIn"><router-link to="/view/cols">My Active</router-link></li>  
          <li v-if="isLoggedIn"><router-link to="/view/gantt">My Gantt</router-link></li>  
          
          <li v-if="isLoggedIn"><router-link to="/view/users">View Users </router-link></li>  
          <li v-if="isLoggedIn"><router-link to="/view/projcat">View Projects </router-link></li>

          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <!-- <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>         -->
        </ul>
    </div>
  </nav>
      <ul id="dropdown1" class="dropdown-content">
        <li v-if="isLoggedIn"><router-link to="/">My Dashboard</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/view/all">My All</router-link></li>  
        <li v-if="isLoggedIn"><router-link to="/view/cols">My Active</router-link></li>  
        <li v-if="isLoggedIn"><router-link to="/view/gantt">My Gantt</router-link></li>  
        
        <li v-if="isLoggedIn"><router-link to="/view/users">View Users </router-link></li>  
        <li v-if="isLoggedIn"><router-link to="/view/projcat">View Projects </router-link></li>

        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <!-- <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>         -->
      </ul>
  </div>    
</template>

<script>
import firebase from 'firebase';
import db from "./firebaseInit";

export default {
  name: 'navbar',
  data() {
    return {
      isLoggedIn: false,
      currentUser: false,
      isMng:false
    };
  },
  created() {
    if (firebase.auth().currentUser) {      
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
      db
      .collection("Users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(doc => {
        if(doc.data().isManager){this.isMng=true}
      })
    }
  },
   mounted() {     
    $('.tooltipped').tooltip();
    $(".dropdown-trigger").dropdown();
    //  if (!(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) || /opr/.test(navigator.userAgent.toLowerCase())) {
    //     $('body').html("<center>The application was designed for Google Chrome</center>");
    //     alert("== Please use Chrome to open this page ==");
    // }
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
           this.$router.go({ path: this.$router.path });
        });
    }
  }
};
</script>
<style>
.router-link-exact-active {
  background: #6e7686
}
</style>

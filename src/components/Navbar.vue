<template>
<div>
  <nav>
    <div class="nav-wrapper grey darken-3 row">
        <span v-if="isLoggedIn" style="margin-left:20px" class="brand-logo left hide-on-small-only"> 
          <i class="large material-icons tooltipped" style="padding-top: 4px;color:#8bbf8b;cursor: help;"  data-position="bottom" v-bind:data-tooltip="currentUser">account_circle</i>
          <a v-if="isLoggedIn">
            <button v-on:click="logout" class="btn-flat white-text">Logout</button></a>
          
            <a href="http://kb.ipsosinteractive.com/Compentence_Stuff/%5BCompetence_Internal%5D_Meinetasks_App" target="_blank" class="material-icons blue-text text-lighten-3">help_outline</a>

            
        </span>
        <!-- small screen only -->
        <a class="dropdown-trigger right col s12 hide-on-med-and-up	" href="#!" data-target="dropdown1">Select View<i class="material-icons right">arrow_drop_down</i></a>
        <!-- large screens -->
        <ul class="hide-on-small-only right">
          <li v-if="isLoggedIn"><router-link class="link" to="/">My Dashboard</router-link></li>
          <li v-if="isLoggedIn"><router-link class="link" to="/view/all">My All</router-link></li>  
          <li v-if="isLoggedIn"><router-link class="link" to="/view/cols">My Active</router-link></li>
          <li v-if="isLoggedIn"><router-link class="link" to="/backlog">Backlog</router-link></li>  
          <!-- <li v-if="isLoggedIn"><router-link class="link" to="/view/gantt">My Gantt</router-link></li>   -->
          
          <li v-if="isLoggedIn"><router-link class="link" to="/view/users">View Users </router-link></li>  
          <li v-if="isLoggedIn"><router-link class="link" to="/view/projcat">View Projects </router-link></li>
          <li v-if="isLoggedIn && isManager"><router-link class="link" to="/admn">Admin</router-link></li>

          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <!-- <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>         -->
        </ul>
    </div>
  </nav>
      <ul id="dropdown1" class="dropdown-content">
        <li v-if="isLoggedIn"><router-link to="/">My Dashboard</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/view/all">My All</router-link></li>  
        <li v-if="isLoggedIn"><router-link to="/view/cols">My Active</router-link></li>  
        <li v-if="isLoggedIn"><router-link to="/backlog">Backlog</router-link></li>  
        
        
        <li v-if="isLoggedIn"><router-link to="/view/users">View Users </router-link></li>  
        <li v-if="isLoggedIn"><router-link to="/view/projcat">View Projects </router-link></li>

        <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
        <!-- <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>         -->
      </ul>
  </div>    
</template>

<script>
import firebase from "firebase";
import RTDB from "./firebaseInitRTDB";

export default {
  name: "navbar",
  props: { isManager: Boolean, isLoggedIn: Boolean },
  data() {
    return {
      currentUser: ""
    };
  },
  created() {    
    if (firebase.auth().currentUser) {
      this.currentUser = firebase.auth().currentUser.email;
    }
  },
  mounted() {
    $(".tooltipped").tooltip();
    $(".dropdown-trigger").dropdown();
    //  if (!(/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) || /opr/.test(navigator.userAgent.toLowerCase())) {
    if (/trident/.test(navigator.userAgent.toLowerCase())) {
      $("body").html(
        "<center>The application was designed for Google Chrome</center>"
      );
      alert("== Please use Chrome to open this page ==");
    }
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
  background: #3eb0ae;
}
.tooltipped {
  cursor: help;
}
.material-icons {
  cursor: pointer;
}
.fas {
  cursor: pointer;
}
.link:hover {
  background-color: #8e8e8e;
}
</style>

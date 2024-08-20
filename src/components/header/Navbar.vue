<template>
  <div id="b-navbar">
    <div class="container">


      <b-navbar toggleable="lg" type="dark" variant="primary" id="b-navbar" class="justify-content-start">
        <b-container fluid>
          <b-row>
            <b-col>
              <b-navbar-brand href="#">
                <img src="../../assets/logo.svg" alt="Logo" style="height: 3rem;">
              </b-navbar-brand>
            </b-col>
            <!-- Diğer navbar içeriği buraya gelecek -->
          </b-row>
        </b-container>

        <b-collapse id="nav-collapse" is-nav>
          <b-container fluid>
            <b-row class="ml-auto">
              <b-col>
                <b-button id="btn-logout" v-if="!isLoginRoute" @click="logout">Logout</b-button>
              </b-col>
            </b-row>
          </b-container>
        </b-collapse>
      </b-navbar>
    </div>
  </div>
</template>

<script>
import { Api } from "../../helpers/Api/apiConfig.js";
export default {
  data() {
    return {
      isLoginRoute: false
    };
  },
  watch: {
    '$route'() {
      this.checkRoute();
    }
  },
  mounted() {
    this.checkRoute();
  },
  methods: {
    async logout() {


      await Api("POST", "/user/logout", {

      })
        .then((response) => {
          // console.log(response.data);
          if (response.data.ApiStatusCode == "200") {
            localStorage.clear();
            this.$router.push('/login');
          } else {
            // console.log(
            //   response.data.ApiStatusMessage === ""
            //     ? "Error! Please Check Your Information Again"
            //     : response.data.ApiStatusMessage
            // );
          }
        })
        .catch((error) => {
          console.log(error);
        });





    },
    checkRoute() {
      this.isLoginRoute = this.$route.name === 'login';
    }
  }
};
</script>

<style>
.justify-content-start {
  justify-content: flex-start;
}

.navbar-collapse {
  justify-content: flex-end;
}

#b-navbar {
  background-color: #13003B !important;
}

#btn-logout {
  background-color: #13003B !important;
}
</style>
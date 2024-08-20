<template>
  <div>
    <b-card class="login-card mb-2" :img-src="require('../../assets/logo.svg')" img-alt="Image" img-top tag="article"
      style="max-width: 20rem">
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group id="input-group-1" label-for="input-1" :state="apiError && !emailState ? false : null"
          :invalid-feedback="apiError && !emailState ? 'Please enter a valid email address' : ''">
          <b-form-input id="input-1" v-model="form.email" type="email" placeholder="Enter email" required
            :state="apiError && !emailState ? false : null"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label-for="input-2" class="mt-3"
          :state="apiError && !passwordState ? false : null"
          :invalid-feedback="apiError && !passwordState ? 'Password must be at least 8 characters long' : ''">
          <b-form-input id="input-2" v-model="form.password" placeholder="Enter password" required type="password"
            :state="apiError && !passwordState ? false : null"></b-form-input>
        </b-form-group>

        <div v-if="errorMessage" class="text-danger text-center mb-2">{{ errorMessage }}</div>

        <b-button type="submit" :disabled="isLoading" class="mt-3 w-100" variant="outline-primary">
          <b-spinner small v-if="isLoading"></b-spinner>
          {{ isLoading ? "Logging in..." : "Login" }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import { Api } from "../../helpers/Api/apiConfig.js";

export default {
  data() {
    return {
      isLoading: false,
      errorMessage: "",
      apiError: false, // Track API error to show validation messages
      form: {
        email: "homework@eva.guru",
        password: "Homeworkeva1**",
      },
      show: true,
    };
  },
  computed: {
    emailState() {
      // Simple email validation
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
      return re.test(this.form.email);
    },
    passwordState() {
      // Simple password validation (at least 8 characters)
      return this.form.password.length >= 8;
    },
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.apiError = false; // Reset API error before each submit

      this.Login();
    },
    async Login() {
      this.isLoading = true;
      this.errorMessage = "";
      await Api("POST", "/oauth/token", {
        Email: this.form.email,
        Password: this.form.password,
        GrantType: "password",
        Scope: "amazon_data",
        ClientId: "C0001",
        ClientSecret: "SECRET0001",
        RedirectUri: "https://api.eva.guru",
      })
        .then((response) => {
          // console.log(response.data);
          if (response.data.ApiStatusCode == "200") {


            localStorage.setItem("AccessToken", response.data.Data.AccessToken);
            localStorage.setItem(
              "RefreshToken",
              response.data.Data.RefreshToken
            );
            this.$store.dispatch("User/login", { email: this.form.email });
          } else {
            // console.log(
            //   response.data.ApiStatusMessage === ""
            //     ? "Error! Please Check Your Information Again"
            //     : response.data.ApiStatusMessage
            // );
            this.apiError = true;
            this.errorMessage =
              response.data.ApiStatusMessage || "Error! Please check your information again.";
          }
        })
        .catch((error) => {
          console.log(error);
          this.apiError = true;
          this.errorMessage = "An error occurred. Please try again.";
        });
      this.isLoading = localStorage.getItem("userData") ? true : false;
    },
  },
};
</script>

<style scoped>
.card-img,
.card-img-top,
.card-img-bottom {
  width: 25%;
  margin: auto;
  padding-top: 10px;
}

.login-card {
  background-color: #13003b;
  display: flex;
  justify-content: center;
  height: 276px;
  padding: 10px;
  border-radius: 30px;
  margin: auto;
  max-width: 26rem !important;
  margin-top: 10%;
}
</style>

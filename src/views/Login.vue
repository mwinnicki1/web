<template>
  <div id="login">
    <b-form class="form">
      <h1>Logowanie</h1>
      <b-form-input class="input" type="email" v-model="login" required placeholder="email" />
      <b-form-input
        class="input"
        type="password"
        v-model="password"
        required
        placeholder="password"
      />
      <b-button class="button" variant="primary" @click="signIn">Zaloguj</b-button>
    </b-form>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "login",
  components: {},
  data: () => {
    return {
      login: "",
      password: ""
    };
  },
  methods: {
    async signIn() {
      if (this.login.length === 0) {
        this.$bvToast.toast(`Podaj email.`, {
          title: "Logowanie użytkownika.",
          autoHideDelay: 5000
        });
        return;
      }
      if (this.password.length === 0) {
        this.$bvToast.toast(`Podaj email.`, {
          title: "Logowanie użytkownika.",
          autoHideDelay: 5000
        });
        return;
      }
      const response = await this.$api.post(`login`, {
        email: this.login,
        password: this.password
      });
      const data = response.data;
      if (data.item) {
        this.$store.dispatch("login", { email: this.login });
        this.$router.push("/home");
      } else {
        this.$bvToast.toast("Niepoprawny email lub hasło", {
          title: "Logowanie użytkownika.",
          autoHideDelay: 5000,
          appendToast: true
        });
      }
      if (data.error) {
        const error = data.error;
        if (error.original)
          this.$bvToast.toast(error.original.detail, {
            title: "Logowanie użytkownika.",
            autoHideDelay: 5000,
            appendToast: true
          });
        if (error.errors.length) {
          let description = "";
          description = error.errors.map(error => error.path).join(", ");
          this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
            title: "Logowanie użytkownika.",
            autoHideDelay: 5000,
            appendToast: true
          });
        }
      }
    }
  }
};
</script>
<style scoped>
#login {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  display: flex;
  flex-direction: column;
}
.input {
  margin-bottom: 10px;
}
.button {
  align-self: flex-end;
}
</style>

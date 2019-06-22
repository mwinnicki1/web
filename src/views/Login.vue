<template>
  <div id="login">
    <b-form class="form">
      <h1>Logowanie</h1>
      <b-form-input class="input" type="email" v-model="email" required placeholder="email"/>
      <b-form-input
        class="input"
        type="password"
        v-model="password"
        required
        placeholder="password"
      />
      <b-button class="button" variant="primary" href="visit">Zaloguj</b-button>
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

<template>
  <div id="user">
    <div>
      <h1>Dodaj użytkownika</h1>
      <div class="inputs">
        <b-form-input placeholder="Podaj login" type="text" class="col-12"></b-form-input>
        <b-form-input placeholder="Podaj hasło" type="password"></b-form-input>
        <b-form-input placeholder="Powtórz hasło" type="password"></b-form-input>
      </div>
      <div class="button-container">
        <b-button variant="outline-primary" href="home">Powrót</b-button>
        <b-button variant="primary" href="home">Rejestruj</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user",
  components: {},
  data: () => {
    return {};
  },
  methods: {}
};
</script>
<style scoped>
#user {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.inputs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px 0px;
}
.form-control {
  margin: 4px 0px;
}
.button-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 0px;
}
.btn{
    margin-left: 10px;
}
</style>

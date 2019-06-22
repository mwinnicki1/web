<template>
  <div id="app">
    <b-navbar type="dark" variant="info">
      <b-navbar-brand href="/">MyDoctor</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template slot="button-content">
              <em>User</em>
            </template>
            <b-dropdown-item href="#">Profil</b-dropdown-item>
            <b-dropdown-item href="#">Wyloguj</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
    <div class="footer">
      © 2018 Copyright: Szymon Zimny i Miłosz Winnicki
      </div>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: "app",
  components: {},
};
</script>
<style scoped>
#app{
}
.footer {
  padding: 20px;
  display: flex;
  justify-content: center;
  color:white;
  background-color: #18a2b8;
}
</style>

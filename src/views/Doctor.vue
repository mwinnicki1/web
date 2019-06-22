<template>
  <div id="doctor">
    <h1>Lekarze</h1>
    <div class="searchBar">
      <b-button variant="primary" :disabled="!!selected" @click="add">Dodaj</b-button>
      <b-button variant="secondary" :disabled="!selected" @click="edit">Edytuj</b-button>
      <b-button variant="danger" :disabled="!selected" @click="remove">Usuń</b-button>
    </div>
    <!-- <div class="searchBar">
      <b-form-input v-model="selectedNumber" placeholder="Podaj numer" type="number" class="col-3"></b-form-input>
      <b-form-input v-model="selectedFirstname" placeholder="Podaj imię" type="text" class="col-3"></b-form-input>
      <b-form-input
        v-model="selectedLastname"
        placeholder="Podaj nazwisko"
        type="text"
        class="col-3"
      ></b-form-input>
      <b-form-input
        v-model="selectedSpecialization"
        placeholder="Podaj specjalizację"
        type="text"
        class="col-3"
      ></b-form-input>
    </div>-->
      <b-table
        ref="table"
        selectable
        select-mode="single"
        @row-selected="select"
        striped
        hover
        small
        fixed
        :items="items"
        :fields="fields"
        show-empty
      ></b-table>
      <b-pagination
        v-model="page"
        :total-rows="totalPage"
        per-page="1"
        class="my-0"
        @change="changePage"
      ></b-pagination>
    <b-modal
      ref="edit"
      :title="selected !== null ? 'Edycja doktora':'Dodaj doktora'"
      centered
      @ok="ok"
      @cancel="cancel"
    >
      <b-form-input v-model="editNumber" placeholder="Podaj numer" type="number"></b-form-input>
      <b-form-input v-model="editFirstname" placeholder="Podaj imię" type="text"></b-form-input>
      <b-form-input v-model="editLastname" placeholder="Podaj nazwisko" type="text"></b-form-input>
      <b-form-input v-model="editSpecialization" placeholder="Podaj specjalizację" type="text"></b-form-input>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "doctor",
  components: {},
  data: () => {
    return {
      fields: {
        numberPwz: {
          id: 1,
          label: "Numer PWZ",
          sortable: true
        },
        firstname: {
          id: 2,
          label: "Imię",
          sortable: true
        },
        lastname: {
          id: 3,
          label: "Nazwisko",
          sortable: true
        },
        specialization: {
          id: 4,
          label: "Specjalizacja",
          sortable: true
        }
      },
      items: [
        {
          numberPwz: "1234567",
          firstname: "Janusz",
          lastname: "Nowak",
          specialization: "interna"
        },
        {
          numberPwz: "1334567",
          firstname: "Jan",
          lastname: "Kowalski",
          specialization: "urolog"
        }
      ],
      selectedNumber: null,
      selectedFirstname: "",
      selectedLastname: "",
      selectedSpecialization: "",
      editNumber: 0,
      editFirstname: "",
      editLastname: "",
      editSpecialization: "",
      selected: null,
      page: 1,
      totalPage: 10
    };
  },
  methods: {
    select(items) {
      this.selected = items[0];
    },
    remove() {
      const { firstname, lastname, numberPwz } = this.selected;
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć pana doktora ${firstname} ${lastname} o numerze PWZ ${numberPwz} ?`,
          {
            title: "Usuwanie lekarza",
            size: "sm",
            buttonSize: "sm",
            okVariant: "secondary",
            cancelVariant: "primary",
            okTitle: "Usuń",
            cancelTitle: "Nie",
            footerClass: "p-2",
            hideHeaderClose: true,
            centered: true
          }
        )
        .then(value => {
          if (value) {
            const index = this.items.findIndex(item => item === this.selected);
            if (index > -1) this.items.splice(index, 1);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit() {
      const { numberPwz, firstname, lastname, specialization } = this.selected;
      this.editNumber = numberPwz;
      this.editFirstname = firstname;
      this.editLastname = lastname;
      this.editSpecialization = specialization;
      this.$refs["edit"].show();
    },
    add() {
      this.$refs["edit"].show();
    },
    cancel() {
      this.selected = null;
      this.editNumber = null;
      this.editFirstname = "";
      this.editLastname = "";
      this.editSpecialization = "";
    },
    ok() {
      if (this.selected) {
        const index = this.items.findIndex(item => item === this.selected);
        this.items[index].numberPwz = this.editNumber;
        this.items[index].firstname = this.editFirstname;
        this.items[index].lastname = this.editLastname;
        this.items[index].specialization = this.editSpecialization;
      } else {
        this.items.push({
          numberPwz: this.editNumber,
          firstname: this.editFirstname,
          lastname: this.editLastname,
          specialization: this.editSpecialization
        });
      }
      this.$refs.table.clearSelected();
      this.selected = null;
      this.editNumber = null;
      this.editFirstname = "";
      this.editLastname = "";
      this.editSpecialization = "";
    },
    changePage(id) {
      var router = "/doctor";
      if (id > 1) router += "/" + id;
      this.$router.push(router);
      this.loadDoctors();
    },
    async loadDoctors() {
      this.loading = true;
      this.page = this.$route.params.id;
      if (this.page === undefined) this.page = 1;
      this.$api
        .get(`doctors/${this.page - 1}`)
        .then(response => {
          const { count, rows } = response.data;
          this.items = rows;
          this.totalPage = (count / 100).toFixed(0);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    }
  },
  created() {
    this.loadDoctors();
  }
};
</script>
<style scoped>
#doctor {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.searchBar {
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 5px 0px;
}
.button-container {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  padding-right: 0px;
}
</style>

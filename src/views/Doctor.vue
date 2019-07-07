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
      :title="selected !== null ? 'Edycja doktora':'Dodaj doktora'"
      centered
      @ok="ok"
      @cancel="cancel"
      no-close-on-backdrop
      no-close-on-esc
      v-model="visible"
    >
      <b-form-input
        v-model="editNumber"
        placeholder="Podaj numer"
        type="number"
        :state="validationNumber"
        required
      ></b-form-input>
      <b-form-input
        v-model="editFirstname"
        placeholder="Podaj imię"
        type="text"
        :state="validationFirstname"
        required
      ></b-form-input>
      <b-form-input
        v-model="editLastname"
        placeholder="Podaj nazwisko"
        type="text"
        :state="validationLastname"
        required
      ></b-form-input>
      <b-form-input
        v-model="editSpecialization"
        placeholder="Podaj specjalizację"
        type="text"
        :state="validationSpecialization"
        required
      ></b-form-input>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "doctor",
  components: {},
  computed: {
    validationNumber() {
      return this.editNumber.length === 7 ? true : false;
    },
    validationFirstname() {
      return this.editFirstname.length > 0 ? true : false;
    },
    validationLastname() {
      return this.editLastname.length > 0 ? true : false;
    },
    validationSpecialization() {
      return this.editSpecialization.length > 0 ? true : false;
    }
  },
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
      editNumber: "",
      editFirstname: "",
      editLastname: "",
      editSpecialization: "",
      selected: null,
      page: 1,
      totalPage: 10,
      visible: false
    };
  },
  methods: {
    select(items) {
      this.selected = items[0];
    },
    remove() {
      const { firstname, lastname, numberPwz, id } = this.selected;
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
        .then(async () => {
          const response = await this.$api.delete(`doctor/remove/${id}`);
          const data = response.data;
          if (data.item) {
            this.$bvToast.toast("Usunięto dane.", {
              title: "Usuwanie lekarza.",
              autoHideDelay: 5000
            });
          }
          if (data.error) {
            const error = data.error;
            if (error.original)
              this.$bvToast.toast(error.original.detail, {
                title: "Usuwanie lekarza.",
                autoHideDelay: 5000,
                appendToast: true
              });
            if (error.errors.length) {
              let description = "";
              description = error.errors.map(error => error.path).join(", ");
              this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
                title: "Usuwanie lekarza.",
                autoHideDelay: 5000,
                appendToast: true
              });
            }
          }
          this.loadDoctors();
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
      this.visible = true;
    },
    add() {
      this.visible = true;
    },
    cancel() {
      this.selected = null;
      this.editNumber = "";
      this.editFirstname = "";
      this.editLastname = "";
      this.editSpecialization = "";
    },
    async ok() {
      if (
        !this.validationNumber ||
        !this.validationFirstname ||
        !this.validationLastname ||
        !this.validationSpecialization
      )
        return;

      if (this.selected) {
        const index = this.items.findIndex(item => item === this.selected);
        const response = await this.$api.post(`doctor/edit`, {
          id: this.items[index].id,
          numberPwz: this.editNumber,
          firstname: this.editFirstname,
          lastname: this.editLastname,
          specialization: this.editSpecialization
        });
        const data = response.data;
        if (data.item) {
          this.$bvToast.toast("Dane zmienione.", {
            title: "Edytowanie lekarza.",
            autoHideDelay: 5000
          });
        }
        if (data.error) {
          const error = data.error;
          if (error.original)
            this.$bvToast.toast(error.original.detail, {
              title: "Edytowanie lekarza.",
              autoHideDelay: 5000,
              appendToast: true
            });
          if (error.errors.length) {
            let description = "";
            description = error.errors.map(error => error.path).join(", ");
            this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
              title: "Edytowanie lekarza.",
              autoHideDelay: 5000,
              appendToast: true
            });
          }
        }
      } else {
        const response = await this.$api.post(`doctor/add`, {
          numberPwz: this.editNumber,
          firstname: this.editFirstname,
          lastname: this.editLastname,
          specialization: this.editSpecialization
        });
        const data = response.data;
        if (data.item) {
          this.$bvToast.toast("Lekarz został dodany.", {
            title: "Dodawanie lekarza.",
            autoHideDelay: 5000
          });
        }
        if (data.error) {
          const error = data.error;
          if (error.original)
            this.$bvToast.toast(error.original.detail, {
              title: "Dodawanie lekarza.",
              autoHideDelay: 5000,
              appendToast: true
            });
          if (error.errors.length) {
            let description = "";
            description = error.errors.map(error => error.path).join(", ");
            this.$bvToast.toast(`Niepoprawne dane w polach ${description}.`, {
              title: "Dodawanie lekarza.",
              autoHideDelay: 5000,
              appendToast: true
            });
          }
        }
      }

      this.$refs.table.clearSelected();
      this.selected = null;
      this.editNumber = "";
      this.editFirstname = "";
      this.editLastname = "";
      this.editSpecialization = "";
      this.loadDoctors();
    },
    changePage(id) {
      var router = "/doctor";
      if (id > 1) router += "/" + id;
      this.$router.push(router);
      this.loadDoctors();
    },
    async loadDoctors() {
      this.page = this.$route.params.id;
      if (this.page === undefined) this.page = 1;
      this.$api
        .get(`doctors/${this.page - 1}`)
        .then(response => {
          const { count, rows } = response.data.items;
          this.items = rows;
          this.totalPage = Math.ceil(count / 100);
        })
        .catch(error => {
          console.log(error);
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

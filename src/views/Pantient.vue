<template>
  <div id="pantient">
    <h1>Pacjenci</h1>
    <div class="searchBar">
      <b-button variant="primary" :disabled="!!selected" @click="add">Dodaj</b-button>
      <b-button variant="secondary" :disabled="!selected" @click="edit">Edytuj</b-button>
      <b-button variant="danger" :disabled="!selected" @click="remove">Usuń</b-button>
    </div>
    <!-- <div class="searchBar">
      <b-form-input v-model="selectedFirstname" placeholder="Podaj imię" type="text"></b-form-input>
      <b-form-input v-model="selectedLastname" placeholder="Podaj nazwisko" type="text"></b-form-input>
      <b-form-input v-model="selectedStreet" placeholder="Podaj ulicę" type="text"></b-form-input>
      <b-form-input v-model="selectedCity" placeholder="Podaj ulicę" type="text"></b-form-input>
      <b-form-input v-model="selectedPostcode" placeholder="Podaj kod pocztowy" type="text"></b-form-input>
      <b-form-input v-model="selectedPhone" placeholder="Podaj telefon" type="number"></b-form-input>
      <b-form-input v-model="selectedPesel" placeholder="Podaj pesel" type="number"></b-form-input>
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
    <b-pagination v-model="page" :total-rows="totalPage" per-page="1" class="my-0" @change="changePage"></b-pagination>
    <b-modal
      ref="edit"
      :title="!!selected ? 'Edycja pacjenta':'Dodaj pacjenta'"
      centered
      @ok="ok"
      @cancel="cancel"
    >
      <b-form-input v-model="editFirstname" placeholder="Podaj imię" type="text"></b-form-input>
      <b-form-input v-model="editLastname" placeholder="Podaj nazwisko" type="text"></b-form-input>
      <b-form-input v-model="editStreet" placeholder="Podaj ulicę" type="text"></b-form-input>
      <b-form-input v-model="editCity" placeholder="Podaj miasto" type="text"></b-form-input>
      <b-form-input v-model="editPostcode" placeholder="Podaj kod pocztowy" type="text"></b-form-input>
      <b-form-input v-model="editPhone" placeholder="Podaj telefon" type="number"></b-form-input>
      <b-form-input v-model="editPesel" placeholder="Podaj pesel" type="number"></b-form-input>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "visit",
  components: {},
  data: () => {
    return {
      fields: {
        firstname: {
          label: "Imie",
          sortable: true
        },
        lastname: {
          label: "Nazwisko",
          sortable: true
        },
        street: {
          label: "Ulica",
          sortable: true
        },
        city: {
          label: "Miejscowość",
          sortable: true
        },
        postcode: {
          label: "Kod pocztowy",
          sortable: true
        },
        phone: {
          label: "Telefon",
          sortable: true
        },
        pesel: {
          label: "Pesel",
          sortable: true
        }
      },
      items: [
        {
          firstname: "Janusz",
          lastname: "Trasz",
          street: "Daszyńskiego 30",
          city: "Kraków",
          postcode: "31-521",
          phone: "123456789",
          pesel: "12365445123"
        },
        {
          firstname: "Jan",
          lastname: "Wójcik",
          street: "Dmowskiego 30",
          city: "Kraków",
          postcode: "31-521",
          phone: "123456589",
          pesel: "12365435123"
        }
      ],
      selectedFirstname: "",
      selectedLastname: "",
      selectedStreet: "",
      selectedCity: "",
      selectedPostcode: "",
      selectedPhone: null,
      selectedPesel: null,
      editFirstname: "",
      editLastname: "",
      editStreet: "",
      editCity: "",
      editPostcode: "",
      editPhone: null,
      editPesel: null,
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
      const { firstname, lastname, pesel } = this.selected;
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć pacjenta ${firstname} ${lastname} o numerze Pesel ${pesel} ?`,
          {
            title: "Usuwanie pacjenta",
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
      const {
        firstname,
        lastname,
        street,
        city,
        postcode,
        phone,
        pesel
      } = this.selected;
      this.editFirstname = firstname;
      this.editLastname = lastname;
      this.editStreet = street;
      this.editCity = city;
      this.editPostcode = postcode;
      this.editPhone = phone;
      this.editPesel = pesel;
      this.$refs["edit"].show();
    },
    add() {
      this.$refs["edit"].show();
    },
    cancel() {
      this.selected = null;
      this.editFirstname = "";
      this.editLastname = "";
      this.editStreet = "";
      this.editCity = "";
      this.editPostcode = "";
      this.editPhone = null;
      this.editPesel = null;
    },
    ok() {
      if (this.selected) {
        const index = this.items.findIndex(item => item === this.selected);
        this.items[index].firstname = this.editFirstname;
        this.items[index].lastname = this.editLastname;
        this.items[index].street = this.editStreet;
        this.items[index].city = this.editCity;
        this.items[index].postcode = this.editPostcode;
        this.items[index].phone = this.editPhone;
        this.items[index].pesel = this.editPesel;
        this.selected = null;
        this.editFirstname = "";
        this.editLastname = "";
        this.editStreet = "";
        this.editCity = "";
        this.editPostcode = "";
        this.editPhone = null;
        this.editPesel = null;
      } else {
        this.items.push({
          firstname: this.editFirstname,
          lastname: this.editLastname,
          street: this.editStreet,
          city: this.editCity,
          postcode: this.editPostcode,
          phone: this.editPhone,
          pesel: this.editPesel
        });
        this.selected = null;
        this.editFirstname = "";
        this.editLastname = "";
        this.editStreet = "";
        this.editCity = "";
        this.editPostcode = "";
        this.editPhone = null;
        this.editPesel = null;
      }
      this.$refs.table.clearSelected();
    },
    changePage(id) {
      var router = "/pantient";
      if (id > 1) router += "/" + id;
      this.$router.push(router);
      this.loadPantients();
    },
    async loadPantients() {
      this.loading = true;
      this.page = this.$route.params.id;
      if (this.page === undefined) this.page = 1;
      this.$api
        .get(`pantients/${this.page - 1}`)
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
    this.loadPantients();
  }
};
</script>
<style scoped>
#pantient {
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

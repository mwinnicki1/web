<template>
  <div id="visit">
    <h1>Wizyty</h1>
    <div class="searchBar">
      <b-button variant="primary" :disabled="!!selected" @click="add">Dodaj</b-button>
      <b-button variant="secondary" :disabled="!selected" @click="edit">Edytuj</b-button>
      <b-button variant="danger" :disabled="!selected" @click="remove">Usuń</b-button>
    </div>
    <!-- <div class="searchBar">
      <b-form-select v-model="selectedDoctor" :options="filterDoctors" class="col-3"></b-form-select>
      <b-form-input v-model="selectedDate" type="date" class="col-3"></b-form-input>
      <b-form-select v-model="selectedPantient" :options="filterPantients" class="col-3"></b-form-select>
    </div> -->
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
    >
      <template slot="date" slot-scope="data">
        {{ new Date(data.item.date).toString() }}
      </template>
</b-table>
    <b-pagination v-model="page" :total-rows="totalPage" per-page="1" class="my-0" @change="changePage"></b-pagination>
    <b-modal
      ref="edit"
      :title="selected !== null ? 'Edycja wizyty':'Dodaj wizytę'"
      centered
      @ok="ok"
      @cancel="cancel"
    >
      <b-form-select v-model="editDoctor" :options="optionsDoctors"/>
      <b-form-select v-model="editPantient" :options="optionsPantients"/>
      <b-form-select v-model="editDate" :options="optionsDate"/>
      <b-form-select v-model="editTime" :options="optionsTime"/>
      <b-form-input v-model="editDescription" placeholder="Podaj opis" type="text"></b-form-input>
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
        doctor: {
          label: "Doktor",
          sortable: true
        },
        date: {
          label: "Godzina i data wizyty",
          sortable: true
        },
        pantient: {
          label: "Nazwisko i imię pacjenta",
          sortable: true
        },
        description: {
          label: "Opis"
        }
      },
      items: [
        {
          doctor: "Kowalski Jan",
          date: "12:00:00 22.06.2018",
          pantient: "Nowak Janusz",
          description: "-"
        },
        {
          doctor: "Majewski Jan",
          date: "13:00:00 23.06.2018",
          pantient: "Kowalski Janusz",
          description: "-"
        }
      ],
      selectedDoctor: null,
      filterDoctors: [
        { value: null, text: "Filtruj wg lekarza" },
        { value: "Kowalski Jan", text: "Kowalski Jan" },
        { value: "Majewski Jan", text: "Majewski Jan" }
      ],
      selectedPantient: null,
      filterPantients: [
        { value: null, text: "Filtruj wg pacjenta" },
        { value: "Nowak Janusz", text: "Nowak Janusz" },
        { value: "Kowalski Janusz", text: "Kowalski Janusz" }
      ],
      optionsDoctors: [
        { value: null, text: "Wybierz lekarza" },
        { value: "Kowalski Jan", text: "Kowalski Jan" },
        { value: "Majewski Jan", text: "Majewski Jan" }
      ],
      optionsPantients: [
        { value: null, text: "Wybierz pacjenta" },
        { value: "Nowak Janusz", text: "Nowak Janusz" },
        { value: "Kowalski Janusz", text: "Kowalski Janusz" }
      ],
      optionsDate: [
        { value: null, text: "Wolne terminy" },
        { value: "22.06.2018", text: "22.06.2018" },
        { value: "23.06.2018", text: "23.06.2018" },
        { value: "24.06.2018", text: "24.06.2018" },
        { value: "25.06.2018", text: "25.06.2018" }
      ],
      optionsTime: [
        { value: null, text: "Wolne godziny" },
        { value: "08:00", text: "08:00" },
        { value: "09:00", text: "09:00" },
        { value: "10:00", text: "10:00" },
        { value: "11:00", text: "11:00" },
        { value: "12:00", text: "12:00" },
        { value: "13:00", text: "13:00" }
      ],
      selectedDate: null,
      editDoctor: null,
      editPantient: null,
      editDescription: "",
      editDate: null,
      editTime: null,
      selected: null,
      page:1,
      totalPage:3
    };
  },
  methods: {
    select(items) {
      this.selected = items[0];
    },
    remove() {
      const { doctor, pantient, date } = this.selected;
      this.$bvModal
        .msgBoxConfirm(
          `Czy chcesz usunąć wizytę ${pantient} u ${doctor} ${date} ?`,
          {
            title: "Usuwanie wizyty",
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
      const { doctor, pantient, date, description } = this.selected;
      this.editDoctor = doctor;
      this.editPantient = pantient;
      this.editDate = new Date(date);
      this.editDescription = description;
      this.$refs["edit"].show();
    },
    add() {
      this.$refs["edit"].show();
    },
    cancel() {
      this.selected = null;
      this.editDoctor = null;
      this.editPantient = null;
      this.editDate = null;
      this.editDescription = "";
    },
    ok() {
      if (this.selected) {
        const index = this.items.findIndex(item => item === this.selected);
        this.items[index].doctor = this.editDoctor;
        this.items[index].pantient = this.editPantient;
        this.items[index].date = this.editDate;
        this.items[index].description = this.editDescription;
      } else {
        this.items.push({
          doctor: this.editDoctor,
          pantient: this.editPantient,
          date: this.editDate,
          description: this.editDescription
        });
      }
      this.$refs.table.clearSelected();
      this.selected = null;
      this.editDoctor = null;
      this.editPantient = null;
      this.editDate = null;
      this.editDescription = "";
    },
    changePage(id) {
      var router = "/visit";
      if (id > 1) router += "/" + id;
      this.$router.push(router);
      this.loadVisit();
    },
    async loadVisit() {
      this.loading = true;
      this.page = this.$route.params.id;
      if (this.page === undefined) this.page = 1;
      this.$api
        .get(`visits/${this.page - 1}`)
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
    this.loadVisit();
  }
};
</script>
<style scoped>
#visit {
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

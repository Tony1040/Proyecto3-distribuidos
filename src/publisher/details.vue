<!-- bookDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 3%">
      <!-- <div v-if="show" class="row">
        <img
          v-bind:src="`/src/publisher/` + publisher.imagen"
          height="300"
          width="600"
          class="six columns four columns offset-by-three"
        />
      </div> -->
      <h2 style="margin-top: 3%">{{ title }}</h2>
      <form>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Id</label>
            <input
              class="u-full-width"
              type="text"
              v-model="publisher.id"
              readonly
            />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Nombre</label>
            <input
              class="u-full-width"
              type="text"
              v-model="publisher.nombre"
            />
          </div>
          <div class="four columns">
            <label for="editionInput">Fundador</label>
            <input
              class="u-full-width"
              type="text"
              v-model="publisher.fundador"
            />
          </div>
          <div class="four columns">
            <label for="copyrightInput">Fundacion</label>
            <input
              class="u-full-width"
              type="text"
              v-model="publisher.fundacion"
            />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="phoneInput">Director</label>
            <input
              class="u-full-width"
              type="tel"
              v-model="publisher.director"
            />
          </div>
          <div class="four columns"></div>
          <div class="four columns">
            <label for="phoneInput">Pais de origen</label>
            <input class="u-full-width" type="tel" v-model="publisher.pais" />
          </div>
        </div>
        <div v-if="create || edit" style="margin-top: 3%">
          <h5>Seleccione una imagen</h5>
          <img
            v-bind:src="this.imagePreview"
            class="uploading-image"
            height="200"
            width="200"
          />
          <input type="file" accept="image/jpeg" @change="uploadImage" />
        </div>
        <div class="row">
          <br />
          <br />
          <h2 v-if="show">Albums</h2>
          <table v-if="show">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Generos</th>
                <th>Fecha publicacion</th>
                <th>Duracion</th>
                <th>Artista</th>
                <th>Descripcion</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="album in albums" :key="album.id">
                <td>{{ album.nombre }}</td>
                <td>{{ album.generos }}</td>
                <td>{{ album.fecha_publicacion }}</td>
                <td>{{ album.duracion }}</td>
                <td>{{ album.id_artista }}</td>
                <td>{{ album.descripcion }}</td>
                <td>
                  <router-link class="button" :to="'/album/show/' + album.id"
                    >Show</router-link
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <router-link class="button button-primary" to="/discografica">
            Back
          </router-link>
          <a
            v-if="edit"
            class="button button-primary"
            style="float: right"
            v-on:click="updatePublisher()"
            >Update</a
          >
          <a
            v-if="create"
            class="button button-primary"
            style="float: right"
            v-on:click="createPublisher()"
            >Create</a
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  props: ["create", "edit", "show"],
  data: function () {
    return {
      title: "Información de artistas",
      albums: [],
      publisher: {
        id: 0,
        nombre: "",
        fundacion: "",
        fundador: "",
        director: "",
        pais: "",
        imagen: "",
      },
      imagePreview: null,
    };
  },
  created() {
    const route = useRoute();
    if (this.show || this.edit) {
      this.findPublisher(route.params.id);
    } else {
      this.publisher.id = Math.floor(Math.random() * 100000000);
    }
  },
  methods: {
    findPublisher: function (id) {
      fetch("/.netlify/functions/discograficas/" + id, {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("This is the result of getting publishers", result);
          this.publisher = result[0];
        });
      fetch("/.netlify/functions/discograficas/" + id + "/albums", {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          this.albums = data;
        });
    },
    updatePublisher: function () {
      delete this.publisher["albums"];

      fetch("/.netlify/functions/discograficas/" + this.publisher.id, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(this.publisher),
      }).then((data) => {
        if (data.status != 200) {
          console.log(data);
          alert(JSON.stringify(data));
        } else {
          alert("Discografica actualizada correctamente");
          this.$router.push("/discografica");
        }
      });
    },
    createPublisher: function () {
      fetch("/.netlify/functions/discograficas", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(this.publisher),
      }).then((data) => {
        console.log(data);
        if (data.status == 303) {
          alert(
            "There is already an object with this id, please use a different one"
          );
        } else {
          alert("Discografica agregada correctamente");
          this.$router.push("/discografica");
        }
      });
    },
    uploadImage(e) {
      const image = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
        console.log(this.imagePreview);
      };
    },
  },
};
</script>

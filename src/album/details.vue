<!-- bookDetails.vue -->
<template>
  <div class="row">
    <div class="eleven column" style="margin-top: 3%">
      <!-- <div v-if="show" class="row">
        <img
          v-bind:src="`/src/album/` + album.imagen"
          height="700"
          width="600"
          class="twelve columns"
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
              v-model="album.id"
              readonly
            />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="titleInput">Nombre</label>
            <input class="u-full-width" type="text" v-model="album.nombre" />
          </div>
          <div class="four columns">
            <label for="editionInput">Fecha publicación</label>
            <input
              class="u-full-width"
              type="text"
              v-model="album.fecha_publicacion"
            />
          </div>
          <div class="four columns">
            <label for="copyrightInput">Duración</label>
            <input class="u-full-width" type="text" v-model="album.duracion" />
          </div>
        </div>
        <div class="row">
          <div class="four columns">
            <label for="phoneInput">Generos</label>
            <input class="u-full-width" type="tel" v-model="album.generos" />
          </div>
          <div class="four columns">
            <label v-if="show" for="emailInput">Artista</label>
            <label v-else for="emailInput">Id Artista</label>
            <router-link
              v-if="show"
              class="button"
              :to="'/artista/show/' + this.artista.id"
              >{{ this.artista.nombre }}</router-link
            >
            <input
              v-else
              class="u-full-width"
              type="email"
              v-model="album.id_artista"
            />
          </div>
          <div class="four columns">
            <label v-if="show">Discografica</label>
            <label v-else for="phoneInput">Id Discografica</label>
            <router-link
              v-if="show"
              class="button"
              :to="'/discografica/show/' + this.discografica.id"
              >{{ this.discografica.nombre }}</router-link
            >
            <input
              v-else
              class="u-full-width"
              type="tel"
              v-model="album.id_discografica"
            />
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
          <div class="twelve columns">
            <label for="descriptionInput">Descripción</label>
            <textarea class="u-full-width" v-model="album.descripcion" />
          </div>
          <router-link class="button button-primary" to="/album">
            Back
          </router-link>
          <a
            v-if="edit"
            class="button button-primary"
            style="float: right"
            v-on:click="updateAlbum()"
            >Update</a
          >
          <a
            v-if="create"
            class="button button-primary"
            style="float: right"
            v-on:click="createAlbum()"
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
      title: "Información de album",
      album: {
        id: 0,
        id_artista: 0,
        id_discografica: 0,
        fecha_publicacion: "",
        generos: "",
        duracion: "",
        nombre: "",
        descripcion: "",
        imagen: "",
        imagePreview: null,
      },
      artista: {
        id: 0,
        nombre: "",
      },
      discografica: {
        id: 0,
        nombre: "",
      },
    };
  },
  created() {
    const route = useRoute();
    if (this.show || this.edit) {
      this.findAlbum(route.params.id);
    } else {
      this.album.id = Math.floor(Math.random() * 100000000);
    }
  },
  methods: {
    findAlbum: function (id) {
      fetch("/.netlify/functions/albums/" + id, {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log("This is the result", result);
          this.album = result[0];

          fetch("/.netlify/functions/artistas/" + this.album.id_artista, {
            headers: { Accept: "application/json" },
          })
            .then((response) => response.json())
            .then((result) => {
              this.artista = result[0];
            });

          fetch(
            "/.netlify/functions/discograficas/" + this.album.id_discografica,
            {
              headers: { Accept: "application/json" },
            }
          )
            .then((response) => response.json())
            .then((result) => {
              this.discografica = result[0];
            });
        });
    },
    updateAlbum: function () {
      //   const router = useRoute();
      //   var id = router.params.id;

      delete this.album["artista"];
      delete this.album["discografica"];

      fetch("/.netlify/functions/albums/" + this.album.id, {
        headers: { "Content-Type": "application/json" },
        method: "PUT",
        body: JSON.stringify(this.album),
      }).then((data) => {
        if (data.status != 200) {
          console.log(data);
          alert(JSON.stringify(data));
        } else {
          alert("Album updated correctly");
          this.$router.push("/album");
        }
      });
    },
    createAlbum: function () {
      const router = useRoute();
      fetch("/.netlify/functions/albums", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(this.album),
      }).then((data) => {
        console.log(data);
        if (data.status == 303) {
          alert(
            "There is already an object with this id, please use a different one"
          );
        } else {
          alert("Album added");
          this.$router.push("/album");
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

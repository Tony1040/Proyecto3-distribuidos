<!-- src/albumIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{ title }}</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Generos</th>
            <th>Fecha publicacion</th>
            <th>Duracion</th>
            <th>Descripcion</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="album in albums" :key="album.id">
            <td>{{ album.nombre }}</td>
            <td>{{ album.generos }}</td>
            <td>{{ album.fecha_publicacion }}</td>
            <td>{{ album.duracion }}</td>
            <td>{{ album.descripcion }}</td>
            <td>
              <router-link class="button" :to="'/album/show/' + album.id"
                >Show</router-link
              >
              <router-link class="button" :to="'/album/edit/' + album.id"
                >Edit</router-link
              >
              <a class="button" v-on:click="deleteAlbum(album.id)">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
      <router-link class="button button-primary" to="/album/create"
        >New</router-link
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      albums: [],
      title: "Lista de albums",
    };
  },
  methods: {
    allAlbums() {
      fetch("/.netlify/functions/albums", {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.albums = result;
        });
    },
    deleteAlbum(id) {
      fetch("/.netlify/functions/albums/" + id, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        body: JSON.stringify({ _method: "DELETE" }),
      }).then((result) => {
        this.allAlbums();
      });
    },
  },
  mounted() {
    this.allAlbums();
  },
};
</script>

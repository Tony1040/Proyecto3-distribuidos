<!-- src/albumIndex.vue -->
<template>
  <div class="row">
    <div style="margin-top: 5%">
      <h2>{{ title }}</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha de nacimiento</th>
            <th>Fallecimiento</th>
            <th>Origen</th>
            <th>Instrumentos</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="artist in artists" :key="artist.id">
            <td>{{ artist.nombre }}</td>
            <td>{{ artist.fecha_nacimiento }}</td>
            <td>{{ artist.fallecimiento }}</td>
            <td>{{ artist.origen }}</td>
            <td>{{ artist.instrumentos }}</td>
            <td>
              <router-link class="button" :to="'/artista/show/' + artist.id"
                >Show</router-link
              >
              <router-link class="button" :to="'/artista/edit/' + artist.id"
                >Edit</router-link
              >
              <a class="button" v-on:click="deleteArtist(artist.id)">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
      <router-link class="button button-primary" to="/artista/create"
        >New</router-link
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      artists: [],
      title: "Lista de artistas",
    };
  },
  methods: {
    allArtists() {
      fetch("/.netlify/functions/artistas", {
        headers: { Accept: "application/json" },
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.artists = result;
        });
    },
    deleteArtist(id) {
      fetch("/.netlify/functions/artistas/" + id, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        body: JSON.stringify({ _method: "DELETE" }),
      }).then((result) => {
        this.allArtists();
      });
    },
  },
  mounted() {
    this.allArtists();
  },
};
</script>

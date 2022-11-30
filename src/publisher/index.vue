
<!-- src/albumIndex.vue -->
<template>
  <div class="row">
   <div style="margin-top: 5%">
     <h2>{{title}}</h2>
     <table><thead>
      <tr><th>Nombre</th><th>Fundacion</th><th>Fundador</th>
          <th>Director</th><th>Pais de origen</th></tr>
      </thead><tbody>
      <tr v-for='publisher in publishers' :key="publisher.id"><td>{{publisher.nombre}}</td>
      <td>{{publisher.fundacion}}</td>
      <td>{{publisher.fundador}}</td>
      <td>{{publisher.director}}</td>
      <td>{{publisher.pais}}</td>
      <td>
      <router-link class="button"
        :to="'/discografica/show/'+publisher.id">Show</router-link>
      <router-link class="button"
        :to="'/discografica/edit/'+publisher.id">Edit</router-link>
      <a class="button"
        v-on:click="deletePublisher(publisher.id)">Delete</a>
      </td>
      </tr></tbody>
     </table>
     <router-link class="button button-primary" 
       to="/discografica/create">New</router-link>
   </div>
  </div>
</template>
<script>
	
export default {
  data() {
    return {
      publishers: [],
      title: 'Lista de discograficas'
    }
  },
  methods: {
    allPublishers() {
      fetch('/.netlify/functions/discograficas',
        { headers: {'Accept': 'application/json'}})
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          this.publishers = result;
        })
     },
     deletePublisher(id) {
       fetch('/.netlify/functions/discograficas/' + id,
         { headers: {'Content-Type': 'application/json'},
   	       method: 'DELETE',
           body: JSON.stringify({'_method':'DELETE'})})
         .then((result) => {
            this.allPublishers();
          }
        )
     }
  },
  mounted() {
    this.allPublishers()
  }
}
</script>
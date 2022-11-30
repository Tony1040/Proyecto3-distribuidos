// src/main.js
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";

import "./css/normalize.css";
import "./css/skeleton.css";

import albumIndex from "./album/index.vue";
import albumDetails from "./album/details.vue";

import artistIndex from "./artist/index.vue";
import artistDetails from "./artist/details.vue";

import publisherIndex from "./publisher/index.vue";
import publisherDetails from "./publisher/details.vue";

const routes = [
  // Routing Albums
  { path: "/album", component: albumIndex, props: true },
  { path: "/album/show/:id", component: albumDetails, props: { show: true } },
  { path: "/album/edit/:id", component: albumDetails, props: { edit: true } },
  { path: "/album/create", component: albumDetails, props: { create: true } },
  {
    path: "/album/delete/:id",
    component: albumDetails,
    props: { delete: true },
  },

  // Home Routing
  { path: "/", component: albumIndex, props: true },

  // Routing Artistas
  { path: "/artista", component: artistIndex, props: true },
  {
    path: "/artista/show/:id",
    component: artistDetails,
    props: { show: true },
  },
  {
    path: "/artista/edit/:id",
    component: artistDetails,
    props: { edit: true },
  },
  {
    path: "/artista/create",
    component: artistDetails,
    props: { create: true },
  },
  {
    path: "/artista/delete/:id",
    component: artistDetails,
    props: { delete: true },
  },

  // Routing Discograficas
  { path: "/discografica", component: publisherIndex, props: true },
  {
    path: "/discografica/show/:id",
    component: publisherDetails,
    props: { show: true },
  },
  {
    path: "/discografica/edit/:id",
    component: publisherDetails,
    props: { edit: true },
  },
  {
    path: "/discografica/create",
    component: publisherDetails,
    props: { create: true },
  },
  {
    path: "/discografica/delete/:id",
    component: publisherDetails,
    props: { delete: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

let app = createApp(App);

app.use(router);

app.mount("#app");

<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <router-link class="navbar-brand" :to="{ name: 'home' }">Message board</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

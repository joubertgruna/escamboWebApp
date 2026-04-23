<template>
  <nav class="navbar navbar-light bg-white fixed-top shadow-sm">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold" to="/feed" style="color: #2ecc71;">
        🔄 Escambo
      </router-link>
      <div class="d-flex align-items-center gap-2">
        <PWAControls />
        <router-link to="/items/new" class="btn btn-sm btn-escambo">
          + Item
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import PWAControls from '@/components/PWAControls.vue';
</script>

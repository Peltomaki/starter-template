<template>
  <div>
    <the-nav></the-nav>
    <router-view name="admin" />
  </div>
</template>

<script>
import TheNav from '@/components/TheNav.vue'

export default {
  name: 'Admin',
  components: {
    TheNav,
  },
}
</script>

<template>
  <div>Home</div>
</template>

<script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  export default {
    name: 'Login',

    setup() {
      const data = ref([]);
      const getData = async () => {
        const data1 = await axios.get(
          'http://localhost:5003/api/v1/users',

          { withCredentials: true }
        );
        console.log(data1.data);
      };

      onMounted(() => {
        getData();
      });

      return { data, getData };
    },
  };
</script>

<style scoped></style>

<template>
  <form @submit.prevent="login">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input
        type="email"
        class="form-control"
        placeholder="Email"
        v-model="data.email"
      />
    </div>
    <div class="form-floating">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="data.password"
      />
    </div>

    <div class="checkbox mb-3">
      <label> <input type="checkbox" value="remember-me" /> Remember me </label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
  </form>
</template>

<script>
  import { reactive } from 'vue';
  import axios from 'axios';

  export default {
    name: 'Login',

    setup() {
      const data = reactive({
        email: '',
        password: '',
      });
      const login = async () => {
        const data1 = await axios.post(
          'http://localhost:5003/api/v1/users/login',
          data,
          { withCredentials: true }
        );
        console.log(data1.data);
      };

      return { data, login };
    },
  };
</script>

<style scoped></style>

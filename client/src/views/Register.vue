<template>
  <form @submit.prevent="register">
    <h1 class="h3 mb-3 fw-normal">Please register</h1>

    <input
      type="email"
      class="form-control"
      placeholder="Email"
      v-model="data.email"
    />

    <input
      type="password"
      class="form-control"
      placeholder="Password"
      v-model="data.password"
    />
    <input
      type="password"
      class="form-control"
      placeholder="Password"
      v-model="data.confirmPassword"
    />
    <input
      type="text"
      class="form-control"
      placeholder="Etunimi"
      v-model="data.firstName"
    />

    <input
      type="text"
      class="form-control"
      placeholder="Sukunimi"
      v-model="data.lastName"
    />

    <input
      type="text"
      class="form-control"
      placeholder="Puhelin"
      v-model="data.phone"
    />

    <input
      type="text"
      class="form-control"
      placeholder="Rooli"
      v-model="data.role"
    />

    <div class="checkbox mb-3">
      <label> <input type="checkbox" value="remember-me" /> Remember me </label>
    </div>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
  </form>
</template>

<script>
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  export default {
    name: 'Register',
    setup() {
      const router = useRouter();

      const data = reactive({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: '',
        confirmPassword: '',
      });

      const register = async () => {
        console.log(data);
        const user = await axios.post(
          'http://localhost:5003/api/v1/users/signup',
          data,
          { withCredentials: true }
        );
        console.log(user.data);
        await router.push('/login');
      };

      return { data, register };
    },
  };
</script>

<style scoped></style>

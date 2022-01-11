<template>
  <form @submit.prevent="login">
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

    <div class="form-floating">
      <input
        type="email"
        class="form-control"
        placeholder="Email"
        v-model="user.email"
      />
    </div>
    <div class="form-floating">
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="user.password"
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
  import AuthenticationService from '@/services/AuthenticationService';

  export default {
    name: 'Login',

    setup() {
      const message = reactive({
        success: '',
        error: '',
      });
      const user = reactive({
        email: '',
        password: '',
      });
      const login = async () => {
        try {
          const credintials = {
            email: user.email,
            password: user.password,
          };
          const userLogin = await AuthenticationService.login(credintials);
          message.success = userLogin.data.message;
          console.log(userLogin);
        } catch (error) {
          console.log(error);
        }
      };

      return { message, user, login };
    },
  };
</script>

<style scoped></style>

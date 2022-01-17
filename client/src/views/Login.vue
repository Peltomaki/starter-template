<template>
  <main class="form-signin">
    <form @submit.prevent="login">
      <img class="mb-4" src="" alt="" width="72" height="57" />
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input
          type="email"
          class="form-control"
          id="loginEmail"
          placeholder="name@example.com"
          v-model="user.email"
        />
        <label for="loginEmail">Tunnus</label>
      </div>
      <div class="form-floating">
        <input
          type="password"
          class="form-control"
          id="loginPassword"
          placeholder="Password"
          v-model="user.password"
        />
        <label for="loginPassword">Salasana</label>
      </div>
      <button class="w-100 btn btn-lg btn-primary" type="submit">
        Kirjaudu
      </button>
      <p class="mt-5 mb-3 text-muted">&copy; 2022 Pyöräsuomi</p>
    </form>
  </main>
</template>

<script>
import {reactive} from 'vue'
import AuthenticationService from '@/services/AuthenticationService'

export default {
  name: 'Login',

  setup() {
    const message = reactive({
      success: '',
      error: '',
    })
    const user = reactive({
      email: '',
      password: '',
    })
    const login = async () => {
      try {
        const credintials = {
          email: user.email,
          password: user.password,
        }
        const userLogin = await AuthenticationService.login(credintials)
        message.success = userLogin.data.message
        console.log(userLogin)
      } catch (error) {
        console.log(error)
      }
    }

    return {message, user, login}
  },
}
</script>

<style scoped></style>

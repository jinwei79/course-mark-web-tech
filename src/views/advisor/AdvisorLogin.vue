<template>
  <div class="login-container">
    <h2>Advisor Login</h2>
    <form @submit.prevent="handleLogin">
      <input
        id="email"
        v-model="email"
        placeholder="Email"
        type="email"
        required
      />
      <input
        id="password"
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  mounted() {
    localStorage.getItem('user') && this.$router.push('/dashboard-advisor')
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ''
      console.log("Email:", this.email)
      console.log("Password:", this.password)
      try {
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        if (!response.ok) {
          const error = await response.json()
          this.errorMessage = error.message || 'Login failed'
          return
        }

        const data = await response.json()

        // Save user info and token to localStorage
        localStorage.setItem('user', JSON.stringify({
          role: 'advisor',
          id: data.user.id,
          name: data.user.name,
          email: data.user.email
        }))
        localStorage.setItem('token', data.token)

        // Redirect to lecturer dashboard
        this.$router.push('/dashboard-advisor')
      } catch (err) {
        console.error(err)
        this.errorMessage = err.message || 'An error occurred during login'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
input {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>

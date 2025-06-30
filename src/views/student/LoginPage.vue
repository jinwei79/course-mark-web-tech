<template>
  <div class="login-container">
    <h2>Student Login</h2>
    <form @submit.prevent="handleLogin">
      <input id="matric" v-model="matric" placeholder="Matric Number" required />
      <input id="pin" v-model="pin" type="password" placeholder="PIN" required />
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      matric: '',
      pin: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = ''
 console.log("Matric:", this.matric)
  console.log("PIN:", this.pin)
      try {
        const response = await fetch('http://localhost:8080/student-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            matric_no: this.matric,
            pin: this.pin
          })
        })

        if (!response.ok) {
          const error = await response.json()
          this.errorMessage = error.message || 'Login failed'
          return
        }

        const data = await response.json()

        // Save user info and JWT token
        localStorage.setItem('user', JSON.stringify({
          role: 'student',
          id: data.student.id,
          matric: data.student.matric,
          name: data.student.name
        }))
        localStorage.setItem('token', data.token)

        this.$router.push('/dashboard')
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Network or server error'
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

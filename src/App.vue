<template>
  <div class="container">
    <h1>Course Mark Management Web Application</h1>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 10px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h1, h3 {
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 5px;
  margin-bottom: 20px;
}

nav {
  margin-bottom: 30px;
  text-align: center;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 5px;
  transition: 0.3s;
}

nav a:hover {
  background-color: #42b983;
  color: white;
}

input {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

button {
  padding: 10px 18px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
  transition: 0.3s;
}

button:hover {
  background-color: #2c9f6d;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f4f7f9;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
}

li img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 15px;
  border: 2px solid #42b983;
} 
</style>
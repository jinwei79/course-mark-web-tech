<style scoped>
.dashboard {
  padding: 1rem;
}

.logout-btn {
  float: right;
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

nav {
  margin-bottom: 30px;
  text-align: center;
}

nav button {
  margin: 0 10px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 5px;
  transition: 0.3s;
  border: 1px solid white;
  background-color: #42b983;
}

nav button:hover {
  background-color: white;
  color: #42b983;
  border: 1px solid #42b983;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px auto;
  max-width: 700px;
  padding: 0 10px;
}

.nav-grid button {
  padding: 10px 15px;
  font-weight: bold;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-grid button:hover {
  background-color: #2c9f6d;
}
</style>


<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>
    <nav class="nav-grid">
      <button
      :style="currentSection === 'manageUsers' ? 'background-color: #42b983; color: white; border: 1px solid white;' : 'background-color: white; color: #42b983; border: 1px solid #42b983;'"
      @click="setSection('manageUsers')"
      >
      Manage Users
      </button>
      <button
      :style="currentSection === 'assignLecturers' ? 'background-color: #42b983; color: white; border: 1px solid white;' : 'background-color: white; color: #42b983; border: 1px solid #42b983;'"
      @click="setSection('assignLecturers')"
      >
      Assign Lecturers to Courses
      </button>
      <button
      :style="currentSection === 'viewLogs' ? 'background-color: #42b983; color: white; border: 1px solid white;' : 'background-color: white; color: #42b983; border: 1px solid #42b983;'"
      @click="setSection('viewLogs')"
      >
      View System Logs & Mark Updates
      </button>
      <button
      :style="currentSection === 'resetPasswords' ? 'background-color: #42b983; color: white; border: 1px solid white;' : 'background-color: white; color: #42b983; border: 1px solid #42b983;'"
      @click="setSection('resetPasswords')"
      >
      Reset User Passwords
      </button>
    </nav>

    <div v-if="admin">
      <div v-if="currentSection === 'manageUsers'">
        <!-- Manage user accounts and roles component goes here -->
         <hr />
        <ManageUser />
      </div>
      <div v-if="currentSection === 'assignLecturers'">
        <!-- Assign lecturers to courses component goes here -->
        <p>Assign lecturers to courses.</p>
      </div>
      <div v-if="currentSection === 'viewLogs'">
        <!-- View system logs and mark updates component goes here -->
        <p>View system logs and mark updates.</p>
      </div>
      <div v-if="currentSection === 'resetPasswords'">
        <!-- Reset user passwords component goes here -->
        <p>Reset user passwords.</p>
      </div>
    </div>
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script>
import ManageUser from "@/components/Admin/ManageUser.vue";

export default {
  name: "AdminDashboard",
  components: {
    ManageUser,
  },
  data() {
    return {
      admin: null,
      currentSection: "manageUsers",
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token || user.role !== "admin") {
      this.$router.push("/");
      return;
    }
    this.admin = user;
  },
  methods: {
    setSection(section) {
      this.currentSection = section;
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/login-admin");
    },
  },
};
</script>
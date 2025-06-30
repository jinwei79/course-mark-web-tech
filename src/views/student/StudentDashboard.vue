<template>
  <div class="dashboard">
    <nav>
      <button @click="setSection('dashboard')">Dashboard</button>
      <button @click="setSection('compare')">Compare</button>
      <button @click="setSection('simulate')">What-if</button>
      <button @click="setSection('remark')">Remark</button>
    </nav>

    <div v-if="student">
      <div v-if="currentSection === 'dashboard'">
        <MarksTable :marks="marks" />
        <ProgressBar :marks="marks" />
        <RankCard :studentTotal="total" />
      </div>

      <!-- <div v-if="currentSection === 'compare'">
        <CompareTable :currentMatric="student.matric" />
      </div>

      <div v-if="currentSection === 'simulate'">
        <WhatIfTool :originalMarks="marks" />
      </div>

      <div v-if="currentSection === 'remark'">
        <RemarkForm :matric="student.matric" />
      </div> -->
    </div>

    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script>

import MarksTable from "@/components/Student/MarksTable.vue";
import ProgressBar from "@/components/Student/ProgressBar.vue";
// import CompareTable from "@/components/Student/CompareTable.vue";
import RankCard from "@/components/Student/RankCard.vue";
// import WhatIfTool from "@/components/Student/WhatIfTool.vue";
// import RemarkForm from "@/components/Student/RemarkForm.vue";

// import marksData from "@/data/marks.json";

export default {
  name: "StudentDashboard",
  components: {
    MarksTable,
    ProgressBar,
    // CompareTable,
    RankCard,
    // WhatIfTool,
    // RemarkForm,
  },
  data() {
    return {
      student: null,
      marks: {},
      total: 0,
      currentSection: "dashboard",
    };
  },
  mounted() {
    // const user = JSON.parse(localStorage.getItem("user"));
    // if (!user || user.role !== "student") {
    //   this.$router.push("/");
    //   return;
    // }

    // this.student = user;
    // this.marks = marksData[this.student.matric];
    // this.total = Object.values(this.marks).reduce((a, b) => a + b, 0);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
console.log(user)
console.log(token)
  if (!user || !token || user.role !== 'student') {
    this.$router.push('/');
    return;
  }

  // Example: Fetch student's marks (using ID or matric depending on your backend)
  fetch(`http://localhost:8080/students/marks/${user.id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (!response.ok) throw new Error("Unauthorized or not found");
      return response.json();
    })
    .then(data => {
      console.log(data)
      this.marks = data.marks; // Adjust depending on structure
      this.student = data.student;
    })
    .catch(error => {
      console.error("Failed to fetch student data:", error);
      this.$router.push('/');
    });
},
  methods: {
    setSection(section) {
      this.currentSection = section;
    },
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
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

.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-family: "Segoe UI", sans-serif;
  color: #333;
}

h1,
h3 {
  color: #2c3e50;
  border-bottom: 2px solid #42b983;
  padding-bottom: 5px;
  margin-bottom: 20px;
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
}

nav button:hover {
  background-color: white;
  color: #42b983;
  border: 1px solid #42b983;
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

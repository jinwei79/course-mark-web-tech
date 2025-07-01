<template>
  <div class="enrollment-manager">
    <h2>Manage Enrollments</h2>

    <!-- Add Enrollment Form -->
    <form @submit.prevent="enrollStudent">
      <select v-model="form.student_id" required>
        <option disabled value="">Select Student</option>
        <option v-for="student in students" :key="student.id" :value="student.id">
          {{ student.name }} ({{ student.matric_no }})
        </option>
      </select>

      <select v-model="form.course_id" required>
        <option disabled value="">Select Course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.code }} - {{ course.name }}
        </option>
      </select>

      <button type="submit">Enroll</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>

    <!-- Enrollment Table -->
    <table>
      <thead>
        <tr>
          <th>Student</th>
          <th>Course</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="enroll in enrollments" :key="enroll.id">
          <td>{{ enroll.student_name }}</td>
          <td>{{ enroll.course_code }} - {{ enroll.course_name }}</td>
          <td><button @click="deleteEnrollment(enroll.id)">Remove</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        student_id: '',
        course_id: ''
      },
      students: [],
      courses: [],
      enrollments: [],
      message: ''
    };
  },
  mounted() {
    this.fetchStudents();
    this.fetchCourses();
    this.fetchEnrollments();
  },
  methods: {
    async fetchStudents() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/students", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      this.students = data.students || [];
    },
    async fetchCourses() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      this.courses = data.courses || [];
    },
    async fetchEnrollments() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8080/enrollments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        this.enrollments = data.enrollments || [];
      } catch (error) {
        this.message = "Failed to fetch enrollments.";
      }
    },
    async enrollStudent() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(this.form)
      });
      const result = await res.json();
      if (res.ok) {
        this.message = "Enrollment added.";
        this.form.student_id = '';
        this.form.course_id = '';
        this.fetchEnrollments();
      } else {
        this.message = result.message || "Enrollment failed.";
      }
    },
    async deleteEnrollment(id) {
      if (!confirm("Confirm remove enrollment?")) return;

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/enrollments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (res.ok) {
        this.message = "Enrollment removed.";
        this.fetchEnrollments();
      } else {
        this.message = result.message || "Failed to delete.";
      }
    }
  }
};
</script>

<style scoped>
.enrollment-manager {
  max-width: 800px;
  margin: auto;
}
form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
select {
  padding: 8px;
  width: 200px;
}
button {
  padding: 8px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
}
button:hover {
  background-color: #2c9f6d;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 10px;
  border-bottom: 1px solid #ccc;
  text-align: left;
}
.message {
  margin: 10px 0;
  color: #2c3e50;
}
</style>

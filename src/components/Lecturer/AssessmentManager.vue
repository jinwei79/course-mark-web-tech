<template>
  <div class="assessment-manager">
    <h2>Manage Assessment Components</h2>

    <!-- Select Course -->
    <select v-model="selectedCourse" @change="fetchAssessments" required>
      <option disabled value="">Select Course</option>
      <option v-for="course in courses" :key="course.id" :value="course.id">
        {{ course.code }} - {{ course.name }}
      </option>
    </select>

    <!-- Form -->
    <form v-if="selectedCourse" @submit.prevent="submitForm">
      <input v-model="form.name" placeholder="Component Name (e.g., Quiz)" required />
      <input v-model="form.description" placeholder="Description" />
      <input v-model.number="form.weightage" type="number" placeholder="Weightage (%)" required />
      <input v-model.number="form.max_mark" type="number" placeholder="Max Mark" required />
      <label>
        <input type="checkbox" v-model="form.is_final_exam" /> Final Exam (30%)
      </label>
      <button type="submit">{{ isEditing ? 'Update' : 'Add' }} Component</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>

    <!-- Assessment Table -->
    <table v-if="assessments.length">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Weight</th>
          <th>Max</th>
          <th>Final?</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in assessments" :key="a.id">
          <td>{{ a.name }}</td>
          <td>{{ a.description }}</td>
          <td>{{ a.weightage }}%</td>
          <td>{{ a.max_mark }}</td>
          <td>{{ a.is_final_exam ? "Yes" : "No" }}</td>
          <td>
            <button @click="editAssessment(a)">Edit</button>
            <button @click="deleteAssessment(a.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCourse: '',
      courses: [],
      assessments: [],
      form: {
        id: null,
        name: '',
        description: '',
        weightage: '',
        max_mark: '',
        is_final_exam: false
      },
      isEditing: false,
      message: ''
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      this.courses = data.courses || [];
    },
    async fetchAssessments() {
      if (!this.selectedCourse) return;
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/assessments/${this.selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      this.assessments = data || [];
    },
    async submitForm() {
      const token = localStorage.getItem("token");
      const url = this.isEditing
        ? `http://localhost:8080/assessments/${this.form.id}`
        : "http://localhost:8080/assessments";
      const method = this.isEditing ? "PUT" : "POST";

      const payload = {
        course_id: this.selectedCourse,
        name: this.form.name,
        description: this.form.description,
        weightage: this.form.weightage,
        max_mark: this.form.max_mark,
        is_final_exam: this.form.is_final_exam ? 1 : 0
      };

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (res.ok) {
        this.message = this.isEditing ? "Assessment updated." : "Assessment added.";
        this.fetchAssessments();
        this.resetForm();
      } else {
        this.message = result.message || "Error occurred.";
      }
    },
    editAssessment(a) {
      this.isEditing = true;
      this.form = { ...a, is_final_exam: a.is_final_exam == 1 };
    },
    async deleteAssessment(id) {
      if (!confirm("Delete this assessment?")) return;

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/assessments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await res.json();
      if (res.ok) {
        this.message = "Deleted successfully.";
        this.fetchAssessments();
      } else {
        this.message = result.message || "Failed to delete.";
      }
    },
    resetForm() {
      this.isEditing = false;
      this.form = {
        id: null,
        name: '',
        description: '',
        weightage: '',
        max_mark: '',
        is_final_exam: false
      };
    }
  }
};
</script>

<style scoped>
.assessment-manager {
  max-width: 800px;
  margin: auto;
}
form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}
input,
select {
  padding: 8px;
  width: calc(33% - 10px);
}
label {
  width: 100%;
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

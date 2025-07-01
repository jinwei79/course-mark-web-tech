<template>
  <div class="remark-form">
    <h3>Submit Remark Request</h3>

    <form @submit.prevent="submitRequest">
      <label>Course:</label>
      <select v-model="selectedCourse" @change="loadAssessments" required>
        <option disabled value="">Select Course</option>
        <option v-for="course in courses" :key="course.code" :value="course.code">
          {{ course.name }}
        </option>
      </select>

      <label>Assessment:</label>
      <select v-model="selectedAssessment" required>
        <option disabled value="">Select Assessment</option>
        <option v-for="a in assessments" :key="a.id" :value="a.id">
          {{ a.name }}
        </option>
      </select>

      <label>Justification:</label>
      <textarea v-model="justification" rows="4" required></textarea>

      <button type="submit">Submit Request</button>

      <p class="success" v-if="successMsg">{{ successMsg }}</p>
      <p class="error" v-if="errorMsg">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      courses: [],
      assessments: [],
      selectedCourse: '',
      selectedAssessment: '',
      justification: '',
      errorMsg: '',
      successMsg: ''
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`http://localhost:8080/students/courses/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        this.courses = await res.json();
      }
    },
    async loadAssessments() {
      const token = localStorage.getItem('token');
      this.assessments = [];
      const res = await fetch(`http://localhost:8080/assessments/${this.selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        this.assessments = await res.json();
      }
    },
    async submitRequest() {
      this.errorMsg = '';
      this.successMsg = '';
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      try {
        const res = await fetch('http://localhost:8080/students/remark-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            student_id: user.id,
            assessment_component_id: this.selectedAssessment,
            justification: this.justification
          })
        });

        const data = await res.json();
        if (!res.ok) {
          this.errorMsg = data.message || 'Failed to submit request.';
          return;
        }

        this.successMsg = 'Remark request submitted successfully!';
        this.selectedCourse = '';
        this.selectedAssessment = '';
        this.justification = '';
      } catch (err) {
        console.error(err);
        this.errorMsg = 'Server error.';
      }
    }
  }
};
</script>

<style scoped>
.remark-form {
  max-width: 600px;
  margin: auto;
}
label {
  display: block;
  margin-top: 10px;
}
textarea,
select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}
button {
  margin-top: 12px;
}
.success {
  color: green;
  margin-top: 8px;
}
.error {
  color: red;
  margin-top: 8px;
}
</style>

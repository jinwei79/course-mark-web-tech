<template>
  <div>
    <h3>What-If Tool</h3>

    <label>Select Course:</label>
    <select v-model="selectedCourse" @change="fetchAssessments">
      <option disabled value="">-- Select a course --</option>
      <option v-for="c in courses" :key="c.code" :value="c.code">
        {{ c.name }} ({{ c.code }})
      </option>
    </select>

    <div v-if="assessments.length">
      <h4>Expected Marks</h4>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Max Mark</th>
            <th>Weightage (%)</th>
            <th>Your Mark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in assessments" :key="a.id">
            <td>{{ a.name }}</td>
            <td>{{ a.max_mark }}</td>
            <td>{{ a.weightage }}</td>
            <td>
              <input
                type="number"
                v-model.number="a.expected_mark"
                :max="a.max_mark"
                min="0"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <button @click="calculateTotal">Calculate</button>

      <div v-if="expectedTotal !== null">
        <h4>Expected Total: {{ expectedTotal.toFixed(2) }}%</h4>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedCourse: '',
      courses: [],
      assessments: [],
      expectedTotal: null,
      errorMessage: ''
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
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        this.courses = await res.json();
      }
    },
    async fetchAssessments() {
      this.assessments = [];
      this.expectedTotal = null;

      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:8080/students/courses/${this.selectedCourse}/whatif-data`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.ok) {
        const data = await res.json();
        this.assessments = data.map((a) => ({
          ...a,
          expected_mark: 0
        }));
      }
    },
    calculateTotal() {
      this.expectedTotal = this.assessments.reduce((sum, a) => {
        const ratio = a.expected_mark / a.max_mark;
        const weighted = ratio * a.weightage;
        return sum + weighted;
      }, 0);
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}
td,
th {
  padding: 0.5rem;
  border: 1px solid #ccc;
}
input {
  width: 100px;
}
</style>

<template>
  <div>
    <h3>Compare Marks with Coursemates</h3>
    <div v-if="Object.keys(comparisonData).length === 0">
      <p>No comparison data available.</p>
    </div>

    <div v-for="(students, course) in comparisonData" :key="course" class="course-block">
      <h4>{{ course }}</h4>
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th v-for="comp in getAllComponents(students)" :key="comp">{{ comp }}</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in students" :key="entry.student">
            <td>{{ entry.student }}</td>
            <td v-for="comp in getAllComponents(students)" :key="comp">
              {{ entry[comp] !== undefined ? entry[comp] : '-' }}
            </td>
            <td>{{ entry.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comparisonData: {}
    };
  },
  mounted() {
    this.fetchComparison();
  },
  methods: {
    async fetchComparison() {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/students/peer-comparison/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        this.comparisonData = await res.json();
      } else {
        console.error("Failed to fetch comparison data.");
      }
    },
    getAllComponents(students) {
      const all = new Set();
      students.forEach(s => {
        Object.keys(s).forEach(k => {
          if (k !== 'student' && k !== 'total') all.add(k);
        });
      });
      return Array.from(all);
    }
  }
};
</script>

<style scoped>
table {
  width: 100%;
  margin-bottom: 2rem;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}
.course-block {
  margin-bottom: 2rem;
}
</style>

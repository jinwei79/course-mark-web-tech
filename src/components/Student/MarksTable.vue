<template>
  <div class="marks-table">
    <h3>Marks</h3>

    <div v-for="(assessments, courseName) in marks" :key="courseName">
      <h4>{{ courseName }}</h4>
      <table>
        <thead>
          <tr>
            <th>Component</th>
            <th>Mark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mark, assessment) in assessments" :key="assessment" >
            <td v-if="assessment != 'total'">{{ assessment }}</td>
            <td v-if="assessment != 'total'">{{ mark }}</td>
          </tr>
          <tr class="total-row">
            <td><strong>Total</strong></td>
            <td>
              <strong>{{ assessments.total }}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["marks"]
};
</script>

<style scoped>
.marks-table {
  margin-top: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
.total-row td {
  border-top: 2px solid #000;
}
</style>

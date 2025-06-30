<template>
  <div v-for="(assessments, courseName) in marks" :key="courseName" class="course-section">
  <h4>{{ courseName }}</h4>

  <!-- Progress Bar -->
  <div class="progress-bar-wrapper">
    <div class="progress-bar" :style="{ width: getPercentage(assessments.total) + '%' }"></div>
  </div>
  <p><strong>{{ assessments.total }}/100</strong> total score</p>

  <!-- Breakdown -->
  <ul>
    <li v-for="(mark, name) in getAssessmentsOnly(assessments)" :key="name">
      {{ name }}: {{ mark }}
    </li>
  </ul>
</div>

</template>

<script>
export default {
  props: ['marks'],
  methods: {
    getAssessmentsOnly(assessments) {
      const copy = { ...assessments }
      delete copy.total
      return copy
    },
    getPercentage(score) {
      return Math.min(100, Math.round((score / 100) * 100))
    }
  }
};
</script>

<style scoped>
.progress-bar-wrapper {
  background: #eee;
  border-radius: 5px;
  height: 20px;
  width: 100%;
  margin-bottom: 10px;
  overflow: hidden;
}
.progress-bar {
  background: #42b983;
  height: 100%;
  transition: width 0.5s ease;
}

</style>

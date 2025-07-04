<template>
  <div class="analytics-page">
    <h2>📊 Student Progress Overview</h2>

    <!-- Course Dropdown -->
    <select v-model="selectedCourse" @change="fetchProgressData">
      <option disabled value="">Select Course</option>
      <option v-for="course in courses" :key="course.id" :value="course.id">
        {{ course.code }} - {{ course.name }}
      </option>
    </select>

    <!-- Chart Canvas -->
    <canvas v-if="chartReady" id="progressChart"></canvas>

    <!-- Summary Section -->
    <div v-if="summary" class="summary-box">
      <p><strong>Average Mark:</strong> {{ summary.average.toFixed(2) }}</p>
      <p><strong>Highest Mark:</strong> {{ summary.highest }}</p>
      <p><strong>Lowest Mark:</strong> {{ summary.lowest }}</p>

      <!-- Table of Student Total Marks -->
      <div v-if="summary.students && summary.students.length">
        <h4>Student Total Marks:</h4>
        <table class="summary-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Total Mark</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, index) in summary.students" :key="s.name">
              <td>{{ index + 1 }}</td>
              <td>{{ s.name }}</td>
              <td>{{ s.totalMark }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default {
  data() {
    return {
      courses: [],
      selectedCourse: '',
      chart: null,
      chartReady: false,
      chartData: [],
      summary: null,
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
      this.courses = Array.isArray(data) ? data : data.courses || [];
    },

    async fetchProgressData() {
      this.chartReady = false;
      this.chartData = [];
      this.summary = null;

      if (!this.selectedCourse) return;

      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/analytics/progress/${this.selectedCourse}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const rawData = await res.json();

      if (!Array.isArray(rawData) || rawData.length === 0) return;

      // Calculate total mark per student
      this.chartData = rawData.map(student => {
        const totalMark = student.marks.reduce((sum, m) => sum + (Number(m.mark) || 0), 0);
        return {
          ...student,
          totalMark
        };
      });

      this.chartReady = true;

      this.$nextTick(() => {
        this.renderChart();
        this.calculateSummary();
      });
    },

    renderChart() {
      const ctx = document.getElementById("progressChart");
      if (!ctx) return;

      if (this.chart) this.chart.destroy();

      const labels = this.chartData.map(s => s.name);
      const componentNames = this.chartData[0].marks.map(m => m.component);

      const datasets = componentNames.map((comp, index) => ({
        label: comp,
        data: this.chartData.map(s => s.marks[index]?.mark ?? 0),
        backgroundColor: `hsl(${index * 50}, 70%, 60%)`
      }));

      this.chart = new Chart(ctx, {
        type: "bar",
        data: { labels, datasets },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Student Marks by Component"
            },
            legend: { position: "top" }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100
            }
          }
        }
      });
    },

    calculateSummary() {
      const totals = this.chartData.map(student => ({
        name: student.name,
        totalMark: student.totalMark
      }));

      if (totals.length === 0) {
        this.summary = { average: 0, highest: 0, lowest: 0, students: [] };
        return;
      }

      const totalSum = totals.reduce((a, b) => a + b.totalMark, 0);
      const average = totalSum / totals.length;
      const highest = Math.max(...totals.map(s => s.totalMark));
      const lowest = Math.min(...totals.map(s => s.totalMark));

      this.summary = {
        average,
        highest,
        lowest,
        students: totals
      };
    }
  }
};
</script>

<style scoped>
.analytics-page {
  max-width: 900px;
  margin: auto;
  text-align: center;
}
select {
  padding: 10px;
  margin: 20px auto;
  display: block;
  width: 100%;
  max-width: 400px;
}
canvas {
  max-width: 100%;
  margin-top: 20px;
}
.summary-box {
  margin-top: 20px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  text-align: left;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.summary-table th,
.summary-table td {
  padding: 8px 12px;
  border: 1px solid #ccc;
  text-align: center;
}
</style>

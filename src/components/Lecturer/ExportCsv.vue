<template>
    <div class="export-page">
      <h2>📤 Export Student Marks (CSV Only)</h2>
  
      <select v-model="selectedCourse" @change="fetchMarks">
        <option disabled value="">Select Course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.code }} - {{ course.name }}
        </option>
      </select>
  
      <div class="buttons">
        <button @click="exportCSV" :disabled="!marks.length">Export Component Marks CSV</button>
        <button @click="calculateTotals" :disabled="!marks.length">Calculate Total Marks</button>
        <button @click="exportTotalMarksCSV" :disabled="!totalMarks.length">Export Total Marks CSV</button>
      </div>
  
      <table v-if="marks.length" class="export-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Matric No</th>
            <th>Component</th>
            <th>Mark</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in marks" :key="i">
            <td>{{ m.student_name }}</td>
            <td>{{ m.matric_no }}</td>
            <td>{{ m.component_name }}</td>
            <td>{{ m.mark }}</td>
          </tr>
        </tbody>
      </table>
  
      <h3 v-if="totalMarks.length">🎓 Student Total Marks</h3>
      <table v-if="totalMarks.length" class="export-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Matric No</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in totalMarks" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ student.name }}</td>
            <td>{{ student.matric }}</td>
            <td>{{ student.total }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        courses: [],
        selectedCourse: '',
        marks: [],
        totalMarks: []
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
  
      async fetchMarks() {
        if (!this.selectedCourse) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/export/${this.selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.marks = await res.json();
        this.totalMarks = []; // reset
      },
  
      exportCSV() {
        const header = ["Student Name", "Matric No", "Component", "Mark"];
        const rows = this.marks.map(m => [
          m.student_name,
          m.matric_no,
          m.component_name,
          m.mark,
        ]);
        const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
        this.downloadCSV(csvContent, "component_marks.csv");
      },
  
      calculateTotals() {
        const totals = {};
        this.marks.forEach(m => {
          const key = m.matric_no;
          if (!totals[key]) {
            totals[key] = {
              name: m.student_name,
              matric: m.matric_no,
              total: 0
            };
          }
          totals[key].total += parseFloat(m.mark);
        });
        this.totalMarks = Object.values(totals);
      },
  
      exportTotalMarksCSV() {
        const header = ["#", "Student Name", "Matric No", "Total Marks"];
        const rows = this.totalMarks.map((s, i) => [
          i + 1,
          s.name,
          s.matric,
          s.total
        ]);
        const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
        this.downloadCSV(csvContent, "total_student_marks.csv");
      },
  
      downloadCSV(content, filename) {
        const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  </script>
  
  <style scoped>
  .export-page {
    max-width: 900px;
    margin: auto;
    text-align: center;
  }
  select {
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
    max-width: 400px;
  }
  .buttons {
    margin-bottom: 15px;
  }
  button {
    margin: 5px;
    padding: 8px 16px;
    font-weight: bold;
  }
  .export-table {
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;
  }
  .export-table th, .export-table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: center;
  }
  </style>
  
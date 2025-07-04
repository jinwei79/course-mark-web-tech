<template>
    <div class="mark-entry">
      <h2>Enter Student Marks</h2>
  
      <!-- Select Course -->
      <select v-model="selectedCourse" @change="fetchComponents" required>
        <option disabled value="">Select Course</option>
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.code }} - {{ course.name }}
        </option>
      </select>
  
      <!-- Select Component -->
      <select v-if="selectedCourse" v-model="selectedComponent" @change="fetchStudents" required>
        <option disabled value="">Select Component</option>
        <option v-for="component in components" :key="component.id" :value="component.id">
          {{ component.name }}
        </option>
      </select>
  
      <!-- Student Marks Table -->
      <form v-if="selectedComponent && students.length" @submit.prevent="submitMarks">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Matric No</th>
              <th>Enter Mark</th>
              <th>Latest Mark</th>
              <th>Lecturer Name</th>
              <th>Assessment Component</th>
              <th>Course</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.enrollment_id">
              <td>{{ student.name }}</td>
              <td>{{ student.matric }}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  :max="maxMarkAllowed"
                  v-model.number="marks[student.student_id]"
                  :placeholder="`0 - ${maxMarkAllowed}`"
                  required
                />
              </td>
              <td>
                <div v-if="latestMarkData[student.student_id]">
                  {{ latestMarkData[student.student_id].mark }}
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="latestMarkData[student.student_id]">
                  {{ latestMarkData[student.student_id].updated_by_name }}
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="latestMarkData[student.student_id]">
                  {{ latestMarkData[student.student_id].component_name }}
                </div>
                <div v-else>-</div>
              </td>
              <td>
                <div v-if="latestMarkData[student.student_id]">
                  {{ latestMarkData[student.student_id].course_name }}
                </div>
                <div v-else>-</div>
              </td>
            </tr>
          </tbody>
        </table>
  
        <button type="submit">Submit Marks</button>
      </form>
  
      <div v-if="!students.length && selectedComponent" class="message">
        No students found for this course.
      </div>
  
      <div v-if="message" class="message">{{ message }}</div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        courses: [],
        components: [],
        students: [],
        selectedCourse: '',
        selectedComponent: '',
        marks: {},
        latestMarkData: {},
        maxMarkAllowed: null,
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
        this.courses = Array.isArray(data) ? data : data.courses || [];
      },
  
      async fetchComponents() {
        this.selectedComponent = '';
        this.components = [];
        this.students = [];
        this.marks = {};
        this.latestMarkData = {};
        this.maxMarkAllowed = null;
  
        if (!this.selectedCourse) return;
  
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/assessments/${this.selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        this.components = Array.isArray(data) ? data : data.components || [];
      },
  
      async fetchStudents() {
        this.students = [];
        this.marks = {};
        this.latestMarkData = {};
        this.maxMarkAllowed = null;
  
        if (!this.selectedCourse || !this.selectedComponent) return;
  
        const token = localStorage.getItem("token");
  
        // Enrolled students
        const res = await fetch(`http://localhost:8080/marks/enrolled/${this.selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const enrolledData = await res.json();
        this.students = Array.isArray(enrolledData) ? enrolledData : [];
  
        this.students.forEach(student => {
          this.marks[student.student_id] = '';
        });
  
        // Get selected component details (to extract max_mark)
        const selectedComp = this.components.find(c => c.id == this.selectedComponent);
        if (selectedComp) {
          this.maxMarkAllowed = selectedComp.max_mark ?? 100;
        }
  
        // Existing marks
        const markRes = await fetch(`http://localhost:8080/marks/component/${this.selectedComponent}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        const markData = await markRes.json();
        if (Array.isArray(markData)) {
          markData.forEach(m => {
            this.marks[m.student_id] = m.mark;
            this.latestMarkData[m.student_id] = {
              mark: m.mark,
              updated_at: m.updated_at,
              updated_by_name: m.updated_by_name,
              course_name: m.course_name,
              component_name: m.component_name
            };
          });
        }
      },
  
      async submitMarks() {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
  
        if (!userId) {
          this.message = "User ID missing from local storage.";
          return;
        }
  
        const payload = this.students.map(student => ({
          enrollment_id: student.enrollment_id,
          student_id: student.student_id,
          course_id: this.selectedCourse,
          component_id: this.selectedComponent,
          mark: this.marks[student.student_id],
          updated_by: userId
        }));
  
        const res = await fetch("http://localhost:8080/marks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
  
        const result = await res.json();
        if (res.ok) {
          this.message = "Marks submitted successfully.";
          setTimeout(() => {
            this.fetchStudents(); // refresh data
            this.message = '';
          }, 1500);
        } else {
          this.message = result.message || "Error submitting marks.";
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .mark-entry {
    max-width: 800px;
    margin: auto;
    text-align: center;
  }
  select {
    padding: 8px;
    margin-bottom: 10px;
    width: 100%;
    max-width: 500px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  }
  th, td {
    padding: 10px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    vertical-align: middle;
  }
  input[type="number"] {
    width: 100px;
    padding: 5px;
    text-align: center;
  }
  button {
    margin-top: 15px;
    padding: 10px 15px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
  }
  button:hover {
    background-color: #2c9f6d;
  }
  .message {
    margin-top: 10px;
    color: #2c3e50;
    font-weight: bold;
    text-align: center;
  }
  </style>
  
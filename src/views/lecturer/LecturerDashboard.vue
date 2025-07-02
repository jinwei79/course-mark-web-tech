<template>
  <div class="dashboard">
    <nav class="nav-grid">
      <button @click="setSection('students')">Manage Students</button>
      <button @click="setSection('courses')">Manage Courses</button>
      <button @click="setSection('enrollment')">Manage Enrollment</button>
      <button @click="setSection('components')">Assessment Components</button>
      <button @click="setSection('marks')">Enter Marks</button>
      <button @click="setSection('visualAnalytics')">Visual Analytics</button>
      <button @click="setSection('csv')">Export as CSV</button>
      <button @click="setSection('studentNotification')">Student Notification</button>
    </nav>

    <div v-if="lecturer">
      <div v-if="currentSection === 'students'">
        <StudentManager />
      </div>
      <div v-if="currentSection === 'courses'">
        <CourseManager />
      </div>
      <div v-if="currentSection === 'enrollment'">
        <EnrollmentManager />
      </div>
      <div v-if="currentSection === 'components'">
        <AssessmentManager />
      </div>
      <div v-if="currentSection === 'marks'">
        <MarkEntry />
      </div>
      <div v-if="currentSection === 'visualAnalytics'">
        <VisualAnalytics />
      </div>
      <div v-if="currentSection === 'csv'">
        <ExportCsv />
      </div>
      <div v-if="currentSection === 'studentNotification'">
        <StudentNotification />
      </div>
    </div>

    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script>
import StudentManager from "@/components/Lecturer/StudentManager.vue";
import CourseManager from "@/components/Lecturer/CourseManager.vue";
import EnrollmentManager from "@/components/Lecturer/EnrollmentManager.vue";
import AssessmentManager from "@/components/Lecturer/AssessmentManager.vue";
import MarkEntry from "@/components/Lecturer/MarkEntry.vue";
import VisualAnalytics from "@/components/Lecturer/VisualAnalytics.vue";
import ExportCsv from "@/components/Lecturer/ExportCsv.vue";
import StudentNotification from "@/components/Lecturer/StudentNotification.vue";

export default {
  name: "LecturerDashboard",
  components: {
    StudentManager,
    CourseManager,
    EnrollmentManager,
    AssessmentManager,
    MarkEntry,
    VisualAnalytics,
    ExportCsv,
    StudentNotification,
  },
  data() {
    return {
      lecturer: null,
      currentSection: "students",
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "lecturer") {
      this.$router.push("/");
      return;
    }

    this.lecturer = user;
  },
  methods: {
    setSection(section) {
      this.currentSection = section;
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/login-lecturer");
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.logout-btn {
  float: right;
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

nav {
  margin-bottom: 30px;
  text-align: center;
}

nav button {
  margin: 0 10px;
  text-decoration: none;
  color: white;
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 5px;
  transition: 0.3s;
  border: 1px solid white;
  background-color: #42b983;
}

nav button:hover {
  background-color: white;
  color: #42b983;
  border: 1px solid #42b983;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px auto;
  max-width: 700px;
  padding: 0 10px;
}

.nav-grid button {
  padding: 10px 15px;
  font-weight: bold;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.nav-grid button:hover {
  background-color: #2c9f6d;
}
</style>

<template>
  <div class="course-manager">
    <h2>Manage Courses</h2>

    <!-- Form to Add or Edit a Course -->
    <form @submit.prevent="submitForm">
      <input v-model="form.code" placeholder="Course Code" required />
      <input v-model="form.name" placeholder="Course Name" required />
      <input v-model="form.semester" placeholder="Semester" required />
      <button type="submit">{{ isEditing ? "Update" : "Add" }} Course</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>

    <!-- List of Courses -->
    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          <th>Semester</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="course in courses" :key="course.id">
          <td>{{ course.code }}</td>
          <td>{{ course.name }}</td>
          <td>{{ course.semester }}</td>
          <td>
            <button @click="editCourse(course)">Edit</button>
            <button @click="deleteCourse(course.id)">Delete</button>
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
      courses: [],
      form: {
        id: null,
        code: "",
        name: "",
        semester: "",
      },
      isEditing: false,
      message: "",
    };
  },
  mounted() {
    this.fetchCourses();
  },
  methods: {
    async fetchCourses() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        this.courses = data.courses || [];
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    },
    async submitForm() {
      const url = this.isEditing
        ? `http://localhost:8080/courses/${this.form.id}`
        : "http://localhost:8080/courses";

      const method = this.isEditing ? "PUT" : "POST";
      const payload = {
        code: this.form.code,
        name: this.form.name,
        semester: this.form.semester,
      };

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          this.message = this.isEditing
            ? "Course updated successfully"
            : "Course added successfully";
          this.resetForm();
          this.fetchCourses();
        } else {
          this.message = result.message || "Failed to save course";
        }
      } catch (err) {
        console.error("Submit error:", err);
        this.message = "Network or server error";
      }
    },
    editCourse(course) {
      this.isEditing = true;
      this.form = {
        id: course.id,
        code: course.code,
        name: course.name,
        semester: course.semester,
      };
    },
    async deleteCourse(id) {
      if (!confirm("Are you sure you want to delete this course?")) return;

      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/courses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (response.ok) {
          this.message = "Course deleted successfully";
          this.fetchCourses();
        } else {
          this.message = result.message || "Failed to delete course";
        }
      } catch (err) {
        console.error("Delete error:", err);
        this.message = "Network or server error";
      }
    },
    resetForm() {
      this.isEditing = false;
      this.form = {
        id: null,
        code: "",
        name: "",
        semester: "",
      };
    },
  },
};
</script>

<style scoped>
.course-manager {
  max-width: 800px;
  margin: auto;
}
form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
input {
  padding: 8px;
  width: calc(33% - 10px);
}
button {
  padding: 8px 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #2c9f6d;
}
.message {
  margin: 10px 0;
  color: #2c3e50;
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
</style>

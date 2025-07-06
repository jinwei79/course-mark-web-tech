<template>
  <div class="student-manager">
    <h2>Manage Students</h2>

    <!-- Form to Add or Edit a Student -->
    <form @submit.prevent="submitForm">
      <input v-model="form.matric_no" placeholder="Matric Number" required />
      <input v-model="form.name" placeholder="Name" required />
      <input v-model="form.email" placeholder="Email" required />
      <input
        v-if="!isEditing"
        v-model="form.pin"
        placeholder="PIN (new student)"
        required
      />
      <button type="submit">{{ isEditing ? "Update" : "Add" }} Student</button>
    </form>

    <div v-if="message" class="message">{{ message }}</div>

    <!-- List of Students -->
    <table>
      <thead>
        <tr>
          <th>Matric No</th>
          <th>Name</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.matric_no }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.email }}</td>
          <td>
            <button @click="editStudent(student)">Edit</button>
            <button @click="deleteStudent(student.id)">Delete</button>
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
      students: [],
      form: {
        id: null,
        matric_no: "",
        name: "",
        email: "",
        pin: "",
      },
      isEditing: false,
      message: "",
    };
  },
  mounted() {
    this.fetchStudents();
  },
  methods: {
    async fetchStudents() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        this.students = data.students || [];
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    async submitForm() {
      const url = this.isEditing
        ? `http://localhost:8080/students/${this.form.id}`
        : "http://localhost:8080/students";

      const method = this.isEditing ? "PUT" : "POST";
      const payload = {
        matric_no: this.form.matric_no,
        name: this.form.name,
        email: this.form.email,
      };

      // Only include PIN for new student
      if (!this.isEditing) {
        payload.pin = this.form.pin;
      }

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
            ? "Student updated successfully"
            : "Student added successfully";
          this.resetForm();
          this.fetchStudents();
        } else {
          this.message = result.message || "Failed to save student";
        }
      } catch (err) {
        console.error("Submit error:", err);
        this.message = "Network or server error";
      }
    },
    editStudent(student) {
      this.isEditing = true;
      this.form = {
        id: student.id,
        matric_no: student.matric_no,
        name: student.name,
        email: student.email,
        pin: "", // only used when adding new
      };
    },
    async deleteStudent(id) {
      if (!confirm("Are you sure you want to delete this student?")) return;

      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8080/students/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (res.ok) {
          this.message = "Student deleted successfully";
          this.fetchStudents();
        } else {
          this.message = result.message || "Failed to delete student";
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
        matric_no: "",
        name: "",
        email: "",
        pin: "",
      };
    },
  },
};
</script>

<style scoped>
.student-manager {
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

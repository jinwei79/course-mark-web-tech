<template>
    <div class="dashboard">
    <nav class="nav-grid">
      <button
        :class="{ active: currentSection === 'Lecturer' }"
        @click="setSection('Lecturer')"
      >Lecturer</button>
      <button
        :class="{ active: currentSection === 'Advisor' }"
        @click="setSection('Advisor')"
      >Advisor</button>
      <button
        :class="{ active: currentSection === 'Student' }"
        @click="setSection('Student')"
      >Student</button>
    </nav>

    <div v-if="admin">
      <div v-if="currentSection === 'Lecturer'">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
            <AddUserModal @userAdded="() => { fetchLecturers(); fetchAdvisors(); fetchStudents(); }" />
        </div>
        <table class="responsive-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="lecturers.length === 0">
                    <td colspan="4" style="text-align: center;">No data available</td>
                </tr>
                <tr v-for="lecturer in lecturers" :key="lecturer.id" v-else>
                    <td>{{ lecturer.name }}</td>
                    <td>{{ lecturer.email }}</td>
                    <td>
                        <span v-if="lecturer.is_active" class="status-active">Active</span>
                        <span v-else class="status-inactive">Inactive</span>
                    </td>
                    <td>
                        <EditUserModal :user="lecturer" @userUpdated="() => { fetchLecturers(); fetchAdvisors(); fetchStudents(); }" />
                        <button class="button-danger"  @click="deleteUser(lecturer.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      <div v-if="currentSection === 'Advisor'">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
            <AddUserModal @userAdded="() => { fetchLecturers(); fetchAdvisors(); fetchStudents(); }" />
        </div>
       <table class="responsive-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="advisors.length === 0">
                    <td colspan="4" style="text-align: center;">No data available</td>
                </tr>
                <tr v-for="advisor in advisors" :key="advisor.id" v-else>
                    <td>{{ advisor.name }}</td>
                    <td>{{ advisor.email }}</td>
                    <td>
                        <span v-if="advisor.is_active" class="status-active">Active</span>
                        <span v-else class="status-inactive">Inactive</span>
                    </td>
                    <td>
                        <EditUserModal :user="advisor" @userUpdated="() => { fetchLecturers(); fetchAdvisors(); fetchStudents(); }" />
                        <button class="button-danger"  @click="deleteUser(advisor.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
      <div v-if="currentSection === 'Student'">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
            <AddUserModal @userAdded="() => { fetchLecturers(); fetchAdvisors(); fetchStudents(); }" />
        </div>
        <table class="responsive-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Matric No.</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="students.length === 0">
                    <td colspan="4" style="text-align: center;">No data available</td>
                </tr>
                <tr v-for="student in students" :key="student.id" v-else>
                    <td>{{ student.name }}</td>
                    <td>{{ student.email }}</td>
                    <td>{{ student.matric_no }}</td>
                    <td>
                        <!-- <button @click="editUser(student)">Edit</button> -->
                        <button class="button-danger" @click="deleteUser(student.id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import AddUserModal from "@/components/Admin/AddUserModal.vue";
import EditUserModal from "@/components/Admin/EditUserModal.vue";

export default {
  name: "AdminDashboard",
  components: {
    AddUserModal,
    EditUserModal,
  },
  data() {
    return {
      admin: null,
      currentSection: "Lecturer",
        lecturers: [], // This will hold the list of lecturers
        advisors: [], // This will hold the list of advisors
        students: [], // This will hold the list of students
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!user || !token || user.role !== "admin") {
      this.$router.push("/");
      return;
    }
    this.admin = user;
    this.fetchLecturers();
    this.fetchAdvisors();
    this.fetchStudents();
  },
  methods: {
    setSection(section) {
      this.currentSection = section;
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/");
    },
    async fetchLecturers() {
      try {
        const response = await fetch('http://localhost:8080/users?role=lecturer', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch lecturers');
        const data = await response.json();
        this.lecturers = data.users || [];
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAdvisors() {
      try {
        const response = await fetch('http://localhost:8080/users?role=advisor', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch advisors');
        const data = await response.json();
        this.advisors = data.users || [];
      } catch (error) {
        console.error(error);
      }
    },
    async fetchStudents() {
      try {
        const response = await fetch('http://localhost:8080/students', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        this.students = data.students || [];
      } catch (error) {
        console.error(error);
      }
    },
    editUser(user) {
      // Logic to edit user details
      console.log("Editing user:", user);
      // You can redirect to an edit form or open a modal here
    },
    async deleteUser(userId) {

    if(confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        try {
            const response = await fetch(`http://localhost:8080/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            });
            if (!response.ok) throw new Error('Failed to delete user');
            // Remove the user from the list after successful deletion
            this.lecturers = this.lecturers.filter(lecturer => lecturer.id !== userId);
            this.advisors = this.advisors.filter(advisor => advisor.id !== userId);
            this.students = this.students.filter(student => student.id !== userId);
            console.log("User deleted successfully");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    }
      
    }

  },
};
</script>
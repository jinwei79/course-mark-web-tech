<template>
  <div class="dashboard">
    <h1>Academic Advisor Workspace</h1>
    
      <h2>Student List</h2>
      <table class="responsive-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Matric No.</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr
            v-for="student in students"
            :key="student.id"
            :style="{ backgroundColor: student.is_highlighted === 1 ? '#ffcccc' : '' }"
            >
            <td>{{ student.name }}</td>
            <td>{{ student.matric_no }}</td>
            <td>{{ student.email }}</td>
            <td>
              <button @click="showMarks(student)">Marks</button>
              <button @click="addNotes(student)">Add Notes</button>
              <button @click="exportReport(student.id)">Export</button>
            </td>
            </tr>
          <tr v-if="students.length === 0">
            <td colspan="4" style="text-align:center;">No students found.</td>
          </tr>
        </tbody>
      </table>
      <hr>
    <div v-if="showMarksSection && selectedStudent">
      <h2>Marks for {{ selectedStudent.name }}</h2>
      <table class="responsive-table">
        <thead>
          <tr>
            <th width="40%">Course</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mark, courseCode) in marks" :key="courseCode">
            <td>{{ courseCode }}</td>
            <td>
              <div>Total: {{ mark.total }}</div>
              <div v-for="(entry) in getMarkEntries(mark)" :key="entry[0]">
                {{ entry[0] }}: {{ entry[1] }}
              </div>
            </td>
          </tr>
          <tr v-if="Object.keys(marks).length === 0">
            <td colspan="2" style="text-align:center;">No marks available.</td>
          </tr>
        </tbody>
      </table>
      <div style="display: flex; justify-content: flex-end;">
        <button @click="highlightStudent(selectedStudent.is_highlighted == 1 ? 0 : 1)">{{ selectedStudent.is_highlighted == 0 ? 'Highlight' : 'Unhighlight' }} Student</button>
      </div>
    </div>

    <div v-if="addNotesSection && selectedStudent">
      <h2>Add Notes for {{ selectedStudent.name }}</h2>
      <div v-if="selectedStudent.notes && selectedStudent.notes.length > 0">
        <label for="notes">Notes:</label>
        <div v-for="note in selectedStudent.notes" :key="note.id">
          <p> <span><small style="color: gray">{{ note.created_at }}</small></span> {{ note.note }}</p>
        </div>
      </div>
      <textarea v-model="notes" placeholder="Enter notes here..." rows="5"></textarea>
      <br>
      <div style="display: flex; justify-content: flex-end;">
        <button @click="saveNotes">Save Notes</button>
      </div>
    </div>
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script>


export default {
  name: "AdvisorDashboard",
  components: {
  },
  data() {
    return {
      advisor: null,
      students: [],
      selectedStudent: null,
      showMarksSection: false,
      addNotesSection: false,
      notes: "",
      marks: [],
    };
  },
  mounted() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token || user.role !== "advisor") {
      this.$router.push("/");
      return;
    }

    this.advisor = user;
    this.fetchAdvisees();
  },
  methods: {
    getMarkEntries(mark) {
      return Object.entries(mark).filter(([key]) => key !== 'total');
    },
    async fetchAdvisees() {
      try {
        const response = await fetch("http://localhost:8080/academic-advisors/advisees", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        this.students = data.students || [];
        this.showMarksSection = false;
        this.addNotesSection = false;
        this.selectedStudent = null;

      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/login-advisor");
    },
    showMarks(student) {
      this.selectedStudent = student;
      this.fetchAdviseesMarks();
      this.showMarksSection = true;
      this.addNotesSection = false;
    },
    async fetchAdviseesMarks() {
      try {
        const response = await fetch("http://localhost:8080/students/marks/"+this.selectedStudent.id, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        this.marks = data.marks || [];
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    },
    addNotes(student) {
      this.selectedStudent = student;
      this.showMarksSection = false;
      this.addNotesSection = true;
      this.notes = "";

      console.log("Selected student for notes:", this.selectedStudent);
    },
    async saveNotes() {
      if (!this.notes.trim()) {
        alert("Please enter some notes.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/academic-advisors/advisees/${this.selectedStudent.id}/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ note: this.notes }),
        });

        if (!response.ok) {
          throw new Error("Failed to save notes");
        }

        this.selectedStudent.notes.unshift({
          id: Date.now(), // Temporary ID, should be replaced with actual ID from server
          note: this.notes,
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        this.notes = "";

        console.log("Notes saved successfully:", this.selectedStudent.notes);
      } catch (error) {
        console.error("Error saving notes:", error);
        alert("Error saving notes: " + error.message);
      }
    },
    exportReport(studentId) {
      // Find the student in the current list
      const student = this.students.find(s => s.id === studentId) || {};
      this.selectedStudent = student; // Set selected student for report
      this.fetchAdviseesMarks();

      console.log("Exporting report for student:", student);
      // Dynamically import jsPDF
      import('jspdf').then(jsPDFModule => {
        const { jsPDF } = jsPDFModule;
        const doc = new jsPDF();

        let y = 10;
        doc.setFont(undefined, 'bold');
        doc.text(`Student Report`, 10, y);
        doc.setFont(undefined, 'normal');
        
        y += 20;
        doc.text(`Name: ${student.name || ''}`, 10, y);
        y += 10;
        doc.text(`Matric No.: ${student.matric_no || ''}`, 10, y);
        y += 10;
        doc.text(`Email: ${student.email || ''}`, 10, y);
        y += 20;

        // Add notes if available
        if (student.notes && student.notes.length > 0) {
          doc.text(`Notes:`, 10, y);
          y += 15;
          // Table headers
          doc.setFont(undefined, 'bold');
          doc.text('Date', 12, y);
          doc.text('Note', 100, y);
          doc.setFont(undefined, 'normal');
          y += 10;
          // Table rows
          student.notes.forEach((note) => {
            doc.text(`${note.created_at}`, 12, y);
            doc.text(`${note.note}`, 100, y, { maxWidth: 130 });
            y += 10;
          });
        }

        y += 20;
        // Add marks if available
        doc.text(`Marks:`, 10, y);
        y += 15;
        // Use the same structure as the marks table in the UI
        if (this.marks && Object.keys(this.marks).length > 0) {
          Object.entries(this.marks).forEach(([courseCode, mark]) => {
            doc.setFont(undefined, 'bold');
            doc.text(`${courseCode}`, 12, y);
            doc.setFont(undefined, 'normal');
            y += 8;
            doc.text(`Total: ${mark.total}`, 18, y);
            y += 8;
            Object.entries(mark).forEach(([key, value]) => {
              if (key !== 'total') {
          doc.text(`${key}: ${value}`, 22, y);
          y += 8;
              }
            });
            y += 6; // extra space between courses
          });
        } else {
          doc.text(`No marks available.`, 12, y);
          y += 8;
        }

        doc.save(`student_report_${student.name}.pdf`);
        
      }).catch(error => {
        alert("Failed to export report: " + error.message);
      });

      this.selectedStudent = null; // Reset selected student
      this.marks = []; // Clear marks data
    },
    highlightStudent(status) {
      if (!this.selectedStudent) {
        alert("Please select a student first.");
        return;
      }
      
      fetch(`http://localhost:8080/academic-advisors/advisees/${this.selectedStudent.id}/highlight`, {
        method: "POST",
        body: JSON.stringify({ is_highlighted: status }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then(response => {
          if (!response.ok) throw new Error("Failed to highlight student");
          this.fetchAdvisees(); // Refresh the student list
        })
        .catch(error => {
          console.error("Error highlighting student:", error);
          alert("Error highlighting student: " + error.message);
        });
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

textarea,
select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
}
</style>

<template>
  <div class="notification-list">
    <h2>All Notifications</h2>

   

    <table v-if="notifications.length">
      <thead>
        <tr>
          <th>#</th>
          <th>Student Name</th>
          <th>Component</th>
          <th>Mark</th>
          <th>Message</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(n, index) in notifications" :key="n.id">
          <td>{{ index + 1 }}</td>
          <td>{{ n.student_name || '-' }}</td>
          <td>{{ n.component || '-' }}</td>
          <td>{{ n.mark ?? '-' }}</td>
          <td>{{ n.message }}</td>
          <td>
            <span :class="{ unread: !n.is_read }">
              {{ n.is_read ? "Read" : "Unread" }}
            </span>
          </td>
          <td>{{ formatDate(n.created_at) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No notifications found.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notifications: [],
    };
  },
  mounted() {
    this.fetchAllNotifications();
  },
  methods: {
    async fetchAllNotifications() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/notifications/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      this.notifications = Array.isArray(data) ? data : [];
    },
    async markAllAsRead() {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:8080/notifications/mark-all", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      this.fetchAllNotifications();
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
  },
};
</script>

<style scoped>
.notification-list {
  max-width: 1000px;
  margin: auto;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 8px 14px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #2c9f6d;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: center;
}

.unread {
  font-weight: bold;
  color: #d35400;
}
</style>

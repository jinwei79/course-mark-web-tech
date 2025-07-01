<template>
  <div class="rank-summary" v-if="rankData">
    <h3>Overall Performance Summary</h3>
    <table>
      <tr>
        <td><strong>Total Marks:</strong></td>
        <td>{{ rankData.total }}</td>
      </tr>
      <tr>
        <td><strong>Rank:</strong></td>
        <td>{{ rankData.rank }} out of {{ rankData.total_students }}</td>
      </tr>
      <tr>
        <td><strong>Percentile:</strong></td>
        <td>{{ rankData.percentile }}%</td>
      </tr>
    </table>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: "OverallRankCard",
  data() {
    return {
      rankData: null,
      errorMessage: "",
    };
  },
  mounted() {
    this.fetchRankData();
  },
  methods: {
    async fetchRankData() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8080/students/overall-rank/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const err = await res.json();
          this.errorMessage = err.message || "Failed to fetch ranking.";
          return;
        }

        const data = await res.json();
        this.rankData = data;
      } catch (err) {
        console.error(err);
        this.errorMessage = "Network or server error.";
      }
    },
  },
};
</script>

<style scoped>
.rank-summary {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  background: #f9f9f9;
}
table {
  width: 100%;
  margin-top: 0.5rem;
}
td {
  padding: 0.3rem 0.5rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>

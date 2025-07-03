import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/views/student/LoginPage.vue";
import StudentDashboard from "@/views/student/StudentDashboard.vue";
import LoginLecturer from '@/views/lecturer/LoginLecturer.vue'
import LecturerDashboard from '@/views/lecturer/LecturerDashboard.vue'
import AdvisorLogin from '@/views/advisor/AdvisorLogin.vue';
import AdvisorDashboard from '@/views/advisor/AdvisorDashboard.vue';

import AdminLogin from '@/views/admin/AdminLogin.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';

const routes = [
  { path: "/", name: "Login", component: LoginPage },
  { path: "/dashboard", name: "StudentDashboard", component: StudentDashboard },

  // Lecturer
  { path: "/login-lecturer", name: "LoginLecturer", component: LoginLecturer },
  {
    path: "/dashboard-lecturer",
    name: "LecturerDashboard",
    component: LecturerDashboard,
  },

  //ADVISOR - Faizal
  { path: "/login-advisor", name: "Login Advisor", component: AdvisorLogin},
  { path: "/dashboard-advisor", name: "Advisor Dashboard", component: AdvisorDashboard},
  
    // Admin
{ path: "/login-admin", name: "Login Admin", component: AdminLogin},
  { path: "/dashboard-admin", name: "Dashboard Admin", component: AdminDashboard},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.path === "/" && user?.role === "student") {
    // Already logged in student, redirect to dashboard
    return next("/dashboard");
  }

  if (to.path === "/dashboard") {
    if (!user || user.role !== "student") {
      // Not logged in or wrong role
      return next("/");
    }
  }

  next();
});

export default router;

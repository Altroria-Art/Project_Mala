<template>
  <div class="login-container">
    
    <div class="login-card">

      <div class="text-center mb-14">
        <div class="logo-circle">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/3750/3750663.png" 
            alt="Shiba Logo" 
            class="shiba-logo"
          />
        </div>

        <h1 class="title">Mala Verse</h1>
        <p class="subtitle">Administrator Portal</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-8">

        <div class="input-group">
          <label>Username</label>
          <div class="input-box">
            <i class="fas fa-user"></i>
            <input
              v-model="username"
              type="text"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

        <div class="input-group">
          <label>Password</label>
          <div class="input-box">
            <i class="fas fa-lock"></i>
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button type="submit" class="login-btn">
          เข้าสู่ระบบ
        </button>

      </form>

    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");

const handleLogin = () => {
  if (username.value === "admin" && password.value === "1234") {
    localStorage.setItem("isAdminLoggedIn", "true");
    router.push("/admin");
  } else {
    alert("Username หรือ Password ไม่ถูกต้อง!");
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;600;700&family=Permanent+Marker&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg,#fff7ed,#ffedd5,#fde68a);
  background-size: 400% 400%;
  animation: gradientMove 12s ease infinite;
  font-family: "Kanit", sans-serif;
}

@keyframes gradientMove {
  0% {background-position:0% 50%}
  50% {background-position:100% 50%}
  100% {background-position:0% 50%}
}

.login-card {
  width: 420px;
  padding: 50px 45px;

  border-radius: 30px;

  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(12px);

  box-shadow:
  0 20px 40px rgba(0,0,0,0.08),
  0 10px 20px rgba(255,140,0,0.15);

  border: 1px solid rgba(255,255,255,0.3);

  transition: 0.3s;
}

.login-card:hover{
  transform: translateY(-4px);
}

.logo-circle {
  width: 85px; 
  height: 85px;
  margin: auto;
  margin-bottom: 20px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #ffffff;
  border: 3px solid #f97316;
  box-shadow: 0 8px 20px rgba(255,140,0,0.3);

  overflow: hidden;
  transition: transform 0.3s ease;
}

.logo-circle:hover {
  transform: scale(1.05) rotate(5deg);
}

.shiba-logo {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.title{
  font-family:"Permanent Marker",sans-serif;
  font-size:40px;
  color:#ea580c;
}

.subtitle{
  color:#6b7280;
  font-size:18px;
}

.input-group label{
  font-weight:600;
  color:#374151;
  margin-bottom:6px;
  display:block;
}

.input-box{
  display:flex;
  align-items:center;
  gap:10px;

  border-radius:16px;
  border:2px solid #e5e7eb;

  padding:12px 14px;

  background:#fff;

  transition:0.25s;
}

.input-box i{
  color:#9ca3af;
}

.input-box input{
  border:none;
  outline:none;
  width:100%;
  font-size:16px;
}

.input-box:focus-within{
  border-color:#f97316;
  box-shadow:0 0 0 3px rgba(249,115,22,0.15);
}

.login-btn{
  margin-top:10px;

  background:linear-gradient(135deg,#f97316,#fb923c);

  border:none;
  border-radius:18px;

  padding:14px;

  font-size:20px;
  font-weight:700;
  color:white;

  cursor:pointer;

  transition:0.25s;
}

.login-btn:hover{
  transform:translateY(-2px);
  box-shadow:0 10px 25px rgba(249,115,22,0.35);
}

.login-btn:active{
  transform:scale(0.97);
}
</style>

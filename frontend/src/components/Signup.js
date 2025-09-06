import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // asigură-te că ai stilurile moderne aici

export default function Signup() {
  const navigate = useNavigate();

  // Starea pentru formular
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    full_name: "",
    role: ""
  });

  // Starea pentru erori
  const [errors, setErrors] = useState({});

  // Modificare input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({}); // reset erori la modificare
  };

  // Trimitere formular
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/api/signup/", form)
      .then(res => {
        localStorage.setItem("token", "7d67f14e4858b897f270858d08e8593deb327a25");
        navigate("/"); // redirect la pagina principala
      })

      .catch(err => {
        if (err.response && err.response.data) {
          console.log("Serializer errors frontend:", err.response.data); // vezi exact ce e
          setErrors(err.response.data); // afișare erori pe pagină
        } else {
          setErrors({ general: "Signup failed. Please check your info." });
        }
      });
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {/* Afișare erori */}
        {errors.general && <p className="error">{errors.general}</p>}
        {errors.username && <p className="error">Username: {errors.username.join(", ")}</p>}
        {errors.email && <p className="error">Email: {errors.email.join(", ")}</p>}
        {errors.password && <p className="error">Password: {errors.password.join(", ")}</p>}
        {errors.full_name && <p className="error">Full Name: {errors.full_name.join(", ")}</p>}
        {errors.role && <p className="error">Role: {errors.role.join(", ")}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={form.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role in Company"
          value={form.role}
          onChange={handleChange}
          required
        />

        <button className="btn btn-primary" type="submit">Sign Up</button>

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

import { useState } from "react";
import axios from "../../api/axios";
import "./Auth.css";
import { MdPerson, MdEmail, MdLock, MdSchool, MdBadge, MdDateRange } from "react-icons/md";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Register({ role, onSuccess }) {

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    registerNumber: "",
    email: "",
    password: "",
    department: "",
    batch: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    registerNumber: "",
    email: "",
    password: "",
    department: "",
    batch: "",
    general: "",
  });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({
      name: "",
      registerNumber: "",
      email: "",
      password: "",
      department: "",
      batch: "",
      general: "",
    });
    setLoading(true);

    try {
      await axios.post("/auth/register", form);
      onSuccess();
    } catch (err) {
        const field = err.response?.data?.field;
        const message = err.response?.data?.message || "Register failed";

        if (field) {
          setErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setErrors((prev) => ({ ...prev, general: message }));
        }
    } finally {
      setLoading(false);
    }
  };

  if(role !== "alumni") {
    onSuccess();
  }
  return (
    
    <form className="form sign-up-form" onSubmit={submitHandler}>
      <h2 className="title">Sign up</h2>

      {/* NAME */}
      <div className="input-field">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={changeHandler}
        />
        <MdPerson className="input-icon"/>
      </div>
      {errors.name && (
        <p className="field-error">{errors.name}</p>
      )}

      {/* Register Number */}
      <div className="input-field">
        <input
          type="text"
          name="registerNumber"
          placeholder="Register number"
          value={form.registerNumber}
          onChange={changeHandler}
        />
        <MdBadge className="input-icon"/>
      </div>
      {errors.registerNumber && (
        <p className="field-error">{errors.registerNumber}</p>
      )}

      {/* DEPARTMENT */}
      <div className="input-field">
        <input
          type="text"
          name="department"
          placeholder="Department (e.g. CSE)"
          value={form.department}
          onChange={changeHandler}
        />
        <MdSchool className="input-icon"/>
      </div>
      {errors.department && (
        <p className="field-error">{errors.department}</p>
      )}

      {/* BATCH */}
      <div className="input-field">
        <input
          type="text"
          name="batch"
          placeholder="e.g. 2022-2026"
          pattern="\d{4}-\d{4}"
          value={form.batch}
          onChange={changeHandler}
        />
        <MdDateRange className="input-icon"/>
      </div>
      {errors.batch && (
        <p className="field-error">{errors.batch}</p>
      )}

      {/* EMAIL */}
      <div className="input-field">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={changeHandler}
        />
        <MdEmail className="input-icon"/>
      </div>
      {errors.email && (
        <p className="field-error">{errors.email}</p>
      )}


      {/* PASSWORD */}
      <div className="input-field">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={changeHandler}
        />

        {showPassword ? (
          <MdVisibilityOff
            className="input-icon eye-icon cursor-pointer"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <MdVisibility
            className="input-icon eye-icon cursor-pointer"
            onClick={() => setShowPassword(true)}
          />
        )}
      </div>
      {errors.password && (
        <p className="field-error">{errors.password}</p>
      )}

      {errors.general && (
        <p className="field-error general-error">{errors.general}</p>
      )}
      <input
        type="submit"
        className="btn"
        value={loading ? "Signing up..." : "Sign up"}
        disabled={loading}
      />
    </form>
  );
}

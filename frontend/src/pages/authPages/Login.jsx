import { useState } from "react";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { MdEmail } from "react-icons/md";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Login({ role }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [errors, setErrors] = useState({
  email: "",
  password: "",
  general: "",
});  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({
      email: "",
      password: "",
      general: "",
    });
    setLoading(true);

    try {
      const { data } = await axios.post("/auth/login", {
        email,
        password,
        role,
      });

      login(data.data.token, data.data.user);

      navigate(
        data.data.user.role === "admin"
          ? "/admin/dashboard"
          : "/alumni/dashboard"
      );
    } catch (err) {
        const field = err.response?.data?.field;
        const message = err.response?.data?.message || "Login failed";

        if (field) {
          setErrors((prev) => ({ ...prev, [field]: message }));
        } else {
          setErrors((prev) => ({ ...prev, general: message }));
        }
      } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form sign-in-form" onSubmit={submitHandler}>
      <h2 className="title">Sign in</h2>
      
      {/* <div className="field-wrapper"> */}
        <div className="input-field">
          {/* <i className="fas fa-envelope"></i> */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <MdEmail className="input-icon"/>
       </div>
        {errors.email && (
          <p className="field-error">{errors.email}</p>
        )}
      {/* </div> */}

      {/* <div className="field-wrapper"> */}
<div className="input-field">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
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
      {/* </div> */}

{errors.general && (
  <p className="field-error">{errors.general}</p>
)}
      <input
        type="submit"
        className="btn solid"
        value={loading ? "Logging in..." : "Login"}
        disabled={loading}
      />
    </form>
  );
}

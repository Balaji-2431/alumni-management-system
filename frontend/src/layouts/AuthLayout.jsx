// import { Outlet } from "react-router-dom";

// const AuthLayout = () => {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Outlet />
//     </div>
//   );
// };

// export default AuthLayout;

import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Login from "../pages/authPages/Login";
import Register from "../pages/authPages/Register";

import image from "../assets/test-removebg-preview.png";

export default function AuthLayout() {
  const { role } = useParams();
  const [signUpMode, setSignUpMode] = useState(false);

  if (!role || !["admin", "alumni"].includes(role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={`backs ${signUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          <Login role={role} />
          <Register role={role} onSuccess={() => setSignUpMode(false)} />
        </div>
      </div>

      
      
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            {role === "admin" ? (
              <>
                <h3>Admin Access Only</h3>
                <p>
                  Authorized administrators only. This portal is used to manage
                  alumni, approvals, jobs, and events.
                </p>
              </>
            ) : (
              <>
                <h3>New here? Join the alumni network</h3>
                <p>Register with your details. Your account will be reviewed and approved by admin.</p>
                <button
                  className="btn transparent"
                  onClick={() => setSignUpMode(true)}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
          <img src={image} alt="panel illustration" className="image" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>One of us already ?</h3>
            <p>Log in to access alumni updates, jobs, and events.</p>
            <button
              className="btn transparent"
              onClick={() => setSignUpMode(false)}
            >
              Sign in
            </button>
          </div>
          <img src={image} className="image" />
        </div>

      </div>

    </div>
  );
}

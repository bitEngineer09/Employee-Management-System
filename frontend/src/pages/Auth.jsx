import React, { useState } from 'react';

// components
import ButtonLoader from '../components/Loader/ButtonLoader';

// hooks  
import useLogin from '../hooks/Auth/useLogin';
import useSignup from '../hooks/Auth/useSignup';

// icons
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [newUser, setNewUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const navigate = useNavigate();

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    newUser ?
      signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        adminCode: formData.adminCode,
      }) :
      login({
        email: formData.email,
        password: formData.password,
      })
  };

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  // hooks data
  const { login, isLoading: loginLoading, error: loginError } = useLogin();
  const { signup, isLoading: signupLoading, error: signupError } = useSignup();

  return (
    <div className='flex h-screen items-center justify-center bg-auth-gradient px-4'>
      <div className="border border-(--border-primary) rounded-xl p-5 bg-login-card w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl text-(--text-primary) font-semibold">
          {newUser ? "Create" : "Login to"} your Account
        </h1>
        <p className="text-xs sm:text-sm text-(--text-secondary) mt-3">
          {newUser ? "Create your account to start your team track" : "See what is going on with your team"}
        </p>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">

          {/* Name */}
          {newUser && (
            <InputCard
              label="Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          {/* Email */}
          <InputCard
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          {/* Password */}
          <InputCard
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            showPassword={showPassword}
            toggleShowPassword={() => setShowPassword(!showPassword)}
          />

          {
            newUser && (
              <>
                {/* Confirm Password */}
                <InputCard
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                />

                {/* Admin Code */}
                <InputCard
                  label="Admin Code"
                  type="password"
                  name="adminCode"
                  value={formData.adminCode}
                  onChange={handleChange}
                />
              </>
            )
          }

          {/* error display */}
          {(loginError || signupError) && (
            <div
              className="
              border border-red-500
              bg-red-700/20
              text-(--text-primary)
              rounded-md my-3
              p-2 text-center
              ">
              {
                loginError?.response?.data?.message ||
                signupError?.response?.data?.message ||
                "Something went wrong"
              }
            </div>
          )}

          {/* Login / signup button */}
          <button
            disabled={loginLoading || signupLoading}
            className="
            w-full p-2
            font-semibold rounded-md
            cursor-pointer 
            bg-(--blue-dark) text-(--text-primary)
            hover:bg-(--blue-hover) transition-colors
            flex items-center justify-center
            disabled:opacity-50
            disabled:cursor-not-allowed
            ">
            {
              loginLoading || signupLoading
                ? <ButtonLoader />
                : newUser ? "Signup" : "Login"
            }
          </button>

          {!newUser && (
            <p
              onClick={() => navigate("/auth/forgot-password")}
              className="
              text-sm mt-2
              text-(--blue-light)
              cursor-pointer
              hover:underline
              text-right
              ">
              Forgot Password?
            </p>
          )}
        </form>


        <div
          className="
          mt-5 flex flex-col 
          sm:flex-row justify-center 
          items-center
          gap-1 sm:gap-3 text-sm
        ">
          <p className='text-(--text-secondary)'>
            {newUser ? "Already have an account?" : "Not registered Yet?"}
          </p>
          <p
            onClick={() => setNewUser(!newUser)}
            className="
            text-(--blue-light)
              font-medium cursor-pointer
            ">{newUser ? "Login to your account" : "Create an account"}</p>
        </div>
      </div>
    </div>
  )
}

export default Auth;

const InputCard = ({
  label,
  type,
  name,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}) => {

  return (
    <div className="flex flex-col relative">
      <label className="text-sm text-(--text-secondary)">{label}</label>

      <input
        type={type === "password" && showPassword ? "text" : type}
        name={name}
        value={value}
        onChange={onChange}
        className="
          border border-(--border-primary)
          rounded-md 
          py-2 px-2
          text-sm text-(--text-secondary)
          mt-1
          outline-none
        "
      />

      {type === "password" && toggleShowPassword && (
        showPassword ? (
          <Eye
            size={15}
            onClick={toggleShowPassword}
            className="absolute right-2 top-9 text-(--text-secondary) cursor-pointer"
          />
        ) : (
          <EyeOff
            size={15}
            onClick={toggleShowPassword}
            className="absolute right-2 top-9 text-(--text-secondary) cursor-pointer"
          />
        )
      )}
    </div>
  );
};

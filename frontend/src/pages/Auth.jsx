import React, { useState } from 'react';
import useLogin from '../hooks/useLogin';
import useSignup from '../hooks/useSignup';
import ButtonLoader from '../components/Loader/buttonLoader';
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";


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

  const { login, isLoading: loginLoading, error: loginError } = useLogin();
  const { signup, isLoading: signupLoading, error: signupError } = useSignup();

  return (
    <div className='flex h-screen items-center justify-center bg-(--bg-secondary) px-4'>
      <div className="border border-(--border-primary) rounded-xl p-5 bg-(--bg-tertiary) w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl text-(--text-primary) font-semibold">{newUser ? "Create" : "Login to"} your Account</h1>
        <p className="text-xs sm:text-sm text-(--text-secondary) mt-3">{newUser ? "Create your account to start your team track" : "See what is going on with your team"}</p>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
          {/* name */}
          {
            newUser && (
              <div className='flex flex-col'>
                <label htmlFor="email" className="text-sm text-(--text-secondary)">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="
                    border border-(--border-primary)
                    rounded-md 
                    py-2 px-2
                    text-sm text-(--text-secondary)
                    mt-1
                    outline-none
                  "/>
              </div>
            )
          }

          {/* email */}
          <div className='flex flex-col'>
            <label htmlFor="email" className="text-sm text-(--text-secondary)">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="
                border border-(--border-primary)
                rounded-md 
                py-2 px-2
                text-sm text-(--text-secondary)
                mt-1
                outline-none
              "/>
          </div>

          {/* password */}
          <div className='flex flex-col relative'>
            <label htmlFor="password" className="text-sm text-(--text-secondary)">Password</label>
            <input
              type={`${showPassword ? "text" : "password"}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="
                border border-(--border-primary)
                rounded-md 
                py-2 px-2
                text-sm text-(--text-secondary)
                mt-1
                outline-none
              "/>
            {
              showPassword
                ? <FaRegEye onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-9 text-(--text-secondary)' />
                : <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-9 text-(--text-secondary)' />
            }

          </div>
          {
            newUser ?
              <>
                {/* confirm password */}
                <div className='flex flex-col relative'>
                  <label htmlFor="confirmPassword" className="text-sm text-(--text-secondary)">Confirm Password</label>
                  <input
                    onChange={handleChange}
                    type={`${showPassword ? "text" : "password"}`}
                    value={formData.confirmPassword}
                    name="confirmPassword"
                    className="
                      border border-(--border-primary)
                      rounded-md 
                      py-2 px-2
                      text-sm text-(--text-secondary)
                      mt-1
                      outline-none
                    "/>
                  {
                    showPassword
                      ? <FaRegEye onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-9 text-(--text-secondary)' />
                      : <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} className='absolute right-2 top-9 text-(--text-secondary)' />
                  }
                </div>

                {/* admin code */}
                <div className='flex flex-col'>
                  <label htmlFor="adminCode" className="text-sm text-(--text-secondary)">Admin Code</label>
                  <input
                    type="password"
                    name="adminCode"
                    onChange={handleChange}
                    value={formData.adminCode}
                    className="
                      border border-(--border-primary)
                      rounded-md 
                      py-2 px-2
                      text-sm text-(--text-secondary)
                      mt-1
                      outline-none
                    "/>
                </div>
              </>
              : null
          }

          {/* error display */}
          {
            (loginError || signupError) && (
            <div
              className="
                border border-red-500
                bg-red-700/20
                text-(--text-primary)
                rounded-md my-3
                p-2 text-center
              ">
              {loginError?.response?.data?.message ||
                signupError?.response?.data?.message}
            </div>
            )
          }

          <button
            disabled={loginLoading || signupLoading}
            className="
              w-full p-2
              font-semibold rounded-md
              cursor-pointer 
              bg-(--blue-dark) text-(--text-primary)
              hover:bg-(--blue-hover) transition-colors
              flex items-center justify-center
            ">{
              loginLoading || signupLoading
                ? <ButtonLoader />
                : newUser ? "Signup" : "Login"
            }
          </button>
        </form>

        <div className="mt-5 flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-3 text-sm">
          <p className='text-(--text-secondary)'>{newUser ? "Already have an account?" : "Not registered Yet?"}</p>
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
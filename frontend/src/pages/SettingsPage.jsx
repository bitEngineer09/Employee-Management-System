import React, { useState } from "react";
import useChangeDefaultPassword from "../hooks/Auth/useChangeDefaultPassword";
import ButtonLoader from "../components/Loader/ButtonLoader";
import { Eye, EyeOff, KeyRound, Lock } from "lucide-react";

const SettingsPage = () => {
  const { changeDefaultPassword, isLoading } = useChangeDefaultPassword();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    changeDefaultPassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

  };

  return (
    <div className="flex items-center justify-center mt-3">
      <div
        className="
        w-full max-w-md
        bg-gray-900 rounded-2xl 
        shadow-2xl p-5
        border border-gray-700
      ">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 flex items-center justify-center bg-blue-500/20 rounded-xl">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-(--text-primary)">Change Password</h2>
            <p className="text-sm text-(--text-tertiary) mt-0.5">Update your default password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div className="relative">
            <label
              htmlFor="oldPaswd"
              className="text-sm font-semibold text-gray-300 mb-2 block">
              Old Password
            </label>
            <div className="relative">
              <input
                type={show.old ? "text" : "password"}
                name="oldPassword"
                id="oldPaswd"
                value={form.oldPassword}
                onChange={handleChange}
                placeholder="Enter old password"
                required
                className="
                w-full px-4 py-2
                bg-gray-900/50
                border border-gray-700
                rounded-xl 
                text-(--text-primary)
                placeholder-gray-500
                focus:outline-none focus:ring-2
                focus:ring-blue-500
                focus:border-transparent 
                transition-all duration-200
              "/>
              <button
                type="button"
                onClick={() => setShow({ ...show, old: !show.old })}
                className="
                absolute right-3 top-1/2
                -translate-y-1/2
                text-(--text-tertiary) hover:text-gray-300
                transition-colors
              ">
                {show.old ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="relative">
            <label
              htmlFor="newPswd"
              className="text-sm font-semibold text-gray-300 mb-2 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={show.new ? "text" : "password"}
                name="newPassword"
                id="newPswd"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                className="
                w-full px-4 py-2
                bg-gray-900/50
                border border-gray-700
                rounded-xl 
                text-(--text-primary)
                placeholder-gray-500
                focus:outline-none focus:ring-2
                focus:ring-blue-500
                focus:border-transparent 
                transition-all duration-200
              "/>
              <button
                type="button"
                onClick={() => setShow({ ...show, new: !show.new })}
                className="
                absolute right-3 top-1/2
                -translate-y-1/2
                text-(--text-tertiary)
                hover:text-gray-300 transition-colors
              ">
                {show.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPswd"
              className="text-sm font-semibold text-gray-300 mb-2 block">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={show.confirm ? "text" : "password"}
                name="confirmPassword"
                id="confirmPswd"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                className="
                w-full px-4 py-2
                bg-gray-900/50
                border border-gray-700
                rounded-xl 
                text-(--text-primary)
                placeholder-gray-500
                focus:outline-none focus:ring-2
                focus:ring-blue-500
                focus:border-transparent 
                transition-all duration-200
              "/>
              <button
                type="button"
                onClick={() => setShow({ ...show, confirm: !show.confirm })}
                className="
                absolute right-3 top-1/2
                -translate-y-1/2
                text-(--text-tertiary)
                hover:text-gray-300 transition-colors
                ">
                {show.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300 font-medium mb-1.5">Password Requirements:</p>
            <ul className="text-xs text-(--text-tertiary) space-y-0.5 ml-4 list-disc">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="
            w-full mt-6 py-3
            flex items-center justify-center gap-2
            rounded-xl bg-cyan-600
            text-(--text-primary) font-semibold 
            hover:scale-102 cursor-pointer
            transition-all duration-200
            disabled:opacity-50 
            disabled:cursor-not-allowed 
          ">
            {isLoading ? (
              <ButtonLoader />
            ) : (
              <>
                <KeyRound size={18} />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
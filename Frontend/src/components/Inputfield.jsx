import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export default function InputField({
  id,
  label,
  Icon,
  type,
  placeholder,
  value,
  onChange,
  children,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  return (
    <div className="w-full gsap-item">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative flex items-center bg-white rounded-xl shadow-inner border border-purple-100/50 p-3">
        <Icon className="w-5 h-5 text-purple-400 mr-3 shrink-0" />
        <input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-base"
          required
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="text-gray-400 hover:text-purple-500"
          >
            {isPasswordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

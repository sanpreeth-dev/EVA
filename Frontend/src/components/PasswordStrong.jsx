export default function PasswordStrengthMeter({ password }) {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex h-1.5 rounded-full overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-1/5 ${
              strength > i ? strengthColors[strength - 1] : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
      <p className="text-xs font-medium text-gray-500 text-right">
        {strengthLabels[strength - 1] || ""}
      </p>
    </div>
  );
}

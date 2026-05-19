import React from "react";

export const BAR_COLORS = [
  "",
  "bg-red-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
];

export const STRENGTH_LABELS = ["", "Too weak", "Fair", "Good", "Strong"];

export const getPasswordScore = (pw) => {
  if (!pw) return 0;

  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  return score;
};

export const PasswordStrength = ({ password }) => {
  const score = getPasswordScore(password);
  const color = password ? BAR_COLORS[score] : "bg-slate-200";

  return (
    <div>
      <div className="mt-[10px] mb-1 flex gap-[6px]">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-[5px] flex-1 rounded-full transition-all duration-300 ${
              password && i <= score ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p className="text-left text-[12px] text-slate-400">
        Password strength:{" "}
        <span className="font-semibold text-slate-600">
          {password ? STRENGTH_LABELS[score] : ""}
        </span>
      </p>
    </div>
  );
};

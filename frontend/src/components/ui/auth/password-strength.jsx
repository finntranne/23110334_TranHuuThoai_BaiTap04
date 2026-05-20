import React from "react";

export const BAR_COLORS = [
  "",
  "bg-rose-500",
  "bg-amber-500",
  "bg-indigo-500",
  "bg-emerald-500",
];

export const STRENGTH_LABELS = ["", "Quá yếu", "Trung bình", "Khá tốt", "Rất mạnh"];

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
  const color = password ? BAR_COLORS[score] : "bg-neutral-200";

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-[4px] flex-1 rounded-full transition-all duration-300 ${
              password && i <= score ? color : "bg-neutral-200"
            }`}
          />
        ))}
      </div>

      <p className="text-left text-[11px] text-neutral-500 mt-1">
        Độ mạnh mật khẩu:{" "}
        <span className="font-bold text-neutral-800">
          {password ? STRENGTH_LABELS[score] : "Chưa nhập"}
        </span>
      </p>
    </div>
  );
};

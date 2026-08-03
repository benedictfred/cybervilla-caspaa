import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export const getAge = (dob: string) => {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return `${Math.abs(age)} yrs`;
};

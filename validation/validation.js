import { z } from "zod";

const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

const genderOptions = z.enum(["Male", "Female", "Other", "Prefer not to say"]);
const jobTypeOptions = z.enum(["Full Time", "Part Time", "Internship"]);
const workplaceOptions = z.enum(["On-site", "Hybrid", "Remote"]);
const truthyOptions = z.enum(["True", "False"]);
const recruitmentOptions = z.enum([
  "1 to 3 days",
  "3 to 7 days",
  "1 to 2 weeks",
  "2 to 4 weeks",
  "More than 4 weeks",
]);
const rateOptions = z.enum(["per year", "per month", "per week", "per hour"]);

export const userSchema = z.object({
  first_name: z
    .string()
    .min(2, "first name must be at least 2 characters long"),
  last_name: z.string().min(2, "last name must be at least 2 characters long"),
  username: z.string().min(2, "last name must be at least 2 characters long"),
  gender: genderOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  experience_level: z
    .string()
    .min(1, "Please mention experience, even if its none"),
  age: z.number().min(14, "age is required"),
  education_level: z.string().min(4, "education level is required"),
  languages: z.string().min(2, "language is required"),
  phone: z.string().refine((value) => /^\+44\d{10}$/.test(value), {
    message: "Phone number must start with +44 and be followed by 10 digits",
  }),
  email: z.string().email("Invalid email address"),
});

export const jobPostSchema = z.object({
  job_title: z.string().min(4, "Title must have at least 4 characters"),
  category: z.object({
    value: z.number().positive("Category is required!"),
    label: z.string(),
  }),
  sub_category: z.object({
    value: z.number().positive("Sub category value must be positive"),
    label: z.string(),
  }),
  job_type: jobTypeOptions.refine((value) => value !== undefined, {
    message: "Please select an option",
  }),
  workplace_type: workplaceOptions.refine((value) => value !== undefined, {
    message: "Please select an option",
  }),
  exp_required: z.string().min(3, "experience is required"),
  gender: genderOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  url: z.string().url(),
  is_published: truthyOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  is_closed: truthyOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  recruitment_timeline: recruitmentOptions.refine(
    (value) => value !== undefined,
    {
      message: "Please select a valid option",
    }
  ),
  city: z.object({
    value: z.number().positive("select a city"),
    label: z.string(),
  }),
  pincode: z
    .string()
    .min(6, "pincode must be of 6 digits")
    .max(6, "pincode must be of 6 digits"),
  location: z.string().min(4, "address is required"),
  job_des: z.string().min(4, "job description is required"),
  skills_req: z
    .array(
      z.object({
        value: z.number().positive(),
        label: z.string(),
      })
    )
    .min(1, "At least choose one skill"),
  max_salary: z.string().min(1, "max salary is required"),
  min_salary: z.string().min(1, "min salary is required"),
  rate: rateOptions.refine((value) => value !== undefined, {
    message: "Please select an option",
  }),
});

export const companySchema = z.object({});

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
const educationItemSchema = z.object({
  institution_name: z.string().min(1, "Institution name is required"),
  field_of_study: z.string().min(1, "Field of study is required"),
  degree: z.enum(
    ["HS", "AD", "BD", "MD", "PHD", "OT"],
    "Invalid degree option"
  ), // Validate against specific degree options
  location: z.string().min(1, "Location is required"),
  grade: z.string().min(1, "grade is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().nullable(),
});

export const userEducationSchema = z.object({
  education: z
    .array(educationItemSchema)
    .min(1, "At least one education entry is required"),
});
export const userSchema = z.object({
  first_name: z
    .string()
    .min(2, "first name must be at least 2 characters long"),
  last_name: z.string().min(2, "last name must be at least 2 characters long"),
  username: z.string().min(2, "last name must be at least 2 characters long"),
  gender: genderOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  age: z.number().min(14, "minimum age is 14"),
  languages: z.string().min(2, "language is required"),
  phone: z.string().refine((value) => /^\+44\d{10}$/.test(value), {
    message: "Phone number must start with +44 and be followed by 10 digits",
  }),
  email: z.string().email("Invalid email address"),
});

export const userContact = z.object({
  email: z.string().email("Invalid email address"), // Validates that the input is a valid email
  pincode: z.string().length(6, "Pincode must be exactly 6 digits"), // Validates that the pincode is exactly 6 digits long
  address1: z.string().min(2, "Address line 1 is required"), // Ensures address1 is not empty
  address: z.string().min(2, "address is required"), // Optional field for address line 2, if needed
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

// Define a schema for a single experience entry
const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  employment_type: z.string().min(1, "Employment type is required"),
  company_name: z.string().min(1, "Company name is required"),
  location: z.string(),
  location_type: z.enum(["On-site", "Remote", "Hybrid"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional().nullable(),
  is_current: z.boolean().optional(),
});

// Define the schema for the entire form which includes an array of experience entries
export const userExperienceSchema = z.object({
  experience: z
    .array(experienceSchema)
    .min(1, "At least one experience is required"),
});

// Define a schema for a single certificate entry
const certificateSchema = z.object({
  cert_title: z.string().min(1, "Certificate title is required"),
  issuing_organization: z.string().min(1, "Issuing organization is required"),
  certificate_file: z.any(), // This can be refined further if you need specific validation
  issue_date: z.string().min(1, "Issue date is required"),
  expiration_date: z.string().nullable(),
  working: z.boolean().optional(),
  link: z.string().url("Must be a valid URL"),
  skills_acquired: z.string(),
});

// Define the schema for the entire form which includes an array of certificates
export const userCertificateSchema = z.object({
  certificate: z
    .array(certificateSchema)
    .min(1, "At least one certificate is required"),
});

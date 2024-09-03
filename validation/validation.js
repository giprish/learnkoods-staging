import { z } from "zod";

const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

const usergenderOptions = z.enum([
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
]);
const genderOptions = z.enum(["Male", "Female", "All"]);
const jobTypeOptions = z.enum(["Full Time", "Part Time", "Internship"]);
const workplaceOptions = z.enum(["On-site", "Hybrid", "Remote"]);
const truthyOptions = z.enum(["True", "False"]);
const experienceOptions = z.enum([
  "Fresher",
  "1-2 years",
  "2-3 years",
  "3-4 years",
  "4-5 years",
  "5-7 years",
  "7-9 years",
  "9-11 years",
  "11-13 years",
  "13-15 years",
  "15+ above years",
]);

const recruitmentOptions = z.enum([
  "1-7 days",
  "8-15 days",
  "16-30 days",
  "31-60 days",
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
  gender: usergenderOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  age: z.number().min(14, "minimum age is 14"),
  languages: z.string().min(2, "language is required"),
  email: z.string().email("Invalid email address"),
  skills: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, "Please select at least one skill"),
  profile_desc: z.string().min(1, "Profile description is required"),
  current_salary: z.number(),
  expected_salary: z.number(),
  position: z.object({
    value: z.number().positive("select a position"),
    label: z.string(),
  }),
});

export const userContact = z.object({
  email: z.string().email("Invalid email address"), // Validates that the input is a valid email
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  pincode: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) ? undefined : num; // Convert to number or return undefined if invalid
    })
    .refine((val) => val !== undefined, {
      message: "Pincode must be a valid number",
    })
    .refine((val) => val >= 100000 && val <= 999999, {
      message: "Pincode must be exactly 6 digits",
    }),
  country: z.object({
    value: z.number().positive("select a country"),
    label: z.string(),
  }),
  state: z.object({
    value: z.number().positive("select a state"),
    label: z.string(),
  }),
  city: z.object({
    value: z.number().positive("select a city"),
    label: z.string(),
  }), // Validates that the pincode is exactly 6 digits long
  address1: z.string().min(2, "Address line 1 is required"), // Ensures address1 is not empty
  address: z.string().min(2, "address is required"), // Optional field for address line 2, if needed
});

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
  skills_acquired: z
    .array(
      z.object({
        value: z.number().optional(),
        label: z.string(),
      })
    )
    .min(1, "Please select at least one skill"),
});

// Define the schema for the entire form which includes an array of certificates
export const userCertificateSchema = z.object({
  certificate: z
    .array(certificateSchema)
    .min(1, "At least one certificate is required"),
});

export const companyRegistrationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Must be a valid email"),
  phone_number: z.string(), // You can add specific validation like length, pattern, etc.
  website: z.string().url("Must be a valid URL"),
  since: z.string().min(1, "Since field is required"), // You can add date-specific validation if needed
  team_size: z.enum(
    ["50-100", "100-150", "150-200", "200-250", "250-300", "300-500", "500+"],
    "Team size is required"
  ),
  country: z.object({
    value: z.number().positive("select a country"),
    label: z.string(),
  }),
  profile_image: z.any(), // Add file validation if needed
  country: z.object({
    value: z.number().positive("select a country"),
    label: z.string(),
  }),
  state: z.object({
    value: z.number().positive("select a state"),
    label: z.string(),
  }),
  city: z.object({
    value: z.number().positive("select a city"),
    label: z.string(),
  }),
  industry: z.object({
    value: z.number().positive("select a industry"),
    label: z.string(),
  }),
  pincode: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) ? undefined : num; // Convert to number or return undefined if invalid
    })
    .refine((val) => val !== undefined, {
      message: "Pincode must be a valid number",
    })
    .refine((val) => val >= 100000 && val <= 999999, {
      message: "Pincode must be exactly 6 digits",
    }), // You can add length or pattern validation if needed
  address1: z.string(),
  address: z.string(),
  description: z.string(),
});

export const jobPostSchema = z.object({
  questions: z.array(
    z.object({
      question_name: z.string().min(1, "Question name cannot be empty"),
    })
  ),
  job_title: z.string().min(4, "Title must have at least 4 characters"),
  job_type: jobTypeOptions.refine((value) => value !== undefined, {
    message: "Please select an option",
  }),
  workplace_type: workplaceOptions.refine((value) => value !== undefined, {
    message: "Please select an option",
  }),
  exp_required: experienceOptions.refine((value) => value !== undefined, {
    message: "Experience is required",
  }),
  gender: genderOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  url: z.string().url().or(z.literal("")).optional(),
  is_published: truthyOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  is_closed: truthyOptions.refine((value) => value !== undefined, {
    message: "Please select a valid option",
  }),
  category: z.object({
    value: z.number().positive("Category is required!"),
    label: z.string(),
  }),
  sub_category: z.object({
    value: z.number().positive("Sub category is required"),
    label: z.string(),
  }),
  recruitment_timeline: recruitmentOptions.refine(
    (value) => value !== undefined,
    {
      message: "Please select a valid option",
    }
  ),
  country: z.object({
    value: z.number().positive("select a country"),
    label: z.string(),
  }),
  state: z.object({
    value: z.number().positive("select a state"),
    label: z.string(),
  }),
  city: z.object({
    value: z.number().positive("select a city"),
    label: z.string(),
  }),
  pincode: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10);
      return isNaN(num) ? undefined : num; // Convert to number or return undefined if invalid
    })
    .refine((val) => val !== undefined, {
      message: "Pincode must be a valid number",
    })
    .refine((val) => val >= 100000 && val <= 999999, {
      message: "Pincode must be exactly 6 digits",
    }),
  location1: z.string().min(2, "Address is required"),
  location: z.string().min(2, "Address is required"),
  job_des: z.string().min(1, "Job description is required"),
  skills_req: z
    .array(
      z.object({
        value: z.number(),
        label: z.string(),
      })
    )
    .min(1, "Please select at least one skill"),
  min_salary: z
    .number({
      required_error: "Minimum salary is required",
      invalid_type_error: "Minimum salary must be a valid number",
    })
    .min(0, "Minimum salary must be at least 0")
    .positive("Minimum salary must be a positive number"),
  max_salary: z
    .number({
      required_error: "Maximum salary is required",
      invalid_type_error: "Maximum salary must be a valid number",
    })
    .min(0, "Maximum salary must be at least 0")
    .positive("Maximum salary must be a positive number"),
  rate_type: z.enum(["Per Year", "Per Month", "Per Week", "Per Hour"], {
    required_error: "Rate type is required",
    invalid_type_error: "Invalid rate type selected",
  }),
});
// .superRefine((data, ctx) => {
//   if (data.max_salary <= data.min_salary) {
//     ctx.addIssue({
//       path: ["max_salary"],
//       message: "Maximum salary must be greater than minimum salary",
//       code: z.ZodIssueCode.custom,
//     });
//   }
// });

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(
    /[0-9\s\W]/,
    "Password must include at least one number, symbol, or whitespace"
  );

export const changePasswordSchema = z
  .object({
    old_password: z.string(),
    new_password: passwordSchema,
    confirm_password: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

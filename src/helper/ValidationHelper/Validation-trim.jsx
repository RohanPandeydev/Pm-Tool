import * as Yup from "yup";

export const AddUser = Yup.object().shape({
  userName: Yup.string()
    .trim()
    .required("Username is required")
    .min(3, "Minimum 3 characters"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  gender: Yup.string().trim().required("Gender is required"),
  role: Yup.string().trim().required("Role is required"),
  reportingTo: Yup.string().trim(),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .max(160, "Maximum 160 characters")
    .required("Email is required")
    .typeError("Email must be valid"),
  password: Yup.string()
    .trim()
    .min(8, "Password is too short - should be 8 chars minimum")
    .max(64, "Password is too long - should be 64 chars maximum")
    .required("Password is required"),
  c_password: Yup.string()
    .trim()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  designation: Yup.string().trim().required("Designation required"),
  team: Yup.array()
    .min(1, "At least one team member is required")
    .max(5, "Maximum five team members allowed"),
});

export const UpdateUser = Yup.object().shape({
  userName: Yup.string()
    .trim()
    .required("Username is required")
    .min(3, "Minimum 3 characters"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  gender: Yup.string().trim().required("Gender is required"),
  role: Yup.string().trim().required("Role is required"),
  reportingTo: Yup.string().trim().required("Reporting is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .max(160, "Maximum 160 characters")
    .required("Email is required"),
  team: Yup.array()
    .min(1, "At least one team member is required")
    .max(5, "Maximum five team members allowed"),
  designation: Yup.string().trim().required("Designation required"),
});

export const Role = Yup.object().shape({
  roleName: Yup.string().trim().required("Required"),
  rolePermissions: Yup.array().min(1, "Required"),
});

export const RolePermission = Yup.object().shape({
  rolePermissionName: Yup.string().trim().required("Required"),
  role: Yup.array().min(1, "Required"),
});

export const RoleFrom = Yup.object().shape({
  roleName: Yup.string().trim().required("Role name required"),
  roleUId: Yup.string().trim().required("Role code required"),
});

export const LoginForm = Yup.object().shape({
  username: Yup.string().trim().required("Email is required"),
  password: Yup.string().trim().required("Password is required"),
});

export const ResetFormValidation = Yup.object().shape({
  password: Yup.string()
    .trim()
    .min(8, "Password is too short - should be 8 chars minimum")
    .max(64, "Password is too long - should be 64 chars maximum")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .trim()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const ProfileBasicDetails = Yup.object().shape({
  userName: Yup.string()
    .trim()
    .required("Username is required")
    .min(3, "Minimum 3 characters"),
  gender: Yup.string().trim().required("Gender is required"),
  dateOfBirth: Yup.date()
    .max(new Date(Date.now() - 86400000), "Please enter a valid date of birth")
    .typeError("Please enter a numeric value.")
    .required("Date of Birth required"),
});

export const ProfileContactDetails = Yup.object().shape({
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email format")
    .max(160, "Maximum 160 characters")
    .required("Email is required"),
});

export const AddTeamForm = Yup.object().shape({
  teamName: Yup.string()
    .trim()
    .required("Team name is required")
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters allowed"),
});

export const AddDesignationForm = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Designation name is required")
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters allowed"),
});

export const AddProjectForm = Yup.object().shape({
  name: Yup.string().trim().required("Project name is required"),
  customerName: Yup.string().trim(),
  customerEmail: Yup.string().trim().email("Invalid email format"),
  assistantManagerId: Yup.string().trim().required("Sales team is required"),
  customerPhoneNumber: Yup.string().trim(),
  teams: Yup.array()
    .min(1, "At least one team is required")
    .required("Teams are required"),
  priceType: Yup.string().trim(),
  estimatedTime: Yup.number()
    .required("Estimated time is required")
    .typeError("Estimated time must be a number"),
  price: Yup.number().typeError("Price must be a number"),
  startDate: Yup.date()
    .required("Start Date is required")
    .typeError("Invalid date format"),
  endDate: Yup.date()
    .required("End Date is required")
    .typeError("Invalid date format"),
  comments: Yup.string()
    .trim()
    .max(200, "Comment must be less than 200 characters"),
});

export const AddTeamMemberForm = Yup.object().shape({
  member: Yup.array()
    .min(1, "At least one team is required")
    .required("Teams are required"),
});

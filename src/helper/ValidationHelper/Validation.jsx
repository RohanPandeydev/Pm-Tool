import * as Yup from "yup";
export const AddUser = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .min(3, "Minimum 3 character"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
  role: Yup.string().required("Role is required"),
  reportingTo: Yup.string(),
  email: Yup.string()
    .email("Invalid email format")
    .max(160, "Maximum 160 character")
    .required("Email is required").typeError("Email must be valid"),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum")
    .max(64, "Password is too long - should be 64 chars maximun")
    .required("Password is required"),
  c_password: Yup.string()
    .required("Confrim password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
    designation:Yup.string().required("Designation required"),

  team: Yup.array()
    // Validate minimum number of elements in the array
    .min(1, 'At least one team  is required')
    // Validate maximum number of elements in the array
    .max(5, 'Maximum five team  allowed')

});
export const UpdateUser = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .min(3, "Minimum 3 character"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
  role: Yup.string().required("Role is required"),
  reportingTo: Yup.string().required("Reporting is required"),
  email: Yup.string()
    .email("Invalid email format")
    .max(160, "Maximum 160 character")
    .required("Email is required"),
  team: Yup.array()
    // Validate minimum number of elements in the array
    .min(1, 'At least one team member is required')
    // Validate maximum number of elements in the array
    .max(5, 'Maximum five team members allowed'),
    designation:Yup.string().required("Designation required")
});
export const Role = Yup.object().shape({
  roleName: Yup.string().required("Required"),
  rolePermissions: Yup.array().min(1, "Required"),
});
export const RolePermission = Yup.object().shape({
  rolePermissionName: Yup.string().required("Required"),
  role: Yup.array().min(1, "Required"),
});
export const RoleFrom = Yup.object().shape({
  roleName: Yup.string().required("Role name required"),
  roleUId: Yup.string().required("Role code required"),
});
export const LoginForm = Yup.object().shape({
  username: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});
export const ResetFormValidation = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum")
    .max(64, "Password is too long - should be 64 chars maximun")
    .required("Password is required"),
  // .matches(/[0-9]/, "Password requires a number")
  // .matches(/[a-z]/, "Password requires a lowercase letter")
  // .matches(/[A-Z]/, "Password requires an uppercase letter")
  // .matches(/[^\w]/, "Password requires a symbol"),
  confirmPassword: Yup.string()
    .required("Confrim password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
})
export const ProfileBasicDetails = Yup.object().shape({
  userName: Yup.string()
    .required("Username is required")
    .min(3, "Minimum 3 character"),
  gender: Yup.string().required("Gender is required"),
  dateOfBirth: Yup.date()
    .max(new Date(Date.now() - 86400000), "Please enter a valid date of birth")
    // .max(new Date(Date.now() - 1), "Date of birth can't be in current")
    .typeError("Please enter numeric value .")
    .required("Date of Birth required"),


  // .matches(/[0-9]/, "Password requires a number")
  // .matches(/[a-z]/, "Password requires a lowercase letter")
  // .matches(/[A-Z]/, "Password requires an uppercase letter")
  // .matches(/[^\w]/, "Password requires a symbol"),

});
export const ProfileContactDetails = Yup.object().shape({

  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email format").max(160, "Maximum 160 character")
    .required("Email is required"),
});
export const AddTeamForm = Yup.object().shape({
  teamName: Yup.string()
    .required("Team name is required").min(3, "Minimum 3 character").max(50, "Maximum 50 character allowed"),
});
export const AddDesignationForm = Yup.object().shape({
  name: Yup.string()
    .required("Designation name is required").min(3, "Minimum 3 character").max(50, "Maximum 50 character allowed"),
});
export const AddProjectForm = Yup.object().shape({
  name: Yup.string().required("Project name is required"),
  customerName: Yup.string(),
  customerEmail: Yup.string().email("Invalid email format"),
  assistantManagerId: Yup.string().required("Sales team is required"),
  customerPhoneNumber: Yup.string(),
  teams: Yup.array().min(1, 'At least one team is required').required('Teams  is required'),
  priceType: Yup.string(),
  estimatedTime: Yup.number().required("Estimated time is required").typeError("Estimated time must be a number"),
  price: Yup.number().typeError("Price must be a number"),
  startDate: Yup.date()
    .required('Start Date is required')
    .typeError('Invalid date format'),

  endDate: Yup.date()
    .required('End Date is required')
    .typeError('Invalid date format'),
  comments: Yup.string().max(200, 'Comment must be less than 200 characters') // Comment field added here


});
export const AddBoardForm = Yup.object().shape({
  title: Yup.string().required("Board name is required"),
  project: Yup.string().required("Project id is required"),
  userId: Yup.string().required("User  id is required"),
  description: Yup.string().max(200, 'Comment must be less than 200 characters') // Comment field added here


});

export const AddTeamMemberForm = Yup.object().shape({
  member: Yup.array().min(1, 'At least one team is required').required('Teams  is required'),

})





const apiUrl = import.meta.env.VITE_APP_API_URL;
const secretKey = import.meta.env.VITE_ENCRYPTION_SECRET_KEY;
const superAdmin = import.meta.env.VITE_ROLE_SUPER_ADMIN;
const Admin = import.meta.env.VITE_ROLE_ADMIN;
const Manager = import.meta.env.VITE_ROLE_MANAGER;
const Am = import.meta.env.VITE_ROLE_AM;
const Executive = import.meta.env.VITE_ROLE_EXECUTIVE;
const salesExecutive = import.meta.env.VITE_ROLE_SALES_EXECUTIVE;
const localStorageUserDetails = import.meta.env.VITE_SECURE_LOCAL_STORAGE_HASH_KEY;
const localStorageUserToken = import.meta.env.VITE_SECURE_LOCAL_STORAGE_TOKEN_KEY;
const localStorageBoardId = import.meta.env.VITE_SECURE_LOCAL_STORAGE_BOARD_ID;
const teamLeader = import.meta.env.VITE_ROLE_TEAM_LEADER;
const notStarted = import.meta.env.VITE_TASK_STATUS_NOT_STARTED;
const inProgress = import.meta.env.VITE_TASK_STATUS_IN_PROGRESS;
const paused = import.meta.env.VITE_TASK_STATUS_PAUSED;
const completed = import.meta.env.VITE_TASK_STATUS_COMPLETED;


const config = {
    apiUrl: apiUrl,
    secretKey: secretKey,
    superAdmin: superAdmin,
    Admin: Admin,
    Manager: Manager,
    Am: Am,
    Executive: Executive,
    salesExecutive: salesExecutive,
    localStorageUserToken: localStorageUserToken,
    localStorageUserDetails: localStorageUserDetails,
    localStorageBoardId: localStorageBoardId,
    teamLeader: teamLeader,
    notStarted:notStarted,
    inProgress:inProgress,
    paused:paused,
    completed:completed

};
export default config;
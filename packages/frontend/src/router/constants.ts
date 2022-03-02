export enum Path {
  // auth
  Login = '/login',
  Register = '/register',
  ForgetPassword = '/forget-password',
  // manager
  Dashboard = '/dashboard',
  // design
  DesignIndex = '/design',
  DesignSetting = '/design/setting',
  DesignPublish = '/design/publish',
  // admin
  Admin = '/admin',
  // misc
  NotFound = '*',
  Forbidden = '/403',
}

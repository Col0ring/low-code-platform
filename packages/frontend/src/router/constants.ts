export const Path = {
  // auth
  Login: '/login',
  Register: '/register',
  ForgetPassword: '/forget-password',
  // main
  Dashboard: '/dashboard',
  AppCenter: '/app-center',
  TemplatesCenter: '/templates-center',
  // app
  AppPage: (appId: string) => `/app/${appId}/page`,
  AppSetting: (appId: string) => `/app/${appId}/setting`,
  AppPublish: (appId: string) => `/app/${appId}/publish`,
  // design
  DesignIndex: '/design',
  DesignSetting: '/design/setting',
  DesignPublish: '/design/publish',
  // admin
  Admin: '/admin',
  // misc
  NotFound: '*',
  Forbidden: '/403',
}

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
  AppSetting: (appId: string) => `/app/${appId}/setting/basic`,
  AppBasicSetting: (appId: string) => `/app/${appId}/setting/basic`,
  AppAuthSetting: (appId: string) => `/app/${appId}/setting/auth`,
  AppPublish: (appId: string) => `/app/${appId}/publish`,
  AppPageDetail: (appId: string, pageId: string) =>
    `/app/${appId}/page/${pageId}`,
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

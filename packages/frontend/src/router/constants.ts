export const Path = {
  // auth
  Login: '/login',
  Register: '/register',
  ForgetPassword: '/forget-password',
  // main
  Dashboard: '/dashboard',
  AppCenter: '/app-center',
  TemplatesCenter: '/templates-center',
  UserCenter: '/user-center',
  // app
  AppPage: (appId: string | number) => `/app/${appId}/page`,
  MatchedAppPage: (appId: string | number) => `/app/${appId}/page/*`,
  AppSetting: (appId: string | number) => `/app/${appId}/setting/basic`,
  AppBasicSetting: (appId: string | number) => `/app/${appId}/setting/basic`,
  AppAuthSetting: (appId: string | number) => `/app/${appId}/setting/auth`,
  AppPublish: (appId: string | number) => `/app/${appId}/publish`,
  AppPageDetail: (appId: string | number, pageId: string | number) =>
    `/app/${appId}/page/${pageId}`,
  // design
  DesignIndex: (appId: string | number, pageId: string | number) =>
    `/app/${appId}/design/${pageId}`,
  MatchedDesignSetting: (appId: string | number, pageId: string | number) =>
    `/app/${appId}/design/${pageId}/setting/*`,
  DesignBasicSetting: (appId: string | number, pageId: string | number) =>
    `/app/${appId}/design/${pageId}/setting/basic`,
  DesignAuthSetting: (appId: string | number, pageId: string | number) =>
    `/app/${appId}/design/${pageId}/setting/auth`,
  DesignPublish: (appId: string | number, pageId: string) =>
    `/app/${appId}/design/${pageId}/publish`,
  // admin
  Admin: '/admin',
  // misc
  NotFound: '*',
  Forbidden: '/403',
}

export const config = {
  baseUrl: 'http://localhost:9527',
}

export function mergeBaseUrl(url: string) {
  return config.baseUrl + ('/' + url).replace(/\/+/g, '/')
}

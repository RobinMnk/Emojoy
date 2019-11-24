interface Cookies {
  [key: string]: string
}

export function getCookies(): Cookies {
  const cookies: Cookies = {}
  document.cookie.split(';')
    .map(e => e.trim().split('='))
    .forEach(([k, v]) => cookies[k] = v)
  return cookies
}

export function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value}`
}
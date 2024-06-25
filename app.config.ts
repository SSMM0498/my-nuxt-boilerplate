export default defineAppConfig({
  API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE || "http://127.0.0.1:8090/",
  ui: {
    strategy: 'override',
    icon: 'vscode-icons',
    primary: 'blue',
    colors: ['gray', 'success', 'critical', 'warning', 'interactive', 'primary'],
  },
})

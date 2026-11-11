# React + Vite
# For Testing Purpose Only

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Report generation

Report API settings are centralized in `.env`. `VITE_API_BASE_URL` is the API
base path, and the `VITE_REPORT_*_ENDPOINT` values are paths relative to it.
The development server proxies `VITE_REPORTS_PROXY_PATH` to
`VITE_REPORTS_PROXY_TARGET`, avoiding cross-origin browser restrictions. Restart
Vite after changing environment values. Use `.env.local` for machine-specific
overrides.

In production, configure the web server to proxy the reports path to the
backend. Alternatively, set `VITE_API_BASE_URL` to the backend's API base URL at
build time and configure backend CORS. Vite exposes `VITE_` variables to the
browser; never put credentials or secrets in them.

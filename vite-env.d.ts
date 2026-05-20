/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PHONE_NUMBER: string
  readonly VITE_EMAIL: string
  readonly VITE_ADDRESS: string
  readonly VITE_CONTACT_URL: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

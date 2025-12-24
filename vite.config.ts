/// <reference types="vitest/config" />
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	test: {
		browser: {
			provider: playwright(),
			enabled: true,
			// at least one instance is required
			instances: [{ browser: 'chromium' }],
		},
	},
})

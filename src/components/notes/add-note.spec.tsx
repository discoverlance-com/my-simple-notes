import { expect, test, vi, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

// Mocks before importing the component so imports use the mock
vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}))

import { AddNote } from './add-note'
import { notesCollection } from '@/lib/db'

afterEach(() => {
	vi.restoreAllMocks()
})

test('should render add note component', async () => {
	const { getByPlaceholder, getByText } = await render(<AddNote />)
	expect(getByPlaceholder('Enter Note...')).toBeDefined()
	expect(getByText('Add New Note')).toBeDefined()
})

test('typing updates character count', async () => {
	const { getByPlaceholder, getByText } = await render(<AddNote />)
	const textarea = getByPlaceholder('Enter Note...')

	await userEvent.type(textarea, 'Hello')

	expect(getByText('5/100 characters')).toBeDefined()
})

test('adding new note calls notesCollection.insert and shows success toast', async () => {
	const insertSpy = vi.spyOn(notesCollection, 'insert')
	const { getByPlaceholder, getByText } = await render(<AddNote />)
	const textarea = getByPlaceholder('Enter Note...')
	await userEvent.type(textarea, 'My test note')
	const saveBtn = getByText('Save')
	await userEvent.click(saveBtn)

	expect(insertSpy).toHaveBeenCalled()
	const { toast } = await import('sonner')
	expect(toast.success).toHaveBeenCalled()
})

test('pressing Enter (without shift) submits the form', async () => {
	const insertSpy = vi.spyOn(notesCollection, 'insert')
	const { getByPlaceholder } = await render(<AddNote />)
	const textarea = getByPlaceholder('Enter Note...')

	await userEvent.type(textarea, 'Enter submit test')
	await userEvent.keyboard('{Enter}')

	expect(insertSpy).toHaveBeenCalled()
})

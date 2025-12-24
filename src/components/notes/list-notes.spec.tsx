import { expect, test, vi, type Mock, afterEach } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'

// Mocks before importing the component so imports use the mock
vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
	},
}))

vi.mock('@tanstack/react-db', () => ({
	useLiveQuery: vi.fn(),
}))

// Mock the local db module to avoid importing @tanstack/react-db internals
vi.mock('@/lib/db', () => ({
	notesCollection: {
		insert: vi.fn(),
		update: vi.fn(),
		delete: vi.fn(),
	},
}))

import { ListNotes } from './list-notes'
import { useLiveQuery } from '@tanstack/react-db'
import { notesCollection } from '@/lib/db'

afterEach(() => {
	vi.restoreAllMocks()
})

test('shows loading state when isLoading is true', async () => {
	;(useLiveQuery as unknown as Mock).mockReturnValue({
		data: [],
		isLoading: true,
	})

	const { getByText } = await render(<ListNotes />)

	expect(getByText('Loading notes, please wait')).toBeDefined()
})

test('shows empty state and Add new note focuses input', async () => {
	;(useLiveQuery as unknown as Mock).mockReturnValue({
		data: [],
		isLoading: false,
	})

	const focusSpy = vi.fn()
	const querySpy = vi
		.spyOn(document, 'querySelector')
		.mockReturnValue({ focus: focusSpy } as unknown as HTMLElement)

	const { getByText } = await render(<ListNotes />)

	expect(getByText('No Notes Yet')).toBeDefined()

	const addBtn = getByText('Add new note')
	await userEvent.click(addBtn)

	expect(querySpy).toHaveBeenCalledWith('#add-note-input')
	expect(focusSpy).toHaveBeenCalled()
})

test('renders notes and handles toggle favorite and delete', async () => {
	const note = {
		id: '1',
		title: 'Note 1',
		is_favorite: false,
		created_at: Date.now(),
		updated_at: Date.now(),
	}

	;(useLiveQuery as unknown as Mock).mockReturnValue({
		data: [note],
		isLoading: false,
	})

	const updateSpy = vi.spyOn(notesCollection, 'update')
	const deleteSpy = vi.spyOn(notesCollection, 'delete')

	const { getByText, getByRole } = await render(<ListNotes />)

	expect(getByText('Note 1')).toBeDefined()

	// Find the favorite toggle button by its accessible name and click
	const favBtn = getByRole('button', { name: /Make favorite/i })
	await userEvent.click(favBtn)

	expect(updateSpy).toHaveBeenCalledWith('1', expect.any(Function))

	// Find the Delete button by its accessible name and click
	const delBtn = getByRole('button', { name: /Delete/i })
	await userEvent.click(delBtn)

	expect(deleteSpy).toHaveBeenCalledWith('1')
	const { toast } = await import('sonner')
	expect(toast.success).toHaveBeenCalled()
})

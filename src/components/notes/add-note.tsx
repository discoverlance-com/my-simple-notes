import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupText,
	InputGroupTextarea,
} from '@/components/ui/input-group'

import { notesCollection, notesSchema } from '@/lib/db'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { toast } from 'sonner'
import { useRef, useState } from 'react'

export const AddNote = () => {
	const [value, setValue] = useState('')
	const formRef = useRef<HTMLFormElement>(null)

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault() // Prevent newline
			if (formRef.current) {
				formRef.current.requestSubmit() // Submits the form
			}
		}
	}

	const addNewNote = (title: string) => {
		// validate the schema
		const data = {
			id: Date.now().toString(),
			title,
			is_favorite: false,
			created_at: Date.now(),
			updated_at: Date.now(),
		}

		const { error, data: note } = notesSchema.safeParse(data)

		if (error) {
			toast.error('Failed to save note.')
			return
		}
		notesCollection.insert(note)
		toast.success('Note Added')
	}

	return (
		<form
			id="add-note-form"
			ref={formRef}
			onSubmit={(e) => {
				e.preventDefault()
				e.stopPropagation()

				if (value) {
					addNewNote(value)
					// reset input
					setValue('')
				}
			}}
		>
			<Card className="mx-auto w-full max-w-xl">
				<CardHeader>
					<h2 className="text-left text-xl leading-none font-semibold">
						Add New Note
					</h2>
				</CardHeader>
				<CardContent>
					<InputGroup>
						<InputGroupTextarea
							id="add-note-input"
							placeholder="Enter Note..."
							value={value}
							onChange={(e) => {
								setValue(e.target.value)
							}}
							onKeyDown={handleKeyDown}
							required
							maxLength={100}
						/>
						<InputGroupAddon align="block-end">
							<InputGroupText className="mt-1 text-xs text-muted-foreground">
								{value.length}/100 characters
							</InputGroupText>
							<InputGroupButton
								className="ml-auto"
								type="submit"
								variant="default"
							>
								Save
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</CardContent>
			</Card>
		</form>
	)
}

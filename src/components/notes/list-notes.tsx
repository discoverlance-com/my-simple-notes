import { useLiveQuery } from '@tanstack/react-db'
import { notesCollection } from '@/lib/db'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from '@/components/ui/card'
import { toast } from 'sonner'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
	FileCodeIcon,
	PlusIcon,
	StarIcon,
	StarOffIcon,
	TrashIcon,
} from 'lucide-react'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'

export const ListNotes = () => {
	const { data: notes, isLoading } = useLiveQuery((q) =>
		q
			.from({ notes: notesCollection })
			.orderBy(({ notes }) => notes.created_at, 'desc'),
	)

	const toggleFavorite = (id: string) => {
		notesCollection.update(id, (note) => {
			note.is_favorite = !note.is_favorite
			note.updated_at = Date.now()
		})
	}

	const deleteNote = (id: string) => {
		notesCollection.delete(id)
		toast.success('Note deleted')
	}

	if (isLoading) {
		return (
			<Card className="mx-auto w-full max-w-xl">
				<CardHeader>
					<h2 className="text-left text-xl leading-none font-semibold">
						A list of all notes
					</h2>
					<CardDescription>Loading notes, please wait</CardDescription>
				</CardHeader>
				<CardContent>
					<ScrollArea className="h-[500px] space-y-4">
						<ScrollBar orientation="vertical" />
						<div className="space-y-6">
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-24 w-full" />
							<Skeleton className="h-24 w-full" />
						</div>
					</ScrollArea>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="mx-auto w-full max-w-xl">
			<CardHeader>
				<h2 className="text-left text-xl leading-none font-semibold">
					A list of all notes
				</h2>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[500px] space-y-4">
					<ScrollBar orientation="vertical" />
					<div className="space-y-6">
						{notes.length === 0 ? (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<FileCodeIcon />
									</EmptyMedia>
									<EmptyTitle>No Notes Yet</EmptyTitle>
									<EmptyDescription>
										You haven&apos;t created any notes yet. Get started by
										creating your first note.
									</EmptyDescription>
								</EmptyHeader>
								<EmptyContent>
									<div className="flex gap-2">
										<Button
											onClick={() => {
												;(
													document.querySelector(
														'#add-note-input',
													) as HTMLInputElement
												)?.focus()
											}}
										>
											<PlusIcon /> Add new note
										</Button>
									</div>
								</EmptyContent>
							</Empty>
						) : (
							notes.map((note) => {
								return (
									<Card key={note.id}>
										<CardHeader>
											<h3 className="flex flex-wrap items-center justify-between gap-4 text-base leading-none font-semibold">
												<span>{note.title}</span>
												<Button
													size="icon"
													variant="outline"
													onClick={() => {
														toggleFavorite(note.id)
													}}
												>
													{note.is_favorite ? (
														<span className="sr-only">Unfavorite</span>
													) : (
														<span className="sr-only">Make favorite</span>
													)}
													{note.is_favorite ? (
														<StarOffIcon className="text-primary" />
													) : (
														<StarIcon />
													)}
												</Button>
											</h3>
											<Button
												variant="destructive"
												size="icon"
												onClick={() => {
													deleteNote(note.id)
												}}
											>
												<TrashIcon /> <span className="sr-only">Delete</span>
											</Button>
										</CardHeader>
									</Card>
								)
							})
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	)
}

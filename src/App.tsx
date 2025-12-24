import './App.css'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { notesCollection } from './lib/db'
import { Toaster } from './components/ui/sonner'
import { ThemeProvider } from './components/theme-provider'
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from './components/ui/card'
import { AddNote } from './components/notes/add-note'
import { ListNotes } from './components/notes/list-notes'

function App() {
	const { data: notes } = useLiveQuery((q) =>
		q.from({ notes: notesCollection }),
	)

	const { data: favoriteNotes } = useLiveQuery((q) =>
		q
			.from({ notes: notesCollection })
			.where(({ notes }) => eq(notes.is_favorite, true)),
	)

	return (
		<ThemeProvider>
			<main className="container mx-auto min-h-screen w-full space-y-12">
				<div>
					<h1 className="text-center text-4xl font-bold text-pretty text-foreground sm:text-5xl">
						My Simple Notes
					</h1>
					<p className="mt-3 text-center text-lg text-muted-foreground">
						Capture your thoughts, organize your ideas. All your data is stored
						in the browser.
					</p>
				</div>

				{notes.length > 0 && (
					<div className="flex items-center gap-8">
						<Card className="w-38">
							<CardHeader>
								<CardTitle className="text-xl">{notes.length}</CardTitle>
								<CardDescription>Total Notes</CardDescription>
							</CardHeader>
						</Card>

						<Card className="w-38">
							<CardHeader>
								<CardTitle className="text-xl">
									{favoriteNotes.length}
								</CardTitle>
								<CardDescription>Favoriate Notes</CardDescription>
							</CardHeader>
						</Card>
					</div>
				)}

				<div className="grid gap-16 md:grid-cols-2">
					<AddNote />
					<ListNotes />
				</div>
			</main>

			<Toaster position="bottom-center" duration={3500} richColors />
		</ThemeProvider>
	)
}

export default App

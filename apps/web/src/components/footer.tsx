import { Asterisk } from "lucide-react"

export const Footer = () => {
	return (
		<footer className="grid place-items-center">
			<div className="flex items-center gap-6 text-sm text-muted-foreground">
				<a
					href="https://github.com/neiforfaen"
					className="transition-colors hover:text-foreground"
					target="_blank"
					rel="noopener noreferrer"
				>
					GitHub
				</a>
				<Asterisk size={16} />
				<span className="text-sm text-center cursor-default">424</span>
				<Asterisk size={16} />
				<a
					href="https://linkedin.com/in/kaiden-riley"
					className="transition-colors hover:text-foreground"
					target="_blank"
					rel="noopener noreferrer"
				>
					LinkedIn
				</a>
			</div>
		</footer>
	)
}

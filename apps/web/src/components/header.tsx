import * as m from "@neiforfaen/i18n/messages"

export const Header = () => {
	return (
		<header className="grid sm:grid-cols-[1fr_113px] gap-8">
			<h1 className="font-normal font-serif text-[28px] sm:text-[38px] leading-[1.2] text-foreground">
				{m.header_hero_text()}
			</h1>
		</header>
	)
}

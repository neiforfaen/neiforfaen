import * as m from "@neiforfaen/i18n/messages"
import { getLocale, setLocale } from "@neiforfaen/i18n/runtime"
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@neiforfaen/ui"
import { Languages } from "lucide-react"
import { useCallback } from "react"

export const LanguageSwitcher = () => {
	const currentLocale = getLocale()

	const handleLanguage = useCallback((locale: typeof currentLocale) => {
		setLocale(locale)
	}, [])

	return (
		<div className="fixed top-0 right-0 z-50">
			<DropdownMenu>
				<DropdownMenuTrigger className="p-4">
					<Tooltip>
						<TooltipTrigger>
							<Button variant="ghost" size="icon">
								<Languages />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="left">{m.language_tooltip()}</TooltipContent>
					</Tooltip>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-40 mr-4" align="start">
					<DropdownMenuGroup>
						<DropdownMenuLabel>{m.language()}</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => handleLanguage("en")}>
							{m.locale_en()}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleLanguage("de")}>
							{m.locale_de()}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

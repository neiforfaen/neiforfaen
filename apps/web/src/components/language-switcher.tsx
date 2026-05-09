import * as m from "@neiforfaen/i18n/messages"
import { setLocale } from "@neiforfaen/i18n/runtime"
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

export const LanguageSwitcher = () => {
	return (
		<div className="fixed top-0 right-0 z-50 animate-[fadeBlur_1.5s_ease-in-out_forwards]">
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
						<DropdownMenuItem onClick={() => setLocale("en")}>
							{m.locale_en()}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setLocale("de")}>
							{m.locale_de()}
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

# apex

Bootstrap script for personal systems.

## Usage

```sh
bash -c "$(curl -fsSL https://apex.0x424.kr/init.sh)"
```

## Steps

- **OS Check**: Verifies macOS (Darwin) is running
- **Homebrew**: Installs Homebrew if not present
- **Node.js**: Installs Node.js 24 via nvm and sets as default
- **Wrangler**: Installs Cloudflare Wrangler CLI globally
- **Claude Code**: Installs Claude Code CLI
- **CLAUDE.md**: Creates behavioral guidelines at `~/.claude/CLAUDE.md`
- **Homebrew Packages**: Installs formulae (ffmpeg, gh, git, mas, pnpm, dockutil, fzf, gnupg, pinentry-mac, cocoapods, ruby, go, rust)
- **Homebrew Casks**: Installs applications (Zed, Spotify, Discord, Google Chrome, Ghostty, Raycast, WebStorm, Logitech G Hub, NordPass, Obsidian)
- **WebStorm**: Configures default tool window layout
- **Oh My Zsh**: Installs Oh My Zsh with gnzh theme and git/nvm/node/fzf plugins
- **Shell Functions**: Adds `push()` alias for signed commits and push
- **GPG Agent**: Configures pinentry-mac for commit signing with extended cache TTL
- **Git Config**: Sets global defaults for main branch, auto-setup remote, case sensitivity, and mandatory commit signing
- **Dock**: Configures dock with Spotify, WebStorm, Google Chrome, and Ghostty
- **Mac App Store**: Installs Xcode

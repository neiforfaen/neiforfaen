import type { IRequest } from "itty-router"
import { error, text, IttyRouter } from "itty-router"

// Inlined as a string literal rather than imported from scripts/init.sh so the
// script isn't bundled as a separate file when deploying to the Cloudflare Worker.
//
// initScript variable is a 1:1 of ../scripts/init.sh
const initScript = `set -euo pipefail

# OS check
if [[ "$(uname -s)" != "Darwin" ]]; then
    echo "apex is only supported on macOS." >&2
    exit 1
fi

echo "Running system setup cmd..."

# Homebrew check
if ! command -v brew &> /dev/null; then
    echo "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [[ -x /opt/homebrew/bin/brew ]]; then
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        eval "$(/usr/local/bin/brew shellenv)"
    fi
fi

# NVM check + node setup
export NVM_DIR="$HOME/.nvm"
if [[ ! -s "$NVM_DIR/nvm.sh" ]]; then
    echo "nvm not found. Installing..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi
source "\${NVM_DIR}/nvm.sh"

if [[ "$(nvm version default)" != "$(nvm version 24)" || "$(nvm version 24)" == "N/A" ]]; then
    nvm install 24 > /dev/null
    nvm alias default 24 > /dev/null
fi

# Install Wrangler CLI
if ! command -v wrangler &> /dev/null; then
    echo "Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Claude Code install
if ! command -v claude &> /dev/null; then
    echo "Claude Code not found. Installing..."
    curl -fsSL https://claude.ai/install.sh | bash
fi

cat > "$HOME/.claude/CLAUDE.md" <<'CLAUDE_MD_EOF'
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

\`\`\`
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
\`\`\`

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
CLAUDE_MD_EOF

# Homebrew installs
CASKS=(zed spotify discord google-chrome ghostty raycast webstorm logitech-g-hub nordpass obsidian)
FORMULAE=(ffmpeg gh git mas pnpm dockutil fzf gnupg pinentry-mac cocoapods ruby go rust python)
MAS_APPS=(497799835) # Xcode

MISSING_FORMULAE=()
for formula in "\${FORMULAE[@]}"; do
    brew list --formula "$formula" &> /dev/null || MISSING_FORMULAE+=("$formula")
done
if [[ \${#MISSING_FORMULAE[@]} -gt 0 ]]; then
    for formula in "\${MISSING_FORMULAE[@]}"; do
        brew install "$formula" || echo "Skipping $formula; install failed"
    done
fi

MISSING_CASKS=()
for cask in "\${CASKS[@]}"; do
    brew list --cask "$cask" &> /dev/null || MISSING_CASKS+=("$cask")
done
if [[ \${#MISSING_CASKS[@]} -gt 0 ]]; then
    for cask in "\${MISSING_CASKS[@]}"; do
        brew install --cask --adopt "$cask" || echo "Skipping $cask; install failed"
    done
fi

# WebStorm default layout
if [[ -f "/Applications/WebStorm.app/Contents/Resources/product-info.json" ]]; then
    WEBSTORM_DATA_DIR=$(grep -m1 -o '"dataDirectoryName": *"[^"]*"' "/Applications/WebStorm.app/Contents/Resources/product-info.json" | sed -E 's/.*"([^"]+)"$/\\1/')
    WEBSTORM_OPTIONS_DIR="$HOME/Library/Application Support/JetBrains/$WEBSTORM_DATA_DIR/options"
    mkdir -p "$WEBSTORM_OPTIONS_DIR"
    cat > "$WEBSTORM_OPTIONS_DIR/window.layouts.xml" <<'WEBSTORM_LAYOUT_EOF'
<application>
  <component name="ToolWindowLayout"><![CDATA[{
  "activeLayoutName": "Default",
  "layouts": {
    "Default": {
      "v2": [
        {
          "id": "Commit",
          "order": 0,
          "isShowStripeButton": false,
          "weight": 0.60227937
        },
        {
          "id": "Structure",
          "order": 1,
          "isShowStripeButton": false,
          "weight": 0.25,
          "isSplit": true
        },
        {
          "id": "Version Control",
          "order": 0,
          "anchor": "BOTTOM",
          "isShowStripeButton": false
        },
        {
          "id": "Problems",
          "order": 1,
          "anchor": "BOTTOM"
        },
        {
          "id": "Terminal",
          "order": 2,
          "anchor": "BOTTOM",
          "isShowStripeButton": false
        },
        {
          "id": "Services",
          "order": 3,
          "anchor": "BOTTOM",
          "isShowStripeButton": false
        },
        {
          "id": "Problems View",
          "order": 4,
          "anchor": "BOTTOM",
          "isSplit": true
        },
        {
          "id": "Notifications",
          "order": 0,
          "anchor": "RIGHT",
          "isShowStripeButton": false,
          "weight": 0.29741675
        },
        {
          "id": "AIAssistant",
          "order": 1,
          "anchor": "RIGHT",
          "isShowStripeButton": false,
          "weight": 0.25
        },
        {
          "id": "Database",
          "order": 2,
          "anchor": "RIGHT",
          "weight": 0.25
        },
        {
          "id": "Gradle",
          "order": 3,
          "anchor": "RIGHT",
          "weight": 0.25
        },
        {
          "id": "Maven",
          "order": 4,
          "anchor": "RIGHT",
          "weight": 0.25
        },
        {
          "id": "Project",
          "order": 5,
          "anchor": "RIGHT",
          "contentUiType": "COMBO",
          "isActiveOnStart": true,
          "isVisible": true,
          "weight": 0.24756394
        }
      ],
      "unifiedWeights": {
        "top": 0.33,
        "left": 0.7005439,
        "bottom": 0.33,
        "right": 0.24756394
      }
    }
  }
}]]></component>
</application>
WEBSTORM_LAYOUT_EOF
else
    echo "Skipping WebStorm layout config; WebStorm.app not found"
fi

# Zed config
if [[ -d "/Applications/Zed.app" ]]; then
    cat > "$HOME/.config/zed/settings.json" << 'ZED_CONFIG_EOF'
{
  "lsp": {
    "vtsls": {
      "settings": {
        "typescript": {
          "updateImportsOnFileMove": {
            "enabled": "always"
          }
        },
        "javascript": {
          "updateImportsOnFileMove": {
            "enabled": "always"
          }
        }
      },
      "enable_lsp_tasks": true
    }
  },
  "cli_default_open_behavior": "new_window",
  "base_keymap": "JetBrains",
  "ui_font_family": ".ZedMono",
  "ui_font_size": 18,
  "buffer_font_family": ".ZedMono",
  "buffer_font_size": 18,
  "buffer_line_height": {
    "custom": 1.75,
  },
  "agent_ui_font_size": 18,
  "agent_buffer_font_size": 18,
  "icon_theme": "Catppuccin Frappé",
  "theme": "Aura Dark",
  "theme_overrides": {
    "Aura Dark": {
      "border.variant": "#15141C",
      "border": "#15141C",
      "title_bar.background": "#15141C",
      "panel.background": "#15141C",
      "panel.focused_border": "#15141C",
      "players": [
        {
          "cursor": "#bd9dff",
        },
      ],
      "syntax": {
        "comment": {
          "font_style": "italic",
        },
        "comment.doc": {
          "font_style": "italic",
        },
      },
    },
  },
  "title_bar": {
    "show_onboarding_banner": false,
    "show_project_items": false,
    "show_branch_name": false,
    "show_user_menu": false,
  },
  "tab_bar": {
    "show": false,
  },
  "toolbar": {
    "quick_actions": false,
  },
  // "status_bar": {
  //     "experimental.show": true,
  // },
  "project_panel": {
    "dock": "right",
    "default_width": 600,
    "hide_root": true,
    "auto_fold_dirs": false,
    "starts_open": false,
    "sticky_scroll": false,
    "scrollbar": {
      "show": "never",
    },
    "indent_guides": {
      "show": "never",
    },
  },
  "outline_panel": {
    "default_width": 300,
    "indent_guides": {
      "show": "never",
    },
  },
  "file_finder": {
    "modal_max_width": "large",
  },
  "scrollbar": {
    "show": "never",
  },
  "gutter": {
    "min_line_number_digits": 0,
    "folds": false,
    "runnables": false,
  },
  "indent_guides": {
    "enabled": false,
  },
  "cursor_shape": "block",
  "cursor_blink": false,
  "selection_highlight": false,
  "drag_and_drop_selection": {
    "enabled": false,
  },
  "seed_search_query_from_cursor": "never",
  "current_line_highlight": "none",
  "show_whitespaces": "none",
  "search": {
    "include_ignored": true,
  },
  "lsp_document_colors": "none",
  "hover_popover_enabled": false,
  "format_on_save": "on",
  "autosave": {
    "after_delay": {
      "milliseconds": 1000,
    },
  },
  "auto_update": false,
  "extend_comment_on_newline": false,
  "horizontal_scroll_margin": 1,
  "vertical_scroll_margin": 1,
  "when_closing_with_no_tabs": "keep_window_open",
  "restore_on_file_reopen": false,
  "restore_on_startup": "empty_tab",
  "session": {
    "restore_unsaved_buffers": false,
  },
  "inlay_hints": {
    "enabled": true,
    "show_type_hints": true,
    "show_parameter_hints": false,
    "show_other_hints": false,
    "show_background": false,
  },
  "telemetry": {
    "diagnostics": false,
    "metrics": false,
  },
  "diagnostics": {
    "inline": {
      "enabled": true,
      "update_debounce_ms": 50,
      "min_column": 0,
      "max_severity": null,
    },
  },
}
ZED_CONFIG_EOF
else
    echo "Skipping Zed config; Zed.app not found"
fi

# Ghostty config
cat > $HOME/Library/Application\\ Support/com.mitchellh.ghostty/config.ghostty <<'GHOSTTY_CONFIG_EOF'
cursor-style = bar
cursor-style-blink = false
window-padding-x = 16
window-padding-y = 12
GHOSTTY_CONFIG_EOF

# Oh My Zsh setup
if [[ ! -d "$HOME/.oh-my-zsh" ]]; then
    echo "oh-my-zsh not found. Installing..."
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

if [[ -f "$HOME/.zshrc" ]]; then
    sed -i '' 's/^ZSH_THEME=.*/ZSH_THEME="gnzh"/' "$HOME/.zshrc"
    sed -i '' 's/^plugins=.*/plugins=(git nvm node fzf)/' "$HOME/.zshrc"
else
    echo "Skipping Oh My Zsh theme/plugin config; ~/.zshrc not found"
fi

cat >> "$HOME/.zshrc" << 'OMZ_EOF'
function push() {
    local commit_msg="$*"

    if [[ -z "$commit_msg" ]]; then
      echo "Error: commit message required"
      return 1
    fi

    git commit -S -m"$commit_msg"
    git push
}

alias push="push"
OMZ_EOF

# GPG agent config for commit signing (push() always signs with -S)
mkdir -p "$HOME/.gnupg"
chmod 700 "$HOME/.gnupg"
PINENTRY_MAC_PATH="$(brew --prefix pinentry-mac)/bin/pinentry-mac"
cat > "$HOME/.gnupg/gpg-agent.conf" <<EOF
pinentry-program $PINENTRY_MAC_PATH
default-cache-ttl 34560000
max-cache-ttl 34560000
EOF
gpgconf --kill gpg-agent

# Set git defaults
git config --global init.defaultBranch main
git config --global push.autoSetupRemote true
git config --global core.ignoreCase false
git config --global commit.gpgsign true

# Configure dock
if command -v dockutil >/dev/null 2>&1; then
    DOCK_APPS=("Spotify" "WebStorm" "Google Chrome" "Ghostty")

    dockutil --remove all --no-restart > /dev/null
    for app in "\${DOCK_APPS[@]}"; do
        dockutil --add "/Applications/\${app}.app" --no-restart > /dev/null
    done
    killall Dock
else
    echo "Skipping Dock configuration; dockutil is not available"
fi

# Install Mac App Store apps
if [[ \${#MAS_APPS[@]} -gt 0 ]]; then
    for app in "\${MAS_APPS[@]}"; do
        output=$(mas install "$app" 2>&1) || { echo "$output"; echo "Skipping $app; install failed"; }
    done
fi

# Postflight steps

cat <<'EOF'
System setup complete!

Next steps:
- Sign in to GitHub: \`gh auth login\`
- Sign in to Cloudflare: \`wrangler login\`
- Set user.name and user.email in .gitconfig
- Generate or import a GPG key for commit signing, then set it with \`git config --global user.signingkey <KEYID>\` (push() always signs commits with -S)
- If any \`mas\` installs failed, sign into App Store and rerun apex (Apple removed \`mas signin\` in macOS 10.13+)
EOF
`

const router = IttyRouter()

router
  .get("/", () => text('bash -c "$(curl -fsSL https://apex.0x424.kr/init.sh)"'))
  .get(
    "/init.sh",
    () =>
      new Response(initScript, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      })
  )
  .all("*", () => error(404))

export default {
  fetch: async (request: IRequest, ...args: unknown[]) =>
    await router
      .fetch(request, ...args)
      .then(text)
      .catch(error),
}

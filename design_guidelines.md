{
  "brand": {
    "product_name": "Micro-Niche Hunter",
    "design_personality": [
      "strict minimalist",
      "high-contrast editorial UI",
      "builder-first / indie-hacker",
      "Notion cleanliness + Linear precision + terminal honesty",
      "dense data, breathable spacing"
    ],
    "non_negotiables": [
      "Strict black & white only (plus neutral grays).",
      "NO gradients anywhere.",
      "NO color accents (no blue links, no colored badges).",
      "Sans-serif for headings/body.",
      "Monospace ONLY for data points + validator output.",
      "Premium section must be convincingly blurred with a sticky CTA overlay.",
      "Mobile-first responsive.",
      "All interactive + key informational elements must include data-testid (kebab-case)."
    ]
  },

  "inspiration_refs": {
    "visual_refs": [
      {
        "name": "Linear (precision SaaS minimalism)",
        "why": "tight typography, crisp borders, calm motion, product-first hierarchy",
        "url": "https://linear.app"
      },
      {
        "name": "Notion (editorial whitespace + utility UI)",
        "why": "breathable density, subtle dividers, content-first layout",
        "url": "https://www.notion.so"
      },
      {
        "name": "MDN Masonry Layout Guide",
        "why": "reference for masonry grid behavior and responsive rules",
        "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Masonry_layout"
      }
    ],
    "layout_fusion": "Use Notion-like spacing + Linear-like crisp borders + terminal-like monospace data chips. Keep everything monochrome; conversion comes from hierarchy + copy + stickiness, not color."
  },

  "typography": {
    "google_fonts": {
      "sans": {
        "family": "Geist",
        "fallback": "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
        "weights": ["400", "500", "600", "700"],
        "url": "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap"
      },
      "mono": {
        "family": "Geist Mono",
        "fallback": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New",
        "weights": ["400", "500", "600"],
        "url": "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap"
      }
    },
    "usage_rules": {
      "sans_used_for": [
        "all headings",
        "all body copy",
        "navigation",
        "buttons",
        "form labels",
        "helper text"
      ],
      "mono_used_only_for": [
        "data points: competition_score, MRR, counts",
        "category tags",
        "validator output (rating + critique)",
        "IDs / timestamps in admin table",
        "small metadata labels (e.g., 'UPDATED 2D AGO')"
      ],
      "never_mono_for": [
        "long paragraphs",
        "marketing headline",
        "CTA headline"
      ]
    },
    "type_scale_tailwind": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold",
      "h2": "text-base md:text-lg font-medium text-foreground",
      "section_title": "text-lg sm:text-xl font-semibold tracking-tight",
      "body": "text-sm sm:text-base leading-relaxed",
      "small": "text-xs sm:text-sm",
      "mono_chip": "font-mono text-[11px] sm:text-xs tracking-tight",
      "mono_value": "font-mono text-xs sm:text-sm"
    },
    "copy_tone": {
      "voice": "brutally honest, concise, builder-friendly",
      "examples": {
        "validator_helper": "Be specific. Bad inputs get bad scores.",
        "paywall": "Unlock 150+ Profitable AI Niches for $29",
        "empty_state": "No niches match this filter. Either broaden your criteria or admit the market is saturated."
      }
    }
  },

  "color_system": {
    "mode": "light-first (optional dark mode later)",
    "palette_hsl": {
      "background": "0 0% 100%",
      "foreground": "0 0% 6%",
      "muted": "0 0% 96%",
      "muted_foreground": "0 0% 38%",
      "card": "0 0% 100%",
      "card_foreground": "0 0% 6%",
      "border": "0 0% 88%",
      "border_strong": "0 0% 78%",
      "input": "0 0% 88%",
      "ring": "0 0% 10%",
      "shadow": "0 0% 0%",
      "black": "0 0% 0%",
      "white": "0 0% 100%"
    },
    "semantic_tokens": {
      "--background": "hsl(var(--background))",
      "--foreground": "hsl(var(--foreground))",
      "--surface": "hsl(var(--card))",
      "--surface-2": "hsl(0 0% 98%)",
      "--border": "hsl(var(--border))",
      "--border-strong": "hsl(var(--border_strong))",
      "--focus-ring": "hsl(var(--ring))",
      "--text-subtle": "hsl(var(--muted-foreground))"
    },
    "rules": [
      "No gradients (explicitly prohibited).",
      "No colored accents; links are black with underline, not blue.",
      "Use borders/dividers instead of shadows for structure.",
      "Use only grayscale for states; rely on iconography + copy for meaning."
    ]
  },

  "design_tokens_css": {
    "add_to": "/app/frontend/src/index.css",
    "css_variables": "/* Micro-Niche Hunter tokens (monochrome, no gradients) */\n@layer base {\n  :root {\n    --mn-font-sans: 'Geist', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;\n    --mn-font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;\n\n    --mn-bg: 0 0% 100%;\n    --mn-fg: 0 0% 6%;\n    --mn-fg-subtle: 0 0% 38%;\n\n    --mn-surface: 0 0% 100%;\n    --mn-surface-2: 0 0% 98%;\n\n    --mn-border: 0 0% 88%;\n    --mn-border-strong: 0 0% 78%;\n\n    --mn-ring: 0 0% 10%;\n\n    --mn-radius-sm: 10px;\n    --mn-radius-md: 14px;\n\n    --mn-shadow-none: 0 0 #0000;\n\n    --mn-space-1: 4px;\n    --mn-space-2: 8px;\n    --mn-space-3: 12px;\n    --mn-space-4: 16px;\n    --mn-space-5: 20px;\n    --mn-space-6: 24px;\n    --mn-space-8: 32px;\n    --mn-space-10: 40px;\n    --mn-space-12: 48px;\n\n    --mn-blur-premium: 14px;\n    --mn-blur-premium-mobile: 12px;\n  }\n\n  body {\n    font-family: var(--mn-font-sans);\n    background: hsl(var(--mn-bg));\n    color: hsl(var(--mn-fg));\n  }\n\n  .font-mono {\n    font-family: var(--mn-font-mono);\n  }\n}\n\n/* Utility: subtle noise (optional, keep extremely faint) */\n.mn-noise {\n  position: relative;\n}\n.mn-noise::before {\n  content: '';\n  pointer-events: none;\n  position: absolute;\n  inset: 0;\n  opacity: 0.035;\n  mix-blend-mode: multiply;\n  background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"120\" height=\"120\" filter=\"url(%23n)\" opacity=\"0.35\"/></svg>');\n}\n\n/* Premium blur wrapper */\n.mn-premium-blur {\n  filter: blur(var(--mn-blur-premium));\n}\n@media (max-width: 640px) {\n  .mn-premium-blur {\n    filter: blur(var(--mn-blur-premium-mobile));\n  }\n}\n\n/* Link style: monochrome */\n.mn-link {\n  color: hsl(var(--mn-fg));\n  text-decoration: underline;\n  text-underline-offset: 3px;\n}\n.mn-link:hover {\n  text-decoration-thickness: 2px;\n}\n"
  },

  "layout": {
    "grid_system": {
      "container": "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      "section_spacing": "py-10 sm:py-14",
      "stack_spacing": "space-y-6 sm:space-y-8",
      "divider": "border-t border-[hsl(var(--mn-border))]"
    },
    "header": {
      "pattern": "sticky top-0 z-40 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b",
      "height": "h-14",
      "left": "logo + wordmark",
      "right": "Google OAuth button OR user menu + Paid badge",
      "badge": "monochrome outline badge with mono text"
    },
    "home_sections": [
      "Header",
      "Hero: AI Idea Validator",
      "Free Niches (exactly 3 cards)",
      "Premium Niches (blurred) + sticky CTA overlay",
      "Footer (minimal links)"
    ],
    "admin_sections": [
      "Admin login",
      "Admin dashboard shell: stats row, bulk JSON upload, niches table"
    ]
  },

  "components": {
    "component_path": {
      "shadcn_primary": [
        "/app/frontend/src/components/ui/button.jsx",
        "/app/frontend/src/components/ui/input.jsx",
        "/app/frontend/src/components/ui/textarea.jsx",
        "/app/frontend/src/components/ui/card.jsx",
        "/app/frontend/src/components/ui/badge.jsx",
        "/app/frontend/src/components/ui/separator.jsx",
        "/app/frontend/src/components/ui/table.jsx",
        "/app/frontend/src/components/ui/dialog.jsx",
        "/app/frontend/src/components/ui/sheet.jsx",
        "/app/frontend/src/components/ui/sonner.jsx",
        "/app/frontend/src/components/ui/skeleton.jsx",
        "/app/frontend/src/components/ui/scroll-area.jsx"
      ]
    },

    "button_styles": {
      "primary_cta": {
        "use": "Paywall unlock + Validate",
        "shape": "rounded-[12px]",
        "classes": "rounded-[12px] bg-black text-white hover:bg-black/90 active:bg-black/95 focus-visible:ring-2 focus-visible:ring-[hsl(var(--mn-ring))] focus-visible:ring-offset-2",
        "motion": "transition-colors duration-150 (NO transition-all)",
        "data_testid_examples": [
          "paywall-unlock-button",
          "idea-validator-validate-button"
        ]
      },
      "secondary": {
        "use": "Login, filters",
        "classes": "rounded-[12px] border border-[hsl(var(--mn-border-strong))] bg-white text-black hover:bg-[hsl(var(--mn-surface-2))]",
        "motion": "transition-colors duration-150"
      },
      "ghost": {
        "use": "icon actions, table row actions",
        "classes": "rounded-[10px] hover:bg-black/5",
        "motion": "transition-colors duration-150"
      }
    },

    "card_styles": {
      "base": {
        "classes": "rounded-[14px] border border-[hsl(var(--mn-border))] bg-white",
        "hover": "hover:border-[hsl(var(--mn-border-strong))]",
        "motion": "transition-colors duration-150",
        "shadow": "none (borders only)"
      },
      "dense": {
        "classes": "p-4 sm:p-5",
        "internal_spacing": "space-y-3"
      }
    },

    "niche_card_markup_idea_js": {
      "notes": "Use sans for title/market_gap; mono only for chips + numeric values. Keep card height variable to support masonry rhythm.",
      "example": "<Card data-testid=\"niche-card\" className=\"rounded-[14px] border border-[hsl(var(--mn-border))] bg-white hover:border-[hsl(var(--mn-border-strong))] transition-colors duration-150\">\n  <CardHeader className=\"p-4 sm:p-5 pb-3\">\n    <div className=\"flex items-start justify-between gap-3\">\n      <div className=\"min-w-0\">\n        <CardTitle className=\"text-base sm:text-lg font-semibold tracking-tight truncate\" data-testid=\"niche-title\">AI Compliance Checklists for SMBs</CardTitle>\n        <p className=\"mt-1 text-xs sm:text-sm text-[hsl(var(--mn-fg-subtle))]\" data-testid=\"niche-market-gap\">Most tools are enterprise-only. SMBs need templates + reminders.</p>\n      </div>\n      <Badge data-testid=\"niche-category-badge\" className=\"font-mono text-[11px] tracking-tight rounded-[10px] border border-[hsl(var(--mn-border-strong))] bg-white text-black\">B2B</Badge>\n    </div>\n  </CardHeader>\n  <CardContent className=\"px-4 sm:px-5 pb-4 sm:pb-5\">\n    <div className=\"grid grid-cols-2 gap-3\">\n      <div className=\"rounded-[12px] border border-[hsl(var(--mn-border))] p-3\">\n        <div className=\"font-mono text-[11px] text-[hsl(var(--mn-fg-subtle))]\" data-testid=\"niche-competition-label\">COMPETITION</div>\n        <div className=\"font-mono text-sm font-semibold\" data-testid=\"niche-competition-value\">7.2/10</div>\n      </div>\n      <div className=\"rounded-[12px] border border-[hsl(var(--mn-border))] p-3\">\n        <div className=\"font-mono text-[11px] text-[hsl(var(--mn-fg-subtle))]\" data-testid=\"niche-mrr-label\">MRR</div>\n        <div className=\"font-mono text-sm font-semibold\" data-testid=\"niche-mrr-value\">$3,400</div>\n      </div>\n    </div>\n  </CardContent>\n</Card>"
    },

    "masonry_grid": {
      "approach": "CSS columns for true masonry feel (simple + fast) OR CSS grid masonry if supported. Prefer columns for broad support.",
      "classes": {
        "wrapper": "columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]",
        "item": "break-inside-avoid mb-4"
      },
      "notes": "Each card wrapper uses break-inside-avoid to prevent splitting. Keep consistent vertical rhythm with mb-4."
    },

    "premium_blur_paywall": {
      "blur_intensity": "filter: blur(14px) desktop, 12px mobile",
      "additional_obfuscation": [
        "Add slight opacity reduction on blurred container: opacity-70",
        "Add pointer-events-none to blurred cards area",
        "Overlay subtle white scrim: bg-white/60 to make blur feel 'frosted'"
      ],
      "sticky_cta": {
        "pattern": "sticky bottom-4 sm:bottom-6 z-30",
        "container_classes": "mx-auto max-w-2xl px-4",
        "cta_card_classes": "rounded-[16px] border border-[hsl(var(--mn-border-strong))] bg-white/90 backdrop-blur p-4 sm:p-5 shadow-none",
        "cta_copy": {
          "headline": "text-base sm:text-lg font-semibold tracking-tight",
          "sub": "text-xs sm:text-sm text-[hsl(var(--mn-fg-subtle))]"
        },
        "button": "primary_cta",
        "data_testid": {
          "container": "paywall-sticky-cta",
          "headline": "paywall-cta-headline",
          "button": "paywall-unlock-button"
        }
      },
      "example_structure": "<section className=\"relative\">\n  <div className=\"mn-premium-blur opacity-70 pointer-events-none\" aria-hidden=\"true\">...premium cards...</div>\n  <div className=\"pointer-events-none absolute inset-0 bg-white/50\" />\n  <div className=\"sticky bottom-4 sm:bottom-6 z-30 pointer-events-auto\" data-testid=\"paywall-sticky-cta\">...CTA card...</div>\n</section>"
    },

    "idea_validator": {
      "layout": "Hero card with input + validate button; output appears below in mono panel.",
      "input": {
        "placeholder": "Pitch your micro-SaaS idea...",
        "classes": "h-12 rounded-[12px] border border-[hsl(var(--mn-border-strong))] bg-white",
        "data_testid": "idea-validator-input"
      },
      "output_panel": {
        "classes": "mt-4 rounded-[14px] border border-[hsl(var(--mn-border))] bg-[hsl(var(--mn-surface-2))] p-4 font-mono text-xs sm:text-sm leading-relaxed",
        "content": "Rating: 4/10\nBrutal take: ...\nFix: ...",
        "data_testid": "idea-validator-output"
      },
      "micro_interaction": "On Validate: button shows loading state; output panel animates in with subtle y+opacity (Framer Motion optional)."
    },

    "auth": {
      "google_button": {
        "style": "secondary button with Google icon (lucide-react)",
        "classes": "rounded-[12px] border border-[hsl(var(--mn-border-strong))] bg-white text-black hover:bg-[hsl(var(--mn-surface-2))]",
        "data_testid": "google-oauth-login-button"
      },
      "paid_badge": {
        "component": "Badge",
        "classes": "font-mono text-[11px] rounded-[10px] border border-black bg-white text-black",
        "data_testid": "user-paid-badge"
      }
    },

    "admin_dashboard": {
      "shell": "Use a simple top header + left nav (optional) or single-column admin layout for speed.",
      "bulk_upload": {
        "component": "Textarea + Button",
        "textarea_classes": "min-h-[180px] font-mono text-xs rounded-[14px] border border-[hsl(var(--mn-border-strong))]",
        "data_testid": {
          "textarea": "admin-bulk-json-textarea",
          "submit": "admin-bulk-upload-button"
        }
      },
      "table": {
        "component": "Table (shadcn)",
        "rules": [
          "Use mono for numeric columns (MRR, competition).",
          "Sticky header on desktop if table scrolls.",
          "Row hover: bg-black/3 (very subtle).",
          "Delete action uses AlertDialog confirmation."
        ],
        "data_testid": {
          "table": "admin-niches-table",
          "delete": "admin-delete-niche-button"
        }
      }
    }
  },

  "motion": {
    "principles": [
      "Micro only: calm, fast, purposeful.",
      "No bouncy easing; use subtle ease-out.",
      "Prefer opacity + small translateY (2-6px).",
      "Never animate layout on scroll in a way that feels gimmicky."
    ],
    "durations": {
      "fast": "150ms",
      "medium": "220ms"
    },
    "hover_states": {
      "cards": "border darkens slightly",
      "buttons": "bg shifts by ~5-10%",
      "links": "underline thickness increases"
    },
    "optional_library": {
      "name": "framer-motion",
      "why": "entrance animations for validator output + paywall CTA reveal",
      "install": "npm i framer-motion",
      "usage_hint": "Wrap output panel with motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:0.22,ease:'easeOut'}}"
    }
  },

  "accessibility": {
    "requirements": [
      "WCAG AA contrast: black text on white surfaces; avoid light gray text below 38% gray.",
      "Visible focus ring on all interactive elements (ring-2 + ring-offset-2).",
      "Blurred premium content must be aria-hidden and non-interactive.",
      "Sticky CTA must be reachable by keyboard and not cover essential content on small screens (add bottom padding to blurred section).",
      "Use semantic headings and labels; inputs must have <Label>."
    ]
  },

  "spacing_and_density": {
    "philosophy": "Dense data, but never cramped. Use borders to separate; use whitespace to signal importance.",
    "spacing_scale_px": {
      "1": 4,
      "2": 8,
      "3": 12,
      "4": 16,
      "5": 20,
      "6": 24,
      "8": 32,
      "10": 40,
      "12": 48
    },
    "card_padding": "p-4 sm:p-5",
    "section_padding": "py-10 sm:py-14",
    "max_line_length": "max-w-[68ch] for long copy"
  },

  "image_urls": {
    "policy": "No photos needed. Keep it product/data-first. If any imagery is required, use monochrome SVG patterns only.",
    "optional": [
      {
        "category": "background texture",
        "description": "Use the built-in SVG noise overlay (.mn-noise) instead of external images.",
        "urls": []
      }
    ]
  },

  "instructions_to_main_agent": [
    "Remove CRA default App.css styles (dark centered header, spinning logo). Do NOT center the app container globally.",
    "In index.css: set body font-family to Geist; keep shadcn tokens but override with mn tokens as specified.",
    "Implement masonry via CSS columns (columns-1 sm:columns-2 lg:columns-3) and wrap each card with break-inside-avoid.",
    "Homepage: render exactly 3 free niches (is_premium=false) unblurred; render remaining niches blurred with pointer-events-none + aria-hidden.",
    "Sticky CTA: use a monochrome bordered card with backdrop blur; keep copy short and brutal; button is solid black.",
    "Links: monochrome underline (no blue).",
    "Monospace enforcement: create small helper components (e.g., <MonoChip>, <MonoValue>) to avoid accidental mono usage.",
    "Add data-testid to: header login button, validator input/button/output, each niche card + key fields, paywall CTA container/button, admin bulk upload textarea/button, admin table + delete buttons, success page confirmation text.",
    "No gradients anywhere (including subtle). No colored charts. If stats are needed, use mono numbers + separators."
  ],

  "General_UI_UX_Design_Guidelines": [
    "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms",
    "- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text",
    "- NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json",
    "\n **GRADIENT RESTRICTION RULE**",
    "NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc",
    "NEVER use dark gradients for logo, testimonial, footer etc",
    "NEVER let gradients cover more than 20% of the viewport.",
    "NEVER apply gradients to text-heavy content or reading areas.",
    "NEVER use gradients on small UI elements (<100px width).",
    "NEVER stack multiple gradient layers in the same viewport.",
    "\n **ENFORCEMENT RULE:**",
    "    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors",
    "\n **How and where to use:**",
    "   • Section backgrounds (not content backgrounds)",
    "   • Hero section header content. Eg: dark to light to dark color",
    "   • Decorative overlays and accent elements only",
    "   • Hero section with 2-3 mild color",
    "   • Gradients creation can be done for any angle say horizontal, vertical or diagonal",
    "\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
  ]
}

# Apple HIG — Components: notes for web implementations (Liquid Glass era)

Source: developer.apple.com HIG JSON (`/tutorials/data/design/human-interface-guidelines/<slug>.json`), fetched 2026-10-13.
Pages carry change logs up to June 2026 (e.g. tab bars, search fields, menus, and sidebars updated 2026-06-08; sheets 2026-03-24; layout 2026-09-09).

Legend:
- Plain bullets = what the HIG says (paraphrased; numbers exact).
- **Web:** = my suggestion for a web build. This is NOT HIG text.
- **Not in HIG:** = something the brief expected that the page does not contain. Several Liquid Glass details people associate with "iOS 26" (button style names, toolbar spacers, sheet insets) are NOT on the component pages. They come from SwiftUI/UIKit APIs and WWDC25 sessions. I mark them where relevant.

---

## 0. Cross-cutting foundations (needed by every component)

### 0.1 Two layers: controls layer vs content layer (Materials, Layout, Color)
- Liquid Glass is a dynamic material. It forms a separate functional layer for controls and navigation (tab bars, toolbars, sidebars) that floats above the content layer. Content scrolls and peeks through underneath while the controls stay legible.
- **Don't use Liquid Glass in the content layer.** Use standard materials there (for example, app backgrounds).
- Exception: transient interactive content-layer controls (**sliders, toggles**) take on a Liquid Glass look *while being activated* (during drag or press).
- Use it sparingly. System components adopt it automatically. In custom UI, limit it to the most important functional elements.
- Layout: don't put a solid or semi-opaque background colour under controls. Use a **scroll edge effect** to lift controls above content. Extend full-screen background content under sidebars, toolbars and tab bars.
- **Background extension effect:** when a sidebar or inspector would cover part of a hero image, mirror the adjacent image, flip and blur it, and run it to the window edge under the bar (`backgroundExtensionEffect()`, `UIBackgroundExtensionView`).
- **Web:** use two stacking contexts. `.content` scrolls normally. `.chrome` is `position: fixed/sticky` with glass. For the background extension, use a duplicated `<img>` with `transform: scaleX(-1); filter: blur(…)` placed under the sidebar.

### 0.2 Liquid Glass variants (Materials)
- **Regular:** blurs the background and adjusts its luminosity for legibility. Most system components use it. Use it when the background could hurt legibility or the component has a lot of text (alerts, sidebars, popovers).
- **Clear:** highly translucent and favours seeing the content underneath. Use it **only over visually rich backgrounds** (photos, video). If that content is bright, add a **dark dimming layer at 35% opacity**. No dimming is needed if the content is already dark, or if you use standard AVKit playback controls (they bring their own).
- Appearance changes with user settings: preferred glass look, Reduce Transparency, Increase Contrast.
- **Web:** use regular glass ≈ `backdrop-filter: blur(~20–30px) saturate(1.5–1.8)` plus a translucent fill, a hairline inner highlight and a soft shadow. For clear glass, use a much lower fill alpha and lighter blur, plus an optional `rgba(0,0,0,.35)` dim. Under `@media (prefers-reduced-transparency: reduce)`, switch to an opaque fill. Under `prefers-contrast: more`, add a stronger border and fill.

### 0.3 Liquid Glass colour (Color)
- Glass has no colour of its own. It picks up colour from what's behind it.
- You can tint glass for a "stained glass" look to emphasise a control such as the primary CTA. This is how the system draws **prominent buttons**.
- By default, symbols and text on small glass elements (toolbars, tab bars) are **monochrome and adaptive**: darker over light content, lighter over dark content.
- **Sidebars use a more opaque glass** so they stay legible over complex backgrounds.
- Use colour sparingly: status indicators and primary actions. **For a primary action, colour the button background, not its symbol or label.** Don't colour the backgrounds of several controls.
- With a colourful app background, avoid control labels in similar hues. Prefer a monochrome toolbar or tab bar, or an accent with clear contrast. Colourful content may scroll under controls, but the resting state (top of the scroll view) must be clearly legible.
- Even an app with a single appearance should define light and dark colours, to support glass adaptivity.

### 0.4 System colours (RGB from the Color page, June 2025 values; use APIs, values may change)
| Color | Light | Dark | Inc. contrast light | Inc. contrast dark |
|---|---|---|---|---|
| Red | 255,56,60 | 255,66,69 | 233,21,45 | 255,97,101 |
| Orange | 255,141,40 | 255,146,48 | 197,83,0 | 255,160,86 |
| Yellow | 255,204,0 | 255,214,0 | 161,106,0 | 254,223,67 |
| Green | 52,199,89 | 48,209,88 | 0,137,50 | 74,217,104 |
| Mint | 0,200,179 | 0,218,195 | 0,133,117 | 84,223,203 |
| Teal | 0,195,208 | 0,210,224 | 0,129,152 | 59,221,236 |
| Cyan | 0,192,232 | 60,211,254 | 0,126,174 | 109,217,255 |
| Blue | 0,136,255 | 0,145,255 | 30,110,244 | 92,184,255 |
| Indigo | 97,85,245 | 109,124,255 | 86,74,222 | 167,170,255 |
| Purple | 203,48,224 | 219,52,242 | 176,47,194 | 234,141,255 |
| Pink | 255,45,85 | 255,55,95 | 231,18,77 | 255,138,196 |
| Brown | 172,127,94 | 183,138,102 | 149,109,81 | 219,166,121 |
- Note that the Liquid Glass-era blue is **#0088FF** (light) and **#0091FF** (dark), not the old #007AFF.
- Semantic backgrounds (iOS) come in two sets, each with three levels: `systemBackground / secondary / tertiary`, and `systemGroupedBackground / secondary / tertiary`. Use the grouped set for grouped tables. Primary is the whole view, secondary groups content inside it, tertiary groups content inside secondary.
- Text colours: `label`, `secondaryLabel`, `tertiaryLabel` (unavailable items), `quaternaryLabel` (watermark), `placeholderText`, `separator` (translucent), `opaqueSeparator`, `link`. Don't use separator as text or secondaryLabel as a background.
- Vibrancy on materials (iOS): labels come in four levels (avoid quaternary on thin and ultra-thin); fills are `fill`, `secondaryFill`, `tertiaryFill`; there is one `separator`. Standard materials: ultraThin, thin, regular (default), thick.
- Don't rely on colour alone (add shapes or labels). Colour meanings are cultural (Stocks shows gains in green in English and in red in Chinese).

### 0.5 Hit targets, spacing, text (Accessibility, Typography)
| Platform | Default target | Minimum target | Default text | Min text |
|---|---|---|---|---|
| iOS/iPadOS | 44×44 pt | 28×28 pt | 17 pt | 11 pt |
| macOS | 28×28 pt | 20×20 pt | 13 pt | 10 pt |
| tvOS | 66×66 pt | 56×56 pt | 29 pt | 23 pt |
| visionOS | 60×60 pt | 28×28 pt | 17 pt | 12 pt |
| watchOS | 44×44 pt | 28×28 pt | 16 pt | 12 pt |
- Spacing between controls: about **12 pt** around bezeled elements and about **24 pt** around the visible edges of non-bezeled elements.
- Contrast (WCAG AA): **4.5:1** for text ≤17 pt; **3:1** for text ≥18 pt or any bold text.
- Text must scale to at least **200%** (watchOS: 140%).
- Reduce Motion: tighten springs, replace x/y/z movement with fades, avoid animating depth or blur.
- visionOS: keep button centres **≥60 pt apart**. watchOS: at most 3 glyph buttons or 2 text buttons per row.
- **Web:** 1 pt = 1 CSS px. Use `min-height: 44px` for touch and `@media (pointer: fine)` to allow 28px desktop controls.

### 0.6 Type ramp (iOS Dynamic Type "Large" default; weight / size / leading; emphasized weight)
| Style | iOS | macOS |
|---|---|---|
| Large Title | Reg 34/41 (Bold) | Reg 26/32 (Bold) |
| Title 1 | Reg 28/34 (Bold) | Reg 22/26 (Bold) |
| Title 2 | Reg 22/28 (Bold) | Reg 17/22 (Bold) |
| Title 3 | Reg 20/25 (Semibold) | Reg 15/20 (Semibold) |
| Headline | Semibold 17/22 | Bold 13/16 (Heavy) |
| Body | Reg 17/22 (Semibold) | Reg 13/16 (Semibold) |
| Callout | Reg 16/21 | Reg 12/15 |
| Subhead | Reg 15/20 | Reg 11/14 |
| Footnote | Reg 13/18 | Reg 10/13 |
| Caption 1 | Reg 12/16 | Reg 10/13 (Medium) |
| Caption 2 | Reg 11/13 | Medium 10/13 |
- iOS Body at AX1 is 28/34, at AX5 53/62.
- SF Pro is the system font everywhere except watchOS (SF Compact). New York is the serif. Optical sizes are continuous (variable font).
- **Web:** `font-family: system-ui, -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif`. Map the ramp to rem so it scales with the user's text size.

### 0.7 Concentricity, shapes, layout
- Toolbars: standard buttons, text fields, headers and footers default to corner radii **concentric with the bar's corners**. Custom components must be concentric too.
- Widgets: match the content radius to the widget radius (`ContainerRelativeShape`).
- visionOS shapes: icon-only buttons are **circles**; text-only are **rounded rect or capsule**; icon plus text is a **capsule**. Prefer more rounded shapes. Use capsules in horizontal rows and rounded rects in vertical stacks.
- watchOS: all inline buttons are capsules.
- **Web:** use concentric radius = parent radius − inset padding (`--r-inner: calc(var(--r-outer) - var(--pad))`). Use capsules via `border-radius: 999px`.
- Size classes: compact or regular, per axis. Base the layout on size class (available space), not on device or orientation. Keep features the same across sizes; e.g. a tab bar becomes a sidebar in regular width.
- macOS: avoid critical controls at the bottom of a window, since it is often off-screen.
- tvOS: safe area is 60 pt top/bottom and 80 pt sides. Grid column spacing is 40 pt horizontal and ≥100 pt vertical. Unfocused widths are 860/560/410/320/260/217/184/160 pt for 2–9 columns.

---

## 1. Buttons
**Definition:** a button starts an instantaneous action. It is defined by **style** (size, colour, shape), **content** (symbol, text or both) and **role**.

### Best practices
- Leave enough space around a button to separate it visually from neighbours.
- Hit region: **≥44×44 pt**; **60×60 pt in visionOS**.
- **Every custom button needs a pressed state.** Without one it feels dead.

### Style hierarchy
- Use a **prominent** style for the most likely action. The system puts the accent colour on its **background**.
- Limit prominent buttons to **one or two per view**.
- Distinguish the preferred option by **style, not size**. Equal-size buttons read as one coherent set; mixed sizes look inconsistent.
- Avoid label colours similar to the content behind. Over colourful content, prefer the default monochrome label.
- **Not in HIG page:** the named styles "glass", "glassProminent", "bordered", "borderless", "borderedProminent", "plain", and the size names mini/small/regular/large/extraLarge. These are SwiftUI APIs (`.buttonStyle(.glass)`, `.glassProminent`, `.bordered`, `.borderedProminent`, `.borderless`, `.plain`; `.controlSize(.mini … .extraLarge)`; `ButtonBorderShape .capsule/.roundedRectangle/.circle`). The page refers to "prominent" and "less prominent" styles only. For web, a reasonable tier is:
  1. **Prominent glass/filled:** tinted glass in the accent colour, white label. Primary CTA, at most 1–2 per view.
  2. **Glass:** neutral glass on chrome or floating over content.
  3. **Bordered/tinted (gray):** fill such as `fill`/`secondaryFill`, accent label. Content-layer secondary actions.
  4. **Borderless/plain:** accent text only. Tertiary, inline.
  Capsule is the default modern shape. Use rounded rect for stacked full-width buttons.

### Content
- Purpose must be clear from the symbol, the text, or both.
- Tooltips on macOS hover and visionOS dwell: short phrases.
- Use familiar icons for familiar actions (e.g. `square.and.arrow.up` = Share).
- Text labels: a few words, **Title Case**, **start with a verb** ("Add to Cart").

### Roles
- **Normal:** no specific meaning.
- **Primary:** the default and most likely choice. Uses the accent colour and responds to **Return**. In sheets, alerts and edit views, Return can close the view.
- **Cancel:** cancels the current action.
- **Destructive:** may destroy data. Uses **system red**.
- **Never make a destructive button primary**, even when it's the likely choice; people may hit it without reading.

### iOS/iPadOS
- For actions that aren't instant, show an **activity indicator inside the button**. Optionally swap the label ("Checkout" → "Checking out…"). The indicator sits next to the label and any button image is hidden.
- **Web:** `aria-busy="true"`, a spinner before the label, a disabled pointer, and a stable width.

### macOS
- **Push button:** the standard. Text, symbol, icon or image. Can be the default button (accent-filled) and can be tinted. A flexible-height variant is only for 2-line text or tall icons; it keeps the same corner radius and padding.
- Add a **trailing ellipsis** when the button opens another window, view or app ("Edit…").
- Spring loading: dragging items onto a button and force-clicking activates it.
- **Square (gradient) buttons:** symbol only, for view-related actions such as +/− under a table. Place them in or under the view, never in a toolbar or status bar. No introductory label.
- **Help button:** circular with "?", at most one per window. Position:
  - dialog with OK/Cancel → lower corner opposite them, vertically aligned;
  - dialog without dismiss buttons, or a settings pane → lower-left or lower-right.
  - Not in a toolbar. No intro text.
- **Image buttons:** about **10 px padding** between the image and the button edge (the click area is the button edge). Usually no border. Put any label **below**.

### visionOS
- Buttons have a visible background and play a sound (no haptics).
- States: **idle, hover, selected, unavailable**. Selected = **white background, black glyph**, so never use custom white-with-black-text buttons.
- No custom hover effects.
- Sizes:

| Shape | Mini 28 | Small 32 | Regular 44 | Large 52 | XL 64 |
|---|---|---|---|---|---|
| Circle (icon) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Capsule text-only | – | ✓ | ✓ | ✓ | – |
| Capsule text+icon | – | – | ✓ | ✓ | – |
| Rounded rect | – | ✓ | ✓ | ✓ | – |
- Prefer a visible background shape and fill. The exception is buttons inside a toolbar, context menu, alert or ornament, where the container provides the material.
- On a glass window, use the **thin** material as the button background. Floating in space, use **glass**.
- Keep centres ≥**60 pt** apart. For buttons ≥60 pt, add **4 pt** of padding so hover effects don't overlap. Avoid mini or small buttons in stacks or rows.
- **Web takeaway:** this is the only place Apple publishes a full button-height scale: **28 / 32 / 44 / 52 / 64**. Use it as `--btn-h-{xs,sm,md,lg,xl}`.

### watchOS
- Inline buttons are capsules on a contrasting material.
- Corner toolbar buttons get **Liquid Glass**, which separates them from content.
- Prefer full-width primary buttons. Two side-by-side buttons must share a height.

### Change log
- 2025-12-16: Liquid Glass update.
- 2025-06-09: styles and content update.

---

## 2. Toggles (switch, checkbox, radio, toggle button)
- A toggle chooses between two opposing states, with a distinct look for each. It only manages state; for other actions use another control, such as a pop-up button.
- Make it clear what the toggle affects. Make the state difference obvious (fill on/off, background shown/hidden, checkmark or dot). **Don't rely on colour alone.**
- **Switch:** leading label, trailing switch.
- **Checkbox:** small square. Empty = off, checkmark = on, dash = mixed. The title is on the trailing side. It may have no title in an editable checklist.
- **Radio:** small circle with a label, in groups of **2–5**, mutually exclusive. Filled = selected. A mixed (dash) state exists but is rarely useful.
- **Toggle button:** an icon button whose background changes with state.

### iOS/iPadOS
- Use a switch **only in list rows**; no extra label is needed because the row gives context.
- The default "on" colour is **green**. Change it to the accent only if necessary, and keep enough contrast with off.
- **Outside lists, use a toggle button, not a switch** (e.g. Phone's filter button gets a blue highlight when active). No explanatory label.
- Liquid Glass: per Materials, a switch's thumb turns to glass while being dragged or pressed (Liquid Glass applies to transient interaction).
- **Web:** implement the switch as `<button role="switch" aria-checked>`. Typical iOS switch geometry is not given in the HIG; native iOS 26 is about 63×28 with a capsule thumb that enlarges into glass while pressed. Treat these as approximate.

### macOS
- Put switches, checkboxes and radios in the **window body**, not in a toolbar or status bar.
- Prefer a **switch** for settings you want to emphasise (more visual weight; governs a group).
- In a grouped form, a **mini switch** matches row height. Use regular switches for primary settings and mini switches for subordinates.
- Don't replace existing checkboxes with switches.
- **Checkboxes** for hierarchies: leading-aligned, indented for dependents. An optional group label is baseline-aligned with the first checkbox. A parent shows **mixed** when its children differ (e.g. bold/italic/underline).
- Prefer a single checkbox for one on/off setting. Use paired radios only if the opposite states need explicit labels.
- **Radio buttons:** use for more than 2 exclusive options. **More than about 5 → pop-up button.** For horizontal radios, give every item the width of the longest label.

### Change log
- 2024-03-29: macOS switch guidance.

---

## 3. Segmented controls
- A linear set of **≥2 segments**, each acting as a button. Segments are usually **equal width**. Text labels may sit below each segment or below the control.
- **Modes:**
  - single-select (all platforms);
  - multi-select (macOS only, e.g. B/I/U);
  - momentary/action (no selection state, e.g. Mail's Reply / Reply All / Forward).
  - Never mix action and selection behaviour in one control.
- Use for closely related choices affecting an object, state or view. Grouping and selection are visible at a glance.
- **Segment limits:** about **5–7** in wide UIs and about **5 on iPhone**.
- Content: text **or** images, never mixed. Keep content sizes similar. Labels are **nouns**, Title Case. No intro text needed if the segments are labelled.
- **iOS:** switch between closely related subviews (e.g. Calendar New Event vs Reminder). For separate app sections, use a **tab bar**.
- **macOS:**
  - Intro text is optional. Icon segments can have labels beneath them, and every segment should have a tooltip.
  - For view switching in the main window, use a tab view.
  - Fine in toolbars and inspectors. Supports spring loading.
- **tvOS:** for filtering, prefer a split view. Keep other focusable items away, because focus selects a segment.
- **visionOS:** icon segments show a tooltip on gaze.
- Not supported on watchOS.
- **Not in HIG:** Liquid Glass specifics. (Native iOS 26: the track is a capsule; the selected thumb is a raised capsule that becomes glass while dragged.)
- **Web:** use `role="radiogroup"`/`radio` for selection or `role="group"` of buttons for momentary. The selected pill animates (`transform`) between segments. Use a capsule track and a concentric capsule thumb.

---

## 4. Sliders
- Anatomy: horizontal **track**, **thumb**, **fill** from min to thumb, optional **min/max icons**, optional **tick marks** (macOS).
- Customisable: track colour, thumb image, tint, and the left/right images (e.g. small and large image icons for size).
- Min is on the **leading** side (or bottom when vertical); max is trailing (or top).
- For wide ranges, pair with a **text field and stepper** for exact values.
- Give **live feedback** while dragging (e.g. Dock icons resize live).
- Horizontal = fixed endpoints. **Circular** (macOS) = repeating or unbounded values, e.g. 0–360°, with multiple turns allowed (1440°).
- Introduce a slider with a label: sentence case, **ending with a colon**.
- Use tick marks for precision and label them (min/max is often enough; label periodically for nonlinear scales).
- **iOS:** never use a slider for audio volume; use the system volume view.
- **macOS:** linear thumb is a lozenge, circular thumb is a small circle, ticks are dots around the circle. Show a tooltip with the value on hover.
- **visionOS:** prefer horizontal.
- **watchOS:** discrete steps or a continuous bar, with −/+ buttons at the sides.
- Not available on tvOS.
- Liquid Glass (Materials): the thumb takes on glass during interaction.
- **Web:** use `<input type="range">` with custom styling. Fill via a `linear-gradient` driven by a CSS var. The thumb is a capsule or circle; on `:active`, scale it up and switch to a glass treatment. Add `aria-valuetext`.

---

## 5. Steppers
- Two segments (− / +) for incremental values. They **don't show the value**; place the value field next to them. Make clear which value they change.
- For large changes, pair with a text field (e.g. Print copies).
- **macOS:** Shift-click changes by a bigger step (e.g. **10×** the default).
- Not on watchOS or tvOS. No numeric specs.
- **Web:** use two buttons in a capsule group with a divider, plus `<input type="number">` or an `<output>` beside it.

---

## 6. Pickers (incl. date pickers)
- Show one or more scrollable lists of distinct values. Order and values depend on locale.
- Use for **medium-to-long lists**. For short lists use a **pull-down button**; for very long ones use a list or table with an index.
- Values must be predictable and logically ordered (e.g. alphabetical countries).
- Show in context, below or near the field being edited, typically at the bottom of a window or in a popover. Don't switch views to show a picker.
- Minute granularity: you can set an interval that divides 60 (e.g. 0/15/30/45).
- **Styles:**
  - *Wheels:* iOS, and watchOS dates; also accepts keyboard input on iOS.
  - *Compact (iOS):* a button showing the value in the accent colour that opens a modal calendar plus time editor. Use when space is tight.
  - *Inline (iOS):* time → wheels; date → an inline calendar.
  - *Automatic.*
  - *macOS:* graphical (calendar or clock face, supports ranges) and textual (fields).
  - *watchOS:* navigation link with Digital Crown scrubbing.
- **Date modes:** date; time (with optional AM/PM); date and time; countdown timer (≤ 23 h 59 m; not available in compact or inline).
- **Web:** compact = a pill button with accent text opening a popover with a calendar grid. Native `<input type="date">` is acceptable on mobile.

---

## 7. Text fields
- For **small** amounts of text (name, email); use a text view for more.
- Placeholder text ("Email") is a hint only. It disappears on typing, so **also provide a separate label**.
- Use **secure fields** for passwords.
- Field size suggests input length. Space fields evenly and stack them vertically with consistent widths (first and last name equal; address and city equal).
- Tab order should be logical.
- **Validation timing:**
  - digits-only → on bad entry;
  - email → when focus leaves;
  - username/password → *before* focus leaves.
- Use number formatters (locale-aware decimals, %, currency).
- Overflow: clip (default), wrap (by character or word), or truncate (head, middle or tail). Consider an expansion tooltip on hover for clipped text.
- Choose the matching keyboard type (§7a). Minimise text entry on tvOS and watchOS.
- **iOS:**
  - **Clear button** at the trailing end.
  - Leading image shows purpose; trailing buttons for extras (e.g. Bookmarks).
- **macOS:** text plus a list of choices → **combo box**.
- **Not in HIG:** style variants, focus/error/disabled states, Liquid Glass. **Web:** use filled rounded rects (`tertiarySystemFill`-like) in content and a capsule on glass bars (concentric with the bar). Show a 2–3 px accent focus ring and red helper text for errors.

### 7a. Keyboard type → web mapping (Virtual keyboards)
- default → `inputmode="text"`
- numberPad → `inputmode="numeric"`
- decimalPad → `decimal`
- phonePad → `tel`
- email → `type=email`
- URL → `type=url`
- webSearch → `inputmode="search"`
- Return key label → `enterkeyhint` (`search|go|send|next|done`)
- Input accessory bars above the keyboard should use Liquid Glass if neighbours do; a standard toolbar adopts it automatically.

---

## 8. Search fields
- Anatomy: magnifying-glass icon, placeholder, **Clear** button. Optional **scope bar** and **tokens**.
- Placeholder says what is searchable.
- Search **as people type** if possible. Show suggestions (recents before typing, predictions while typing). Most relevant results first; group by category.
- **Scope bar:** filter clearly defined categories, defaulting to the **broader** scope (e.g. Mail: all mailboxes → current mailbox).
- **Tokens:** visual chips for common terms (a contact, a "Photos" filter). Pair them with suggestions so people discover them.

### iOS placement (Liquid Glass era)
There are three entry points.
1. **Search as a tab** in the tab bar, in one of two styles:
   - *Standard tab:* looks like other tabs and opens a search landing page with the field at top. Use for discovery and browsing (TV app genres).
   - *Button appearance:* a **separate button at the trailing end** of the tab bar. Tapping it focuses the field and raises the keyboard immediately. Use when search should resolve fast. Exiting returns to the previous tab.
2. **Toolbar search:**
   - *Bottom toolbar:* an expanded field or a toolbar button, depending on space. Tapping animates it into a field **above the keyboard**. **Prefer bottom when search is a priority** (Settings with search alone; Mail and Notes alongside other controls).
   - *Top toolbar (navigation bar):* appears as a button and animates into a field above the keyboard (or at the top if there's no room). Use top when a bottom field would cover a primary function, or when there's no bottom toolbar (Wallet passes).
3. **Inline field** next to the content it filters (Music library filter). At the top, place it above the list; consider pinning it into the top toolbar on scroll.

### iPadOS/macOS
- Common case: **trailing side of the toolbar** (Mail, Notes, Voice Memos; keeps selection visible). Results can show in the detail view (Freeform).
- **Top of the sidebar** when it filters sidebar navigation (Settings).
- A dedicated sidebar or tab-bar search area for discovery (Music, TV).
- Auto-focus on entering a dedicated search area, **except on iPad with only a virtual keyboard**.
- The field resizes fluidly. In compact widths, put it above the content list column.

### Other platforms
- tvOS: a keyboard screen with results below; offer suggestions.
- watchOS: a full-screen text input.

### Web
- `<search><input type="search" enterkeyhint="search">`. Use a capsule field with a leading 🔍 icon and a trailing clear (×) shown only with text.
- On mobile, put it in a floating bottom glass bar that slides above the virtual keyboard (`visualViewport` API).

### Change log
- 2026-06-08: search-as-tab terminology.
- 2025-06-09: iOS placement and tokens.

---

## 9. Menus (general rules for every menu)
- A menu reveals options on interaction. Items are commands, options or states.
- **Labels:**
  - Verb or verb phrase; **Title Case**.
  - Drop articles ("View Settings", not "View the Settings").
  - May show a keyboard shortcut (apps, not games).
- **Unavailable items are dimmed** (in regular menus). If everything is unavailable, keep the menu itself openable.
- Add a **trailing ellipsis "…"** when the item needs more input before completing.
- **Icons:**
  - Use standard icons for common actions (Share, Print, Search).
  - Use icons sparingly: key actions, file locations, devices, visual concepts (rotate/flip), user content.
  - Skip an icon if none is clear.
  - **Icons are all-or-nothing within a group.** (Updated 2026-06-08.)
- **Order:** most important or frequent items first. Group related items with **separators** (a line or gap). Keep related commands together even if their importance differs (Copy/Cut/Paste/Paste and Match Style).
- Long menus → split them or use a submenu. Dynamic or user content (History, Bookmarks) may scroll.
- **Submenus:**
  - The parent shows a trailing **chevron**.
  - Use sparingly, and only **1 level deep**.
  - If the submenu has more than **about 5 items**, consider a separate menu.
  - Create one when the same term appears in more than 2 items ("Sort by Date/Score/Time" → "Sort by ▸").
  - The parent stays enabled even if its children are disabled.
  - Prefer a submenu to indentation.
- **Toggled items:**
  - Use one item whose label changes ("Show Map" ↔ "Hide Map"); add a verb when it's unclear ("Turn HDR On").
  - Or show both items with only one enabled.
  - Or use a **checkmark** for attributes that are in effect.
  - Consider a "clear all" item (e.g. "Plain").
- **iOS/iPadOS layouts** (`preferredElementSize`):
  - **Small:** top row of **4 icon-only** items, then a list. Only for tightly related actions like B/I/U/S.
  - **Medium:** top row of **3 items** with icon over a short label, then a list (Notes: Scan / Lock / Pin).
  - **Large (default):** a plain list.
- **visionOS:**
  - Small or large layouts. Show the menu near its content.
  - It can extend beyond the window.
  - Breakthrough effects: automatic, **subtle** (preferred), prominent, none.
- **Not in HIG page:** menu row heights, radii, or a glass spec. (Native iOS 26 menus are glass panels that morph out of the source button.)
- **Web:** use a `role="menu"` panel with a regular-glass background, a large radius (~20–26 px on touch, ~10–12 px with a pointer), ~44 px rows on touch, 1 px separators or 8 px gaps between groups, and destructive items in system red. Animate scale and opacity from the trigger's origin (`transform-origin` at the button).

---

## 10. Pull-down buttons
- A button whose menu lists actions or items **directly related to the button's action**. Choosing an item closes the menu and performs it.
- Examples:
  - Add ▾ → what to add;
  - Sort ▾ → sort key;
  - Back (long-press) → history.
- For mutually exclusive *choices* (not commands), use a **pop-up button**.
- Don't hide all of a view's primary actions in one pull-down.
- **Minimum 3 items.** For 1–2 items, use buttons or a toggle. Too many items slow people down.
- A menu title is only shown if it adds meaning.
- **Destructive items** are red. On choosing one, confirm via an **action sheet (iPhone)** or **popover (iPad)**, placed apart from the menu.
- Icons go *after* the label (trailing) only when they clarify; use SF Symbols.
- **iOS:**
  - Can be revealed by touch-and-hold on a regular button (Safari Tabs button).
  - **More (ellipsis) button:** a compact catch-all for non-prominent items. It hurts discoverability, so weigh that.
- Not on tvOS or watchOS.
- **Web:** `<button aria-haspopup="menu" aria-expanded>`. Optionally use long-press to open.

---

## 11. Pop-up buttons
- Show a menu of **mutually exclusive options**. After a choice, the button label updates to the selection.
- Use for a flat list of options or states. Use a **pull-down** instead for actions, multi-select, or submenus.
- Provide a **sensible default** (the most-likely item, not necessarily the first).
- Make options predictable via an intro label or a descriptive button label.
- Space-efficient. Can include a "Custom…" option. Explanatory text may appear below.
- **iPadOS:** inside a popover or modal, prefer a pop-up button over a disclosure row that navigates to a detail list (small, well-defined option sets).
- Not on tvOS or watchOS.
- **Web:** a button showing "Value ⌃⌄" (up/down chevrons) opening a listbox with a checkmark on the selected row. Native `<select>` is acceptable.

---

## 12. Context menus
- **Triggers:** touch/pinch-and-hold (iOS, iPadOS, visionOS); Control-click or secondary click (macOS, iPadOS).
- **Relevance:** no advanced or rare items. Mail's message menu has Reply and Move, not Manage Mailboxes.
- Keep **few items**. Support context menus **consistently** on all similar items.
- **Every item must also be available elsewhere** in the main UI (toolbar or menu bar).
- Submenus: 1 level, with clear titles.
- **Hide unavailable items** (don't dim them). Exception: macOS Cut/Copy/Paste may appear dimmed.
- Frequent items go where the eye lands first. **Reverse the order if the menu opens above the content.**
- **No keyboard shortcuts** shown in context menus.
- Use **≤ about 3 groups** with separators.
- **Destructive items go last**, marked destructive (red).
- Titles are rare; use one only when it clarifies (e.g. "3 Messages").
- **iOS/iPadOS:**
  - Use a context menu **or** an edit menu for an item, not both.
  - iPad: a context menu on empty space can create new objects (Files: New Folder).
  - **Preview:** a condensed view of the item appears near the menu. Tapping it opens the item; it can be dragged.
  - The system animates the preview out of the content and **dims the background**. Match the preview's clip path to the content's shape (rounded corners) so its outline doesn't jump.
- **visionOS:**
  - Prefer a context menu over a panel for frequent functions.
  - The menu shouldn't be taller than the window.
- **Web:** use the `contextmenu` event plus long-press (~500 ms) on touch. Lift the preview card (scale ~1.02, shadow), dim the backdrop, and show the menu below or above. Reorder the items when the menu flips.

---

## 13. Edit menus
- System edit menu for selections: Copy, Select, Translate, Look Up, plus data-detected actions (an address → "Get Directions").
- **iOS:** a compact horizontal bar on touch-and-hold or double-tap. A trailing **chevron** expands it to a vertical menu.
- **iPad:** the horizontal bar on touch; with a pointer or keyboard, it appears directly as a context menu.
- Show only relevant commands (no Copy without a selection). Put custom commands next to related system commands. Support **undo/redo**.
- **Delete ≠ Cut.**
- Allow copying noneditable *content* text (captions, status), but not control labels.
- Default placement is above or below the selection with a pointer arrow. You may move it to avoid covering content; you can't change its shape.

---

## 14. Sheets
- A sheet handles a **scoped task** closely tied to the current context (attach a file, choose a save location).
- **Modality:** always modal on macOS, tvOS, visionOS and watchOS. On iOS/iPadOS a sheet can be **nonmodal** (Notes' format sheet lets you keep editing).
- **Buttons:**
  - **Cancel/Close:** dismiss without saving.
  - **Done:** finish or save.
  - **Back:** go to the previous step; it does not dismiss.
  - **Never use Done alone.** Pair it with Cancel or Back.
  - **Never show Cancel, Done and Back together.**
- **One sheet at a time.** Close the first sheet before opening another (you may re-show it afterwards).
- For complex or long flows, use a full-screen modal (iOS), a separate window (macOS), or a Full Space (visionOS). For supplementary non-blocking UI, use a split view (visionOS), a panel (macOS), or a nonmodal sheet (iOS).

### iOS/iPadOS
- **Single-view sheet:** **Cancel at the leading edge** of the sheet's top toolbar; **Done at the trailing edge**.
- **Multi-step sheet:**
  - step 1: Cancel leading, Done trailing but *inactive*;
  - middle steps: **Back** replaces Cancel, Done stays inactive;
  - final step: Back plus an *active* Done.
  - (Updated 2026-03-24.)
- **Detents:**
  - **large** (full; always supported);
  - **medium** (about **½** of full height);
  - custom.
  - Medium-only prevents expansion; medium plus large allows both.
  - Use medium for progressive disclosure (e.g. the share sheet).
  - Use full height only for content that needs it (Mail/Messages compose).
- **Grabber:** a small horizontal bar at the top of resizable sheets. Tapping it cycles detents (VoiceOver-friendly).
- **Swipe down to dismiss** is expected. With unsaved changes, confirm via an **action sheet**.
- **iPad:** prefer **page or form sheet** styles: default size, centred, over a dimmed background.
- **Not in HIG page:** Liquid Glass sheet geometry. From iOS 26 native behaviour (non-HIG): partial-height sheets float **inset from the screen edges** on a glass background with large concentric corners, and become edge-to-edge and more opaque at the large detent.
- **Web:** use `<dialog>` as a bottom sheet with:
  - `inset-inline: 8px; bottom: 8px; border-radius: ~32px`, glass;
  - at full height, `inset: 0`, top radius only, opaque background;
  - a grabber of 36×5 px with a pill radius;
  - drag-to-dismiss and a backdrop dim at medium/large.

### macOS
- A card-like view with rounded corners that floats on its parent window and **dims** it.
- Use a reasonable default size; resizing is optional.
- On open, bring the parent forward; other windows can still be fronted.
- For repeated or observational input (Find/Replace), use a **panel**, not a sheet.

### visionOS
- Floats in front of the parent and dims it. **Centred**, not sliding from the bottom.
- Don't cover most of the window.

### watchOS
- Full screen, semitransparent, blurring and desaturating what's behind.
- Use only when a custom title or presentation is needed; otherwise use an alert or action sheet.
- A default **Cancel** sits in the top toolbar. No custom Back, and no title-like text in the top-leading corner.

---

## 15. Popovers
- A transient view anchored to a control; small amounts of functionality (a calendar event editor).
- Use for temporary extra room instead of a permanent sidebar or panel.
- **Arrow points directly at the source.** Ideally don't cover the source or essential content.
- Close/Cancel/Done buttons only when they add clarity (save-or-discard). Otherwise dismiss on an outside tap or on item selection.
- **Multi-select popovers stay open** until an explicit dismissal or outside tap.
- **Auto-dismiss must save work.** Only an explicit Cancel discards it.
- **One popover at a time**, never cascaded. Nothing goes on top except an **alert**.
- Allow a single tap to close one popover and open another (adjacent bar buttons).
- Size to fit the content (the system may adjust). **Animate size changes** between condensed and expanded states.
- Never use popovers for **warnings**; use alerts.
- **iOS:** avoid in compact width; use a sheet there. Popovers are for regular width.
- **macOS:** popovers can be **detachable** into a panel (keep its look similar).
- Not on tvOS or watchOS.
- **Web:** use the Popover API (`popover` attribute) plus CSS anchor positioning with an arrow; regular glass, ~16–20 px radius. Under 600 px, switch to a bottom sheet.

---

## 16. Alerts
- Critical, immediate information; modal. Use **sparingly**.
- Not for plain info (show it in context). Not for common undoable actions, even destructive ones. **Never on launch.**
- **Anatomy:**
  - title; optional message; **up to 3 buttons** (all platforms);
  - text field (iOS, iPadOS, macOS, visionOS);
  - icon and accessory view (macOS, visionOS);
  - suppression checkbox and Help button (macOS).
- **Title:**
  - Specific: what happened, the context, why. Never "Error" or "Error 329347".
  - **≤2 lines.**
  - A full sentence gets sentence case and punctuation; a fragment gets Title Case and no punctuation.
- **Message:** only if it adds value. Short, full sentences, sentence case.
- Avoid explaining the buttons. If you must, say "choose" and the exact button title, without quotes.
- **Button titles:**
  - 1–2 words, verbs tied to the text ("View All", "Erase").
  - "OK" only in informational alerts. **Never "Yes" or "No".** Always "**Cancel**" for cancel.
  - Title Case, no punctuation.
- **Placement:** the likely or default button goes **trailing in a row** or **top of a stack**. **Cancel goes leading in a row** or **bottom of a stack**.
- **Destructive style:** only when the button does something the person *didn't* deliberately choose. Don't use it for a deliberate "Empty Trash" confirm, where Return-to-confirm is more useful.
- With a destructive action, **always include Cancel**. **Cancel is never the default.** To force reading, make no button the default. A single default button is "Done", not "Cancel".
- Cancel alternatives: Esc or ⌘. (iOS, iPadOS, macOS, visionOS); Home (iOS); the Menu button (tvOS).
- **iOS:**
  - Choices related to an intentional action → **action sheet**, not an alert.
  - Avoid scrolling alerts (watch out for large text sizes).
- **macOS:**
  - The app icon shows automatically.
  - Suppression checkbox for repeating alerts; Help button.
  - Caution symbol `exclamationmark.triangle` only for unexpected data loss.
- **visionOS:** an accessory view has **max height 154 pt** and a **16 pt corner radius**. In the Shared Space the alert sits in front of the window, slightly forward on the z-axis; in a Full Space it is centred.
- **Web:** use a centred `<dialog role="alertdialog">`, ~270–320 px wide on mobile, glass or thick material, a large radius, and a dimmed backdrop. Lay out 2 buttons side by side (Cancel left) and 3 stacked (default top, Cancel bottom). Native iOS 26 alerts are left-aligned with capsule buttons; that is not stated in the HIG.

---

## 17. Action sheets (confirmation dialogs)
- A modal set of choices **related to an action the person started** (cancel a draft → Delete Draft / Save Draft). Alerts are for unexpected problems.
- Use sparingly. **Title on a single line.** Add a message only if needed.
- **Cancel** where needed, especially for destructive choices:
  - iOS: at the **bottom**;
  - watchOS: **top-left**;
  - SwiftUI `confirmationDialog` includes it automatically.
- **Destructive buttons go at the top**, in destructive style.
- **iOS:** use an action sheet, not a menu, for action-related choices. **Avoid scrolling.**
- **iPad:** shown as a popover (implied by the pull-down page: "action sheet (iOS) or popover (iPadOS)").
- **watchOS:** **≤4 buttons including Cancel** (≤3 others).
- Not on visionOS.
- **Web:** a bottom-anchored group of rows, destructive (red) first, with Cancel as a separate block at the bottom. On wide screens, use a popover anchored to the trigger.

---

## 18. Activity views (share sheet)
- Lists app-specific activities, then system actions (Add to Files, AirPlay); quick app targets. Users can edit the list. Shown as a sheet or popover.
- You can exclude irrelevant system actions (e.g. Print), but you can't reorder them. No duplicates of system actions; rename similar ones ("Print Transaction").
- Custom icon: centred in about **70×70 px**; prefer an SF Symbol.
- Titles: a short verb phrase, no company or product name.
- **Open it via the standard Share button only.**
- Extensions: few steps, no extra modals (an alert is OK). Long tasks continue in the background; notify only on problems.
- iOS, iPadOS and visionOS only.
- **Web:** `navigator.share()`, with a custom sheet as fallback.

---

## 19. Tab bars
- **Navigation between top-level sections**, not actions (use a toolbar for actions). Preserves per-section navigation state.
- **Keep it visible** across sections. It is hidden only under modals.
- Fewer tabs are better. For complex apps, use a sidebar or a tab bar that adapts into a sidebar.
- **Avoid overflow:** in iOS/iPadOS the trailing tab becomes "More". Prevent that.
- **Never disable or hide tabs** when their content is unavailable; explain the empty state inside the tab instead.
- **Always include labels**: single words when possible.
- Use **SF Symbols**, preferring **filled** variants.
- Compact width: **icon above label**. Regular width: **icon beside label**.
- No icon sizes are given (see Apple Design Resources).
- **Badges:** red oval, white number or "!", only for critical info.
- Colour: avoid label colours similar to content. Over colourful content, use monochrome tabs or a high-contrast accent.

### iOS (Liquid Glass)
- The tab bar **floats above content at the bottom**, items on a Liquid Glass background with content visible through.
- **Minimize on scroll:** with an attached **accessory** (e.g. Music's MiniPlayer), the tab bar can shrink when scrolling down and the accessory moves **inline** beside it. Restore by tapping a tab or scrolling to top (`TabBarMinimizeBehavior`, `.onScrollDown`).
- The **accessory view** sits **above** the tab bar when expanded (`tabViewBottomAccessory`).
- A **search tab** can sit at the **trailing end**, either as a standard tab or with a separate *button appearance* (see §8).
- **Not in HIG:** an iPhone tab count. (The old "3–5" figure isn't on the current page; the only number is "≤5 default tabs" for customizable iPad tab bars. Treat **≤5** as a practical cap.)

### iPadOS
- The tab bar sits **near the top** of the screen and can share the horizontal space with the toolbar.
- It may convert to a **sidebar** via a button (`sidebarAdaptable`).
- Allow customisation (add or remove tabs); with customisation, keep **≤5 default tabs**.

### tvOS
- Height **68 pt**, top edge **46 pt** from the screen top (fixed).
- Translucent; the selected tab is opaque and gets a shadow on focus.
- Overflow fades. It scrolls away on single-view tabs and is pinned when the screen has a split view.

### visionOS
- **Vertical**, floating at the window's leading side. Expands on gaze to show labels (symbols are always visible).
- Use a sidebar *within* a tab for depth.

### Web implementation sketch (my interpretation)
- `nav` fixed at `bottom: max(env(safe-area-inset-bottom), 8–12px)`, centred, `border-radius: 999px`.
- Regular glass with an inset highlight and shadow.
- Items ~56–64 px wide; icon ~24 px over a ~10–11 px semibold label.
- The selected item gets an accent-tinted glyph plus a subtle glass "lens" pill behind it.
- The search button is a separate circular glass button at the trailing end.
- On scroll down: shrink to an icon-only pill showing the active tab, and move the accessory inline. Restore on scroll up or at the top. Respect `prefers-reduced-motion`.

---

## 20. Toolbars (incl. navigation bars — "on iOS, a navigation-specific toolbar is called a navigation bar")
- One or more **groups** of controls along the **top or bottom** edge. A toolbar acts on content, aids navigation and orients the user.
- Contains the title, navigation (back/forward, search), and actions (buttons, menus).
- **Regions:**
  - **Leading:** back, sidebar toggle, then the title. An optional *document menu* next to the title (Duplicate, Rename, Move, Export). Not customizable.
  - **Center:** common controls (and the title if it's not leading). Customizable on iPad and Mac. Items collapse into the **system overflow menu** as width shrinks.
  - **Trailing:** must-stay items, inspector toggles, optional search, the **More** menu, and the primary action (Done). Always visible.
- **Back button:** the standard **Back chevron symbol in a standard circular button**. **No "Back" text label.**
- **Close:** the standard **Close (×) symbol**, not a "Close" text label.
- **Overflow:** the system adds it on iPad and Mac. Don't add one manually. Decide which items collapse first.
- Use a **More menu** only for lesser actions.
- **Appearance:**
  - **Reduce custom toolbar backgrounds and tinted controls**; they interfere with system glass effects.
  - Let the content layer inform the toolbar's look. Use a **ScrollEdgeEffectStyle** to separate bar and content when needed.
  - Prefer **monochrome** toolbar labels over colourful content.
- Standard components (buttons, text fields, headers, footers) have **radii concentric with the bar**. Custom components must match.
- Hiding toolbars for distraction-free modes is OK; always give a way back.
- **Titles:** every window gets a useful title, **< 15 characters**, and never the app name. The title may be empty when redundant (Notes single window).
- **Actions:**
  - Prioritise the most-needed ones. Prefer **symbols over text** (except actions like "Edit").
  - Use **borderless system symbols**; the group provides the container. Avoid outlined-circle symbols.
  - Use the **`.prominent` style for the key action** (Done, Submit). It is **tinted and separated** from groups. **Only one**, on the **trailing** side.
- **Grouping (Liquid Glass):**
  - Group by function and frequency. Navigation and critical actions (Done, Close, Save) get their own distinct sections.
  - **Max ~3 groups.** Keep groupings consistent across platforms.
  - **Don't put text-labelled and symbol buttons in the same group.** Separate them with **fixed space** (`UIBarButtonItem.fixedSpace`; SwiftUI `ToolbarSpacer(.fixed)`, though that API name isn't on the page).
  - Image examples:
    - correct: back+forward grouped on the leading side, tools+More grouped on the trailing side;
    - wrong: everything in one trailing group;
    - wrong: Edit (text) and Share (symbol) in one group;
    - correct: each in its own group;
    - the prominent Done is *ungrouped* and tinted.
- **iOS:**
  - Only essential items; the rest go in a More menu.
  - **Large title** collapses to a standard inline title on scroll and expands back at the top (`prefersLargeTitles`).
- **iPadOS:** toolbar and tab bar can share the top row.
- **macOS:**
  - The toolbar sits in the window frame, below or merged with the title bar; the title can be inline.
  - Items have **no bezel**.
  - Every toolbar item must also exist in the **menu bar**, but not every command needs a toolbar item.
- **visionOS:**
  - Bottom of the window, slightly in front.
  - A **variable blur** behind items keeps them legible while the glass stays uniform.
  - Symbol items reveal labels on gaze.
  - No vertical toolbars. Avoid pull-downs.
  - Don't let the window shrink below the toolbar width.
- **watchOS:** buttons in the top corners or along the bottom; an optional primary button hidden in the scroll view, revealed by scrolling up.

### Web sketch
- Top bar: transparent (no fill). Each group is a separate glass **capsule** containing borderless icon buttons (~44 px targets, ~20–22 px glyphs). The back button is a circular glass button with a chevron only.
- A scroll-edge gradient sits under the bar: `mask`/`linear-gradient` with blur (soft = variable blur fade; hard = more opaque with a defined edge).
- Large title (34 px bold) below the bar, collapsing into an inline 17 px semibold title on scroll (IntersectionObserver).
- Bottom toolbar: floating glass capsules at `bottom: safe-area + 8px`.

---

## 21. Scroll views & scroll edge effects
- Support standard gestures and keys; give custom scrolling elastic indicators.
- Show partial content at the edge to signal more.
- **Don't nest same-axis scroll views** (horizontal inside vertical is OK).
- **Paging:** the page size is the viewport size; subtract an overlap unit (a line or row) to keep context.
- **Auto-scroll** only as much as needed:
  - to a search result or insertion point;
  - when typing begins offscreen;
  - when dragging a selection past the edge;
  - before acting on an offscreen selection.
- Zoom needs sensible min and max values.
- **Scroll edge effect** (iOS, iPadOS, macOS):
  - Separates floating UI (toolbars) from the content scrolling behind it.
  - **Hard:** a more opaque blur with a defined bottom edge.
  - **Soft:** a variable blur fading out.
  - **Prefer automatic.** It gives more opaque separation for top toolbars with many controls, text outside glass controls, and **pinned table headers**.
  - Soft needs legibility testing.
  - **Only use it when content scrolls behind floating UI.** It is not decorative and is not a dimming overlay.
  - **One per view.** In split views, one per pane, with **consistent heights**.
- iOS: when using a page control on a paged scroll view, hide the same-axis scroll indicator.
- macOS: scroll bars; small or mini sizes in cramped panels (consistent sizing).
- visionOS:
  - Fixed small indicator, slightly thicker than iOS. Vertical scrolling: trailing edge, centred. Horizontal: bottom edge, centred.
  - **Jog bar:** look at the indicator and drag to control speed.
  - **Look to Scroll:** opt-in per view, for reading or browsing only. Make views full width or height. Remove parallax first.
- watchOS: vertical scrolling preferred, Digital Crown.
- **Web:** `overscroll-behavior` and `scroll-snap` for paging. Scroll edge = a sticky pseudo-element under the bar with `backdrop-filter: blur()` and `mask-image: linear-gradient(to bottom, #000 40%, transparent)` (soft) or a solid-ish fill with a 1 px edge (hard).

---

## 22. Sidebars
- On the **leading** side for navigating top-level areas or collections. Needs a lot of space; otherwise use a tab bar (or an adaptable tab bar/sidebar).
- **Liquid Glass:** on iOS, iPadOS and macOS, sidebars **float above content** in the glass layer, like toolbars and tab bars.
  - Extend content beneath them: horizontal scrolling under the sidebar, or the **background extension effect** (mirrored, flipped, blurred image to the window edge).
  - Wrong: an image stopping at the sidebar edge. (Added 2025-06-09.)
  - Per Color: sidebars use a **more opaque glass**.
- Allow customisation of items and order.
- Group with **disclosure controls**. **≤2 hierarchy levels**; deeper → a split view with a content list column. Group labels must be succinct.
- Use SF Symbols (custom symbols, not bitmaps).
- **Let people hide it:** iPad edge swipe; Mac toggle button and View ▸ Show/Hide Sidebar. **Don't hide it by default.**
- **Icon colour:** the **accent colour by default**. On Mac, people expect icons to follow the system accent. Fixed colours only sparingly, for meaning (Mail's yellow VIP). (Updated 2026-06-08.)
- **iOS/iPadOS:**
  - `sidebarAdaptable` shows a sidebar or tab bar, with a toggle button; it adapts to width and rotation.
  - Consider a tab bar first.
- **macOS:**
  - Row height, text and glyph size depend on the **sidebar icon size** setting (small, medium, large).
  - Auto-collapse when the window narrows (Mail).
  - **No critical items at the bottom.**
- **visionOS:** a sidebar inside a tab; selections shouldn't switch tabs.
- **Web:** a floating glass panel inset ~8 px from the window edges with a ~20–24 px radius (concentric with the window). Rows are ~32 px (Mac medium) or ~44 px (touch). The selected row has an accent or neutral fill pill; icons are in the accent colour. Hero images extend underneath, mirrored.

---

## 23. Split views
- Multiple adjacent panes: primary (often a sidebar) → secondary (list) → optional tertiary (detail). Alternatively, supplementary panes around a canvas (Keynote navigator, notes, inspector).
- **Persistently highlight the selection** in each pane that leads to the detail.
- Support drag and drop between panes.
- **iOS:** use only in **regular** width.
- **iPadOS:** 2 or 3 vertical panes. Test narrow, intermediate and wide widths; keep pane navigation logical.
- **macOS:**
  - Vertical, horizontal or mixed layouts with draggable dividers.
  - Set **min and max pane sizes** so the divider never vanishes.
  - Allow hiding panes, with several ways to reveal them (toolbar, menu, shortcut).
  - **Prefer the thin divider: 1 pt.**
- **tvOS:** default **1/3 + 2/3** (or ½ + ½). One title above the whole split view; centred for collections, above the primary pane for a single main view.
- **visionOS:** prefer a split view over a new window for supplementary information.
- **watchOS:** list or detail full screen; vertical tab view for multiple details.
- **Web:** CSS grid with `minmax()` columns, resizable via a 1 px divider with a wider invisible hit area (~8 px). Collapse to a stack under the compact breakpoint.

---

## 24. Lists and tables
- Best for **text**. For varied sizes or many images, use a collection.
- Let people edit and reorder where sensible. On iOS, selection requires **edit mode**.
- **Selection feedback:**
  - Navigation lists keep the selected row **persistently highlighted** (shows the path).
  - Option lists **briefly highlight**, then show a **checkmark**.
- Keep text short. Long items show titles only, with detail elsewhere. For narrow tables, truncate in the **middle** to keep both ends.
- Column headings: **nouns, Title Case, no punctuation**. A single-column list without a heading needs a label or header.
- **Styles** named: grouped (iOS: headers, footers, extra spacing), elliptical (watchOS), bordered with **alternating rows** (macOS).
  - Plain, inset-grouped and sidebar aren't detailed on this page, but they exist in APIs (`ListStyle`, `UICollectionLayoutListConfiguration.Appearance.sidebar`).
- **Row accessories (iOS, iPadOS, visionOS):**
  - **Disclosure indicator** (chevron ›) = drill down.
  - **Info/detail button** (ⓘ) = more info; *not* navigation.
  - **Checkmark** = chosen option.
- **Index:** a vertical A–Z strip on the trailing side. **Don't combine it with trailing row accessories.**
- **macOS:**
  - Click a header to sort; click again to reverse.
  - Resizable columns; alternating row colours for wide tables.
  - Use an **outline view** for hierarchy.
- **tvOS:** focused rows enlarge and get rounded corners automatically; don't mask images yourself.
- **watchOS:** limit rows. For long lists, show the most relevant rows plus a "more" option.
- **Web (inset grouped, iOS-like):**
  - Section cards on the `systemGroupedBackground` colour, ~10–12 px (pre-26) or larger (~20–26 px in the Liquid Glass era) radius, 16–20 px side margins.
  - Rows ≥44 px, 16 px leading inset; separators inset to the text start.
  - Section header in footnote-size uppercase-ish or Title Case secondary text; footer in secondary text.
  - Trailing: value in secondary label colour, then a tertiary-coloured chevron.

---

## 25. Collections
- Visual, ordered content (images). Use the **standard row or grid**; avoid confusing custom layouts. Text → table.
- Use adequate padding so focus and hover effects don't overlap.
- Default gestures: **tap to select, touch-and-hold to edit, swipe to scroll**. Add custom gestures only if needed.
- **Animate insert, delete and reorder.**
- **iOS:** don't change the layout while people are viewing or interacting with it, unless they asked.
- Not on watchOS.
- **Web:** `display:grid; grid-template-columns: repeat(auto-fill, minmax(…))`. Use the View Transitions API or FLIP for reorder animations.

---

## 26. Outline views / Column views / Disclosure controls (hierarchy family)
- **Outline view (macOS):**
  - Hierarchy in the **first column only**; other columns hold attributes. Always give headers in multi-column outlines.
  - Header click sorts within each level. Option-click a triangle expands all descendants.
  - **Remember expansion state.**
  - Single-click edits, double-click opens.
  - Middle truncation. Add a toolbar search for long outlines.
- **Column view / browser (macOS):** for a deep hierarchy with frequent back-and-forth. Root in the first column; a leaf shows a preview and metadata; columns are resizable. On iPad and visionOS, use a split view instead.
- **Disclosure triangle:** **points to the trailing side when collapsed and down when expanded**. Give it a descriptive label ("Advanced Options"). Most-used controls stay visible; advanced ones are hidden.
- **Disclosure button:** points **down when collapsed and up when expanded**. Place it near its content; **max one per view** (macOS Save sheet).
- iOS, iPadOS and visionOS use `DisclosureGroup`. Not on tvOS or watchOS.
- **Web:** `<details><summary>`. Rotate the chevron 90° (triangle) or 180° (button) with a transition.

---

## 27. Progress indicators
- Transient; shown only while work runs.
- **Determinate:**
  - Bar fills leading → trailing.
  - Circular fills **clockwise**.
- **Indeterminate:** spinner (all platforms); an indeterminate bar (macOS).
- **Refresh control (iOS):** hidden until pull-down.
- **Prefer determinate.** Switch from indeterminate to determinate once the duration is known. **Never switch between bar and circle.**
- Report progress evenly (don't show 90% in 5 s and the last 10% over 5 min).
- **Keep it moving.** If stalled, explain why and what to do.
- Description only if useful; avoid vague "Loading…".
- Keep a consistent location.
- Add **Cancel** if harmless and **Pause** if cancelling loses work; warn before discarding progress.
- **Refresh control:** auto-update anyway. A title only for useful info (e.g. "Updated 5 min ago"), not instructions.
- **macOS:** use a spinner for background tasks or tight spaces (inside a field, next to a button). **Don't label spinners.**
- **watchOS:** white by default; tint is customisable.
- **Web:** `<progress>` styled as a thin capsule track (~4–6 px) with an accent fill. Spinner = 8–12-spoke fading or an SVG arc with `aria-busy`. Pull-to-refresh via an overscroll handler.

---

## 28. Gauges / level & rating indicators
- A gauge shows a value within a range on a circular or linear path.
  - **Standard** = an indicator mark at the value.
  - **Capacity** = a fill up to the value.
  - **Accessory** variant = watch-complication look (Lock Screen widgets).
- Label the current value and both endpoints concisely; VoiceOver reads them.
- A gradient may encode meaning (red hot → blue cold).
- **macOS level indicator:**
  - **Continuous** (translucent track, solid fill) for large ranges.
  - **Discrete** (equal rectangular segments, each fully filled or empty).
  - Default **green**. Can change colour at thresholds, or **tiered** (e.g. red ⅛, yellow ⅜, green ¼, empty ¼).
  - Relevance style (rare).
- **Rating indicator (macOS):**
  - Stars by default; **no partial symbols** (rounds to whole); fixed spacing; doesn't stretch.
  - Allow inline editing of ratings. Custom symbols must clearly read as a rating.
- **Web:** `<meter>` or SVG arcs with `role="meter"` and `aria-valuemin/max/now`.

---

## 29. Page controls
- A row of dots for a **flat, ordered** list of pages. A **solid dot marks the current page**. Dots are equidistant; overflow is clipped.
- **Centre horizontally near the bottom.** For **more than about 10 pages**, use another pattern (a grid).
- Custom indicator images: keep them simple, use **at most 2 image types** (e.g. Weather's `location.fill` for the current-location page), and **don't colour the dots**.
- **iOS:**
  - When there are too many dots, the ends shrink. Example with 9: the middle 5 full size; the 2nd and 8th about ½ size; the 1st and 9th about ¼ size.
  - **Tap** either side of the current dot for next or previous. **Scrub** by dragging; past the edge, jump to the first or last page.
  - Don't animate the page transitions while scrubbing (only on tap).
  - **Background styles:**
    - **automatic** (a translucent rounded rect only during interaction);
    - **prominent** (always; only when it's the primary navigation);
    - **minimal** (never; then **no scrubbing**).
- Not on macOS. tvOS: only for full-screen peer pages. visionOS: display only.
- **Web:** `role="tablist"` or a list of buttons with ~7–8 px dots and ~8–9 px gaps, the current dot in label colour and the others in ~30% opacity. Pair with `scroll-snap`.

---

## 30. Labels
- Static, non-editable text (button text, list text, introductory text). For editable text use a text field; for long text, a text view.
- Prefer system fonts and Dynamic Type.
- Use the **4 label colours** for hierarchy:
  - `label`: primary;
  - `secondaryLabel`: subheading or supplemental;
  - `tertiaryLabel`: unavailable;
  - `quaternaryLabel`: watermark.
- Make useful text **selectable** (error messages, IPs, addresses).
- **Web:** `--label: rgba(0,0,0,1)`, `--secondary-label: rgba(60,60,67,.6)`, `--tertiary-label: rgba(60,60,67,.3)`, `--quaternary-label: rgba(60,60,67,.18)`. In dark mode use `#fff` and `rgba(235,235,245,.6/.3/.16)`. These are the classic UIKit values, not stated on this page; verify.

---

## 31. Badges
- **No standalone "badges" component page exists** in the Components list.
- Badge guidance lives in tab bars (a red oval with white text, a number or "!", for critical info only, used sparingly) and in Notifications/app icons.
- **Web:** min-width 18 px, height 18 px, `border-radius: 9px`, system red background, white 11–12 px semibold text, 4–5 px horizontal padding, top-trailing offset over the icon.

---

## 32. Boxes
- Visually group related info and controls with a border or background; an optional title.
- Keep a box **small relative to its container**. Use padding and alignment for sub-grouping. **Avoid nested boxes.**
- Title: a short phrase in sentence case, no punctuation, except a **colon in settings panes**.
- iOS: backgrounds use **secondary/tertiary** background colours.
- macOS: the title is **above** the box.
- Not on tvOS or watchOS.
- **Web:** `<fieldset>`/`<section>` with `secondarySystemBackground`, ~10–12 px radius, 12–16 px padding.

---

## 33. Panels (macOS only)
- Float above windows; supplementary controls for the active window or selection. Less prominent than the main window.
- Good for **inspectors**: they update with the selection. An Info window that doesn't track selection is a regular window. An inspector could alternatively be a split view pane.
- Prefer **sliders and steppers** over typing or selection controls.
- Title: a noun, Title Case ("Fonts", "Colors", "Inspector"). A **title bar is required** (for dragging).
- **Show all panels when the app activates; hide them when it deactivates.**
- Keep them out of the Window menu's document list. Usually no minimise button.
- In menus, refer to "Show Fonts" (no "panel").
- **HUD panel:** dark and translucent, for media apps only, or when a standard panel would obscure content.
  - Keep the style consistent across full screen.
  - Minimal colour; **small**.
  - Most system controls (except the disclosure triangle) don't match the HUD look.
- **Web:** a floating draggable glass card with a slim title bar. HUD = `rgba(30,30,30,.7)` + blur, white text.

---

## 34. Windows
- **Primary** windows (main navigation) and **auxiliary** windows (one task, with a close button).
- Adapt fluidly to sizes. Open new windows deliberately and offer "Open in New Window".
- **No custom window chrome.** Call it "window" in UI copy (not "scene").
- **iPadOS:**
  - Full-screen or windowed mode (user setting).
  - Windowed mode puts **window controls at the leading edge of the toolbar**, so don't place toolbar buttons there; shift them inward.
  - Pinch-to-expand opens an item in a new window.
- **macOS:**
  - Frame (title bar plus toolbar), body, rare bottom bar.
  - **Key** window = coloured close/minimise/zoom; **inactive** = grey buttons and no vibrancy (looks farther away).
  - One main window; one key window.
  - Panels become key only on a title-bar click or text input.
  - Bottom bar: small, only for contextual info (Finder status).
- **visionOS:**
  - Default window **1280×720 pt**, about **2 m** away (appears about 3 m wide).
  - The glass background can't be modified; keep it.
  - Set min and max sizes. Choose the initial shape to fit the content (Keynote wide, Safari tall).
  - Volumes have a baseplate glow. An ornament can be added (don't put it on the same edge as the toolbar or tab bar; prefer at most 1 extra).
- **Web:** for a desktop-like shell, use a large outer radius and concentric inner panels. Don't fake macOS traffic lights.

---

## 35. Ornaments (visionOS)
- A glass element in a plane parallel to and slightly in front of the window. It moves with the window and doesn't scroll.
- Toolbars, tab bars and video controls are ornaments.
- Keep it close and generally visible (hide it during immersion). Few ornaments; **width ≤ the window width**.
- **Borderless buttons** inside it, which get an automatic hover effect.
- **Web analogue:** a floating glass capsule overlapping the bottom edge of a card or window (`translateY(50%)`).

---

## 36. Lockups (tvOS only)
- Header, content and footer that scale together on focus. Types:
  - **cards** (ratings and reviews);
  - **caption buttons** (title and subtitle below; tilt follows the swipe axis);
  - **monograms** (a circular photo plus name; initials as a fallback; prefer photos);
  - **posters** (image plus title and subtitle revealed on focus).
- Leave room for the focus enlargement. Use consistent sizes per row.
- **Web analogue:** media cards with `:focus-visible { transform: scale(1.08) }` plus a shadow, the title revealed on focus, and a gap large enough for the scaling.

---

## 37. Smaller macOS-only controls
- **Combo box:** a text field plus a pull-down list. Custom values aren't added to the list. Use a meaningful default. Label in Title Case with a colon. List items shouldn't be wider than the field.
- **Token field:** text that becomes tokens on **comma** (add Return as another trigger). Each token has a context menu; tokens are draggable between fields. Delay suggestions so they don't distract.
- **Path control:** standard (a breadcrumb of icon plus name; middle items collapse) or pop-up style. Put it in the window **body**, never in a toolbar or status bar.
- **Color well:** opens the system colour picker and shows the current colour; supports drag and drop. Also on iOS and visionOS. **Web:** `<input type="color">`.
- **Tab view:** a tabbed control on the top edge of an inset content area. Labels are nouns in Title Case. **No more than about 6 tabs**; beyond that, use a pop-up. Not on iOS (use a segmented control).
- **Image well:** an editable image view (paste, drag, Delete to clear).

---

## 38. Text views, image views (content)
- **Text view:** long, multiline, styled, optionally editable text. Leading-aligned in the label colour. Dynamic Type. Selectable.
- **Image view:** display-only. If interactive, use a button containing the image. Use SF Symbols for icons. Over text-on-image, ensure contrast (a shadow or scrim). Animation frames should all be the same size.

---

## 39. Menu bar (macOS / iPadOS) — brief
- Order: **App, File, Edit, Format, View, (app menus), Window, Help.**
- Always show the same items; disable rather than hide.
- App name ≤16 chars.
- Edit menu: Undo/Redo name the target ("Undo Typing"); use "Delete", not "Erase".
- Dynamic (Option) items: rare, single modifier, never the only path.
- Menu bar extras: **menu bar height 24 pt**; use template (black/clear) icons; show a menu rather than a popover.
- iPadOS: the menu bar is hidden until revealed; centred; no extras; group into submenus more often.

---

## 40. Charts (skim)
- Highlight a few insights. **Marks:** bar (compare or sum), line (trend), point (relationships, outliers); combine them.
- **Axes:**
  - Fixed range when the bounds are meaningful (battery 0–100%); dynamic range otherwise.
  - Bars start at zero; don't force zero for data like heart rate.
  - Ticks in familiar steps (0, 5, 10).
  - Light, sparse grid lines.
- Titles and subtitles state the takeaway (e.g. Weather precipitation). Don't hide critical info behind interaction.
- Expand scrub hit areas to the whole plot. Keyboard navigation follows the X axis.
- Never use colour alone (add shapes or patterns). Separators between stacked segments.
- **Accessibility labels:**
  - Describe what a mark represents, not its colour.
  - Use exact values, not "rapidly".
  - Write "June 6", not "6/6"; "60 minutes", not "60m".
  - Hide axis labels from AT when Audio Graphs exist.
- Align the chart's leading edge with surrounding content; Y-axis labels on the trailing side.
- watchOS: glanceable, simple.

---

## 41. Widgets (skim)
- **Families:**
  - system: small, medium, large, extra large (iPad, Mac, visionOS), XL portrait (visionOS);
  - accessory: circular, corner, inline, rectangular.
- **Rendering modes:**
  - **full color**;
  - **accented** (accent and primary groups; on iPhone both are tinted white; *clear* appearance = Liquid Glass background; *tinted* = user tint);
  - **vibrant** (desaturated: Lock Screen, StandBy, Mac desktop). Use opaque grayscale values, not white at reduced alpha.
- Home Screen appearances: **light, dark, clear, tinted**.
- **Margins: 16 pt standard; 11 pt tighter** for grouped graphics or buttons; smaller on the Mac desktop and Lock Screen. Content corner radius concentric with the widget (`ContainerRelativeShape`).
- **Min font 11 pt.** No rasterised text. Dynamic Type Large → AX5.
- Animated data transitions **≤2 s**. Tap = deep link; buttons and toggles act in place; inline accessory = 1 tap target.
- Placeholders: semi-opaque rectangles and circles. Descriptions start with a verb.
- **iPhone sizes (pt):**

| Screen | Small | Medium | Large | Circular | Rectangular | Inline |
|---|---|---|---|---|---|---|
| 430×932 | 170×170 | 364×170 | 364×382 | 76×76 | 172×76 | 257×26 |
| 393×852 | 158×158 | 338×158 | 338×354 | 72×72 | 160×72 | 234×26 |
| 375×667 | 148×148 | 321×148 | 321×324 | 68×68 | 153×68 | 225×26 |
| 320×568 | 141×141 | 292×141 | 292×311 | – | – | – |

- visionOS: 75–125% scale; paper or glass treatments; elevated or recessed mounting.
- **Web analogue:** cards with 16 px padding, an inner radius = outer − 16, and type ≥11 px.

---

## 42. Quick web token sheet (derived; my synthesis)
```css
:root{
  --accent:#0088FF; --red:#FF383C; --green:#34C759; --orange:#FF8D28;
  --bg:#fff; --bg2:#F2F2F7; --bg-grouped:#F2F2F7; --cell:#fff;
  --label:#000; --label2:rgba(60,60,67,.6); --label3:rgba(60,60,67,.3); --sep:rgba(60,60,67,.29);
  --glass-fill:rgba(255,255,255,.55); --glass-blur:24px; --glass-sat:180%;
  --glass-edge:inset 0 0 0 .5px rgba(255,255,255,.6), inset 0 1px 0 rgba(255,255,255,.8);
  --glass-shadow:0 8px 32px rgba(0,0,0,.12);
  --clear-dim:rgba(0,0,0,.35);              /* HIG: 35% dim under clear glass on bright media */
  --hit:44px; --hit-min:28px;               /* iOS default / min; macOS 28 / 20 */
  --btn-xs:28px; --btn-sm:32px; --btn-md:44px; --btn-lg:52px; --btn-xl:64px; /* visionOS scale */
  --gap-bezel:12px; --gap-nobezel:24px;
  --widget-pad:16px; --widget-pad-tight:11px;
  --divider:1px;                            /* macOS thin split divider */
}
@media (prefers-color-scheme: dark){
  :root{ --accent:#0091FF; --red:#FF4245; --green:#30D158; --bg:#000; --bg2:#1C1C1E; --cell:#1C1C1E;
         --label:#fff; --label2:rgba(235,235,245,.6); --label3:rgba(235,235,245,.3);
         --glass-fill:rgba(40,40,40,.5); }
}
@media (prefers-reduced-transparency: reduce){ :root{ --glass-fill:var(--bg2); --glass-blur:0px; } }
```
- Glass recipe: `background: var(--glass-fill); backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat)); box-shadow: var(--glass-edge), var(--glass-shadow); border-radius: 999px`.
- Prominent (tinted) glass: replace the fill with `color-mix(in srgb, var(--accent) 85%, transparent)` and use a white label. Colour the background, not the glyph (HIG).
- Pressed state (mandatory per HIG): `transform: scale(.96)` plus a brighter fill, with ~150–250 ms spring-like easing. With reduced motion, use an opacity-only change.

---

## 43. Gaps — what the HIG component pages do NOT specify
- Pixel heights or radii for iOS buttons, switches, segmented controls, sliders, text fields, menus, alerts and sheets. Only visionOS button heights, the tvOS tab bar (68/46 pt), the visionOS alert accessory (154 pt / 16 pt), the macOS menu bar (24 pt), dividers (1 pt), widget margins and the hit targets are given.
- The names "glass / glassProminent / bordered / borderless" (API-level, not HIG prose).
- Toolbar "spacer" API names (the page cites `fixedSpace`), and explicit "items float without their own background" wording. Grouping is shown through images.
- Sheet inset or corner geometry in Liquid Glass.
- An iPhone tab count (only ≤5 for customizable iPad tab bars).
- A standalone Badges page (badges are covered under tab bars).
- For these, use Apple Design Resources (Figma/Sketch kits for iOS 26), the WWDC25 sessions "Meet Liquid Glass" (219) and "Get to know the new design system" (356), or measure the native UI.

# Apple HIG — Patterns & Inputs: notes for a web UI design skill

Source: developer.apple.com/design/human-interface-guidelines (fetched via JSON endpoints, Oct 2026).
All content paraphrased. "Web:" lines are my translation of each rule to browser UI.

Pattern slugs (25): charting-data, collaboration-and-sharing, drag-and-drop, entering-data, feedback,
file-management, going-full-screen, launching, live-viewing-apps, loading, managing-accounts,
managing-notifications, modality, multitasking, offering-help, onboarding, playing-audio, playing-haptics,
playing-video, printing, ratings-and-reviews, searching, settings, undo-and-redo, workouts.
Also: privacy (separate top-level page).
Input slugs (13): action-button, apple-pencil-and-scribble, camera-control, digital-crown, eyes,
focus-and-selection, game-controls, gestures, gyro-and-accelerometer, keyboards, nearby-interactions,
pointing-devices, remotes. (Web-relevant: pointing-devices, keyboards, gestures, focus-and-selection.)

---

## 0. Cross-cutting principles (distilled)

- Match interruption level to importance: passive status inline; interrupt only for critical/destructive.
- Never block people unnecessarily: no forced accounts, no forced onboarding, no launch-time permission asks,
  no blank screens, no blocking downloads.
- Defaults over settings; detect over ask; choices over typing.
- Every important action has a non-gesture, non-drag alternative (menu/button/keyboard).
- Everything reversible: unlimited undo, confirm only unexpected irreversible loss.
- Restore state: scroll position, selected pane, window/view state, where they left off.
- Don't redefine standard conventions (shortcuts, gestures, focus behavior, control meanings).
- Multiple feedback channels (color + text + icon + sound/haptic); never color- or sound-only.
- Consistency: same interaction for same result regardless of input device.

---

## 1. Modality

What it's for: separate dedicated mode that blocks the parent view and needs explicit dismissal.
Good reasons to go modal:
- Critical info that must be seen/acted on.
- Confirm or modify the most recent action.
- Distinct, narrowly scoped task without losing previous context.
- Immersive experience or concentration on a complex task.

Container choice:
- Narrow tasks: sheets or popovers (desktop may use separate window).
- Full-screen modal: temporary media viewing or distinct multistep tasks (editing, markup, camera).
- Alerts: available everywhere, reserved for critical info.

Rules:
- Use modality only when there's a clear benefit (focus, or choices affecting content/device).
- Keep modal tasks simple, short, streamlined; complex modals make people forget the suspended task.
- No "app within an app": no deep view hierarchy inside a modal. If subviews needed, a single linear path.
- Don't include buttons that could be mistaken for the dismiss button.
- Always provide an obvious dismiss, using platform conventions (top toolbar button / swipe-down on touch;
  button in the content area on desktop).
- Confirm before closing if data could be lost — for both gestures and buttons. Explain and offer resolution
  (e.g., Save / Discard / Keep editing).
- Title the modal with its task name; add short guidance text when useful.
- One modal at a time; let people dismiss one before presenting another. Stacked modals = clutter + hidden context.
- Never more than one alert visible at once (an alert may sit above another modal, but only one alert).

Web:
- Use `<dialog>`/aria-modal with focus trap, Esc to close, close button top-right/top-left, backdrop click
  only when no data at risk; if dirty form, intercept close with confirm.
- Prefer inline/drawer/popover for small tasks; full-screen overlay for editors/lightboxes.
- No nested dialogs; no wizard trees inside a dialog — linear steps only.

---

## 2. Onboarding

- Ideal: app is understandable by just using it. If onboarding needed: fast, fun, optional.
- Onboarding happens after launch completes; it isn't part of the launch.

Best practices:
- Teach through interactivity — let people safely try the action rather than read about it.
- Prefer context-specific tips (near the relevant element, one action at a time) over one big upfront flow.
- If a prerequisite flow is unavoidable: brief, enjoyable, minimal memorization. Teaching too much hurts retention.
- Tutorials optional: skippable on first run, never re-shown automatically, findable later (Help, Account, Settings).
- Teach your product, not the OS/device/browser.

Additional content:
- Splash screen only if necessary: one beautiful graphic, readable at a glance, shown just long enough
  without feeling like a delay.
- Don't let large downloads block onboarding; ship enough to start interacting immediately.
- Avoid licensing/legal text in onboarding; if required, integrate unobtrusively.

Additional requests:
- Postpone nonessential setup/customization; ship sensible defaults.
- Permissions: ask during onboarding only if the app cannot function without it (and explain why/benefit);
  otherwise ask at first use of the feature.
- Delay rating and purchase prompts until people have engaged.

Web: no tour-on-first-load carousels by default; use dismissible inline hints/coachmarks; empty states that
teach by doing; "Replay tour" link in help menu; defer cookie/notification/location asks.

---

## 3. Launching

- Launch instantly; people may not wait more than a couple of seconds.
- Launch screen (native only) ≠ splash ≠ onboarding. Its only job is to feel fast:
  - Nearly identical to the first screen (avoid a flash); if first screen is solid color, show only that color.
  - Match current orientation and light/dark appearance.
  - No text (can't be localized), no ads, no logos unless permanently part of the first screen.
- Splash (branding) goes at the start of onboarding, or right after launch if there's no onboarding.
- Restore previous state: don't make people retrace steps; restore scroll position, window state, location,
  appearance.
- Orientation: launch in current orientation; landscape-only must work rotated either way.
- (tvOS live-viewing: may auto-start recent live content after a few seconds of inactivity.)
- (visionOS: start in a windowed context; let people choose when to go immersive.)

Web:
- Server-render/skeleton the real first view; avoid branded interstitial loaders.
- App shell background = first screen background, respect `prefers-color-scheme` from first paint (no
  white flash in dark mode).
- Persist and restore route, filters, tab, scroll position, open panels (URL state + storage).

---

## 4. Loading

- Show something as soon as possible; a blank screen reads as broken.
- Use placeholder text/graphics/animation (skeletons) and replace progressively as content arrives.
- Keep the app usable during loading; load in the background, other actions remain accessible.
- Long unavoidable waits: give something to look at (tips, hints, intro to new features).
- Estimate remaining time accurately (too short = placeholder content not enjoyed; too long = repeats).
- Download large assets in the background at nondisruptive times (post-install, during updates).

Showing progress:
- Content should ideally appear instantly; if it takes more than a moment or two, show a progress indicator.
- Determinate indicator when duration known; indeterminate when unknown.
- Games/branded experiences may use a custom styled loading view.
- watchOS: avoid indeterminate spinners (they make people feel they must watch); if a 1–2 s wait, show
  indicator rather than blank; for long processes, promise a notification on completion.

Web:
- <~1 s: no indicator (avoid spinner flash; delay ~300–500 ms before showing).
- 1–2 s+: skeleton or spinner; known size (uploads) → progress bar with %.
- Don't block the whole page for a partial fetch; scope indicators to the region loading.
- Long jobs: "We'll notify you when it's done" instead of a forever spinner.

---

## 5. Feedback

Purpose: communicate status, what's possible next, results of actions, how to avoid mistakes.
Types: current status, success/failure of important tasks, warnings about negative consequences,
chances to correct a mistake.

- Match significance to delivery: passive status people can check when needed; interrupt only for warnings
  about possible data loss.
- Make all feedback accessible: multiple channels (color, text, sound, haptics) — works muted, looked-away,
  with screen reader.
- Integrate status into the interface near the items it describes (e.g., unread count + "Updated just now"
  in a toolbar). Unobtrusive but checkable.
- Alerts only for critical, ideally actionable info. Overuse dilutes them.
- Warn before unexpected irreversible data loss. Don't warn when loss is the expected outcome (deleting a file
  in a file manager doesn't warn — because it's undoable/expected).
- Confirm significant actions when it matters (e.g., payment success). People expect success; they mostly
  need to hear about failure.
- When a command can't be done, say why (specific reason, not generic error).

Web:
- Inline status text near content; toasts for transient confirmation (with Undo where possible);
  `aria-live="polite"` for status, `assertive`/alertdialog only for critical.
- Error text says what happened + why + how to fix.
- Disabled buttons: provide reason (tooltip/helper text) where non-obvious.

---

## 6. Entering data

- Reduce what people must enter: pre-gather info; support every input method.
- Get info from the system when possible (settings, location/calendar with permission). Don't ask for what
  you can detect.
- Be clear about required data: placeholder example ("username@company.com") or label ("Email").
- Prefill reasonable defaults to reduce decisions.
- Secure entry field for sensitive data (masked characters).
- Never prepopulate a password field; require entry or use biometric/keychain/passkey autofill.
- Offer choices instead of typing (picker, menu, segmented control) — even when a keyboard exists.
- Support drag-and-drop and paste into fields.
- Validate dynamically: check as soon as a value is entered and show the problem immediately, not after a long
  form submit.
- Numeric input: use a number formatter (restrict to numbers; format decimals, %, currency).
- Make required input clear before proceeding: e.g., keep Next/Continue disabled until required fields filled.
- macOS: expansion tooltip shows full text of truncated fields on hover.

Web:
- Proper `type`, `inputmode`, `autocomplete` tokens (email, tel, one-time-code, current-password,
  new-password, street-address); allow paste into password/OTP fields.
- Labels always visible (placeholder is an example, not the label).
- Validate on blur (and live once a field has errored); don't yell at untouched fields.
- Use `<select>`, radio cards, date pickers, comboboxes over free text where the set is known.
- Show full value of truncated inputs via `title`/tooltip.
- Caution: a disabled submit needs a visible explanation of what's missing (accessibility).

---

## 7. Searching

- Use a standard search field for in-app search — people expect one.
- Personalize: recent searches, suggestions, completions, corrections based on history.
- Let people scope/filter (date, size, type) — scope bars, tokens/chips.
- Provide find-in-page/document.

Best practices:
- Give search a primary, easy-to-reach position if it's important (toolbar; or its own tab in tab-bar apps).
- One clear place to search everything; sections may also offer local filtering of the current view.
- Show the current search scope clearly (descriptive placeholder "Search Inbox", scope bar, or title).
- Offer suggestions: recent searches before typing; predictive suggestions while typing.
- Respect privacy of search history (others may see it); if shown, let people clear it.
- System-wide: index content with descriptive metadata so it's findable outside the app; provide previews
  for custom file types.

Web: `role="search"`, `type="search"`, ⌘K / "/" shortcut, scope in placeholder, recent searches with
"Clear", keyboard-navigable suggestion list (combobox pattern), filters as removable chips,
SEO/metadata = "Spotlight indexing" equivalent.

---

## 8. Settings

- People expect things to just work; customization is secondary.
- Custom settings area only for general options affecting the whole experience.
- Task-specific options live in the task itself.

Best practices:
- Defaults that give the best experience to most people (auto-tune for device rather than asking).
- Minimize the number of settings — too many makes the product unapproachable and options hard to find.
- Put settings where expected: ⌘, (Command-Comma) opens app settings; games: Esc.
- Don't use settings to collect info you can detect (connected devices, Dark Mode).
- Respect system-wide settings; don't duplicate global options (accessibility, scrolling, auth methods) —
  duplicating implies system settings don't apply.

General vs task-specific:
- Settings area = general, infrequently changed options (people must suspend their task to go there).
- Show/hide parts of a view, reorder, filter lists → in the screen they affect (results visible immediately).
- Only the most rarely changed options go in the OS-level settings; link directly to them if needed.

macOS settings window specifics:
- Opened from App menu > Settings (⌘,). Toolbar of pane buttons; noncustomizable, always visible,
  active pane indicated.
- Dim minimize/maximize; window resizes to current pane.
- Window title = current pane name (single pane: "AppName Settings").
- Reopen to the most recently viewed pane.
- Don't put a settings button in the main window toolbar (steals space); document-level options go in File menu.

Web: honor `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`, browser zoom/font size
rather than re-implementing; settings page with left nav panes, remember last pane, autosave toggles
(no "Save settings" button for simple toggles), inline view options (density, sort, columns) in the view.

---

## 9. Managing accounts

- Require an account only if core functionality needs it; otherwise allow use without one.
- Offer platform sign-in (Sign in with Apple ≈ social/SSO) for trust and no new credentials.
- Explain benefits of an account + how to sign up — brief, friendly message in the sign-in view.
- Delay sign-in as long as possible (browse freely; sign in at checkout).
- Prefer passkeys (username only, no password). If passwords, add two-factor.
- Name the auth method in the button ("Sign In with Face ID", not "Sign In").
- Mention only auth methods available on the current device; use correct terminology.
- Don't add an in-app toggle to opt into biometrics (system-level already).
- Don't use the word "passcode" for account auth (confused with device passcode).

Deleting accounts:
- If people can create an account, they must be able to delete it (not just deactivate).
- Follow regional law (right to be forgotten). If you must retain data, explain what and why.
- Clear in-app path to start deletion; if web-only, link directly — not buried in privacy policy/ToS.
- In-app and web deletion flows equal in length/complexity (no dark-pattern friction).
- Optional scheduled deletion (e.g., after subscription ends) — but also offer immediate deletion.
- Tell people when deletion will complete; notify when done.
- Explain billing: subscriptions may continue until canceled separately; give cancel/refund instructions.

TV/limited-input devices: request minimal info; let people sign in on another device; route big forms to web.

Web: guest checkout; "Continue with Google/Apple" + passkey; `autocomplete="webauthn"`; clear "Delete
account" in account settings with consequences listed; confirmation by typing or re-auth, not maze.

---

## 10. Managing notifications (+ marketing)

- Get permission before sending any notification; expect people to revoke/silence.
- Classify every notification type: communication (messages/calls) vs noncommunication.
- Interruption levels:
  - Passive: view at leisure; never breaks through Focus/schedule/silent.
  - Active (default): nice to know on arrival; doesn't break through Focus.
  - Time Sensitive: needs immediate attention (security issue, delivery arriving); breaks through Focus/
    scheduled summary, not silent switch. Use only if happening now or within 1 hour.
  - Critical: health/safety only, needs entitlement; overrides everything.
- Accurately represent urgency; never high urgency for low-priority info.
- Marketing/promotional notifications only with explicit opt-in; never Time Sensitive for marketing.
- Before sending promos, show UI describing what you'll send with clear opt-in/opt-out.
- Provide in-app settings to change notification choices.
- (Multitasking) Don't notify for routine/secondary tasks; only for important things the person started
  or time-sensitive completions.

Web: never call `Notification.requestPermission()` on page load; ask after a user gesture tied to a
feature ("Notify me when my export is ready"); granular notification preferences page; separate
marketing email opt-in, unchecked by default.

---

## 11. Privacy & permission requests

- Request only data a feature actually needs.
- Don't ask before the person shows interest in the feature; make requests as specific/granular as possible.
- Be transparent about collection and use.
- Respect privacy features (hidden/relay emails, mail privacy protection).
- Process on-device where possible; adopt platform encryption/security.
- Disclose practices publicly.

Timing:
- Ask only when clearly needed, ideally at first use of the feature.
- Avoid launch-time requests unless the app can't function without it and purpose is obvious
  (navigation app asking for location).

Purpose string (the explanation text):
- One brief, complete, specific sentence; sentence case; active voice; ends with a period.
- Say how and why ("Records during the night to detect snoring sounds.").
- Bad: vague ("needed for a better experience"); bare imperative ("Turn on microphone access").

Pre-permission (priming) screens:
- Prefer letting context explain; custom pre-alert only when essential.
- Exactly one button, labeled "Continue"/"Next" — never "Allow". No Cancel/Close (unless legally required).
- Don't picture/annotate the system alert or point at its Allow button.
- No incentives for granting; don't withhold functionality or make the app unusable if declined.
- Don't mimic the system prompt or build misleading screens exploiting quick dismissals.
- Tracking: show the system prompt before collecting any tracking data; consent screens allowed for legal
  compliance.

One-time location button: lightweight, temporary access for a single task (tag a post, find nearby store).
Customize only title, glyph fill, colors, corner radius; text must not truncate at any text size/language;
system rejects low-contrast/over-translucent versions.

Protecting data: passkeys over passwords; 2FA if passwords; biometrics to protect sessions; keychain for
secrets; never plain-text passwords; no homemade auth schemes; don't assume who's signed in (shared machines).

Web: geolocation/camera/mic/clipboard/notifications requested only on user action with inline context
("Use my location" button); cookie banner not deceptive (equal-weight Accept/Reject); app must work if denied.

---

## 12. Undo and redo

- Help people predict results: label states the action ("Undo Typing", "Redo Bold"). Shake-to-undo alert
  title gives 1–2 words ("Undo Name", "Redo Address Change").
- Show the result of every undo/redo; if offscreen, scroll it into view — otherwise people repeat actions.
- Don't limit undo count; allow undoing everything since a logical point (open/save).
- Consider batch undo for groups of related discrete actions (e.g., incremental tweaks to one property);
  consider "Revert to last saved/opened".
- Add dedicated undo/redo buttons only when necessary; use standard symbols, in a toolbar.
- Don't redefine standard undo gestures (3-finger swipe, shake).
- macOS: Undo/Redo at top of Edit menu; ⌘Z undo, ⇧⌘Z redo.

Web: ⌘/Ctrl+Z, ⇧⌘Z and Ctrl+Y; toasts "Deleted 3 items · Undo" instead of confirm dialogs for
reversible deletes; coalesce typing into undo groups; scroll/highlight restored item.

---

## 13. Drag and drop

Best practices:
- Support DnD throughout (text fields get it free).
- Always offer alternatives: menu commands for copy/move, keyboard, accessibility drag/drop descriptors.
- Move vs copy: within same container = move; across containers = copy. Prefer least data-loss default.
- Support multi-item drag where sensible; allow adding items to an in-progress drag (touch).
- Undo DnD operations; confirm irreversible drops; otherwise offer another way to reverse.
- Offer multiple representations high→low fidelity (native object > PDF vector > PNG w/ alpha > JPEG).
- Spring loading: hovering a dragged item over a button/tab/folder activates it.

Feedback while dragging:
- Translucent drag image appears after ~3 points of movement; stays until drop.
- Modify drag image only to add clarity; group multiple items ("flocking") + count badge; no constant/radical
  changes.
- Highlight destination/insertion point only when the drop is valid; for invalid targets show nothing or a
  "not allowed" indicator.
- Remove highlight when pointer leaves; show one destination cue at a time.
- Invalid/failed drop: animate item back to source if visible, else scale up + fade out.

Accepting drops:
- Auto-scroll containers when the dragged item nears edges; stop when leaving the container.
- Pick richest representation you support; extract only relevant parts (contact → name+email in To field).
- Option/Alt at drop time forces copy within same container.
- Show progress during transfer; placeholder at drop location in lists/tables.
- If the drop starts a task (print, upload), show it started and its progress.
- Dropped text: keep styles if both sides support them, else adopt destination style.
- After drop, keep dropped content selected at destination. Source: same-container move → disappears;
  copy → deselect original; cross-container → deselect source.

macOS: item-count badge on multi-drag (update if only some accepted); pointer reflects outcome (copy, link,
disappearing item, not-allowed); select-and-drag in a single motion; drag from inactive windows without
bringing them forward.

Web: HTML5 DnD + pointer events; `cursor: grab/grabbing/copy/no-drop`; keyboard reordering (Space to lift,
arrows to move, Space to drop, Esc cancel) with live-region announcements; drop zone highlight only on valid
`dragover`; auto-scroll near edges; ghost image ~0.6–0.8 opacity; "Move to…" menu alternative.

---

## 14. File management (skim)

- New/Open via menus + shortcuts (⌘N, ⌘O); also an Add (+) button.
- Open to a relevant location (recent/default folder) but allow browsing everywhere.
- Avoid explicit save: autosave periodically, on close and app switch.
- Hide file extensions by default with option to show; reflect consistently.
- Previews (Quick Look) for files you can't open; generate previews for your custom types.
- Custom open UIs: Open Recent, filters, multiple selection; rename Open button to task ("Insert").
- Save dialog: change name, format, location; logical default location.
- If autosave off: show unsaved state (dot on close button / "Edited" in title) and prompt on close/quit.
  If autosave on: don't show the unsaved dot (implies action needed).
- File pickers: show only relevant types; show modified date, size, local vs remote.

Web: autosave with "Saved · 2 min ago" status; `beforeunload` guard only when actually unsaved;
"Edited" indicator in tab title when dirty; drag files onto page to upload; previews for uploads.

---

## 15. Collaboration and sharing (skim)

- Share button easy to find (toolbar).
- Customize share UI only as needed; always allow "send a copy".
- Succinct permission summaries ("Only invited people can edit", "Everyone can make changes").
- Few, grouped sharing options.
- Show a Collaboration indicator/button (avatars) next to Share once collaboration starts.
- Custom actions in collaboration popover only if essential.
- Notify collaborators of content changes, membership changes, mentions — with deep links to the exact view.

Web: Share button top-right; share dialog = invite field + one-line access summary + link permission
dropdown + Copy link; presence avatars next to Share; deep links in notification emails.

---

## 16. Going full screen

- Support full screen where it fits: games, media, slideshows, deep-focus tasks.
- Adjust layout in full screen but don't programmatically resize the window; proportional tweaks only, don't
  change which items appear; transitions subtle.
- Keep essential controls accessible (persistent or easily revealed playback controls).
- Let people reach system UI (Dock) except in games.
- Pause automatically when people switch away (game, slideshow) so nothing is missed.
- Let people choose when to exit; don't auto-exit at end of a movie/game.
- Hide toolbars/nav temporarily when content is the focus; restore with familiar action (tap, swipe down,
  move cursor to top edge). Keep controls visible if essential to navigation.
- macOS: use system full screen; enter via window button, View menu, or ⌃⌘F; let people choose to enter;
  don't change display mode for games.
- iOS: may require two swipes to exit for full-screen games to prevent accidental exits.

Web: Fullscreen API only on user gesture; Esc/F always exits; auto-hide controls after ~2–3 s inactivity,
reveal on mouse move/tap; pause video/slideshow on `visibilitychange` hidden.

---

## 17. Offering help

- Match help to task complexity: inline short description for 1–2 step tasks; tutorial for complex ones.
- Tie help to the current action; easy to dismiss/skip.
- Context-appropriate language/imagery: don't reference a different input device than in use.
- Platform-consistent verbs: "tap" on touch, "click" on desktop.
- Inclusive language.
- Don't explain standard controls; explain what they do in your app.
- Teach nonstandard input with visuals/animation, not long text.

Tips (transient views explaining a feature):
- Styles: popover tip (preserves content flow), inline tip (keeps surrounding info visible), annotation-style
  inline tip pointing at an element, hint-style inline tip not tied to an element.
- Reserve tips for simple features: if it needs more than 3 actions, too complex for a tip.
- 1–2 sentences, direct, action-oriented; no promotional content.
- Eligibility rules: don't show for features already used; throttle frequency (e.g., max once per 24 h).
- Use the feature's symbol (filled variant) but don't duplicate the icon already on the UI element it points at.
- Add a button for next step (go to setting, setup flow, docs).

Tooltips (macOS help tags / visionOS):
- Describe only the hovered control; explain the action it initiates, often starting with a verb
  ("Restore default settings").
- Don't repeat the control's name.
- Max ~60–75 characters (localization grows text); sentence fragments, omit articles.
  If lots of text is needed, simplify the UI instead.
- Sentence case; no ending punctuation (unless house style).
- Consider state-sensitive tooltips (change text with control state).

Web: tooltips on hover + focus, ~500 ms delay, Esc dismisses, never the only place essential info lives
(not available on touch); icon-only buttons need `aria-label` + tooltip; tip components dismissible with
persistent "don't show again" storage; ⌘? / "?" opens help/shortcut sheet.

---

## 18. Ratings and reviews (skim)

- Ask only after meaningful engagement (completed a level/significant task); never on first launch or
  during onboarding.
- Don't interrupt tasks; wait for natural stopping points.
- Don't pester: at least 1–2 weeks between requests, and only after further engagement.
- System prompt caps at 3 times per 365 days per app; users can opt out globally.
- Resetting the summary rating trades currency for fewer ratings.

Web: NPS/feedback prompts after success moments, rate-limited (≥ 2 weeks), dismissible, never modal on entry.

---

## 19. Multitasking (relevant bits)

- Pause activities needing attention when people switch away; resume as if never left.
- Always be ready to save/restore context — you can't predict interruptions.
- Finish user-initiated background tasks (downloads, processing) before suspending when no input needed.
- Don't notify for routine tasks.
- Audio: pause indefinitely for primary interruptions; duck volume briefly for short ones, then restore.
- Adapt gracefully to any window size; don't assume or control window configuration.

Web: `visibilitychange` → pause media/games, persist drafts; responsive to any viewport incl. split-screen
widths; resume uploads/background jobs via service worker where possible.

---

## 20. Playing audio (skim)

- When device is silenced/muted, play only audio the person explicitly started; mute UI clicks, effects,
  soundtracks.
- System volume governs output; don't change overall volume, only relative mix.
- Allow output rerouting; use system volume UI.
- Don't stop other apps' audio unless needed; respond to media keys only when you're the audio context.
- Never repurpose audio controls; custom controls only for commands the system lacks.
- Headphones disconnected → pause immediately.
- Signal when temporary audio ends so others resume.
- Interruptions: auto-resume only if the interruption is resumable (call), not after the user started other media.
- Never convey important info only via sound.
- Vary repetitive sounds slightly (pitch/volume) to avoid fatigue.

Web: no autoplay with sound; UI sounds off by default or respect a mute toggle; Media Session API for
media keys/lock-screen controls; captions/visual equivalents for any audio cue.

---

## 21. Playing video (skim)

- Use the system/native player; if custom, mirror its behaviors so habits transfer.
- Show video at its original aspect ratio; don't bake letter/pillarbox bars into the file.
- Default modes: Fill (crop) for 2:1–2.40:1; Fit (bars) for 4:3, 16:9 up to 2:1 and ultrawide > 2.40:1.
- Overlays only when they add value; don't obscure playback.
- Support expected input: Space toggles play/pause.
- Transport controls and custom panels lean: actions within 1–2 steps.
- Prevent overlapping audio when switching modes.
- Start content immediately; skip intros/splashes; let Play skip interstitials.
- Resume automatically at previous position for long content; don't ask "Resume?".
- If loading > 2 s, show black screen with a centered spinner, nothing else; start as soon as enough is
  buffered.
- On exit, return to a relevant screen (detail with resume option); prepare it early.
- Interactive overlays (quiz): pause after ≥ 0.5 s delay; clear dismiss/resume.
- Keep logos/overlays small, translucent.
- Don't autoplay fully immersive video; let people choose to start.
- Scrub thumbnails ~160 px wide.

Web: `<video>` with native controls or accessible custom controls; `object-fit: contain` default;
keyboard: Space/K play-pause, ←/→ seek, F fullscreen, M mute, C captions; captions (`<track>`);
`muted playsinline` required for autoplay, and avoid autoplay of main content with sound.

---

## 22. Playing haptics (→ web: micro-feedback / vibration / motion)

- Use standard haptics for their documented meanings (success/warning/error, selection, impact);
  don't repurpose.
- Consistent cause→effect; never the same pattern for opposite outcomes.
- Complement visuals/sound; match intensity and sharpness to the accompanying animation.
- Don't overuse; best haptics go unnoticed until turned off. User-test frequency.
- Prefer short haptics for discrete events; long continuous ones dilute meaning.
- Make optional; app works fully without them.
- Don't interfere with camera/mic/gyro.
- Custom: stronger for bigger events, subtle for subtle ones; transient (taps) vs continuous (sustained);
  tune sharpness and intensity.

Web: `navigator.vibrate()` sparingly (Android only), ≤ ~10–50 ms ticks for confirmations, off by default or
user-toggleable; the web "haptic" is usually a small press animation (scale 0.97, ~100 ms) + state color.
Honor `prefers-reduced-motion` for any motion-based feedback.

---

## 23. Printing (bonus)

- Print in standard locations (File menu / share or overflow menu).
- Dim/hide Print when nothing printable; remove from action menus when impossible.
- Offer only printer-supported options; don't reimplement system options.
- Advanced options behind "Advanced Options" disclosure; show interdependencies; preview effect.
- Remember print settings with the document at least until closed.

Web: print stylesheet (`@media print`): hide nav/chrome, black-on-white, expand links, page-break rules;
"Print" in overflow menu; ⌘P works natively.

---

## 24. Charting data

When to chart: trends over time, current state of a changing quantity, comparisons across categories.
Don't chart data people only need to look up — use a sortable/searchable table/list.

Best practices:
- Chart to highlight important information; state clearly what people should learn.
- Keep charts simple; progressive disclosure for detail (levels of detail, subsets). Don't cram data.
- For interactive charts, consider staged versions each adding functionality.
- Make every chart accessible: labels describing values/components; interactive accessible elements;
  visual-only description is insufficient.

Designing effective charts:
- Prefer familiar types (bar, line). Novel types need teaching (e.g., animate each element's mapping).
- Examine data at macro (totals, averages), mid (useful subsets), and point level (notable values).
- Aid comprehension with titles, subtitles, annotations; a summary headline gives the takeaway at a glance
  ("Chance of light rain in the next hour"). Headline doesn't replace accessibility labels.
- Size to function: big enough for labels/annotations/interaction; small charts for glanceable single-item
  info or as previews.
- Consistency across charts; differ only to signal meaningful differences.
- Continuity when the same data appears in multiple charts (same type, colors, marks, annotations);
  expanding a small chart to detail keeps the same styling.

Web: headline sentence above chart; `role="img"` + aria-label summary or data table fallback; keyboard
tooltip navigation through points; consistent series colors across the dashboard; sparkline → detail view
continuity.

---

## 25. Pointing devices (mouse/trackpad → web hover & cursor)

General:
- Gestures consistent across system and apps; don't redefine system trackpad gestures.
- Same experience across touch, pointer, keyboard, eyes — no separate interaction model per input.
- Let pointer movement reveal auto-hidden controls (toolbars, video controls).
- Modifier keys behave the same with touch-drag and pointer-drag (e.g., Option-drag duplicates).

Pointer effects (iPadOS model, useful for hover design):
- Highlight: translucent rounded-rect backdrop behind small transparent-background elements (toolbar
  icons, tabs, segmented controls).
- Lift: scale up + shadow + specular for small opaque elements (app icons, tiles).
- Hover: custom scale/tint/shadow for large elements; no pointer morph.
- Use system effects for standard controls; custom controls that act like standard ones should get the same
  effects (otherwise they look broken).
- Consistent effects across the app; no gratuitous decorative effects.
- Scale only if the element can grow without crowding neighbors — never scale table rows.
- Tight spaces: tint only, no scale/shadow.
- Never shadow without scale (doesn't read as elevated).
- Custom pointer shapes: simple, understandable instantly. Pointer accessories (small arrows for resize
  axes, plus → not-allowed) simple; animate between states.
- No instructional text in pointer annotations; useful live annotations OK (x/y in graph, W×H when resizing).
- Magnetism for small buttons/icons, not for large hover elements (feels like losing control); text areas
  get vertical magnetism to avoid line skipping.

Hit regions / padding:
- ~12 pt padding around bezeled elements.
- ~24 pt padding around unbezeled elements (from visible edge) and around glyph/icon buttons.
- Too small = precision demanded; too large = pointer feels sticky.
- Contiguous hit regions across adjacent toolbar buttons (no gaps → no cursor flicker).
- Pointer shape should match element corner radius.
- Allow band (marquee) selection in custom collections.
- Distinguish pointer vs touch only when it adds value (pointer clicks to precise seek point; touch drags).

macOS standard cursor meanings (map to CSS `cursor`):
- arrow → `default` (general interaction).
- pointing hand → `pointer` — specifically for links (URL). (Apple: links only; native buttons keep arrow.)
- I-beam → `text`; vertical I-beam → `vertical-text`.
- open hand → `grab` (content can be panned); closed hand → `grabbing` (panning).
- crosshair → `crosshair` (precise rect selection).
- drag copy → `copy` (Option held); drag link → `alias` (Option+Command).
- operation not allowed → `not-allowed` / `no-drop`.
- contextual menu → `context-menu` (usually only while Control held).
- disappearing item (poof on drop, original unaffected).
- resize cursors → `ew-resize`, `ns-resize`, `col-resize`, `row-resize`, directional `n/s/e/w-resize`.

Mouse/trackpad interactions: primary click = select/activate; secondary click = context menu; scroll any
direction; smart zoom (double-tap two fingers); swipe between pages (back/forward); pinch zoom; rotate;
force click = lookup/Quick Look.

Web:
- Hover states on all interactive elements, guarded by `@media (hover: hover) and (pointer: fine)`;
  never put essential info only in hover.
- Right-click context menus are a supplement, never sole access.
- Don't hijack trackpad two-finger swipe (history nav) or pinch unless canvas-like.
- Icon buttons: visual 16–20 px glyph with ≥ 28–32 px desktop hit target (24 pt padding guidance);
  touch ≥ 44 px.
- Adjacent toolbar buttons: hit areas abut (no dead gaps).

---

## 26. Keyboards

- Support full keyboard access: navigate/activate everything without pointer.
- On iPadOS: keyboard navigation in text fields, text views, sidebars, collections; avoid making plain
  controls (buttons, switches) arrow-navigable — Full Keyboard Access handles those.
- Respect standard shortcuts; for frequent unique actions create custom shortcuts rather than repurposing
  standard ones. Repurpose only if the standard action is meaningless in your app (no text editing → ⌘I could
  be Get Info).
- Games may keep ⌘Q but must allow remapping key bindings.

Key standard shortcuts (Mac; on web map ⌘ → Ctrl on Windows/Linux):
- ⌘A select all · ⇧⌘A deselect all
- ⌘C copy · ⌘X cut · ⌘V paste · ⇧⌘V paste as · ⌥⇧⌘V paste and match style
- ⌘Z undo · ⇧⌘Z redo
- ⌘B bold · ⌘I italic · ⌘U underline
- ⌘F find · ⌥⌘F jump to search field · ⌘G find next · ⇧⌘G find previous · ⌘E use selection for find
- ⌘N new · ⌘O open · ⌘S save · ⇧⌘S save as/duplicate · ⌘P print · ⇧⌘P page setup
- ⌘W close window · ⌥⌘W close all · ⌘Q quit · ⌘H hide · ⌘M minimize
- ⌘, settings · ⌘? help · ⌃⌘F full screen · ⌥⌘T show/hide toolbar · ⌥⌘I inspector
- ⌘. or Esc cancel current operation
- ⌘+/⌘− (⇧⌘= / ⌘-) increase/decrease size of selection
- ⌘[ ⌘] ⌘| left/right/center align · ⌘J scroll to selection · ⌘` cycle windows
- Tab / ⇧Tab move between controls; ⌃Tab / ⌃⇧Tab move between control groups (or tables)
- Arrows with modifiers for text selection: ⇧← → char; ⌥⇧← → word; ⇧⌘← → line start/end;
  ⇧⌘↑ ↓ document start/end; ⌥⇧↑ ↓ paragraph.
- Reserved system: ⌘Space (Spotlight), ⌘Tab (app switch), ⌥⌘Esc (force quit), ⇧⌘3/4 (screenshot),
  ⌃F1–F7 (keyboard focus to menu bar/Dock/toolbar etc.), ⌃Space (input source).

Custom shortcuts:
- Only for the most frequently used app-specific commands; too many = hard to learn.
- Modifier conventions: Command-drag moves as group; Shift during resize constrains aspect ratio; arrow
  keys nudge by smallest unit while held.
- Modifier usage: Command = primary modifier; Shift = secondary, complementing a related shortcut
  (⌘Z / ⇧⌘Z); Option = sparingly, power/less-common; Control = avoid (system uses it).
- Display order of modifiers: Control, Option, Shift, Command (⌃⌥⇧⌘).
- Localization: Command is safe; avoid extra modifiers with characters not on all layouts; non-Command
  modifiers only with letters. Some layouts need Option to type characters (French Option-5 = "{").
- For upper character of two-character keys, show the character, not Shift (⌘? not ⇧⌘/).
- Don't extend an existing shortcut with a modifier for an unrelated command (⇧⌘Z must stay redo-related).
- Let the system localize key names and mirror for RTL.
- Shortcut discovery: holding ⌘ shows a grouped overlay (File/Edit/View) of commands with shortcuts;
  titles must stand alone (no submenu context).

Web:
- Detect platform: show ⌘ on Mac, Ctrl elsewhere; render as `<kbd>` with modifier order ⌃⌥⇧⌘.
- Never override browser-critical shortcuts (⌘T, ⌘W, ⌘L, ⌘R, ⌘Q, ⌘Tab, ⌘F unless providing in-app find
  that's clearly better, ⌘P only for real print).
- Shortcut cheat sheet via "?" or ⌘/; single-key shortcuts only when focus is not in a text field, and
  allow disabling (WCAG 2.1.4).
- ⌘K command palette is a fine "search" entry; Esc always closes/cancels topmost layer; Enter submits
  default action; ⌘Enter submits from multiline text.

---

## 27. Gestures (touch)

Standard gestures and meanings (keep them):
- Tap → activate control / select item.
- Swipe → reveal actions, dismiss views, scroll.
- Drag → move an element.
- Touch and hold (long press) → reveal additional controls/context menu.
- Double tap → zoom in (zoom out if zoomed).
- Pinch (zoom) → zoom/magnify.
- Rotate → rotate selected item.
- iOS extras: 3-finger swipe left/right = undo/redo; 3-finger pinch in/out = copy/paste; shake = undo.

Best practices:
- Offer more than one input method (voice, keyboard, switch control); don't assume anyone can perform a
  given gesture.
- Gestures behave consistently; tap always activates/selects. Don't assign familiar gestures to unique
  actions; don't invent new gestures for standard actions (buttons, scrolling).
- Respond immediately; feedback that helps predict outcome; show extent/type of movement required
  (rubber-banding, progress during swipe).
- Indicate when a gesture is unavailable (locked object looks locked; unavailable button looks disabled) —
  otherwise people assume the app froze.

Custom gestures:
- Only when necessary, for specialized frequent tasks (games, drawing).
- Must be discoverable, easy to perform, distinct, and never the only way to do something important.
- Teach in-app; if you can't describe it simply in words + graphics, it's too hard.
- Shortcut gestures supplement, never replace, standard navigation (keep a visible Back button even if
  edge-swipe works).
- Don't conflict with system gestures (screen-edge swipes, etc.); defer system gestures only in games/
  immersive contexts.
- Don't require specific body movements/positions or a specific hand; avoid complex multi-finger/two-hand
  gestures without a low-effort alternative. Prioritize comfort.

Web:
- Every swipe action (swipe-to-delete, carousel) also has a visible button / keyboard path.
- Don't block pinch-zoom (`user-scalable=no` is an anti-pattern); `touch-action` only on canvases/maps.
- Avoid custom gestures near screen edges (browser back-swipe, OS home indicator).
- Long-press → context menu supplement only.
- Touch targets ≥ 44×44 px (Apple's general layout/accessibility minimum; not stated on this page).
- Immediate visual response on touch (`:active` state) within ~100 ms.

---

## 28. Focus and selection

General:
- Use system focus effects; custom ones only when absolutely necessary.
- Don't move focus without the person's input.
  - Exception: with directional input, if the focused item disappears you may move focus to a nearby item
    within one step; otherwise hide the indicator.
- Match platform focus scope: desktop/iPad keyboard focus targets content elements (list items, text
  fields, search fields); controls via full keyboard access. TV: every element must be focusable.
- Focus visuals: focused list row = white text on accent-color background; unfocused selected row =
  normal text on gray background (selection persists but de-emphasized when the list loses focus).
- Indicator by content: focus ring for text/search fields; row/cell highlight for lists & collections
  (ring OK for cell-filling items like photos, but whole-row highlight scans better).

Focus groups & order (iPadOS model, maps well to web):
- Group regions (sidebar, list, grid). Tab moves between groups; arrow keys move within a group
  (roving tabindex).
- Focus order follows reading order (leading→trailing, top→bottom); adjust for custom layouts (treat a
  vertical stack as one group to go down first).
- When a group receives focus, its primary item gets focus; you can raise an item's priority to be primary
  (e.g., last-selected item).
- Halo/ring: follow element contours (rounded corners); don't let parents clip it; keep badges above it.
- "Highlighted" (selected) ≠ focused: selection styling uses accent-colored text; focus is separate.

Five interaction states to design (tvOS, useful everywhere): unfocused, focused (elevated/illuminated),
highlighted/pressed (instant feedback), selected (chosen, e.g., filled heart), unavailable (inactive).
Focused elements that scale need assets for the larger size and must not crowd neighbors.

Web:
- `:focus-visible` ring always visible for keyboard users (≥ 2 px, offset 2 px, accent color, ≥ 3:1
  contrast); ring follows `border-radius`; ensure `overflow: hidden` parents don't clip it (use
  outline-offset or inset ring).
- Never `outline: none` without replacement.
- Don't programmatically steal focus (no autofocus jumps after async load); after deleting the focused
  row, move focus to the next/previous row; after closing a dialog, return focus to the trigger.
- Listboxes/grids/menus/tabs: single tab stop + arrow keys (roving tabindex / aria-activedescendant).
- Distinguish selected (aria-selected, filled bg) from focused (ring); when list loses focus, selected rows
  dim to neutral gray.
- Skip links for large nav regions; logical DOM order = visual order.

---

## 29. Quick reference — numbers

| Topic | Number |
|---|---|
| Launch patience | people won't wait more than ~2 s |
| Show progress | when loading exceeds a moment or two (~1–2 s) |
| Video loading screen | only if > 2 s; black + centered spinner |
| Interactive video overlay | pause after ≥ 0.5 s |
| Drag image appears | after ~3 pt of movement |
| Pointer hit padding | ~12 pt bezeled; ~24 pt unbezeled / glyphs |
| Tip complexity limit | > 3 actions = too complex for a tip |
| Tip length | 1–2 sentences |
| Tip frequency example | max once per 24 h |
| Tooltip length | ≤ 60–75 characters, sentence case, no period |
| Rating prompt spacing | ≥ 1–2 weeks between asks; system max 3 per 365 days |
| Time Sensitive notification | event now or within 1 hour |
| Undo history | unlimited since open/save |
| Undo label | 1–2 words after "Undo"/"Redo" |
| Modifier order | Control, Option, Shift, Command |
| Alerts visible | max 1 at a time |
| Modals stacked | avoid; dismiss before presenting another |
| Video scrub thumbnails | 160 px wide |
| Video fill vs fit | fill 2:1–2.40:1; fit 4:3–2:1 and > 2.40:1 |

## 30. Anti-pattern checklist (for reviewing web UIs)

- [ ] Modal on page load (newsletter, cookie wall, rating, permission) before engagement.
- [ ] Nested dialogs or multi-level navigation inside a dialog.
- [ ] Dialog closes on backdrop click / Esc and silently loses typed data.
- [ ] Mandatory sign-up before browsing; no guest path.
- [ ] Password field prefilled by app; paste blocked in password/OTP.
- [ ] Validation only after submit, errors far from fields.
- [ ] Free text where a picker would do; no defaults.
- [ ] Settings page duplicating OS prefs (dark mode toggle without "System" default).
- [ ] Blank white screen while loading; full-page spinner for partial data.
- [ ] Confirm dialogs for every delete instead of undo.
- [ ] Undo limited or absent; undo with no visible result.
- [ ] Drag-only reordering with no keyboard/menu alternative.
- [ ] Swipe-only actions; custom gestures conflicting with browser back-swipe.
- [ ] `outline: none` without replacement; focus jumps unexpectedly; focus lost after dialog close.
- [ ] Hover-only info or controls; tooltips with essential info; tooltips > 75 chars.
- [ ] Hijacked standard shortcuts (⌘F, ⌘S, ⌘Z) with different meanings; Ctrl-based custom shortcuts.
- [ ] Permission priming button labeled "Allow"; app unusable after denial.
- [ ] Marketing push/email opt-in pre-checked or tied to urgent channel.
- [ ] Account deletion buried or harder than sign-up.
- [ ] Autoplay video with sound; letterbox baked into video; "Resume?" prompt instead of auto-resume.
- [ ] Charts without headline takeaway or text alternative; inconsistent colors across charts.
- [ ] Rating/feedback prompts repeated more often than every ~2 weeks or mid-task.

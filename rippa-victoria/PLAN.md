# Rippa Victoria concept demo: design plan

Written before any code, per the brief. Checked against the avoid list at the end.

## Where the look comes from

Brochure dimension drawings. The riveted data plate on a machine. Survey pegs and
marking paint on compacted road base. Working equipment, sold honestly.

So: thin black line art on cool grey, numbers that look like they were stamped,
one ground line that everything stands on, and a single fluoro colour that only
appears when the site is answering you.

## Palette

| Token | Hex | Role |
|---|---|---|
| Concrete | `#E6E7E3` | Page ground. Cool, slightly warm-grey, never white |
| Plate | `#F4F4F1` | Spec plates, form fields, the "steel" surfaces that sit on the concrete |
| Road base | `#B9BCB5` | Rules, borders, dimension lines, disabled text |
| Asphalt | `#1E2022` | All text and line art |
| Machine paint | `#2166CC` | Rippa blue, taken from the machine's paint in the reference photos. Buttons, links, the price. The one brand colour |
| Marking paint | `#FF2D95` | Fluoro survey pink. Interactive states only: fits, selected, focus ring, live repayment figure |

Green and red never carry meaning alone, and neither does the blue. "Won't fit" is a grey tag with the words on it.
"Fits" is a marking-paint stripe on the ground under the machine, with the word "Fits" beside it.

## Type

One family: **Archivo** (variable, width axis 62 to 125, weight 100 to 900), loaded from Google Fonts.

| Role | Setting |
|---|---|
| Headlines | `font-stretch: 125%`, weight 700, tight leading |
| Body | `font-stretch: 100%`, weight 400, 17px / 1.5 |
| Spec plates and numbers | `font-stretch: 75%`, weight 600, tabular figures |
| Small labels (tags, captions) | `font-stretch: 88%`, weight 500, sentence case, not tracked out |

Width does the expressive work. No second typeface, no monospace.

## Layout rules

- Left-aligned everywhere. Max content width 1200px, 16px gutter on phones, 40px on desktop.
- The ground line of the line-up is a 3px asphalt rule that runs edge to edge of the viewport. It is the strongest line on the page. No other rule is thicker than 1px.
- Rows and rules, not cards. Sections are separated by 1px road-base rules. No shadows, no rounded panels.
- Spec plate: a plate-coloured block with a 1px asphalt border and four small "rivet" dots in the corners. This is the only decorated surface on the site and it is used for exactly one thing.
- Buttons: solid machine-paint blue with white text, 2px corner radius. Secondary buttons are an asphalt outline. No arrows.

## Motion

Only in answer to the user. 200ms ease-out for gate posts moving, machines stepping back or forward, the spec plate opening. Repayment figure ticks over 300ms. Lead-flow panel steps in one at a time at 700ms intervals. `prefers-reduced-motion` turns all of it to instant.

No scroll-triggered anything.

## Home hero at 380px

```
┌──────────────────────────────────────┐
│ Rippa Victoria          Menu         │  nav, 1px rule under
├──────────────────────────────────────┤
│                                      │
│ Pick the right                       │  h1, Archivo wide 700, 34px
│ excavator by                         │
│ looking at it.                       │
│                                      │
│ Six machines, drawn to scale.        │  body 17px
│ Slide the gate to your side          │
│ access. Tap a machine.               │
│                                      │
│ ┌────────┬───────────────────────► scroll-snap strip
│ │        │      ╭──╮         ╭─╮   │
│ │   o    │  ▌ ▐  │▓▓│╲       │▓│╲   │  person pinned left
│ │  /|\   │  ▌ ▐  │▓▓│ ╲      │▓│ ╲  │  gate posts, then machines
│ │  / \   │  ▌ ▐  ╘══╧══╝     ╘═╧══╝ │
│ ═══════════════════════════════════════ ground line, 3px, edge to edge
│ │ 1.8 m  │ 1,000 │ R10       R13    │  captions, condensed
│ │        │  mm   │ Fits      Fits   │  marking-paint stripe under fits
│ └────────┴──────────────────────────┘
│                                      │
│ How wide is your access?    1,000 mm │  label + live value
│ ━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━  │  native range 700–2000
│                                      │
│ What's the job?                      │
│ [Any job] [Trenching] [Backyard]     │  real buttons, wrap
│ [Farm and fencing] [Post holes]      │
│ [Small demolition]                   │
│                                      │
│ ┌ ● ─────────────────────────── ● ┐  │  spec plate (opens on tap)
│ │ R18 Pro Excavator                │  │
│ │ $24,999      $118/wk est.        │  │
│ │ Digs to 2.4 m: deep enough...    │  │
│ │ 1,000 mm tracks in: fits a ...   │  │
│ │ 1.8 tonne: needs a plant trailer │  │
│ │ Transport 1,750 kg. Check your   │  │
│ │ vehicle's tow rating.            │  │
│ │ [See the R18 Pro]                │  │
│ │ [Enquire about the R18 Pro]      │  │
│ └ ● ─────────────────────────── ● ┘  │
└──────────────────────────────────────┘
```

## Home hero at 1280px

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ Rippa Victoria        Excavators  Skid steers  Attachments  Finance   0423 499 172 │
├────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                    │
│ Pick the right excavator by looking at it.                                         │  h1 wide, 56px, max 14ch
│ Six machines drawn to scale beside a person, a gate and a ute.                     │
│ Slide the gate to your side access. Tap a machine to see what it's for.            │
│                                                                                    │
│                                                        ╭───╮                       │
│    o     ▌  ▐        ╭──╮        ╭──╮╲      ╭──╮╲      │▓▓▓│╲      ┌──────┐        │
│   /|\    ▌  ▐    ▌▐  │▓▓│╲   ▌▐  │▓▓│ ╲  ▌▐ │▓▓│ ╲  ▌▐ │▓▓│ ╲   ┌──┤      ├──┐     │
│   / \    ▌  ▐    ╘═══╧══╧═╝  ╘═══╧══╧══╝ ╘══╧══╧══╝ ╘══╧═══╧══╝  └()─────────()┘    │
│════════════════════════════════════════════════════════════════════════════════════│ ground, 3px, viewport wide
│  1.8 m   1,000 mm   R10      R13 Pro    R15      R18 Pro      R22 Pro   Dual-cab ute│
│          access     Fits     Fits       Fits     Fits         Won't fit            │
│                                                                                    │
│ How wide is your access?  1,000 mm     What's the job?                              │
│ ━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━      [Any job] [Trenching] [Backyard] [Farm]      │
│ 700 mm                     2,000 mm    [Post holes] [Small demolition]              │
│                                                                                    │
│ ┌ ● ──────────────────────────────────────────────────────────────────────── ● ┐   │
│ │ R18 Pro Excavator            $24,999   about $118 a week*                     │   │
│ │ Digs to 2.4 m. Deep enough for stormwater and septic trenches.                │   │
│ │ 989 mm with the tracks pulled in. Fits through most side gates.               │   │
│ │ 1.8 tonne. Tows on a plant trailer behind a dual-cab ute.                      │   │
│ │ Transport weight 1,750 kg. Check your vehicle's tow rating.                    │   │
│ │ [See the R18 Pro]  [Enquire about the R18 Pro]                                 │   │
│ └ ● ──────────────────────────────────────────────────────────────────────── ● ┘   │
└────────────────────────────────────────────────────────────────────────────────────┘
```

## Avoid-list check

- Cream + serif + terracotta: no. Cool grey, one sans, blue accent from the machine paint.
- Near-black with one acid accent: no. Light ground, dark text. (The reference site is navy with white text; we go the other way.)
- Grids of rounded cards with soft shadows: no. Rows and 1px rules. The spec plate is the one bordered block and it is square-cornered.
- All-caps tracked-out labels above headings: no. Sentence case, no letter-spacing anywhere.
- One coloured word in a headline: no. Headlines are all asphalt.
- Numbered markers on things that aren't sequences: the only numbered list is the lead-flow sequence, which is a real sequence. Pre-delivery checks are a plain checklist with tick marks and no numbers.
- Arrows on buttons: no.
- Gradient washes: no.
- Monospace for small labels: no. Condensed Archivo with tabular figures does the "stamped number" job.

Revised after the check: an earlier draft had a "01 / 02 / 03" numbering on the home sections. Removed. An earlier draft used a dark hero band; removed, the ground line is the hero.

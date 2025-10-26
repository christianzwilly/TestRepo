# OCBC Singapore Investment Portfolio Onboarding Experience

## 1. Experience Overview
- **Platform toggle**: A pill-style segmented control anchored on the top-right of every screen lets customers switch between **Mobile App** and **Web App** mock-ups. The selected platform slightly enlarges and uses OCBC red (`#D6001C`) with white text; the unselected pill uses a soft grey background (`#F5F5F5`) and dark text (`#333333`).
- **Journey flow**: Customers access the investment onboarding through the "Investment Portfolio" section within the banking dashboard. The flow is linear with contextual back navigation and a persistent breadcrumb to reinforce progress.
- **Accessibility**: Body text uses OCBC charcoal (`#1F1F1F`) on white or warm grey backgrounds, maintaining WCAG AA contrast. Touch targets respect 48×48 px sizing on mobile and 44×44 px minimum click targets on web.

## 2. Visual Language & Components
- **Primary colors**: OCBC Red `#D6001C`, Deep Charcoal `#1F1F1F`, White `#FFFFFF`.
- **Secondary neutrals**: Cloud Grey `#F0F0F0`, Mist Grey `#D9D9D9`, Slate Grey `#5A5A5A`.
- **Accent**: Emerald `#0F9D58` for positive performance, Amber `#F9A825` for alerts.
- **Typography**: OCBC Sans (or Noto Sans substitute) with bold headers (24–28 pt mobile, 28–32 pt web), regular body (16 pt mobile, 18 pt web), and caption (14 pt mobile, 16 pt web).
- **Buttons**: Filled primary (red background, white text), secondary outline (red border, transparent fill), tertiary text-only with underline hover on web.
- **Cards**: Rounded corners (12 px mobile, 16 px web), subtle drop shadow (`0 8px 24px rgba(0,0,0,0.08)`).
- **Graphs**: Dual-tone line or area charts with base gridlines in Mist Grey. Target projections appear as dashed lines in Emerald or Amber depending on variance.

## 3. Entry Point – Investment Portfolio Section
- **Location**: Home dashboard displays cards for Accounts, Payments, and a new **Investment Portfolio** card.
- **Card layout**:
  - Title "Investment Portfolio" (bold, red accent underline).
  - Current portfolio summary placeholder stating "No portfolios yet".
  - Primary button **Add Portfolio** (fills full card width on mobile, right-aligned on web).
  - Quick tips link: "Learn about investing" (tertiary text button).
- **Interaction**: Tapping **Add Portfolio** launches the onboarding stack with a modal transition on mobile (slide-up) and a centered overlay wizard on web.

## 4. Step 1 – Risk Profile Questionnaire
- **Header**: "Help us understand your risk comfort" with subtext "Answer 5 quick questions".
- **Progress indicator**: Horizontal stepper (1/5, 2/5, etc.) with red active segment and grey inactive segments.
- **Question format**: Single-select cards with radio pills. Each option displays expected time horizon and volatility hints.
- **Questions & Answer Options**:
  1. *Investment Horizon*: `< 2 years`, `2 – 5 years`, `5 – 10 years`, `> 10 years`.
  2. *Experience with investments*: `None`, `Limited (e.g., savings products)`, `Moderate (unit trusts/ETFs)`, `Extensive (derivatives, equities)`.
  3. *Reaction to market downturn*: `Sell to avoid losses`, `Wait and observe`, `Invest more to capitalize`, `Rebalance gradually`.
  4. *Primary investment goal*: `Capital preservation`, `Income generation`, `Balanced growth`, `Aggressive growth`.
  5. *Comfort with short-term loss*: `0%`, `Up to 5%`, `Up to 15%`, `More than 15%`.
- **Controls**: "Save & exit" tertiary text, **Continue** primary button enabled after selecting an option for the current question (auto-advances). Summary card at end displays derived risk category before moving forward.

## 5. Step 2 – Goal Setup
- **Layout**: Split card with form fields on top and illustrative graphic on the side (graphic hidden on smaller mobile devices to keep focus on form).
- **Fields** (left-aligned labels, helper text in Slate Grey):
  - `Goal (Optional)` – free-text field with placeholder "e.g., Children's education".
  - `Target Investment (Optional)` – numeric field with currency prefix (SGD) and inline validation.
  - `Tenor (Optional)` – numeric field with suffix "years".
  - `Initial Investment` – numeric, required; error state if left blank.
  - `Recurring Contribution` – numeric, required.
  - `Recurring Contribution Frequency` – segmented buttons (Monthly, Quarterly, Semi-Annually), required. Selected state fills red; unselected remain grey outlined.
- **CTA behavior**: **Continue** button remains disabled (greyed out with tooltip "Complete required fields" on hover) until `Initial Investment`, `Recurring Contribution`, and `Recurring Contribution Frequency` are valid.
- **Secondary actions**: "Back" outline button, "Save draft" text button stored in quick access tray.

## 6. Step 3 – Model Portfolio Selection & Projection
- **Portfolio cards**: Four horizontally scrollable (mobile) or grid (web) cards labeled `Conservative`, `Moderately Conservative`, `Balanced Growth`, `Aggressive Growth`. Each card shows:
  - Risk badge (Low / Low-Medium / Medium / High).
  - Expected annual return range (e.g., 3–4%, 4–6%, 6–8%, 8–10%).
  - Historical volatility indicator via sparkline.
  - Selecting a card expands it into a full-width detail view.
- **Projection module**:
  - **When Goal, Target, Tenor provided**: chart compares projected portfolio value (solid red line) vs. target (dashed emerald line). If projected final value < target, highlight variance with Amber alert strip and show **Optimize Target** button. Tapping **Optimize Target** opens a side sheet recommending adjusted parameters (higher contribution, longer tenor) with an "Apply suggestion" quick action.
  - **When Goal/Target/Tenor empty**: chart shows projected performance only, with tooltip for year-by-year values.
  - **Chart legend**: includes frequency assumption and contributions timeline badges.
- **Instruments & Allocations**: Beneath the chart, a table lists funds (e.g., `OCBC Global Bond Fund`, `OCBC Balanced Fund`, `OCBC Growth Equity Fund`, `OCBC Asia Opportunity Fund`) with percentage allocation, risk rating, and a "Fund factsheet" button that opens a modal with key facts, performance summary, and download link.
- **Actions**: Primary **Continue** button, secondary **Change inputs** (returns to goal setup), tertiary "View historical performance" link.

## 7. Step 4 – Subscription Confirmation
- **Summary card**: Displays selected model, contribution breakdown, projected value, and (if applicable) optimized parameters. Fee disclosure panel outlines management fee (e.g., 0.75% p.a.) and platform charges.
- **Customer consent**: Two checkboxes with concise text: `I acknowledge the investment risk disclosures.` and `I agree to the model portfolio terms.` Both must be ticked to enable **Confirm & Proceed** button.
- **Document links**: Terms & conditions, prospectus, and factsheets accessible via tertiary buttons.

## 8. Step 5 – Password Entry
- **UI**: Secure input field with show/hide toggle, inline copy "Enter your OCBC digital banking password to proceed." Accepts any value and validates client-side only. Includes "Forgot password" link.
- **CTA**: **Authorize Investment** button turns red once minimum password length (8 chars) met.

## 9. Step 6 – Success Screen
- **Header**: "Your subscription is successful" with celebratory confetti animation (subtle, loop once).
- **Summary tray**: Displays model name, initial & recurring contributions, next deduction date, projected value (if goal provided), and risk category. Provide download/ share receipt buttons.
- **Next steps**: Outline links for "Track performance", "Set alerts", and "Return to dashboard".

## 10. Responsive Behavior Highlights
- **Mobile**: Vertical stacking, sticky footers for primary actions, persistent segmented toggle at top of scroll. Charts use swipeable carousel to view instrument details.
- **Web**: Wizard-style layout with left rail progress summary (`1. Risk Profile → 2. Goal Setup → 3. Portfolio → 4. Confirm → 5. Authorize → 6. Success`). Content centers within 1200 px container.
- **State retention**: Partial progress autosaves; returning users land on the last incomplete step with a toast confirmation.

## 11. Interaction States & Feedback
- **Validation**: Inline error messages appear in red text, with icons and descriptive guidance.
- **Loading**: Portfolio projections show animated skeleton charts and "Calculating projection" microcopy.
- **Empty states**: Factsheet modals display placeholder text until data loads. Optimize side sheet shows friendly message "Great news! Your target is on track" when projections meet target.

## 12. Security & Trust Elements
- Display MAS regulatory badge and "Powered by OCBC Robo-Advisory" descriptor below charts.
- On password screen, include lock icon and secure connection notice. During authorization, show progress spinner with "Securing your transaction" messaging.
- Success screen reiterates "You can adjust or cancel anytime via Investment Portfolio > Manage" with a red outline button.

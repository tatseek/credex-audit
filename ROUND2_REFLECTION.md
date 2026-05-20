# Round 2 Reflection

## 1. The most uncomfortable trade-off you made because of time pressure

The most uncomfortable trade-off was skipping a proper re-audit that actually re-fetches a fresh AI summary. When the user clicks the re-run link, the diff view shows updated recommendations from the audit engine but does not call the Gemini API again for a new personalized paragraph. The old summary is just not shown. The honest reason is that adding an async API call to a server component in 36 hours would have required either making the page a client component or adding a loading state,  both would have expanded the scope significantly late in the assignment. The trade-off is real: the diff view is less polished than the main results page. I would fix this first with more time by adding a Suspense boundary around the summary section.

## 2. If we extended the deadline by another 24 hours, what is the first thing you would do

The single first thing would be adding a one-click unsubscribe link to the pricing change email. Right now if a user gets a re-audit email they have no way to opt out except emailing us back. That is a bad user experience and a potential spam complaint risk. The implementation is straightforward — add an unsubscribed boolean column to the leads table, create a GET /api/unsubscribe?email=x endpoint that sets it to true, and check that column before sending in detect-changes. I did not build it because the diff view was higher priority and the spec listed it as a bonus. But it is the first thing I would ship.

## 3. One thing your Round 1 self made harder for your Round 2 self

The audits table in Round 1 did not store user_email alongside the audit — email was only stored in the leads table as a separate record. This meant in Round 2 I had to add a new column and update the audit saving logic to pass email through, and there is now a subtle inconsistency where older audits have no email and cannot be notified. If I had anticipated Round 2 in Round 1 I would have stored email in the audits table from the start. The lesson is that audit records and lead records are not the same thing — an audit is a snapshot of a moment in time, a lead is a relationship. They should have been separate from day one with a foreign key joining them.

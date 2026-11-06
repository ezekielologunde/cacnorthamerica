# AdSense readiness

What the site already does, and what only the account owner can do. Approval is
Google's decision; nothing here guarantees it.

## Already in the code

- **Ad script.** `components/analytics/AdSenseScript.tsx` loads Google's
  auto-ads script only when `NEXT_PUBLIC_ADSENSE_ID` is set. It never loads on
  `/admin`, the payment confirmation pages (`/events/*/register/confirmation`,
  `/giving/confirmation`, `/store/confirmation`) or the legal pages
  (`/privacy`, `/terms`, `/refunds`). The list is in `lib/adsense.ts`.
- **ads.txt.** `/ads.txt` is built from `NEXT_PUBLIC_ADSENSE_ID` and returns
  `google.com, pub-…, DIRECT, f08c47fec0942fa0`. While the variable is unset it
  returns 404.
- **Crawling.** `robots.txt` lets AdSense's crawler (Mediapartners-Google,
  covered by the `*` group) and AdsBot reach every public page.
- **Policy pages.** Privacy, Terms and Refunds pages are live and linked in the
  footer.

## What you need to do

1. Sign in at https://adsense.google.com with the Google account that should
   own the ads and add the site `cacna.org`.
2. Copy the publisher ID AdSense shows (`ca-pub-` followed by 16 digits).
3. In Vercel, Project, Settings, Environment Variables, set
   `NEXT_PUBLIC_ADSENSE_ID` to that value for Production, then redeploy. The
   value is read at build time, so `/ads.txt` and the ad script only change
   after a new deploy.
4. Check that https://cacna.org/ads.txt shows the line with your ID,
   then ask AdSense to review the site.
5. In AdSense, Ads, By site, Auto ads, add page exclusions for `/privacy`,
   `/terms` and `/refunds`. The site stops the script on those pages when they
   are opened directly, but a visitor who arrives from another page in the same
   tab already has the script running.
6. Visitors in the EEA, the UK and Switzerland must see a Google-certified
   consent message before personalised ads are shown. The simplest route is
   AdSense, Privacy and messaging, European regulations message. The site has no
   consent banner of its own today.
7. AdSense requires the privacy policy to say that third-party vendors,
   including Google, use cookies to serve ads based on past visits, and how to
   opt out (Google's Ads Settings page). `/privacy` currently says only that
   AdSense tags "may also load and use cookies"; add the opt-out wording before
   you apply.

## Content-Security-Policy

The policy in `next.config.ts` already allows what ads need: the AdSense script
(`pagead2.googlesyndication.com`), Google's ad origins in `frame-src`
(`googleads.g.doubleclick.net`, `tpc.googlesyndication.com`) and
`https://*.g.doubleclick.net` in `connect-src`. Nothing to widen before you
apply. If Google later serves ads from a new origin and ad frames show blocked
in the browser console, add that origin there.

## Content quality

AdSense reviewers look for original, useful content that people come back for,
clear navigation, and enough text on each page. Sites that are mostly event
listings, registration forms or thin pages are often rejected as "low value
content". Regular blog posts and substantial ministry pages help; pages that are
only a date and a register button do not. A rejection can be appealed after
the content is improved.

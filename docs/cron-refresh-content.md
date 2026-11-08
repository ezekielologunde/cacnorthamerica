# Keeping the home page, blog and calendar fresh

The public pages are cached (ISR) so they load fast. They now refresh in three ways:

1. **Admin saves refresh at once.** Publishing, editing or deleting a blog post, an event, an
   announcement or a CAC World story (approve, reject, unpublish, "fetch latest") revalidates
   the pages that show it, through `lib/contentRevalidation.ts`.
2. **A scheduled refresh once a day (09:00 UTC; the project is on Vercel Hobby, which rejects anything more frequent -- confirmed by a failed deploy).** `vercel.json` runs a Vercel Cron job against
   `GET /api/cron/refresh-content`. It drops the cached CAC World News feed (tag
   `cac-world-news`) and marks the home, `/blog`, `/blog/[slug]`, `/calendar` and
   `/events/[slug]` pages stale, so new CAC World stories appear without anyone touching
   the admin.
3. **Timers, as a fallback.** The home page rebuilds at most every 60 s and the CAC World
   feed is re-fetched at least every 10 minutes even without the cron.

The home page's Latest News, the hero's "Latest News" slide and Upcoming Programs now read the
same data as `/blog` and `/calendar` (static posts/events plus the ones published from the
admin), so a post published in `/admin/blog` shows on the home page as well.

## Why the old refresh calls did nothing

next-intl serves `/blog` from the internal route `/en/blog`, and `revalidatePath` matches
that internal path, not the URL in the address bar. The build's cache tags show it: the home
page is tagged `_N_T_/en` and `_N_T_/(site)/[locale]/page`, never `_N_T_/`. So the old
`revalidatePath("/")` and `revalidatePath("/blog")` calls matched nothing, and pages only
caught up on their timers (an hour for `/blog`). `lib/contentRevalidation.ts` revalidates by
route-file pattern (`/(site)/[locale]/blog` + `"page"`), which matches whatever URL served it.

## Setup the owner must do: `CRON_SECRET`

The endpoint refuses every request until this is set.

1. Generate a random value of at least 16 characters (32+ recommended), for example
   `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
2. In Vercel, open the CACNA project, **Settings > Environment Variables**, add
   `CRON_SECRET` with that value for **Production**, and redeploy.
3. Vercel Cron then sends `Authorization: Bearer <CRON_SECRET>` on every scheduled call by
   itself. Nothing else needs it; do not put it in any `NEXT_PUBLIC_` variable.

Check it after deploying: the project's **Settings > Cron Jobs** page lists
`/api/cron/refresh-content`, and its log shows 200 responses. A 401 means `CRON_SECRET` is
missing, shorter than 16 characters, or was changed without a redeploy.

To run it by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://cacna.org/api/cron/refresh-content
# {"ok":true,"revalidated":{"tags":1,"pages":5},"at":"..."}
```

### Vercel plan note

The project is on Vercel Hobby, which allows cron jobs once a day at most and fails any deployment whose
`vercel.json` asks for more (a `*/15` schedule failed the round-2 PR build). The schedule is therefore daily
(`0 9 * * *`). Admin saves and the 10-minute feed timer keep pages fresh in between; on Pro, a more frequent
schedule is possible.

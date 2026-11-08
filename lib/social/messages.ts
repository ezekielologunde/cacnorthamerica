// Plain-English text for the codes the dispatcher and validators produce,
// shown in the admin post log and form. Unknown codes are shown as is (they
// are sanitised identifiers, never free text).

const MESSAGES: Record<string, string> = {
  platform_disabled: "This platform is switched off in Settings.",
  kill_switch_off: "Real posting is switched off (master switch).",
  not_configured: "This platform isn't connected yet.",
  adapter_exception: "Outcome unknown: the request failed part-way. Check the platform before retrying.",
  admin_confirmed_not_posted: "Confirmed not posted by an admin; it can be retried.",
  unrecognised_error: "The platform returned an error we don't recognise.",
  already_claimed: "Another request is already posting this.",
  not_retryable: "This can't be retried.",
  not_applicable: "Nothing to change.",
  title_missing: "Add a title.",
  title_too_long: "The title is too long (100 characters at most).",
  caption_too_long: "The caption is too long (2,200 characters at most, title included).",
  caption_too_many_hashtags: "Instagram allows at most 30 hashtags.",
  caption_too_many_mentions: "Instagram allows at most 20 @ tags.",
  video_format_unsupported: "This platform doesn't accept this video format.",
  video_too_large: "The video file is too large for this platform.",
  video_too_short: "The video is too short for this platform.",
  video_too_long: "The video is too long for this platform.",
  video_frame_rate_unsupported: "The video's frame rate isn't accepted (23 to 60 fps).",
  video_codec_unsupported: "The video's codec isn't accepted by this platform.",
  video_dimensions_unsupported: "The video's dimensions aren't accepted by this platform.",
  video_aspect_unsupported: "The video's shape (aspect ratio) isn't accepted by this platform.",

  // Platform adapters. "Reconnect" means a new token in the Vercel env vars
  // named in .env.example, then a redeploy.
  facebook_reconnect_needed: "Reconnect needed: the Facebook Page token expired or was revoked. Put a new FACEBOOK_PAGE_ACCESS_TOKEN in Vercel, then Retry.",
  instagram_reconnect_needed: "Reconnect needed: the Instagram (Page) token expired or was revoked. Put a new token in Vercel, then Retry.",
  tiktok_reconnect_needed: "Reconnect needed: the TikTok authorisation expired or was refused. Put a new TIKTOK_REFRESH_TOKEN in Vercel, then Retry.",
  tiktok_token_rejected: "TikTok rejected the access token. Retry once; if it fails again, reconnect TikTok.",
  tiktok_token_refresh_failed: "Couldn't refresh the TikTok connection (network or TikTok error). Nothing was posted; Retry later.",
  tiktok_token_save_failed: "TikTok was refreshed but the new token couldn't be saved. Nothing was posted; reconnect TikTok.",
  tiktok_token_store_unavailable: "Couldn't read the stored TikTok connection. Nothing was posted; Retry later.",
  facebook_account_checkpoint: "Facebook needs the account owner to log in at facebook.com and resolve a security check.",
  instagram_account_checkpoint: "Facebook needs the account owner to log in at facebook.com and resolve a security check.",
  facebook_permission_missing: "The Facebook token is missing a permission (pages_manage_posts and friends). Reconnect with the right permissions.",
  instagram_permission_missing: "The token is missing an Instagram permission (instagram_content_publish and friends). Reconnect with the right permissions.",
  tiktok_scope_missing: "The TikTok connection lacks the video.publish permission. Reconnect TikTok.",
  facebook_rate_limited: "Facebook is limiting requests right now. Nothing was posted; Retry later.",
  instagram_rate_limited: "Instagram is limiting requests (or the 24-hour posting limit is reached). Nothing was posted; Retry later.",
  tiktok_rate_limited: "TikTok is limiting requests right now. Nothing was posted; Retry later.",
  facebook_policy_blocked: "Facebook has temporarily blocked posting for a policy reason.",
  instagram_policy_blocked: "Instagram has temporarily blocked posting for a policy reason.",
  facebook_duplicate_post: "Facebook says an identical post was just published. Check the Page before doing anything.",
  instagram_duplicate_post: "Instagram says an identical post was just published. Check the account before doing anything.",
  facebook_timeout: "Outcome unknown: Facebook didn't answer in time. Check the Page before retrying.",
  facebook_network_error: "Outcome unknown: the connection to Facebook failed. Check the Page before retrying.",
  facebook_server_error: "Outcome unknown: Facebook had a server error. Check the Page before retrying.",
  facebook_platform_unavailable: "Outcome unknown: Facebook reported a temporary problem. Check the Page before retrying.",
  facebook_unexpected_response: "Outcome unknown: Facebook's answer wasn't recognised. Check the Page before retrying.",
  instagram_timeout: "Instagram didn't answer in time. If this happened while publishing, check the account before retrying.",
  instagram_network_error: "The connection to Instagram failed. If this happened while publishing, check the account before retrying.",
  instagram_server_error: "Instagram had a server error. If this happened while publishing, check the account before retrying.",
  instagram_platform_unavailable: "Instagram reported a temporary problem. If this happened while publishing, check the account before retrying.",
  instagram_unexpected_response: "Instagram's answer wasn't recognised. Check the account before retrying.",
  instagram_processing_failed: "Instagram couldn't process the video (format or encoding). Nothing was posted.",
  instagram_processing_timeout: "Instagram was still processing the video when we stopped waiting. Nothing was posted; Retry.",
  instagram_container_expired: "Instagram's upload expired before it was published. Nothing was posted; Retry.",
  instagram_already_published: "Instagram reports this upload as already published. Check the account.",
  tiktok_private_unaudited: "Posted as PRIVATE (only the account can see it): TikTok hasn't audited the app yet.",
  tiktok_processing_private: "Sent as PRIVATE (TikTok app not audited yet) and still processing. Check TikTok shortly.",
  tiktok_processing: "Sent; TikTok was still processing it. Check TikTok shortly.",
  tiktok_publish_failed: "TikTok couldn't download or process the video. Nothing was posted.",
  tiktok_unaudited_client: "TikTok only allows private posts until the app is audited. Set TIKTOK_APP_AUDITED back to false, then Retry.",
  tiktok_url_not_verified: "TikTok can't fetch the video: the TIKTOK_PULL_URL_PREFIX isn't verified in the TikTok developer portal.",
  tiktok_privacy_level_unavailable: "The TikTok account doesn't offer the privacy level we need (public, or private while unaudited).",
  tiktok_daily_post_limit: "TikTok's daily posting limit for this account is reached. Retry tomorrow.",
  tiktok_user_banned_from_posting: "TikTok has banned this account from posting.",
  tiktok_active_user_cap: "The TikTok app's daily publishing quota is reached. Retry tomorrow.",
  tiktok_invalid_request: "TikTok rejected the request as invalid. Nothing was posted.",
  tiktok_api_error: "TikTok returned an error we don't recognise. Nothing was posted.",
  tiktok_timeout: "TikTok didn't answer in time. If this happened while posting, check TikTok before retrying.",
  tiktok_network_error: "The connection to TikTok failed. If this happened while posting, check TikTok before retrying.",
  tiktok_server_error: "TikTok had a server error. If this happened while posting, check TikTok before retrying.",
  tiktok_unexpected_response: "TikTok's answer wasn't recognised. Check TikTok before retrying.",
};

const PREFIXED: Array<[RegExp, string]> = [
  [/^facebook_api_error_[0-9_]+$/, "Facebook returned an error (code shown). Nothing was posted."],
  [/^instagram_api_error_[0-9_]+$/, "Instagram returned an error (code shown). Nothing was posted."],
];

export function describeCode(code: string | null | undefined): string {
  if (!code) return "";
  if (Object.hasOwn(MESSAGES, code)) return MESSAGES[code];
  const prefixed = PREFIXED.find(([re]) => re.test(code));
  return prefixed ? `${prefixed[1]} (${code})` : code;
}

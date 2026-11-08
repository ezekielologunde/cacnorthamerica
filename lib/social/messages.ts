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
};

export function describeCode(code: string | null | undefined): string {
  if (!code) return "";
  return MESSAGES[code] ?? code;
}

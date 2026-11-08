// The adapter used for dry runs and tests. It applies the real platform's
// video rules (so a dry run shows the same skips a real run would) and never
// touches the network: publish only records the call and returns a fake id.

import { validateVideo } from "./limits.ts";
import type { Platform, PlatformAdapter, PlatformCaption, PublishResult, ValidateResult, VideoMeta } from "./types.ts";

export type FakeCall = { platform: Platform; video: VideoMeta; caption: PlatformCaption };

export class FakeAdapter implements PlatformAdapter {
  readonly platform: Platform;
  readonly calls: FakeCall[] = [];
  /** Results to return for the next publish calls, in order; when empty,
   *  publish succeeds. A function may also throw, to simulate a lost response. */
  readonly script: Array<PublishResult | (() => PublishResult | Promise<PublishResult>)> = [];

  constructor(platform: Platform) {
    this.platform = platform;
  }

  validate(video: VideoMeta): ValidateResult {
    return validateVideo(this.platform, video);
  }

  async publish(video: VideoMeta, caption: PlatformCaption): Promise<PublishResult> {
    this.calls.push({ platform: this.platform, video, caption });
    const next = this.script.shift();
    if (typeof next === "function") return next();
    if (next) return next;
    return { id: `fake-${this.platform}-${globalThis.crypto.randomUUID().slice(0, 8)}` };
  }
}

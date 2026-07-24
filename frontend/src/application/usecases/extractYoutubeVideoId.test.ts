import { describe, expect, it } from "vitest";
import { extractYoutubeVideoId, youtubeEmbedUrl } from "./extractYoutubeVideoId";

describe("extractYoutubeVideoId", () => {
  it("parses watch URLs", () => {
    expect(extractYoutubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("parses youtu.be and embed URLs", () => {
    expect(extractYoutubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYoutubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for non-YouTube URLs", () => {
    expect(extractYoutubeVideoId("https://example.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(extractYoutubeVideoId("not-a-url")).toBeNull();
  });
});

describe("youtubeEmbedUrl", () => {
  it("builds a nocookie embed URL", () => {
    expect(youtubeEmbedUrl("dQw4w9WgXcQ")).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });
});

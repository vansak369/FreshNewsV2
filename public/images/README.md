Drop your site images into this folder using these exact filenames (case
matters — these must match exactly, since hosts like GitHub Pages are
case-sensitive). These are the same filenames referenced in the original
index.html / about.html you sent:

  images/news.webp        - homepage hero/featured story image
  images/world.jpg        - "World" story card
  images/business.jpg     - "Business" story card
  images/sport.jpg        - "Sport" story card
  images/Culture.jpg      - "Culture" story card (capital C, matches original)
  images/health.jpg       - "Health" story card
  images/tech.jpg         - "Technology" story card
  images/Kraaaa.webp      - Kimheng Lim (Editor-in-Chief) avatar
  images/rizz.jpg         - Vansak Vong (World Desk) avatar
  images/Punch.webp       - Vannak Thanuk (Business Desk) avatar
  images/download.jpg     - Vibol Sok (Sport Desk) avatar

Note: the Contact page has no images in the original site, so nothing
was added there. Also, the original "Sport" story image filename in
index.html was a broken/URL-like string with no extension
(sport1.com_maraton-de-chicago-...), so it was renamed to sport.jpg here
-- rename your actual file to match, or update the `image` field in
src/data/articles.js to whatever you'd prefer.

You can rename any of these however you like -- just update the matching
`image` field in src/data/articles.js and src/data/about.js to match.

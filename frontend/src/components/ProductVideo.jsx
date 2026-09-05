import { CONTENT } from '../config/content';
import { tpl } from '../lib/text';
import Section from './Section';

// Turns a plain YouTube watch/share link into an embeddable one. Other URLs
// (Facebook, .mp4, already-embed links) are passed straight through.
function toEmbedUrl(url) {
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  return url;
}

export default function ProductVideo() {
  const { video } = CONTENT;
  if (!video?.title) return null;

  const url = video.url?.trim();
  const isFile = url && /\.(mp4|webm|ogg)(\?|$)/i.test(url);

  return (
    <Section title={video.title}>
      <div
        data-reveal
        className="mx-auto aspect-video w-full max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
      >
        {url ? (
          isFile ? (
            <video src={url} controls playsInline className="h-full w-full object-cover" />
          ) : (
            <iframe
              src={toEmbedUrl(url)}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-zinc-400">
            {tpl(video.placeholder ?? '')}
          </div>
        )}
      </div>
    </Section>
  );
}

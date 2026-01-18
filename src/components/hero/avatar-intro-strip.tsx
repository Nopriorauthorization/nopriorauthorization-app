"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AVATAR_INTROS,
  AVATAR_MEDIA_BASE,
  type AvatarIntro,
} from "@/content/hero/avatar-intros";

export default function AvatarIntroStrip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const router = useRouter();

  const activeAvatar = AVATAR_INTROS[activeIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMuted(true);
      setActiveIndex((prev) => (prev + 1) % AVATAR_INTROS.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    AVATAR_INTROS.forEach((avatar, index) => {
      const video = videoRefs.current[avatar.id];
      if (!video) return;
      if (index === activeIndex) {
        video.muted = muted;
        video.currentTime = 0;
        video.play().catch(() => null);
      } else {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
      }
    });
  }, [activeIndex, muted]);

  const renderIntro = useMemo(() => {
    return (
      <span>
        {activeAvatar.introParts.map((part, index) => (
          <span
            key={`${activeAvatar.id}-part-${index}`}
            className={part.emphasis ? "subtitle-accent" : undefined}
          >
            {part.text}
          </span>
        ))}
      </span>
    );
  }, [activeAvatar]);

  return (
    <section className="avatar-strip">
      <div className="avatar-strip__headline">
        <h2>Meet the Experts Who Tell the Truth</h2>
        <p>
          We tell you the <span className="subtitle-accent">juicy stuff</span>{" "}
          you don't want to ask providers — and what{" "}
          <span className="subtitle-accent">Google won't</span>.
        </p>
      </div>

      <div className="avatar-strip__row">
        {AVATAR_INTROS.map((avatar, index) => (
          <AvatarCard
            key={avatar.id}
            avatar={avatar}
            active={index === activeIndex}
            subtitle={index === activeIndex ? renderIntro : avatar.introParts[0].text}
            muted={muted}
            onActivate={() => setActiveIndex(index)}
            onToggleSound={() => {
              if (index !== activeIndex) {
                setActiveIndex(index);
              }
              setMuted((prev) => !prev);
            }}
            onCtaClick={() => {
              if (avatar.ctaHref.startsWith("http")) {
                window.location.href = avatar.ctaHref;
              } else {
                router.push(avatar.ctaHref);
              }
            }}
            videoRef={(node) => {
              videoRefs.current[avatar.id] = node;
            }}
          />
        ))}
      </div>
    </section>
  );
}

function AvatarCard({
  avatar,
  active,
  subtitle,
  muted,
  onActivate,
  onToggleSound,
  onCtaClick,
  videoRef,
}: {
  avatar: AvatarIntro;
  active: boolean;
  subtitle: React.ReactNode;
  muted: boolean;
  onActivate: () => void;
  onToggleSound: () => void;
  onCtaClick: () => void;
  videoRef: (node: HTMLVideoElement | null) => void;
}) {
  return (
    <div
      className={`avatar-card ${active ? "is-active" : ""} ${
        avatar.id === "founder" ? "is-founder" : ""
      }`}
    >
      <div className="avatar-card__media" onClick={onActivate}>
        <video
          ref={videoRef}
          className="avatar-card__video"
          muted
          loop
          playsInline
          preload="metadata"
          poster={avatar.poster}
          style={{ objectPosition: avatar.objectPosition ?? "50% 20%" }}
        >
          <source src={`${AVATAR_MEDIA_BASE}/${avatar.id}-intro.mp4`} type="video/mp4" />
        </video>
        <div className="avatar-card__overlay" />
        <div className="avatar-card__fallback">
          <Image
            src={avatar.poster}
            alt={`${avatar.displayName} avatar`}
            width={320}
            height={320}
            className="avatar-card__image"
            style={{ objectPosition: avatar.objectPosition ?? "50% 20%" }}
          />
        </div>
      </div>

      <div className="avatar-card__body">
        <div className="avatar-card__meta">
          <span className="avatar-card__name">
            {avatar.displayName}
            {avatar.id === "founder" && (
              <span className="avatar-card__badge">Founder</span>
            )}
          </span>
          <span className="avatar-card__domain">{avatar.domain}</span>
          {active && <span className="avatar-card__speaking">Speaking now</span>}
        </div>
        {avatar.credentials && (
          <div className="avatar-card__credentials">
            {avatar.credentials.split("|").map((part, index) => {
              const text = part.trim();
              if (!text) return null;
              if (index === 0) {
                return (
                  <span key={text} className="avatar-card__credentials-accent">
                    {text}
                  </span>
                );
              }
              return (
                <span key={text} className="avatar-card__credentials-rest">
                  <span className="avatar-card__credentials-divider">|</span>
                  {text}
                </span>
              );
            })}
          </div>
        )}
        <p className="avatar-card__subtitle">{subtitle}</p>
        {avatar.microcopy && (
          <p className="avatar-card__microcopy">{avatar.microcopy}</p>
        )}
        <div className="avatar-card__actions">
          <button type="button" className="avatar-card__sound" onClick={onToggleSound}>
            {muted ? "Meet Me" : "Sound on"}
          </button>
          <div className="avatar-card__cta-group">
            <button type="button" className="avatar-card__cta" onClick={onCtaClick}>
              {avatar.cta}
            </button>
            <span className="avatar-card__cta-note">{avatar.ctaNote}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

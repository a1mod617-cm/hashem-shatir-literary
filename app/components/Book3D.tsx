import type { CSSProperties } from "react";

type Book3DProps = {
  cover: string;
  title: string;
  back?: string;
  accent?: string;
  variant?: "card" | "feature" | "modal" | "detail" | "shelf";
  flipped?: boolean;
};

/** A lightweight CSS 3D volume made from the book's real cover artwork. */
export default function Book3D({ cover, title, back, accent = "#a7875a", variant = "card", flipped = false }: Book3DProps) {
  return <div
    className={`book3d book3d--${variant}${flipped ? " book3d--flipped" : ""}`}
    style={{ "--book-edge": accent } as CSSProperties}
    aria-label={`كتاب ${title} بمظهر ثلاثي الأبعاد`}
  >
    <div className="book3d-volume">
      <span className="book3d-edge book3d-edge--spine" aria-hidden="true" />
      <span className="book3d-edge book3d-edge--pages" aria-hidden="true" />
      <span className="book3d-edge book3d-edge--top" aria-hidden="true" />
      <span className="book3d-edge book3d-edge--bottom" aria-hidden="true" />
      <div className="book3d-back" aria-hidden="true">
        {back ? <img src={back} alt="" loading="lazy" /> : <span className="book3d-back-inscription">{title}</span>}
      </div>
      <img className="book3d-front" src={cover} alt={`غلاف ${title}`} loading={variant === "feature" ? "eager" : "lazy"} />
      <span className="book3d-light" aria-hidden="true" />
    </div>
    <span className="book3d-floor" aria-hidden="true" />
  </div>;
}

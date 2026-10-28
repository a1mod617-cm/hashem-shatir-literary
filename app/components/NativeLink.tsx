import type { AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  prefetch?: boolean;
};

/**
 * Use ordinary browser navigation throughout the published site.
 * The hosting framework's client-side Link transition is unreliable in this
 * runtime: it throws during prefetch/navigation and silently blocks taps.
 * A native anchor works even if hydration or client-side routing fails.
 */
export default function NativeLink({ href, prefetch: _prefetch, ...props }: Props) {
  return <a {...props} href={href} />;
}

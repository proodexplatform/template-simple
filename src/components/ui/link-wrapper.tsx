// components/ui/link-wrapper.tsx
import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface LinkWrapperProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  "data-marker"?: string;
}

export const LinkWrapper = React.forwardRef<HTMLAnchorElement, LinkWrapperProps>(
  ({ href, children, className, "data-marker": wrapperMarker, ...props }, ref) => {
    const isInternalLink = href && href.startsWith("/");

    const mergeMarker = (childMarker?: string) => {
      const set = new Set<string>();
      if (wrapperMarker) wrapperMarker.split(";").map(s => s.trim()).filter(Boolean).forEach(s => set.add(s));
      if (childMarker) childMarker.split(";").map(s => s.trim()).filter(Boolean).forEach(s => set.add(s));
      return Array.from(set).join(";");
    };

    if (React.isValidElement(children)) {
      const childMarker = (children.props as any)?.["data-marker"];
      const merged = mergeMarker(childMarker) || undefined;

      const cloned = React.cloneElement(children, {
        ...children.props,
        ...props,
        ref,
        "data-marker": merged,
      });

      if (isInternalLink) {
        return (
          <Link to={href} className={cn("contents", className)} {...props}>
            {cloned}
          </Link>
        );
      } else {
        return (
          <a href={href} className={cn("contents", className)} ref={ref} {...props}>
            {cloned}
          </a>
        );
      }
    }

    // text/fragment
    const wrapperAttr: any = { className: cn("contents", className), ...props };
    if (wrapperMarker) wrapperAttr["data-marker"] = wrapperMarker;

    return isInternalLink ? (
      <Link to={href} ref={ref} {...wrapperAttr}>
        {children}
      </Link>
    ) : (
      <a href={href} ref={ref} {...wrapperAttr}>
        {children}
      </a>
    );
  }
);

LinkWrapper.displayName = "LinkWrapper";
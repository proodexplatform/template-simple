// components/ui/image.tsx
import * as React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  "data-marker"?: string;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(({ className, "data-marker": marker, ...props }, ref) => {
  return <img ref={ref} className={`rounded-md object-cover ${className || ""}`} data-marker={marker} {...props} />;
});

Image.displayName = "Image";
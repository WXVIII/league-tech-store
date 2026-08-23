import { cn } from "@/lib/utils";

import logoDark from "@/assets/league-logo-dark.png.asset.json";
import logoLight from "@/assets/league-logo-light.png.asset.json";

export function LeagueTechLogo({
  className,
  tone = "dark",
}: {
  className?: string;
  /** "dark" = dark mark for light backgrounds, "light" = white mark for dark backgrounds */
  tone?: "dark" | "light";
}) {
  return (
    <img
      src={tone === "light" ? logoLight.url : logoDark.url}
      alt="League Technologies"
      className={cn("h-8 w-auto select-none", className)}
      loading="eager"
      decoding="async"
    />
  );
}

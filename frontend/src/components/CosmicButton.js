import * as React from "react";
import { cn } from "../lib/utils";
import { cosmicButtonVariants } from "./ui/button-variants";

const CosmicButton = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(cosmicButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

CosmicButton.displayName = "CosmicButton";

export { CosmicButton };

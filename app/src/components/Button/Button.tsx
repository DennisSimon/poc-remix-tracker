import React from "react";
import { Button as MuiButton, ButtonProps, SxProps } from "@mui/material";
import { merge } from "lodash";

const containedSx: SxProps = {
  backgroundColor: "background.button",
  borderColor: "background.button",
  color: "text.link",
  textTransform: "none",
  ":hover": {
    backgroundColor: "background.buttonHover",
    borderColor: "background.buttonHover",
  },
};

const outlinedSx: SxProps = {
  borderColor: "background.button",
  color: "text.link",
  textTransform: "none",
  ":hover": {
    borderColor: "background.buttonHover",
  },
};

const textSx: SxProps = {
  color: "text.secondary",
  textTransform: "none",
};

const defaults = {
  contained: containedSx,
  outlined: outlinedSx,
  text: textSx,
};

export const Button = ({
  sx = {},
  variant = "contained",
  disableElevation,
  ...rest
}: ButtonProps) => {
  return (
    <MuiButton
      disableElevation={
        disableElevation !== undefined
          ? disableElevation
          : variant === "contained" || undefined
      }
      sx={merge(defaults[variant], sx)}
      {...rest}
      variant={variant}
    />
  );
};

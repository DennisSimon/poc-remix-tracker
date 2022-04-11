import React, { useCallback } from "react";
import { Card, CardContent, CardWithHeader } from "@Components";
import type { CardWithHeaderProps } from "../CardWithHeader/CardWithHeader";
import { useState } from "react";
import { theme } from "@Styles/victoryTheme";
import type { AppInfoResponse } from "src/api/zrxTrackerApi";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

type TopAppsCardProps = {
  data: AppInfoResponse | null;
} & CardWithHeaderProps;

function abbreviateNumber(value: number): string {
  const suffixes = ["", "k", "m", "b", "t"];
  let suffixNum = 0;
  let tempValue = value;
  while (tempValue >= 1000) {
    tempValue /= 1000;
    suffixNum++;
  }
  if (suffixNum === 0) {
    return value.toFixed(2);
  }
  const cutNum = 3 * suffixNum;
  return (value / 10 ** cutNum).toFixed(2) + suffixes[suffixNum];
}

export const TopAppsCard = ({ data, ...props }: TopAppsCardProps) => {
  return (
    <CardWithHeader
      {...props}
      content={
        <List>
          {data === null
            ? null
            : data.apps.map((app) => {
                return (
                  <ListItem key={app.id}>
                    <ListItemIcon>
                      <img
                        src={app.logoUrl}
                        height={50}
                        style={{ marginRight: 28, height: 50 }}
                        alt=""
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography fontWeight={800}>{app.name}</Typography>
                      <Typography>
                        ${abbreviateNumber(app.stats.tradeVolume.total)}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                );
              })}
        </List>
      }
    />
  );
};

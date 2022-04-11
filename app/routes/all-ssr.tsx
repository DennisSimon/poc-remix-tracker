import { Box, Grid } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { CardWithHeader } from "~/src/components";
import type { AppInfoResponse } from "~/src/components/api/zrxTrackerApi";
import {
  getAppInfoAsync,
  getNetworkInfoAsync,
} from "~/src/components/api/zrxTrackerApi";
import { LineCard } from "~/src/components/LineCard/LineCard";
import { TopAppsCard } from "~/src/components/TopAppsCard/TopAppsCard";

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

export const meta: MetaFunction = () => {
  return {
    title: "info.0x remix poc",
    description: "Welcome to the poc",
  };
};

type Data = {
  volume: string;
  trades: string;
  traders: string;
  avgTradeSize: string;
  chartData: { x: Date; y: number }[];
  performers: AppInfoResponse;
  dummyData1: string;
  dummyData2: string;
};

export const loader = async () => {
  const requests = [
    fetch("https://api.0xtracker.com/stats/network?period=month").then((res) =>
      res.json()
    ),
    fetch("https://api.0xtracker.com/stats/trader?period=month").then((res) =>
      res.json()
    ),
    getNetworkInfoAsync("hour", "day"),
    getAppInfoAsync(5, "day"),
  ];

  const [networkData, traderData, rawChartData, performers] = await Promise.all(
    requests
  );

  const chartData = rawChartData.map((item) => ({
    x: new Date(item.date),
    y: item.tradeVolume,
  }));

  const out: Data = {
    volume: `$${abbreviateNumber(networkData.tradeVolume)}`,
    trades: abbreviateNumber(networkData.tradeCount),
    traders: abbreviateNumber(traderData.traderCount),
    avgTradeSize: `$${abbreviateNumber(
      networkData.tradeVolume / networkData.tradeCount
    )}`,
    performers,
    chartData,
    dummyData1: "$10.9b",
    dummyData2: "5.42k",
  };

  return json(out);
};

export default function Index() {
  const {
    volume,
    trades,
    traders,
    avgTradeSize,
    performers,
    chartData,
    dummyData1,
    dummyData2,
  }: Data = useLoaderData();

  return (
    <Box>
      <Grid container columnSpacing={1} columns={12}>
        <Grid item xs={3}>
          <CardWithHeader header="Volume (30 D)" content={volume} />
        </Grid>
        <Grid item xs={3}>
          <CardWithHeader header="Trades (30 D)" content={trades} />
        </Grid>
        <Grid item xs={3}>
          <CardWithHeader header="Traders (30 D)" content={traders} />
        </Grid>
        <Grid item xs={3}>
          <CardWithHeader
            header="Avg Trade Size (30 D)"
            content={avgTradeSize}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} columns={2} sx={{ mt: 4 }}>
        <Grid item xs={1}>
          <CardWithHeader header="Test data" content={dummyData1} />
        </Grid>
        <Grid item xs={1}>
          <CardWithHeader header="Test data" content={dummyData2} />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} columns={12} sx={{ mt: 4 }}>
        <Grid item xs={7}>
          <LineCard data={chartData} header="Trading Metric (24 H)" />
        </Grid>
        <Grid item xs={5}>
          <TopAppsCard header="Top Performing Apps (24 H)" data={performers} />
        </Grid>
      </Grid>
    </Box>
  );
}

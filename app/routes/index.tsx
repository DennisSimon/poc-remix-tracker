import { Box, Grid } from "@mui/material";
import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from "react";
import { CardWithHeader } from "~/src/components";
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
};

export default function Index() {
  const [mainMetrics, setMainMetrics] = useState<{
    loading: boolean;
    data: Data | null;
  }>({ loading: true, data: null });
  const [data1, setdata1] = useState({ loading: true, data: null });
  const [data2, setdata2] = useState({ loading: true, data: null });

  const [chartData, setChartData] = useState({ loading: true, data: null });
  const [performers, setPerformers] = useState({ loading: true, data: null });

  useEffect(() => {
    const d1 = async () => {
      const requests = [
        fetch("https://api.0xtracker.com/stats/network?period=month").then(
          (res) => res.json()
        ),
        fetch("https://api.0xtracker.com/stats/trader?period=month").then(
          (res) => res.json()
        ),
        getNetworkInfoAsync("hour", "day"),
        getAppInfoAsync(5, "day"),
      ];
      const [networkData, traderData, rawChartData, rawPerformersData] =
        await Promise.all(requests);
      const metricData: Data = {
        volume: `$${abbreviateNumber(networkData.tradeVolume)}`,
        trades: abbreviateNumber(networkData.tradeCount),
        traders: abbreviateNumber(traderData.traderCount),
        avgTradeSize: `$${abbreviateNumber(
          networkData.tradeVolume / networkData.tradeCount
        )}`,
      };

      setMainMetrics(metricData);
      setdata1({ loading: false, data: "$10.9b" });
      setdata2({ loading: false, data: "5.42k" });
      const data = rawChartData.map((item) => ({
        x: new Date(item.date),
        y: item.tradeVolume,
      }));
      setChartData({ loading: false, data });
      setPerformers({ loading: false, data: rawPerformersData });
    };

    d1();
  }, []);

  return (
    <Box>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <Grid container columnSpacing={1} columns={12}>
        <Grid item xs={3}>
          <CardWithHeader
            header="Volume (30 D)"
            content={mainMetrics.data?.volume}
            loading={mainMetrics.loading}
          />
        </Grid>
        <Grid item xs={3}>
          <CardWithHeader
            header="Trades (30 D)"
            content={mainMetrics.data?.trades}
            loading={mainMetrics.loading}
          />
        </Grid>
        <Grid item xs={3}>
          <CardWithHeader
            header="Traders (30 D)"
            content={mainMetrics.data?.traders}
            loading={mainMetrics.loading}
          />
        </Grid>
        <Grid item xs={3}>
          <CardWithHeader
            header="Avg Trade Size (30 D)"
            content={mainMetrics.data?.avgTradeSize}
            loading={mainMetrics.loading}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} columns={2} sx={{ mt: 4 }}>
        <Grid item xs={1}>
          <CardWithHeader
            header="Test data"
            content={data1.data}
            loading={data1.loading}
          />
        </Grid>
        <Grid item xs={1}>
          <CardWithHeader
            header="Test data"
            content={data2.data}
            loading={data2.loading}
          />
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} columns={12} sx={{ mt: 4 }}>
        <Grid item xs={7}>
          <LineCard
            data={chartData.data}
            loading={chartData.loading}
            header="Trading Metric (24 H)"
          />
        </Grid>
        <Grid item xs={5}>
          <TopAppsCard
            header="Top Performing Apps (24 H)"
            data={performers.data}
            loading={performers.loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

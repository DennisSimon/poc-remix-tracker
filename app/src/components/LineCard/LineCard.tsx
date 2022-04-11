import React, { useCallback } from "react";
import { Card, CardContent, CardWithHeader } from "@Components";
import type { CardWithHeaderProps } from "../CardWithHeader/CardWithHeader";
import {
  VictoryArea,
  VictoryAxis,
  VictoryBrushContainer,
  VictoryChart,
  VictoryContainer,
  VictoryLine,
  VictoryZoomContainer,
} from "victory";
import { useState } from "react";
import { theme } from "@Styles/victoryTheme";

type Data = {
  x: Date;
  y: number;
};

type LineCardProps = {
  data: Data[] | null;
} & CardWithHeaderProps;

type DomainTuple = [number, number] | [Date, Date];

function abbreviateNumber(value: number): string {
  const suffixes = ["", "k", "m", "b", "t"];
  let suffixNum = 0;
  let tempValue = value;
  while (tempValue >= 1000) {
    tempValue /= 1000;
    suffixNum++;
  }
  if (suffixNum === 0) {
    return value.toFixed(1);
  }
  const cutNum = 3 * suffixNum;
  return (value / 10 ** cutNum).toFixed(1) + suffixes[suffixNum];
}

const LineChart = ({ data }: { data: Data[] }) => {
  const [zoomDomain, setZoomDomain] = useState<{
    x?: DomainTuple;
    y?: DomainTuple;
  }>();
  const [selectedDomain, setSelectedDomain] = useState<{
    x?: DomainTuple;
    y?: DomainTuple;
  }>();

  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useCallback((node) => {
    if (node !== null) {
      setBoundingRect(node.getBoundingClientRect());
    }
  }, []);

  return (
    <div style={{ width: "100%" }} ref={graphRef}>
      <VictoryChart
        theme={theme}
        height={300}
        width={boundingRect.width}
        scale={{ x: "time" }}
        containerComponent={
          <VictoryZoomContainer
            responsive={false}
            height={300}
            zoomDimension="x"
            zoomDomain={zoomDomain}
            onZoomDomainChange={(domain) => setSelectedDomain(domain)}
          />
        }
      >
        <VictoryArea
          data={data}
          style={{ data: { fill: "#00AE99" } }}
          animate
        />
        <VictoryAxis />
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => abbreviateNumber(t)}
          width={60}
        />
      </VictoryChart>
      <VictoryChart
        height={90}
        width={boundingRect.width}
        theme={theme}
        scale={{ x: "time" }}
        padding={{ top: 0, left: 50, right: 50, bottom: 30 }}
        prependDefaultAxes={false}
        containerComponent={
          <VictoryBrushContainer
            responsive={false}
            height={90}
            brushDimension="x"
            brushDomain={selectedDomain}
            onBrushDomainChange={(domain) => setZoomDomain(domain)}
          />
        }
      >
        <VictoryArea data={data} style={{ data: { fill: "#00AE99" } }} />
        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fill: "transparent" },
          }}
        />
      </VictoryChart>
    </div>
  );
};

export const LineCard = ({ data, ...props }: LineCardProps) => {
  return (
    <CardWithHeader
      {...props}
      content={data === null ? null : <LineChart data={data} />}
    />
  );
};

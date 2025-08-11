/*
 * Copyright (c) 2024.  Botts Innovative Research, Inc.
 * All Rights Reserved
 *
 * opensensorhub/osh-viewer is licensed under the
 *
 * Mozilla Public License 2.0
 * Permissions of this weak copyleft license are conditioned on making available source code of licensed
 * files and modifications of those files under the same license (or in certain cases, one of the GNU licenses).
 * Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.
 * However, a larger work using the licensed work may be distributed under different terms and without
 * source code for files added in the larger work.
 *
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Mode } from "osh-js/source/core/datasource/Mode";
import ChartJsView from "osh-js/source/core/ui/view/chart/ChartJsView.js";
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer.js";
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer";
import ConSysApi from "osh-js/source/core/datasource/consysapi/ConSysApi.datasource";
import { EventType } from "osh-js/source/core/event/EventType";
import { OSH_API_HOST } from "./config";

// Slider imports
import { Box, IconButton, Portal, Stack, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Format timestamp as LocaleTimeString
 * @param timestamp
 * @returns
 */
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export default function ReplayCharts() {
  // Endpoint URL and sensor ID values
  const server = OSH_API_HOST;
  const sensorId = "oa3ogh84spqo0";

  // Time controller states
  const [isPlaying, setIsPlaying] = useState<boolean>(true); // Update to false to start paused
  const [minTime, setMinTime] = useState<number | null>(null);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);

  // Time range values
  const startTime = "2025-08-01T15:41:49.989Z";
  const endTime = "2025-08-06T18:07:57Z";

  // Data syncrhonizer
  const dataSynchronizer = useRef<typeof DataSynchronizer>();

  const handleSliderChange = (_: Event, newVal: number) => {
    const value = Array.isArray(newVal) ? newVal[0] : newVal;
    setIsScrubbing(true);
    setCurrentTime(value);
  };

  const handleSliderCommitted = useCallback(
    async (e: Event, value: number | number[]) => {
      // handleCommitChange(event, value as number);
      console.log("New val:", value);
      setIsScrubbing(false);

      // Set new start time for data synchronizer
      dataSynchronizer.current.dataSynchronizerReplay.setStartTime(
        value as number,
        false
      );
    },
    [dataSynchronizer]
  );

  const handlePlaying = () => {
    if (isPlaying) {
      if (dataSynchronizer.current) {
        dataSynchronizer.current.disconnect();
      }
    } else {
      if (dataSynchronizer.current) {
        dataSynchronizer.current.connect();
      }
    }

    setIsPlaying(!isPlaying);
  };

  // Set mix/max times
  // Set current time to start time
  useEffect(() => {
    if (startTime && endTime) {
      setMinTime(new Date(startTime).getTime());
      setMaxTime(new Date(endTime).getTime());
      setCurrentTime(new Date(startTime).getTime());
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (!isScrubbing && typeof syncTime === "number") setCurrentTime(syncTime);
  }, [syncTime, isScrubbing]);

  useEffect(() => {
    let dht22DataSource = new ConSysApi("DHT22", {
      id: sensorId,
      protocol: "ws",
      endpointUrl: server,
      resource: `/datastreams/${sensorId}/observations`,
      startTime: startTime,
      endTime: endTime,
      mode: Mode.REPLAY,
    });

    // Define temperature curve layer
    let temperatureCurve = new CurveLayer({
      dataSourceId: dht22DataSource.id,
      getValues: (rec: any, timestamp: any) => {
        console.log(rec);
        console.log(timestamp);
        return {
          x: timestamp,
          y: rec.temperature,
        };
      },
      lineColor: "rgba(255,0,0,0.5)",
      fill: true,
      backgroundColor: "rgba(169,212,255,0.5)",
      maxValues: 25,
      name: "Temperature (Cel)",
    });

    // Define humidity curve layer
    let humidityCurve = new CurveLayer({
      dataSourceId: dht22DataSource.id,
      getValues: (rec: any, timestamp: any) => {
        return {
          x: timestamp,
          y: rec.humidity,
        };
      },
      lineColor: "rgba(0, 219, 44, 0.5)",
      fill: true,
      backgroundColor: "rgba(169,212,255,0.5)",
      maxValues: 25,
      name: "Humidity (%)",
    });

    // Temperature chart setup
    let temperatureChartView = new ChartJsView({
      container: "temperature-container",
      layers: [temperatureCurve],
      css: "chart-view",
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: "Temperature (Cel)",
              padding: 20,
            },
          },
        },
      },
      datasetOptions: {
        tension: 0.2,
      },
    });

    // Humidity chart setup
    let humidityChartView = new ChartJsView({
      container: "humidity-container",
      layers: [humidityCurve],
      css: "chart-view",
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: "Temperature (Cel)",
              padding: 20,
            },
          },
        },
      },
      datasetOptions: {
        tension: 0.2,
      },
    });

    // Init data synchronizer
    dataSynchronizer.current = new DataSynchronizer({
      replaySpeed: 10.0,
      startTime: startTime,
      endTime: endTime,
      dataSources: [dht22DataSource],
    });

    // Connect data synchronizer
    dataSynchronizer.current.connect();
  }, [dataSynchronizer]);

  useEffect(() => {
    if (dataSynchronizer.current) {
      dataSynchronizer.current.subscribe(
        (message: { type: any; timestamp: any }) => {
          if (message.type === EventType.MASTER_TIME) {
            setSyncTime(message.timestamp);
          }
        },
        [EventType.MASTER_TIME]
      );
    }
  }, [dataSynchronizer.current]);

  return (
    <div>
      <div style={{ display: "flex", height: "75%", margin: "2%" }}>
        <div
          id="temperature-container"
          style={{ width: "50%", height: "90%", zIndex: 5 }}
        ></div>
        <div
          id="humidity-container"
          style={{ width: "50%", height: "90%", zIndex: 5 }}
        ></div>
      </div>
      <Slider
        aria-labelledby="time-indicator"
        value={currentTime}
        min={minTime}
        max={maxTime}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommitted}
        valueLabelDisplay="off"
      ></Slider>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        width={100}
      >
        <IconButton onClick={handlePlaying}>
          {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
        <Typography variant={"body1"}>
          {formatTime(currentTime)} / {formatTime(maxTime)}
        </Typography>
      </Stack>
    </div>
  );
}

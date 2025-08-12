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
import {
  Box,
  Grid,
  IconButton,
  Portal,
  Stack,
  Typography,
} from "@mui/material";
import Slider from "@mui/material/Slider";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { grey } from "@mui/material/colors";

/**
 * Format timestamp as LocaleTimeString
 * @param timestamp
 * @returns
 */
export const formatTime = (timestamp: number): string[] => {
  const obj = new Date(timestamp);
  const date = obj.toLocaleDateString("en-US");
  const time = obj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return [date, time];
};

export default function ReplayCharts() {
  // Endpoint URL and sensor ID values
  const server = OSH_API_HOST;
  const sensorId = "oa3ogh84spqo0";

  // Time range values
  const startTime = "2025-08-01T15:41:49.989Z";
  const endTime = "2025-08-06T18:07:57Z";
  const minDistance = 300000; // 5 minute minimum distance

  // Time controller states
  const [currentRange, setCurrentRange] = useState<number[] | null>(null); // Values used for current time controller range
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [minTime, setMinTime] = useState<number | null>(null);
  const [maxTime, setMaxTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null); // Value used to display current time
  const [syncTime, setSyncTime] = useState<number | null>(null);
  const [isScrubbing, setIsScrubbing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Data syncrhonizer
  const dataSynchronizer = useRef<typeof DataSynchronizer>();

  // Handle slider range change
  const handleSliderChange = (
    e: Event,
    newVal: number[],
    activeThumb: number
  ) => {
    setIsScrubbing(true);

    // Handle min distance for min or max time thumbs
    if (activeThumb === 0) {
      setCurrentRange([
        Math.min(newVal[0], currentRange[1] - minDistance),
        currentRange[1],
      ]);
      setCurrentTime(Math.min(newVal[0], currentRange[1] - minDistance));
    } else {
      setCurrentRange([
        currentRange[0],
        Math.max(newVal[1], currentRange[0] + minDistance),
      ]);
      setCurrentTime(newVal[0]);
    }
  };

  // Handle committed slider range values
  const handleSliderCommitted = useCallback(
    async (e: Event, value: number[]) => {
      console.log("New val:", value);
      setIsScrubbing(false);

      // If start time changed, reconnect data synchronizer
      if (
        dataSynchronizer.current.dataSynchronizerReplay.getStartTimeAsTimestamp() !=
        value[0]
      ) {
        setIsLoading(true);
        dataSynchronizer.current.disconnect();
        // Set new start time for data synchronizer
        dataSynchronizer.current.dataSynchronizerReplay.setStartTime(
          value[0] as number,
          false
        );
        dataSynchronizer.current.connect();
        setIsLoading(false);
      }
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
  // Set default time slider range
  // Set current time to start time
  useEffect(() => {
    if (startTime && endTime) {
      setMinTime(new Date(startTime).getTime());
      setMaxTime(new Date(endTime).getTime());
      setCurrentTime(new Date(startTime).getTime());
      setCurrentRange([
        new Date(startTime).getTime(),
        new Date(endTime).getTime(),
      ]);
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
    <Grid container>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          zIndex: 9999,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
      <Box
        style={{ display: "flex", height: "75%", width: "100%", margin: "2%" }}
      >
        <div
          id="temperature-container"
          style={{ width: "50%", height: "90%", zIndex: 5 }}
        ></div>
        <div
          id="humidity-container"
          style={{ width: "50%", height: "90%", zIndex: 5 }}
        ></div>
      </Box>
      <Slider
        aria-labelledby="time-indicator"
        value={currentRange}
        min={minTime}
        max={maxTime}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommitted}
        valueLabelDisplay="off"
        disableSwap
        sx={{
          width: "90%",
        }}
      ></Slider>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"start"}
        gap={2}
      >
        <IconButton onClick={handlePlaying}>
          {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
        </IconButton>
        <Stack direction={"column"} alignItems={"center"}>
          <Typography variant={"body1"}>
            {formatTime(currentTime)[0]}
          </Typography>
          <Typography variant={"body1"}>
            {formatTime(currentTime)[1]}
          </Typography>
        </Stack>
        <Typography variant={"body1"}>/</Typography>
        <Stack direction={"column"} alignItems={"center"}>
          <Typography variant={"body1"}>{formatTime(maxTime)[0]}</Typography>
          <Typography variant={"body1"}>{formatTime(maxTime)[1]}</Typography>
        </Stack>
      </Stack>
    </Grid>
  );
}

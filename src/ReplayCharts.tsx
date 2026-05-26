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
//import { OSH_API_HOST } from "./config";

// Slider imports
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import CircularProgress from "@mui/material/CircularProgress";
import { TabProps } from "./App";

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

export default function ReplayCharts(props: TabProps) {
  // Endpoint URL and sensor ID values
  //const server = OSH_API_HOST;
  const sensorId = props.sensorId;

  // Time range values
  const startTime = props.startTime;
  const endTime = props.endTime;
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
    setIsPlaying(false);

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
      setIsScrubbing(false);
      setIsPlaying(true);
      setIsLoading(true);

      dataSynchronizer.current.disconnect();
      // Set new start time for data synchronizer
      dataSynchronizer.current.dataSynchronizerReplay.setStartTime(
        value[0] as number,
        false
      );
      dataSynchronizer.current.connect();
      setIsLoading(false);
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
      let audioDataSource = new ConSysApi("audio",{
              id: "0258jl5eicug",
              protocol: "ws",
              endpointUrl: "/localhost:8181/sensorhub/api",
              resource: '/datastreams/0258jl5eicug/observations',
              mode: Mode.REAL_TIME,
          });

           let audioView = new AudioView({
               name: "Audio",
               css: 'audio-css',
               container: 'audio-chart-container',
               dataSource: audioDataSource,
               gain: 5,
               playSound: false
              });

              const audioSpectrogramVisualizer = new AudioSpectrogramVisualizer({
                  fftSize: 2048,
                  container: "audio-spectrogram",
                  sampleField: 'samples',
                  colorScale: 'jet',
              });
//     let dht22DataSource = new ConSysApi("DHT22", {
//       id: sensorId,
//       protocol: "ws",
//       endpointUrl: server,
//       resource: `/datastreams/${sensorId}/observations`,
//       startTime: startTime,
//       endTime: endTime,
//       mode: Mode.REPLAY,
//     });

    // Define temperature curve layer
//     let temperatureCurve = new CurveLayer({
//       dataSourceId: dht22DataSource.id,
//       getValues: (rec: any, timestamp: any) => {
//         console.log(rec);
//         console.log(timestamp);
//         return {
//           x: timestamp,
//           y: rec.temperature,
//         };
//       },
//       lineColor: "rgba(255,0,0,0.5)",
//       fill: true,
//       backgroundColor: "rgba(169,212,255,0.5)",
//       maxValues: 25,
//       name: "Temperature (Cel)",
//     });

    // Define humidity curve layer
//     let humidityCurve = new CurveLayer({
//       dataSourceId: dht22DataSource.id,
//       getValues: (rec: any, timestamp: any) => {
//         return {
//           x: timestamp,
//           y: rec.humidity,
//         };
//       },
//       lineColor: "rgba(0, 219, 44, 0.5)",
//       fill: true,
//       backgroundColor: "rgba(169,212,255,0.5)",
//       maxValues: 25,
//       name: "Humidity (%)",
//     });

    // Temperature chart setup
//     let temperatureChartView = new ChartJsView({
//       container: "rp-temperature-container",
//       layers: [temperatureCurve],
//       css: "chart-view",
//       options: {
//         scales: {
//           y: {
//             title: {
//               display: true,
//               text: "Temperature (Cel)",
//               padding: 20,
//             },
//           },
//         },
//       },
//       datasetOptions: {
//         tension: 0.2,
//       },
//     });

    // Humidity chart setup
//     let humidityChartView = new ChartJsView({
//       container: "rp-humidity-container",
//       layers: [humidityCurve],
//       css: "chart-view",
//       options: {
//         scales: {
//           y: {
//             title: {
//               display: true,
//               text: "Temperature (Cel)",
//               padding: 20,
//             },
//           },
//         },
//       },
//       datasetOptions: {
//         tension: 0.2,
//       },
//     });

    // Init data synchronizer
    dataSynchronizer.current = new DataSynchronizer({
      replaySpeed: 10.0,
      startTime: startTime,
      endTime: endTime,
      dataSources: [audioDataSource],
    });

    // Connect data synchronizer
    //dataSynchronizer.current.connect();

    // Cleanup on unmount
    return () => {
      if (dataSynchronizer.current) {
        dataSynchronizer.current.disconnect();
        dataSynchronizer.current = undefined;
      }
      audioDataSource.disconnect();
      audioView.destroy();
      audioSpectrogramVisualizer.destroy();
    };
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
    <Grid
      container
      sx={{ height: "100%", p: 4 }}
      justifyContent={"start"}
      alignItems={"flex-start"}
      spacing={2}
    >
      <Box
        sx={{
          position: "absolute",
          display: isLoading ? "flex" : "none",
          zIndex: 9999,
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
      <Grid
        container
        sx={{ height: "60%", width: "100%" }}
        spacing={0}
        justifyContent={"center"}
      >
        <div id="audio-chart-container" style={{ width: "50%" }}></div>
        <div id="audio-spectrogram" style={{ width: "50%" }}></div>
      </Grid>
      <Stack direction={"column"} width={"100%"}>
        <Slider
          aria-labelledby="time-indicator"
          value={currentRange}
          min={minTime}
          max={maxTime}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderCommitted}
          valueLabelDisplay="auto"
          valueLabelFormat={(val) => {
            return formatTime(val)[0] + " " + formatTime(val)[1];
          }}
          disableSwap
          sx={{
            width: "100%",
          }}
        ></Slider>
        <Stack
          direction={"row"}
          alignItems={"start"}
          justifyContent={"start"}
          gap={2}
          width={"100%"}
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
      </Stack>
    </Grid>
  );
}

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

import React, { useEffect } from "react";
import { Mode } from "osh-js/source/core/datasource/Mode";
import ChartJsView from "osh-js/source/core/ui/view/chart/ChartJsView.js";
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer.js";
import ConSysApi from "osh-js/source/core/datasource/consysapi/ConSysApi.datasource";
// import { OSH_API_HOST } from "./config";
import { TabProps } from "./App";
import { Grid } from "@mui/material";
import AudioView from "osh-js/source/core/ui/view/audio/AudioView";
import AudioSpectrogramVisualizer from "osh-js/source/core/ui/view/audio/visualizer/spectrogram/AudioSpectrogramVisualizer";


export default function RealtimeCharts(props: TabProps) {
  // Endpoint URL and sensor ID values
//   const server = OSH_API_HOST;
  const sensorId = props.sensorId;

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
        audioDataSource.connect();

  }, []);

  return (
    <Grid container sx={{ height: "100%", p: 4 }}>
      <div id="audio-chart-container" style={{ width: "50%" }}></div>
    </Grid>
  );
}

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

import React, { SyntheticEvent, useEffect, useState } from "react";
import { Mode } from "osh-js/source/core/datasource/Mode";
import ChartJsView from "osh-js/source/core/ui/view/chart/ChartJsView.js";
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer.js";
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer";
import ConSysApi from "osh-js/source/core/datasource/consysapi/ConSysApi.datasource";
import { OSH_API_HOST } from "./config";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import RealtimeCharts from "./RealtimeCharts";
import BatchCharts from "./BatchCharts";
import ReplayCharts from "./ReplayCharts";

export interface TabProps {
  sensorId: string;
  startTime?: string;
  endTime?: string;
}

export default function App() {
  // Endpoint URL and sensor ID values
  const sensorId = "oa3ogh84spqo0";

  // Time range values
  const startTime = "2025-08-01T15:41:49.989Z";
  const endTime = "2025-08-06T18:07:57Z";

  const [tab, setTab] = useState<number>(0);

  const handleChange = (e: SyntheticEvent, value: number) => {
    setTab(value);
  };

  return (
    <Grid container direction="column" height={"100%"}>
      <Grid item sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="chart option tabs"
          centered
        >
          <Tab label="Realtime" />
          <Tab label="Batch" />
          <Tab label="Replay" />
        </Tabs>
      </Grid>
      <Grid item sx={{ flex: 1 }}>
        {tab == 0 ? (
          <RealtimeCharts sensorId={sensorId} />
        ) : tab == 1 ? (
          <BatchCharts
            sensorId={sensorId}
            startTime={startTime}
            endTime={endTime}
          />
        ) : (
          <ReplayCharts
            sensorId={sensorId}
            startTime={startTime}
            endTime={endTime}
          />
        )}
      </Grid>
    </Grid>
  );
}

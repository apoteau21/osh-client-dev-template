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

import React, { SyntheticEvent, useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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
  const sensorId = "03mtl1uill10";

  // Time range values
  const startTime = "2025-08-01T15:41:49.989Z";
  const endTime = "2025-08-01T18:04:08.839Z";

  const [tab, setTab] = useState<number>(0);

  const handleChange = (e: SyntheticEvent, value: number) => {
    setTab(value);
  };

  return (
    <Router>
      <Grid container direction="column" height={"100%"}>
        <Grid item sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="chart option tabs"
            centered
          >
            <Tab label="Realtime" value={0} component={Link} to="/" />
            <Tab label="Batch" value={1} component={Link} to="/batch" />
            <Tab label="Replay" value={2} component={Link} to="/replay" />
          </Tabs>
        </Grid>
        <Grid item sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<RealtimeCharts sensorId={sensorId} />} />
            <Route
              path="/replay"
              element={
                <ReplayCharts
                  sensorId={sensorId}
                  startTime={startTime}
                  endTime={endTime}
                />
              }
            />
            <Route
              path="/batch"
              element={
                <BatchCharts
                  sensorId={sensorId}
                  startTime={startTime}
                  endTime={endTime}
                />
              }
            />
          </Routes>
        </Grid>
      </Grid>
    </Router>
  );
}

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


export default function BatchCharts(props: TabProps) {
  // Endpoint URL and sensor ID values
//   const server = OSH_API_HOST;
  const sensorId = props.sensorId;

  // Time range values
  const startTime = props.startTime;
  const endTime = props.endTime;

  useEffect(() => {



//     let dht22DataSource = new ConSysApi("DHT22", {
//       id: sensorId,
//       protocol: "ws",
//       endpointUrl: server,
//       resource: `/datastreams/${sensorId}/observations`,
//       startTime: startTime,
//       endTime: endTime,
//       mode: Mode.BATCH,
//     });

  }, []);

  return (
    <Grid container sx={{ height: "100%", p: 4 }}>

    </Grid>
  );
}

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
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import ChartJsView from "osh-js/source/core/ui/view/chart/ChartJsView.js";
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer.js";
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer";
import ConSysApi from "osh-js/source/core/datasource/consysapi/ConSysApi.datasource";
import { OSH_API_HOST } from "./config";

export default function RealtimeCharts() {
  // Endpoint URL and sensor ID values
  const server = OSH_API_HOST;
  const sensorId = "oa3ogh84spqo0";

  useEffect(() => {
    let dht22DataSource = new ConSysApi("DHT22", {
      id: sensorId,
      protocol: "ws",
      endpointUrl: server,
      resource: `/datastreams/${sensorId}/observations`,
      mode: Mode.REAL_TIME,
    });

    // Define temperature curve layer
    let temperatureCurve = new CurveLayer({
        dataSourceId: dht22DataSource.id,
        getValues: (rec: any, timestamp: any) => {
            console.log(rec);
            console.log(timestamp)
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

    dht22DataSource.connect();
  }, []);

  return (
    <div style={{ display: "flex", height: "100%", margin: "2%" }}>
      <div
        id="temperature-container"
        style={{ width: "50%", height: "90%" }}
      ></div>
      <div
        id="humidity-container"
        style={{ width: "50%", height: "90%" }}
      ></div>
    </div>
  );
}

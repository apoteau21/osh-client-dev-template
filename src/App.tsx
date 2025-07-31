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
import { EventType } from "osh-js/source/core/event/EventType";

export default function App() {
  const server = "23.28.235.27:8181/sensorhub/api";
  const sensorId = "oa3ogh84spqo0";

  useEffect(() => {
    let dht22DataSource = new SweApi("DHT22", {
      id: sensorId,
      protocol: "ws",
      endpointUrl: server,
      resource: `/datastreams/${sensorId}/observations`,
    //   startTime: "now",
    //   endTime: "2055-01-01Z",
      mode: Mode.REAL_TIME,
    });

    // Define temperature curve layer
    let temperatureCurve = new CurveLayer({
      dataSourceId: dht22DataSource.id,
      getValues: (rec: any) => {
        console.log(rec);
        return {
          x: rec.timestamp,
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
        getValues: (rec: any) => {
          return {
            x: rec.timestamp,
            y: rec.humidity,
          };
        },
        lineColor: "rgba(0, 219, 44, 0.5)",
        fill: true,
        backgroundColor: "rgba(169,212,255,0.5)",
        maxValues: 25,
        name: "Humidity (%)",
      });

    // Chart setup
    let chartView = new ChartJsView({
      container: "temperature-container",
      layers: [temperatureCurve, humidityCurve],
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

    // dht22DataSource.subscribe(
    //   (message: any) => {
    //     let messageValues = message.values[0].data;
    //     console.log(message);
    //   },
    //   [EventType.DATA]
    // );

    dht22DataSource.connect();
  }, []);

  return (
    <div
      id="temperature-container"
      style={{ width: "100%", height: "90%", zIndex: 5 }}
    ></div>
  );
}

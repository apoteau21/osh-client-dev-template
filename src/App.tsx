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

import React, { useEffect, useMemo, useRef } from "react";
import { Cartesian3, Ion, SceneMode, Terrain, } from "@cesium/engine";
import "@cesium/engine/Source/Widget/CesiumWidget.css";
import CesiumView from "osh-js/source/core/ui/view/map/CesiumView.js";
import DataSynchronizer from 'osh-js/source/core/timesync/DataSynchronizer';
import { Mode } from "osh-js/source/core/datasource/Mode";
import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer";
import PolygonLayer from "osh-js/source/core/ui/layer/PolygonLayer";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import VideoDataLayer from "osh-js/source/core/ui/layer/VideoDataLayer";
import VideoView from "osh-js/source/core/ui/view/video/VideoView";

export default function App() {
    // A Cesium Ion access token can be obtained for free from https://ion.cesium.com/.
    // Do not commit your access token to a public repository.
    // Ion.defaultAccessToken = '';

    const server = "osh-dev.botts-inc.com:8443/sensorhub/api";

//     const start = useMemo(() => new Date((Date.now() - 600000)).toISOString(), []);
//     const end = "2024-12-31T23:59:59Z";
    const secure = true;
    const REPLAY_SPEED = 1.0;

    const cesiumContainer = useRef(null);
    const videoContainer = useRef(null);

    // --------------------- DATA SOURCES ---------------------------

    // beast kit -------------------------------
//
//     const bkAOADataSource = useMemo(() => new SweApi('Beast-Kit-AOA', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/orb73vatusoa2/observations',
//         tls: secure,
//         startTime: "2024-04-23T12:23:28.9Z",
//         endTime: "2024-04-25T18:18:15Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);
//
//     const bkGPSDataSource = useMemo(() => new SweApi('Beast-Kit-GPS', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/0raf5gs7iedgm/observations',
//         tls: secure,
//         startTime: "2024-04-23T12:24:48Z",
//         endTime: "2024-04-25T18:18:15Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

    // kraken -------------------------------------------

//     no data??
//     const krakenAOADataSource = useMemo(() => new SweApi('Kraken-AOA', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/[replace]/observations',
//         tls: secure,
//         startTime: "",
//         endTime: "",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

//     const krakenGPSDataSource = useMemo(() => new SweApi('Kraken-GPS', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/cbmgng06q8hfi/observations',
//         tls: secure,
//         startTime: "2024-04-23T16:49:02Z",
//         endTime: "2024-04-23T17:04:44Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

    // misb uas cpi 24 ------------------------------------------------------

//     const misbVideoDataSource = useMemo(() => new SweApi('MISB-UAS-Video', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/c2u1058huoehq/observations',
//         tls: secure,
//         startTime: "1970-01-01T00:00:13.945999999Z",
//         endTime: "2024-04-25T18:48:41Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

    // skybeast --------------------------------------------

//     const sbAOADataSource = useMemo(() => new SweApi('Sky-Beast-AOA', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/6q2d64tm3tjnq/observations',
//         tls: secure,
//         startTime: "2024-04-25T12:36:53.5Z",
//         endTime: "2024-04-25T18:18:15Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//
//     }), []);
//
//     const sbGPSDataSource = useMemo(() => new SweApi('',{
//         protocol: "wss",
//         endpointUrl: server,
//         resource: 'datastreams/no2l5otn10sl6/observations',
//         tls: secure,
//         startTime: "2024-04-24T16:51:56Z",
//         endTime: "2024-04-25T18:21:19Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

    // osh ptz ---------------------------------------------

    // not a lot of data here
//     const oshPTZLocDataSource = useMemo(() => new SweApi('OSH-PTZ-Location', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/kqka25snd5o8c/observations',
//         tls: secure,
//         startTime: "2024-04-25T15:58:41.947Z",
//         endTime: "2024-04-25T17:11:38Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

    const oshPTZVideoSource = new SweApi('OSH-PTZ-Video-Camera', {
        protocol: "wss",
        endpointUrl:  server,
        resource: '/datastreams/k992mhd5jr7ri/observations',
        tls: secure,
        startTime: "2024-04-25T15:43:53.006Z",
        endTime: "2024-04-25T16:43:53.006Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
        });

    // raavak ----------------------------------

//     const raavakLocDataSource = useMemo(() => new SweApi("RAAVAK-Location", {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: `/datastreams/${locationInfoDsId}/observations`,
//         startTime: "2024-04-24T16:55:58Z",
//         endTime: "2024-04-24T17:00:57Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+json',
//         tls: secure
//     }), []);
//
//     const raavakPointMarker = useMemo(() => new PointMarkerLayer({
//             labelOffset: [0, -30],
//             getLocation: {
//                 dataSourceIds: [raavakLocDataSource.getId()],
//                 handler: function (rec: any) {
//                     return {
//                         x: rec.location.lon,
//                         y: rec.location.lat,
//                         z: rec.location.alt
//                     }
//                 }
//
//             },
//             getOrientation: {
//                 dataSourceIds: [raavakLocDataSource.getId()],
//                 handler: function (rec: any) {
//                     return {
//                         heading: rec.att.heading - 90.0
//                     }
//                 }
//             },
//             icon: 'images/uav.glb',
//             iconSize: [32, 64],
//             name: "RAAVAK Location",
//             label: "RAAVAK",
//             iconScale: .05,
//             color: '#FF8000'
//         }), [raavakLocDataSource]);

    // sos android ----------------------------------------------

//     const androidGPSDataSource = useMemo(() => new SweApi('SOS-Android-GPS', {
//         protocol: "wss",
//         endpointUrl:  server,
//         resource: '/datastreams/qmgmbqvg998f0/observations',
//         tls: secure,
//         startTime: "2024-04-25T17:00:23.463Z",
//         endTime: "2024-04-25T17:27:06Z",
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);
//
//     const androidEulerDataSource = useMemo(() => new SweApi('SOS-Android-Euler', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/2c1ev1nm3gkf4/observations',
//         tls: secure,
//         startTime: '2024-04-25T16:29:48.831Z',
//         endTime: '2024-04-25T18:06:36Z',
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

    // android trupulse ---------------------------

//     const androidTrupulseDataSource = useMemo(() => new SweApi('', {
//         protocol: "wss",
//         endpointUrl: server,
//         resource: '/datastreams/gmq44r1ovilum/observations',
//         tls: secure,
//         startTime: '2024-04-25T16:29:53.462Z',
//         endTime: '2024-04-25T17:26:47Z',
//         mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
//     }), []);

// -------------------------------------------------------------------------

    /**
     * Data Sources
     *
     * @remarks This array contains all the data sources that will be used by the master time controller.
     */
    const dataSources = useMemo(() => {
        return [
            oshPTZVideoSource
        ];
    }, [oshPTZVideoSource]);
    //#endregion

    /**
     * Video Data Layer
     *
     * @remarks This layer will be used by the video view to display a video stream.
     */
    const videoDataLayer = useMemo(() => new VideoDataLayer({
        dataSourceId: [oshPTZVideoSource.getId()],
        getFrameData: (rec: any) => {
            return rec.img
        },
        getTimestamp: (rec: any) => {
            return rec.timestamp
        }
    }), [oshPTZVideoSource]);
    oshPTZVideoSource.connect();
    //raavakLocDataSource.connect();

    //#endregion

    /**
     * Master Time Controller
     *
     * @remarks This object will synchronize all the data sources and control the replay speed.
     */
    const masterTimeController = useMemo(() => new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: [oshPTZVideoSource]
        }), [oshPTZVideoSource]);


    // popup window for ptz video
    useEffect(() => {
        const ptzWindow = window.open(
            '',
            'PTZVideoWindow',
            'width=640,height=480,resizable,scrollbars'
        );

        if (!ptzWindow) {
            console.error("PTZ Popup blocked!");
            return;
        }
    ptzWindow.document.write(`
        <html>
          <head>
            <title>OSH PTZ Video</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: black;
              }
              #videoContainer {
                width: 100%;
                height: 100%;
              }
            </style>
          </head>
          <body>
            <div id="videoContainer"></div>
          </body>
        </html>
      `);

      ptzWindow.document.close();

      setTimeout(() => {
        const ptzVideoContainer = ptzWindow.document.getElementById('videoContainer');
        if (ptzVideoContainer) {
          new VideoView({
            container: ptzVideoContainer.id,
            css: 'video-h264',
            name: "OSH PTZ Video",
            framerate: 25,
            showTime: false,
            showStats: false,
            layers: [videoDataLayer]
          });
        }
      }, 100);

    }, [videoDataLayer]);


    // Start streaming
    useEffect(() => {
        masterTimeController.connect();
    }, [])

    return (
        <div id="container">
            <div id="left">
                <div id="cesium-container" ref={videoContainer}></div>
            </div>
            <div id="right">
                <div className="title">UAV Video Stream</div>
                <div id="video-window" ref={videoContainer}></div>
            </div>
        </div>
    );
};
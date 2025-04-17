import React, {useEffect, useMemo, useRef, useState} from "react";
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

export default function Map(){
    // A Cesium Ion access token can be obtained for free from https://ion.cesium.com/.
    // Do not commit your access token to a public repository.
    Ion.defaultAccessToken = '';

    const server = "osh-dev.botts-inc.com:8443/sensorhub/api";
    const secure = true

    const cesiumContainer = useRef(null);

    // data source ids -----------------------------------

    const bkId = "0raf5gs7iedgm";
    const krId = "cbmgng06q8hfi";
    const sbId = "no2l5otn10sl6";
    const oshLocId = "kqka25snd5o8c";
    const adId = "qmgmbqvg998f0";
    const adEulerId = "2c1ev1nm3gkf4";
    const adTPId = "gmq44r1ovilum";
    const rvId = "716h9tnqjtq6a";

    // ------------------------------ DATA SOURCES --------------------------------

    // beast kit -----------------------------------------

    const bkGPSDataSource = useMemo(() => new SweApi('Beast-Kit-GPS', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${bkId}/observations`,
        tls: secure,
        startTime: "2024-04-23T12:24:48Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    // kraken --------------------------------------------

    const krakenGPSDataSource = useMemo(() => new SweApi('Kraken-GPS', { // map
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${krId}/observations`,
        tls: secure,
        startTime: "2024-04-23T16:49:02Z",
        endTime: "2024-04-23T17:04:44Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    // skybeast ------------------------------------------

    const sbGPSDataSource = useMemo(() => new SweApi('Sky-Beast-GPS',{ // map
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${sbId}/observations`,
        tls: secure,
        startTime: "2024-04-24T16:51:56Z",
        endTime: "2024-04-25T18:21:19Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    const oshPTZLocDataSource = useMemo(() => new SweApi('OSH-PTZ-Location', { // map
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${oshLocId}/observations`,
        tls: secure,
        startTime: "2024-04-25T15:58:41.947Z",
        endTime: "2024-04-25T17:11:38Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    // sos android ----------------------------------------------

    const androidGPSDataSource = useMemo(() => new SweApi('SOS-Android-GPS', { // map
        protocol: "wss",
        endpointUrl:  server,
        resource: `/datastreams/${adId}/observations`,
        tls: secure,
        startTime: "2024-04-25T17:00:23.463Z",
        endTime: "2024-04-25T17:27:06Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    const androidEulerDataSource = useMemo(() => new SweApi('SOS-Android-Euler', { // orientation?
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adEulerId}/observations`,
        tls: secure,
        startTime: '2024-04-25T16:29:48.831Z',
        endTime: '2024-04-25T18:06:36Z',
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    // android trupulse ---------------------------

    const androidTrupulseDataSource = useMemo(() => new SweApi('SOS-Android-Trupulse', { // map
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adTPId}/observations`,
        tls: secure,
        startTime: '2024-04-25T16:29:53.462Z',
        endTime: '2024-04-25T17:26:47Z',
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    // raavak --------------------------------------------

    const raavakLocDataSource = useMemo(() => new SweApi("RAAVAK-Location", {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${rvId}/observations`,
        startTime: "2024-04-24T14:34:57Z",
        endTime: "2024-04-24T14:45:19Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
        tls: true
    }), []);

    // -------------------------------------------------------------------

    const bkPointMarker = useMemo(() => new PointMarkerLayer({
            labelOffset: [0, -30],
            getLocation: {
                dataSourceIds: [bkGPSDataSource.getId()],
                handler: function (rec: any) {
                    return {
                        x: rec.location.lon,
                        y: rec.location.lat,
                        z: rec.location.alt
                    }
                }
            },
            icon: 'images/uav.glb',
            iconSize: [32, 64],
            name: "Beast Kit GPS Location",
            label: "Beast Kit GPS",
            iconScale: .05,
            color: '#4287f5',
        }), [bkGPSDataSource]);
//
//     const raavakPointMarker = useMemo(() => new PointMarkerLayer({
//         labelOffset: [0, -30],
//         getLocation: {
//             dataSourceIds: [raavakLocDataSource.getId()],
//             handler: function (rec: any) {
//                 return {
//                     x: rec.location.lon,
//                     y: rec.location.lat,
//                     z: rec.location.alt
//                 }
//             }
//         },
//         icon: 'images/uav.glb',
//         iconSize: [32, 64],
//         name: "RAAVAK Location",
//         label: "RAAVAK",
//         iconScale: .05,
//         color: '#FF8000',
//     }), [raavakLocDataSource]);


    /**
     * Master Time Controller
     *
     * @remarks This object will synchronize all the data sources and control the replay speed.
     */
    const masterTimeController = useMemo(() => new DataSynchronizer({
        replaySpeed: 1,
        intervalRate: 5,
        dataSources: [bkGPSDataSource]
    }), [bkGPSDataSource]);

    // Create the Cesium view with the UAV point marker and bounded draping layers
    useEffect(() => {
        const cesiumView = new CesiumView({
            container: cesiumContainer.current.id,
            layers: [bkPointMarker],

            options: {
                viewerProps: {
                    terrain: Terrain.fromWorldTerrain(),
                    sceneMode: SceneMode.SCENE3D,
                    // infoBox: false,
                    // geocoder: false,
                    timeline: false,
                    animation: false,
                    homeButton: false,
                    scene3DOnly: true,
                    // baseLayerPicker: false,
                    // sceneModePicker: false,
                    fullscreenButton: false,
                    // projectionPicker: false,
                    // selectionIndicator: false,
                    navigationHelpButton: true,
                    navigationInstructionsInitiallyVisible: true
                }
            }
        });

        // Set the imagery and terrain providers
        const baseLayerPicker = cesiumView.viewer.baseLayerPicker;

        const imageryProviders = baseLayerPicker.viewModel.imageryProviderViewModels;
        baseLayerPicker.viewModel.selectedImagery =
            imageryProviders.find((imageProviders: any) => imageProviders.name === "Bing Maps Aerial");

        const terrainProviders = baseLayerPicker.viewModel.terrainProviderViewModels;
        baseLayerPicker.viewModel.selectedTerrain =
            terrainProviders.find((terrainProviders: any) => terrainProviders.name === "Cesium World Terrain");

        // Center the camera on the UAV
        cesiumView.viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(-86.67128902952935, 34.70690480206765, 10000)
        });
    }, [])

    // Start streaming
    useEffect(() => {
        masterTimeController.connect();
    }, [])

    return(
        <div id="left">
            <div id="cesium-container" ref={cesiumContainer}></div>
        </div>
    )
}


import React, {useEffect, useMemo, useRef} from "react";
import {Cartesian3, Ion, SceneMode, Terrain} from "@cesium/engine";
import "@cesium/engine/Source/Widget/CesiumWidget.css";
import CesiumView from "osh-js/source/core/ui/view/map/CesiumView.js";
import DataSynchronizer from 'osh-js/source/core/timesync/DataSynchronizer';
import {Mode} from "osh-js/source/core/datasource/Mode";
import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer";
import PolygonLayer from "osh-js/source/core/ui/layer/PolygonLayer";
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource";
import LineLayer from "osh-js/source/core/ui/layer/LineLayer.js";

export default function Map() {
    Ion.defaultAccessToken = '';

    const server = "osh-dev.botts-inc.com:8443/sensorhub/api";
    const secure = true

    const cesiumContainer = useRef(null);

    const bkId = "0raf5gs7iedgm";
    const bkAOAId = "orb73vatusoa2";
    const krId = "cbmgng06q8hfi";
    const misbLocId = "g3064a5bi43rk";
    const misbAttId = "1gqctlan3jtgm";
    const misbGeoImgId = "fhjv85sb636lu";
    const sbId = "no2l5otn10sl6";
    const sbAOAId = "6q2d64tm3tjnq";
    const oshLocId = "kqka25snd5o8c";
    const adId = "qmgmbqvg998f0";
    const adEulerId = "2c1ev1nm3gkf4";
    const adTPId = "gmq44r1ovilum";
    const rvId = "716h9tnqjtq6a";
    const rvHeartId = "j6k1e1tg38g5i";

    const bkGPSDataSource = useMemo(() => new SweApi('Beast-Kit-GPS', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${bkId}/observations`,
        tls: secure,
        startTime: "2024-04-23T12:23:18Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
    }), []);

    const bkAOADataSource = useMemo(() => new SweApi('Beast-Kit-AOA', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${bkAOAId}/observations`,
        tls: secure,
        startTime: "2024-04-23T12:23:28.9Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
    }), []);

    const krakenGPSDataSource = useMemo(() => new SweApi('Kraken-GPS', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${krId}/observations`,
        tls: secure,
        startTime: "2024-04-23T16:49:02Z",
        endTime: "2024-04-23T17:04:44Z",
        mode: Mode.REPLAY,
    }), []);

    const misbLocDataSource = useMemo(() => new SweApi('PUMA-MISB-Sensor-Location', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbLocId}/observations`,
        tls: secure,
        startTime: "2024-04-24T18:55:21.217Z",
        endTime: "2024-04-25T14:42:49.502Z",
        mode: Mode.REPLAY,
    }), []);

    const misbAttDataSource = useMemo(() => new SweApi('PUMA-MISB-Attitude', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbAttId}/observations`,
        tls: secure,
        startTime: "2024-04-24T18:55:23.618Z",
        endTime: "2024-04-25T14:42:49.741Z",
        mode: Mode.REPLAY,
    }), []);

    const misbGeoDataSource = useMemo(() => new SweApi('PUMA-MISB-Geo-Referenced-Image', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbGeoImgId}/observations`,
        tls: secure,
        startTime: "2024-04-24T18:55:23.618Z",
        endTime: "2024-04-25T14:42:49.741Z",
        mode: Mode.REPLAY,
    }), []);

    const sbGPSDataSource = useMemo(() => new SweApi('Sky-Beast-GPS', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${sbId}/observations`,
        tls: secure,
        startTime: "2024-04-24T16:51:56Z",
        endTime: "2024-04-25T18:21:19Z",
        mode: Mode.REPLAY,
    }), []);

    const sbAOADataSource = useMemo(() => new SweApi('Sky-Beast-AOA', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${sbAOAId}/observations`,
        tls: secure,
        startTime: "2024-04-25T12:36:53.5Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
    }), []);

    const oshPTZLocDataSource = useMemo(() => new SweApi('OSH-PTZ-Location', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${oshLocId}/observations`,
        tls: secure,
        startTime: "2024-04-25T15:58:41.947Z",
        endTime: "2024-04-25T17:11:38Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    const androidGPSDataSource = useMemo(() => new SweApi('SOS-Android-GPS', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adId}/observations`,
        tls: secure,
        startTime: "2024-04-25T17:00:23.463Z",
        endTime: "2024-04-25T17:27:06Z",
        mode: Mode.REPLAY,
    }), []);

    const androidEulerDataSource = useMemo(() => new SweApi('SOS-Android-Euler', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adEulerId}/observations`,
        tls: secure,
        startTime: '2024-04-25T17:50:38.372Z',
        endTime: '2024-04-25T18:04:07.186Z',
        mode: Mode.REPLAY,
    }), []);

    const androidTrupulseDataSource = useMemo(() => new SweApi('SOS-Android-Trupulse', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adTPId}/observations`,
        tls: secure,
        startTime: '2024-04-25T16:29:53.462Z',
        endTime: '2024-04-25T17:26:47Z',
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
    }), []);

    const raavakLocDataSource = useMemo(() => new SweApi("RAAVAK-Location", {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${rvId}/observations`,
        startTime: "2024-04-24T14:34:57Z",
        endTime: "2024-04-24T14:45:19Z",
        mode: Mode.REPLAY,
        responseFormat: 'application/swe+binary',
        tls: secure
    }), []);

    const raavakHeartDataSource = useMemo(() => new SweApi("RAAVAK-Heartbeat", {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${rvHeartId}/observations`,
        startTime: "2024-04-24T14:33:09Z",
        endTime: "2024-04-24T14:33:54Z",
        mode: Mode.REPLAY,
        tls: secure
    }), []);

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
        color: '#FF8000',
    }), [bkGPSDataSource]);

    const krPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -40],
        getLocation: {
            dataSourceIds: [krakenGPSDataSource.getId()],
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
        name: "Kraken GPS Location",
        label: "Kraken GPS",
        iconScale: .05,
        color: '#FF8000',
    }), [krakenGPSDataSource]);

    const misbPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [misbLocDataSource.getId()],
            handler: function (rec: any) {
                return {
                    x: rec.location.lon,
                    y: rec.location.lat,
                    z: rec.location.alt
                }
            }

        },
        getOrientation: {
            dataSourceIds: [misbAttDataSource.getId()],
            handler: function (rec: any) {
                return {
                    heading: rec.attitude.heading - 90.0
                }
            }
        },
        icon: 'images/uav.glb',
        iconSize: [32, 64],
        name: "MISB UAS Location",
        label: "MISB UAS",
        iconScale: .05,
        color: '#FF8000'
    }), [misbLocDataSource]);


    const sbPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [sbGPSDataSource.getId()],
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
        name: "Sky Beast GPS Location",
        label: "Sky Beast GPS",
        iconScale: .05,
        color: '#FF8000',
    }), [sbGPSDataSource]);

    const oshPTZPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [oshPTZLocDataSource.getId()],
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
        name: "OSH PTZ Location",
        label: "OSH PTZ",
        iconScale: .05,
        color: '#FF8000',
    }), [oshPTZLocDataSource]);

    const adPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [androidGPSDataSource.getId()],
            handler: function (rec: any) {
                return {
                    x: rec.location.lon,
                    y: rec.location.lat,
                    z: rec.location.alt
                }
            }
        },
        getOrientation: {
            dataSourceIds: [androidEulerDataSource.getId()],
            handler: function (rec: any) {
                return {
                    heading: rec.orient.heading - 90.0
                }
            }
        },
        icon: 'images/uav.glb',
        iconSize: [32, 64],
        name: "Android GPS Location",
        label: "Android GPS",
        iconScale: .05,
        color: '#FF8000'
    }), [androidGPSDataSource]);

    const adTrupulsePointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [androidTrupulseDataSource.getId()],
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
        name: "Android Trupulse Location",
        label: "Android Trupulse",
        iconScale: .05,
        color: '#FF8000',
    }), [androidTrupulseDataSource]);

    const raavakPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [raavakLocDataSource.getId()],
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
        name: "RAAVAK Location",
        label: "RAAVAK",
        iconScale: .05,
        color: '#FF8000',
    }), [raavakLocDataSource]);

    const raavakHeartPointMarker = useMemo(() => new PointMarkerLayer({
        labelOffset: [0, -30],
        getLocation: {
            dataSourceIds: [raavakHeartDataSource.getId()],
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
        name: "RAAVAK Heartbeat",
        label: "RAAVAK Heartbeat",
        iconScale: .05,
        color: '#FF8000',
    }), [raavakHeartDataSource]);

    let beastKitLOB = useMemo(() => new LineLayer({
        getStartLocationAndBearing: {
            dataSourceIds: [bkAOADataSource.getId()],
            handler: function (rec: any) {
                return {
                    dataSourceIds: [bkAOADataSource.getId()],
                    startLocation: {
                        x: rec.location.lon,
                        y: rec.location.lat,
                        z: rec.location.alt,
                    },
                    bearing: rec['raw-lob'] * Math.PI / 180
                }
            }
        },
        icon: 'images/uav.glb',
        iconSize: [32, 64],
        name: "Beast Kit LOB",
        label: "Beast Kit (LOB)",
        iconScale: .05,
        color: '#f57542',
        weight: 10,
        opacity: .5,
    }), [bkAOADataSource]);

    let skyBeastLOB = useMemo(() => new LineLayer({
        getStartLocationAndBearing: {
            dataSourceIds: [sbAOADataSource.getId()],
            handler: function (rec: any) {
                return {
                    startLocation: {
                        x: rec.location.lon,
                        y: rec.location.lat,
                        z: rec.location.alt,
                    },
                    bearing: rec['raw-lob'] * Math.PI / 180
                }
            }
        },
        icon: 'images/uav.glb',
        iconSize: [32, 64],
        name: "Sky Beast LOB",
        label: "Sky Beast (LOB)",
        iconScale: .05,
        color: '#FF8000',
        weight: 10,
        opacity: .5,
    }), [sbAOADataSource]);

    const misbBoundedDraping = useMemo(() => new PolygonLayer({
        opacity: .5,
        clampToGround: true,
        getVertices: {
            dataSourceIds: [misbGeoDataSource.getId()],
            handler: function (rec: any) {
                return [
                    rec.geoRef.ulc.lon,
                    rec.geoRef.ulc.lat,
                    rec.geoRef.llc.lon,
                    rec.geoRef.llc.lat,
                    rec.geoRef.lrc.lon,
                    rec.geoRef.lrc.lat,
                    rec.geoRef.urc.lon,
                    rec.geoRef.urc.lat,
                ];
            }
        },
    }), [misbGeoDataSource]);

    const masterTimeController = useMemo(() => new DataSynchronizer({
        replaySpeed: 1,
        intervalRate: 5,
        dataSources: [bkGPSDataSource]
    }), [bkGPSDataSource]);

    useEffect(() => {
        const cesiumView = new CesiumView({
            container: cesiumContainer.current.id,
            layers: [bkPointMarker],

            options: {
                viewerProps: {
                    terrain: Terrain.fromWorldTerrain(),
                    sceneMode: SceneMode.SCENE3D,
                    timeline: false,
                    animation: false,
                    homeButton: false,
                    scene3DOnly: true,
                    fullscreenButton: false,
                    navigationHelpButton: true,
                    navigationInstructionsInitiallyVisible: true
                }
            }
        });

        const baseLayerPicker = cesiumView.viewer.baseLayerPicker;

        const imageryProviders = baseLayerPicker.viewModel.imageryProviderViewModels;
        baseLayerPicker.viewModel.selectedImagery =
            imageryProviders.find((imageProviders: any) => imageProviders.name === "Bing Maps Aerial");

        const terrainProviders = baseLayerPicker.viewModel.terrainProviderViewModels;
        baseLayerPicker.viewModel.selectedTerrain =
            terrainProviders.find((terrainProviders: any) => terrainProviders.name === "Cesium World Terrain");

        cesiumView.viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(-81.350848, 27.646529, 10000)
        });
    }, [])

    useEffect(() => {
        masterTimeController.connect();
    }, [masterTimeController])

    return (
        <div id="left">
            <div id="cesium-container" ref={cesiumContainer}></div>
        </div>
    )
}


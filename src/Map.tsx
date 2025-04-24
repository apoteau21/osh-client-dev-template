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
    // A Cesium Ion access token can be obtained for free from https://ion.cesium.com/.
    // Do not commit your access token to a public repository.
    Ion.defaultAccessToken = '';

    const server = "osh-dev.botts-inc.com:8443/sensorhub/api";
    const secure = true

    const cesiumContainer = useRef(null);

    // data source ids -----------------------------------

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

    // ------------------------------ DATA SOURCES --------------------------------

    // beast kit -----------------------------------------

    const bkGPSDataSource = useMemo(() => new SweApi('Beast-Kit-GPS', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${bkId}/observations`,
        tls: secure,
        startTime: "2024-04-23T12:23:18Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
    }), []);

    const bkAOADataSource = useMemo(() => new SweApi('Beast-Kit-AOA', { // lines of bearing
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${bkAOAId}/observations`,
        tls: secure,
        startTime: "2024-04-23T12:23:28.9Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
        //       responseFormat: 'application/swe+binary',
    }), []);

    // kraken --------------------------------------------

    const krakenGPSDataSource = useMemo(() => new SweApi('Kraken-GPS', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${krId}/observations`,
        tls: secure,
        startTime: "2024-04-23T16:49:02Z",
        endTime: "2024-04-23T17:04:44Z",
        mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
    }), []);

    // misb uas cpi 24 ------------------------------------------

    const misbLocDataSource = useMemo(() => new SweApi('PUMA-MISB-Sensor-Location', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbLocId}/observations`,
        tls: secure,
        startTime: "2024-04-24T18:55:21.217Z",
        endTime: "2024-04-25T14:42:49.502Z",
        mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
    }), []);

    const misbAttDataSource = useMemo(() => new SweApi('PUMA-MISB-Attitude', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbAttId}/observations`,
        tls: secure,
        startTime: "2024-04-24T18:55:23.618Z",
        endTime: "2024-04-25T14:42:49.741Z",
        mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
    }), []);

    const misbGeoDataSource = useMemo(() => new SweApi('PUMA-MISB-Geo-Referenced-Image', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbGeoImgId}/observations`,
        tls: secure,
        startTime: "2024-04-24T18:55:23.618Z",
        endTime: "2024-04-25T14:42:49.741Z",
        mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
    }), []);

    // skybeast ------------------------------------------

    const sbGPSDataSource = useMemo(() => new SweApi('Sky-Beast-GPS', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${sbId}/observations`,
        tls: secure,
        startTime: "2024-04-24T16:51:56Z",
        endTime: "2024-04-25T18:21:19Z",
        mode: Mode.REPLAY,
//         responseFormat: 'application/swe+binary',
    }), []);


    const sbAOADataSource = useMemo(() => new SweApi('Sky-Beast-AOA', { // lines of bearing
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${sbAOAId}/observations`,
        tls: secure,
        startTime: "2024-04-25T12:36:53.5Z",
        endTime: "2024-04-25T18:18:15Z",
        mode: Mode.REPLAY,
//        responseFormat: 'application/swe+binary',
    }), []);

    // osh ptz ---------------------------------------------

    const oshPTZLocDataSource = useMemo(() => new SweApi('OSH-PTZ-Location', { // works
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

    const androidGPSDataSource = useMemo(() => new SweApi('SOS-Android-GPS', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adId}/observations`,
        tls: secure,
        startTime: "2024-04-25T17:00:23.463Z",
        endTime: "2024-04-25T17:27:06Z",
        mode: Mode.REPLAY,
//        responseFormat: 'application/swe+binary',
    }), []);

    const androidEulerDataSource = useMemo(() => new SweApi('SOS-Android-Euler', { // works
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adEulerId}/observations`,
        tls: secure,
        startTime: '2024-04-25T17:50:38.372Z',
        endTime: '2024-04-25T18:04:07.186Z',
        mode: Mode.REPLAY,
//        responseFormat: 'application/swe+binary',
    }), []);

    // android trupulse ---------------------------

    const androidTrupulseDataSource = useMemo(() => new SweApi('SOS-Android-Trupulse', { // works
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

    const raavakLocDataSource = useMemo(() => new SweApi("RAAVAK-Location", { // works
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
        responseFormat: 'application/swe+binary',
        tls: secure
    }), []);

    // ------------------------------- POINT MARKERS ----------------------------------------

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
        color: '#4287f5', // these colors do not work ......
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
        color: '#f542e6',
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
        icon: 'images/drone.glb',
        iconSize: [32, 64],
        name: "Sky Beast GPS Location",
        label: "Sky Beast GPS",
        iconScale: .05,
        color: '#f57542',
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
        icon: 'images/drone.glb',
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
        color: '#f57542',
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

    // ------------------------------ LINES OF BEARING --------------------------------

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
        color: '#FF8000',
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

    // -------------------------------- BOUNDED DRAPING ------------------------------

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

    // ------------------------------------------------------------------------------------------------

    /**
     * Master Time Controller
     *
     * @remarks This object will synchronize all the data sources and control the replay speed.
     */
    const masterTimeController = useMemo(() => new DataSynchronizer({
        replaySpeed: 1,
        intervalRate: 5,
        dataSources: [misbGeoDataSource]
    }), [misbGeoDataSource]);

    // Create the Cesium view with the point markers & lines of bearing
    useEffect(() => {
        const cesiumView = new CesiumView({
            container: cesiumContainer.current.id,
            layers: [misbBoundedDraping],

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

        // Center the camera on given coordinates
        cesiumView.viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(-81.50619000, 27.59587000, 10000)
        });
    }, [])

    // Start streaming
    useEffect(() => {
        masterTimeController.connect();
    }, [masterTimeController])

    return (
        <div id="left">
            <div id="cesium-container" ref={cesiumContainer}></div>
        </div>
    )
}


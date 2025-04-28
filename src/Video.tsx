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
import Draggable, {DraggableCore} from 'react-draggable';

export default function Video(){

    const videoContainer = useRef(null);
    const server = "osh-dev.botts-inc.com:8443/sensorhub/api";
    const secure = true;
    const responseFormat = 'application/swe+binary'

    const oshVidId = "k992mhd5jr7ri";
    const misbVidId = "c2u1058huoehq";
    const adVidId = "aljvakc6kqtk2";

    const oshPTZVideoSource = new SweApi('OSH-PTZ-Video-Camera', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${oshVidId}/observations`,
        tls: secure,
        startTime: "2024-04-25T15:43:53.006Z",
        endTime: "2024-04-25T16:43:53.006Z",
        mode: Mode.REPLAY,
        responseFormat: responseFormat,
    });

    const MISBVideoSource = new SweApi('PUMA-MISB-Video-Camera', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${misbVidId}/observations`,
        tls: secure,
        startTime: "2024-04-24T17:13:00.604666748Z",
        endTime: "2024-04-25T18:48:41.60557788Z",
        mode: Mode.REPLAY,
        responseFormat: responseFormat,
    });

    const androidVideoSource = new SweApi('Android-Camera-H264', {
        protocol: "wss",
        endpointUrl: server,
        resource: `/datastreams/${adVidId}/observations`,
        tls: secure,
        startTime: "2024-04-25T16:29:44.176Z",
        endTime: "2024-04-25T18:29:44.323Z",
        mode: Mode.REPLAY,
        responseFormat: responseFormat,
    });

    const videoDataLayer = useMemo(() => new VideoDataLayer({
        dataSourceId: [oshPTZVideoSource.getId()],
        getFrameData: (rec: any) => {
            return rec.img
        },
        getTimestamp: (rec: any) => {
            return rec.timestamp
        }
    }), [oshPTZVideoSource]);

    const masterTimeController = useMemo(() => new DataSynchronizer({
        replaySpeed: 1,
        intervalRate: 5,
        dataSources: [oshPTZVideoSource]
    }), [oshPTZVideoSource]);

    useEffect(() => {
        new VideoView({
            container: "osh-container",
            css: 'video-h264',
            name: "OSH PTZ Video",
            framerate: 25,
            showTime: false,
            showStats: false,
            layers: [videoDataLayer]
        });

        masterTimeController.connect();
    }, []);

    return (
        <div id="right">
            <Draggable handle=".video-handle" defaultPosition={{ x: 0, y: 0 }}>
                <div style={{ width: "480px", border: "1px solid #ccc", backgroundColor: "#000", position: "absolute", zIndex: 10 }}>
                    <div className="video-handle" style={{ cursor: "move", backgroundColor: "#444", color: "#fff", padding: "8px" }}>
                        OSH PTZ Video
                    </div>
                    <div id="osh-container" ref={videoContainer} style={{ width: "100%", height: "100%" }}></div>
                </div>
            </Draggable>
        </div>
    );
}

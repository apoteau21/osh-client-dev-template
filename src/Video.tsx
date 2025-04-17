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

export default function Video(){

    const videoContainer = useRef(null);
    const server = "osh-dev.botts-inc.com:8443/sensorhub/api";
    const secure = true;
    const responseFormat = 'application/swe+binary'

    const oshVidId = "k992mhd5jr7ri";

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

    const videoView = new VideoView({
        container: "video-container",
        css: 'video-h264',
        name: "OSH PTZ Video",
        framerate: 25,
        showTime: false,
        showStats: false,
        layers: [videoDataLayer]
    });

    // Start streaming
    useEffect(() => {
        masterTimeController.connect();
    }, [])

    return(
        <div id="right">
            <div id="video-container" ref={videoContainer}></div>
        </div>
    )

}

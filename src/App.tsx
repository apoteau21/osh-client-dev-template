import React, {useEffect} from "react";
import {Mode} from "osh-js/source/core/datasource/Mode";
import ConSysApi from "osh-js/source/core/datasource/consysapi/ConSysApi.datasource";
import AudioSpectrogramVisualizer
    from "osh-js/source/core/ui/view/audio/visualizer/spectrogram/AudioSpectrogramVisualizer";
import AudioView from 'osh-js/source/core/ui/view/audio/AudioView';
import AudioFrequencyChartJsVisualizer from 'osh-js/source/core/ui/view/audio/visualizer/frequency/AudioFrequencyChartJsVisualizer';
import AudioTimeChartJsVisualizer from 'osh-js/source/core/ui/view/audio/visualizer/time/AudioTimeChartJsVisualizer';
import AudioDataLayer from 'osh-js/source/core/ui/layer/AudioDataLayer';

export default function App() {
    const server = "localhost:8181/sensorhub/api";
    const audioDsId = "itd1rub6pht7q";


    useEffect(() => {

        let audioDataSource = new ConSysApi("audio", {
            protocol: "ws",
            endpointUrl: server,
            resource: `/datastreams/${audioDsId}/observations`,
            mode: Mode.REAL_TIME,
            responseFormat: "application/swe+binary",
            tls: false
        });

        let audioView = new AudioView({
            name: 'Audio',
            css: 'audio-view',
            container: "audio-chart-container",
            gain: 10,
            playSound: true,
            layers: [
                new AudioDataLayer({
                    dataSourceId: audioDataSource.id,
                    getSampleRate: (rec: any) => rec.sampleRate,
                    getFrameData: (rec: any) => rec.samples,
                    getTimestamp: (rec: any) => new Date(rec.time).getTime()
                })
            ],
        });

        const audioChartFrequencyVisualizer = new AudioFrequencyChartJsVisualizer({
            css: 'audio-canvas',
            fftSize: 32,
            container: `chart-frequency`,
            options: {},
            datasetOptions: {
                borderColor: 'rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(210,210,210,0.8)',
                barThickness:  20,
                borderWidth: 1,
            },
        });

        const audioChartTimeVisualizer = new AudioTimeChartJsVisualizer({
            css: 'audio-canvas',
            fftSize: 1024,
            container: `chart-time`,
        });

        const audioSpectrogramVisualizer = new AudioSpectrogramVisualizer({
            fftSize: 2048,
            container: `spectrogram`,
        });

        audioView.addVisualizer(audioChartFrequencyVisualizer);
        audioView.addVisualizer(audioChartTimeVisualizer);
        audioView.addVisualizer(audioSpectrogramVisualizer);

        audioDataSource.connect();
    }, []);



    return (
        <div id="audio-chart-container" style={{width: "50%", height: "100vh"}}>
            <div id="audio-spectrogram"></div>
            <div id="spectrogram" className="audio-visualizer" style={{height: "300px"}}></div>
            <div id="chart-time" className="audio-chart" style={{height: "300px"}}></div>
            <div id="chart-frequency" className="audio-chart" style={{height: "300px"}}></div>
        </div>
    );
}

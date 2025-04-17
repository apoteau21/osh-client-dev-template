import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer";
import SweApi, {Mode} from "osh-js/source/core/*";

export function createLayer(ds: any, name: string, label: string, icon_path: string){
    return (
        new PointMarkerLayer({
            labelOffset: [0, -30],
            getLocation: {
                dataSourceIds: [ds.getId()],
                handler: function (rec: any) {
                    return {
                        x: rec.location.lon,
                        y: rec.location.lat,
                        z: rec.location.alt
                    }
                }
            },
            icon: icon_path,
            iconSize: [32, 64],
            name: name,
            label: label,
            iconScale: .05,
            color: '#FF8000'
        })
    )
}

export function createDs(server: string, dsId: string, startTime: string, endTime:string, name: String){
    return(
        new SweApi(name, {
            protocol: "wss",
            endpointUrl: server,
            resource: `/datastreams/${dsId}/observations`,
            startTime: startTime,
            endTime: endTime,
            mode: Mode.REPLAY,
            responseFormat: 'application/swe+binary',
            tls: true
        })
    )

}
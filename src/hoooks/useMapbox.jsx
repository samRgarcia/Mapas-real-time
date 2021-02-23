import {useRef,useEffect, useCallback,useState} from 'react'
import mapboxgl from 'mapbox-gl';
import {v4} from 'uuid';
import {Subject} from "rxjs";
mapboxgl.accessToken='pk.eyJ1Ijoicml2YXMxOCIsImEiOiJja2xndWc5cnk0Mmt2Mm5wZXd4dG1pdXltIn0.e7u1_MegpZEsi8EqO7cBBw'


export const useMapbox = (puntoInicial) => {

    const mapDiv = useRef();

    const setRef = useCallback((node)=>{
        mapDiv.current = node;
    },[])
    //Referecia a los marcadores
    const marcadores = useRef({});
    //Observables de Rxjs
    const movimientoMarcador = null;
    const nuevoMarcador = useRef(new Subject());

    //Mapa y coords
    const mapas =  useRef()
    const[coords,setCoors]=useState(puntoInicial);

    // Función para agregar marcadores
    const agregarMarcador = useCallback((evt)=>{
        const{ lng, lat} = evt.lngLat;
        const marker = new mapboxgl.Marker();
        marker.id = v4();
        marker.setLngLat([lng, lat])
        .addTo(mapas.current)
        .setDraggable(true)
        //Asignamos al objeto de marcadores
        marcadores.current [marker.id] = marker;


        //TODO: si el marcador tiene ID no emitir
        nuevoMarcador.current.next({
            id:marker.id,
            lng,
            lat
        })

        // Escuchar movimientos del marcador
        marker.on('drag',({target})=>{
            const{id} = target;
            const {lng, lat} = target.getLngLat();
            //TODO: Emitir un cambio en el navegador

        })

    },[])


    useEffect(()=>{
        let map = new mapboxgl.Map({
            container: mapDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center:[puntoInicial.lng,puntoInicial.lat],
            zoom:puntoInicial.zoom
            });
            mapas.current=map;
    },[puntoInicial])

    //Cuando se mueve el mapa
    useEffect(()=>{
        mapas.current?.on('move',()=>{
            const{lng,lat} = mapas.current.getCenter();
            setCoors({
                lng:lng.toFixed(4),
                lat:lat.toFixed(4),
                zoom:mapas.current.getZoom().toFixed(2)
            })
        })
        return mapas.current?.off('move')
    },[])

    // Agregar marcadores cuando aga click

    useEffect(()=>{
        mapas.current.on('click',agregarMarcador)
    },[agregarMarcador])

    return{
        agregarMarcador,
        coords,
        setRef,
        marcadores,
        nuevoMarcador$:nuevoMarcador.current,
    }
}

import React,{useEffect} from 'react';
import {useMapbox} from '../hoooks/useMapbox';


const puntoInicial = {
    lng:-100.9028,
    lat:25.7270,
    zoom: 4.18
}

export const MapaPage = () => {
    const {coords,setRef,nuevoMarcador$ } = useMapbox(puntoInicial);
    useEffect(()=>{
        nuevoMarcador$.subscribe(marcador=>{
            //TODO: nuevo marcador a emitir
        })
    },[nuevoMarcador$])
  
    return(<>
    <div className='info'>
        Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
    </div>
            <div 
            ref={setRef}
            className='mapContainer'
            ></div>
    </>
)}

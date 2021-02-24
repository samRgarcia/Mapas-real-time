import React, {useEffect, useContext} from 'react';
import {useMapbox} from '../hoooks/useMapbox';
import {SocketContext} from '../Context/SocketContext';


const puntoInicial = {
    lng: -100.9028,
    lat: 25.7270,
    zoom: 4.18
}

export const MapaPage = () => {
    const {socket} = useContext(SocketContext);
    const {coords, setRef, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion} = useMapbox(puntoInicial);

    //Marcadores activos
    useEffect(() => {
        socket.on('marcadores-activos', (marcadoresActivos) => {
            for (const key of Object.keys(marcadoresActivos)) {
                agregarMarcador(marcadoresActivos[key], key)
            }
        })
    }, [socket, agregarMarcador])

    useEffect(() => {
        nuevoMarcador$.subscribe(marcador => {
            //TODO: nuevo marcador a emitir
            socket.emit('marcador-nuevo', marcador)
        })
    }, [nuevoMarcador$, socket])

    useEffect(() => {
        movimientoMarcador$.subscribe(movimiento => {
            socket.emit('marcador-actualizado', movimiento)
        })

    }, [movimientoMarcador$, socket]);

    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion(marcador)
        })
    }, [socket, actualizarPosicion])


    useEffect(() => {
        socket.on('marcador-nuevo', marcadorNew => {
            agregarMarcador(marcadorNew, marcadorNew.id)
        })
    }, [socket])

    return (<>
            <div className='info'>
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
            </div>
            <div
                ref={setRef}
                className='mapContainer'
            ></div>
        </>
    )
}

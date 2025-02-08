import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
    return (
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1052.9831793255769!2d105.81523017582998!3d20.976219020638982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acef8ad5350f%3A0x89435a3528118ff5!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBUaMSDbmcgTG9uZw!5e0!3m2!1svi!2s!4v1695782480925!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    );
};

export default MapComponent;

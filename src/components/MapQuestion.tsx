import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { QuizQuestion } from '../types';
import L from 'leaflet';

interface MapQuestionProps {
  question: QuizQuestion;
  timeLeft: number;
}

function MapController({ targetBbox, parentBbox, timeLeft, isReveal }: { targetBbox: any, parentBbox: any, timeLeft: number, isReveal: boolean }) {
  const map = useMap();
  
  // Track previous time to only trigger animations on threshold crossing
  const prevTimeRef = useRef(timeLeft);
  
  useEffect(() => {
    // Initial load
    if (targetBbox && prevTimeRef.current === timeLeft) {
      if (timeLeft > 10) {
        if (parentBbox) {
          map.flyToBounds(parentBbox, { duration: 2 });
        } else {
          map.setView([20, 0], 2);
        }
      } else {
        map.flyToBounds(targetBbox, { duration: 2 });
      }
    }
    
    // Threshold crossing
    if (targetBbox && prevTimeRef.current > 10 && timeLeft <= 10 && !isReveal) {
       map.flyToBounds(targetBbox, { duration: 3 });
    }
    
    if (targetBbox && isReveal && prevTimeRef.current > 0) {
       map.flyToBounds(targetBbox, { duration: 1 });
    }
    
    prevTimeRef.current = timeLeft;
  }, [timeLeft, targetBbox, parentBbox, map, isReveal]);

  return null;
}

export default function MapQuestion({ question, timeLeft }: MapQuestionProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [targetBbox, setTargetBbox] = useState<L.LatLngBoundsExpression | null>(null);
  const [parentBbox, setParentBbox] = useState<L.LatLngBoundsExpression | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchMapData = async () => {
      try {
        if (!question.nominatimQuery) return;
        
        // Fetch target
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(question.nominatimQuery)}&format=json&polygon_geojson=1&limit=1`);
        const data = await res.json();
        
        if (!mounted) return;
        
        if (data && data.length > 0) {
          const item = data[0];
          if (item.geojson) {
            setGeoData(item.geojson);
          }
          if (item.boundingbox) {
            // [latMin, latMax, lonMin, lonMax]
            setTargetBbox([
              [parseFloat(item.boundingbox[0]), parseFloat(item.boundingbox[2])],
              [parseFloat(item.boundingbox[1]), parseFloat(item.boundingbox[3])]
            ]);
          }
        }
        
        // Fetch parent
        if (question.parentRegionQuery && question.parentRegionQuery.toLowerCase() !== 'world') {
          const pRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(question.parentRegionQuery)}&format=json&limit=1`);
          const pData = await pRes.json();
          if (mounted && pData && pData.length > 0) {
            const pItem = pData[0];
            if (pItem.boundingbox) {
              setParentBbox([
                [parseFloat(pItem.boundingbox[0]), parseFloat(pItem.boundingbox[2])],
                [parseFloat(pItem.boundingbox[1]), parseFloat(pItem.boundingbox[3])]
              ]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch map data", err);
      }
    };
    
    setGeoData(null);
    setTargetBbox(null);
    setParentBbox(null);
    
    fetchMapData();
    
    return () => { mounted = false; };
  }, [question]);

  // Give map a key so it completely re-renders if question changes? Or rely on MapController?
  // Using MapController is better for smooth transitions.
  // But wait, the GeoJSON needs to change.
  const geoJsonKey = geoData ? JSON.stringify(geoData).substring(0, 50) + question.nominatimQuery : 'empty';

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-inner border-4 border-slate-200 bg-slate-100 relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          noWrap={true}
          bounds={[[-90, -180], [90, 180]]}
        />
        {geoData && (
          <GeoJSON 
            key={geoJsonKey}
            data={geoData} 
            style={{
              color: '#ef4444',
              weight: 4,
              fillColor: '#ef4444',
              fillOpacity: 0.3
            }} 
          />
        )}
        <MapController 
          targetBbox={targetBbox} 
          parentBbox={parentBbox} 
          timeLeft={timeLeft} 
          isReveal={timeLeft <= 0}
        />
      </MapContainer>
    </div>
  );
}

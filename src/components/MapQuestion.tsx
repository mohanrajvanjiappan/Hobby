import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { QuizQuestion } from '../types';
import L from 'leaflet';

interface MapQuestionProps {
  question: QuizQuestion;
  timeLeft: number;
  isInteractiveMode?: boolean;
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

export default function MapQuestion({ question, timeLeft, isInteractiveMode = false }: MapQuestionProps) {
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
    <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[8px] border-slate-800 bg-slate-900 relative group">
      {/* Cool targeting overlay */}
      <div className="absolute inset-0 z-[400] pointer-events-none mix-blend-screen opacity-50">
        <div className="absolute top-0 left-0 w-full h-full border-[1px] border-emerald-400/30" style={{ background: 'radial-gradient(circle, transparent 60%, rgba(16, 185, 129, 0.1) 100%)' }} />
        {/* Crosshairs */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-400/40" />
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-emerald-400/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-emerald-400/50 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-[1px] border-emerald-400/20 rounded-full border-dashed animate-[spin_20s_linear_infinite]" />
      </div>
      
      {timeLeft <= 0 && (
         <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[500] pointer-events-none flex flex-col items-center animate-bounce">
            <div className="bg-emerald-500 text-white font-black px-6 py-2 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.8)] border-2 border-white tracking-widest uppercase text-xl">
               Target Acquired
            </div>
         </div>
      )}

      
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={isInteractiveMode}
        attributionControl={false}
        dragging={isInteractiveMode}
        scrollWheelZoom={isInteractiveMode}
        doubleClickZoom={isInteractiveMode}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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

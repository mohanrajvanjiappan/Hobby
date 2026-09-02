import React, { useEffect, useRef } from 'react';

export const YoutubeBackgroundAudio = ({ isPlaying }: { isPlaying: boolean }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReady = useRef(false);

  useEffect(() => {
    const loadAPI = () => {
      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    const initPlayer = () => {
      if (!containerRef.current) return;
      playerRef.current = new (window as any).YT.Player(containerRef.current, {
        height: '1',
        width: '1',
        videoId: 'v_m-4XGWrsY',
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
        },
        events: {
          onReady: (event: any) => {
            isReady.current = true;
            event.target.setVolume(30);
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event: any) => {
             // YT.PlayerState.ENDED == 0
             if (event.data === 0) {
                 event.target.playVideo(); // Loop
             }
          }
        }
      });
    };

    if ((window as any).YT && (window as any).YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
      loadAPI();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []); // Only run once on mount

  useEffect(() => {
    if (isReady.current && playerRef.current && playerRef.current.playVideo) {
      try {
        if (isPlaying) {
          playerRef.current.playVideo();
        } else {
          playerRef.current.pauseVideo();
        }
      } catch (e) {}
    }
  }, [isPlaying]);

  return <div className="fixed top-0 left-0 opacity-0 pointer-events-none z-[-1] overflow-hidden"><div ref={containerRef}></div></div>;
};

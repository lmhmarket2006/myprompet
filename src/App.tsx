import { useState, useEffect, useRef } from "react";

interface Station {
  id: string;
  name: string;
  url: string;
  country: string;
  tags: string;
  favicon?: string;
  frequency?: number;
}

const CATEGORIES = [
  { id: "all", label: "الكل", icon: "fa-th-large" },
  { id: "quran", label: "قرآن كريم", icon: "fa-quran" },
  { id: "music", label: "موسيقى", icon: "fa-music" },
  { id: "news", label: "أخبار", icon: "fa-newspaper" },
  { id: "sports", label: "رياضة", icon: "fa-futbol" },
  { id: "drama", label: "مسلسلات", icon: "fa-theater-masks" },
  { id: "talk", label: "حوارات", icon: "fa-comments" },
  { id: "arabic", label: "عربي", icon: "fa-flag" },
];

export default function App() {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [frequency, setFrequency] = useState(88.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tunerKnobRef = useRef<HTMLDivElement | null>(null);
  const tunerContainerRef = useRef<HTMLDivElement | null>(null);

  // Load stations from Radio Browser API
  useEffect(() => {
    loadStations();
  }, []);

  useEffect(() => {
    filterStations();
  }, [stations, selectedCategory, searchQuery]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      // Fetch Arabic and popular stations from Radio Browser API
      const responses = await Promise.all([
        fetch('https://de1.api.radio-browser.info/json/stations/bycountry/arabic'),
        fetch('https://de1.api.radio-browser.info/json/stations/bycountry/Egypt'),
        fetch('https://de1.api.radio-browser.info/json/stations/bycountry/Saudi%20Arabia'),
        fetch('https://de1.api.radio-browser.info/json/stations/search?name=quran&limit=10'),
        fetch('https://de1.api.radio-browser.info/json/stations/search?name=music&limit=15'),
      ]);

      const allStations: Station[] = [];
      
      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          allStations.push(...data.slice(0, 20));
        }
      }

      // Remove duplicates and assign frequencies
      const uniqueStations = allStations
        .filter((station, index, self) => 
          index === self.findIndex(s => s.stationuuid === station.stationuuid)
        )
        .map((station, index) => ({
          id: station.stationuuid || `station-${index}`,
          name: station.name || `محطة ${index + 1}`,
          url: station.url_resolved || station.url,
          country: station.country || 'unknown',
          tags: station.tags || '',
          favicon: station.favicon,
          frequency: 88.0 + (index * 0.4) // Assign frequency between 88-108 MHz
        }))
        .slice(0, 60); // Limit to 60 stations

      setStations(uniqueStations);
    } catch (error) {
      console.error('Error loading stations:', error);
      // Fallback to sample stations
      setStations(getSampleStations());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleStations = (): Station[] => {
    return [
      { id: '1', name: 'إذاعة القرآن الكريم', url: 'https://qurango-live.hoost.eg/live/radio/playlist.m3u8', country: 'Egypt', tags: 'quran,islam', frequency: 88.0 },
      { id: '2', name: 'نجوم إف إم', url: 'https://live.nogoumfm.net/nogoum', country: 'Egypt', tags: 'music,pop', frequency: 88.4 },
      { id: '3', name: 'إذاعة الشرق', url: 'https://radio.elshaab.com:8082/stream', country: 'Egypt', tags: 'music,arabic', frequency: 88.8 },
      { id: '4', name: 'القرآن الكريم السعودية', url: 'https://quran.gov.sa/live/quran.mp3', country: 'Saudi Arabia', tags: 'quran,islam', frequency: 89.2 },
      { id: '5', name: 'إذاعة الرياض', url: 'https://stream.saudiradio.net/riyadh', country: 'Saudi Arabia', tags: 'talk,news', frequency: 89.6 },
      { id: '6', name: 'مزيكا', url: 'https://live.mazikafm.net/mazika', country: 'Egypt', tags: 'music,arabic', frequency: 90.0 },
      { id: '7', name: 'إذاعة الأخبار', url: 'https://nilefm.ice.infomaniak.ch/nilefm-128.mp3', country: 'Egypt', tags: 'news,talk', frequency: 90.4 },
      { id: '8', name: 'راديو سوا', url: 'https://mbnv-live-ingest.akamaized.net/hls/live/2038505/sawa/master.m3u8', country: 'UAE', tags: 'news,music', frequency: 90.8 },
      { id: '9', name: 'إذاعة الشباب', url: 'https://shababfm.live.sa/shabab', country: 'Saudi Arabia', tags: 'music,youth', frequency: 91.2 },
      { id: '10', name: 'مونت كارلو', url: 'https://live.montecarlo.fm/montecarlo', country: 'France', tags: 'news,culture', frequency: 91.6 },
      { id: '11', name: 'إذاعة الأناضول', url: 'https://radyo.anadolu.gov.tr:8070/live', country: 'Turkey', tags: 'news,culture', frequency: 92.0 },
      { id: '12', name: 'بانورما إف إم', url: 'https://panorama.ice.infomaniak.ch/panorama-128.mp3', country: 'Egypt', tags: 'sports,news', frequency: 92.4 },
      { id: '13', name: 'إذاعة القرآن أبوظبي', url: 'https://quran.admc.ae/quran', country: 'UAE', tags: 'quran,islam', frequency: 92.8 },
      { id: '14', name: 'هيتس', url: 'https://hitsradio.live.sa/hits', country: 'Saudi Arabia', tags: 'music,pop', frequency: 93.2 },
      { id: '15', name: 'إذاعة الكويت', url: 'https://radiokw.knet.kw/radio1', country: 'Kuwait', tags: 'music,culture', frequency: 93.6 },
    ];
  };

  const filterStations = () => {
    let filtered = [...stations];

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(station => {
        const tags = station.tags.toLowerCase();
        const name = station.name.toLowerCase();
        
        switch (selectedCategory) {
          case 'quran':
            return tags.includes('quran') || tags.includes('islam') || name.includes('قرآن');
          case 'music':
            return tags.includes('music') || tags.includes('pop') || tags.includes('songs');
          case 'news':
            return tags.includes('news') || tags.includes('talk');
          case 'sports':
            return tags.includes('sports');
          case 'drama':
            return tags.includes('drama') || tags.includes('series');
          case 'talk':
            return tags.includes('talk') || tags.includes('discussion');
          case 'arabic':
            return tags.includes('arabic') || station.country === 'Egypt' || station.country === 'Saudi Arabia';
          default:
            return true;
        }
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(station => 
        station.name.toLowerCase().includes(query) ||
        station.tags.toLowerCase().includes(query) ||
        station.country.toLowerCase().includes(query)
      );
    }

    setFilteredStations(filtered);
  };

  const playStation = (station: Station) => {
    if (currentStation?.id === station.id && isPlaying) {
      pauseStation();
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = station.url;
      audioRef.current.play().then(() => {
        setCurrentStation(station);
        setIsPlaying(true);
        setFrequency(station.frequency || 88.0);
        updateTunerPosition(station.frequency || 88.0);
      }).catch(error => {
        console.error('Error playing station:', error);
      });
    }
  };

  const pauseStation = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!currentStation) return;
    
    if (isPlaying) {
      pauseStation();
    } else {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing:', error);
        });
      }
    }
  };

  const playNext = () => {
    const currentIndex = filteredStations.findIndex(s => s.id === currentStation?.id);
    if (currentIndex < filteredStations.length - 1) {
      playStation(filteredStations[currentIndex + 1]);
    } else if (filteredStations.length > 0) {
      playStation(filteredStations[0]);
    }
  };

  const playPrev = () => {
    const currentIndex = filteredStations.findIndex(s => s.id === currentStation?.id);
    if (currentIndex > 0) {
      playStation(filteredStations[currentIndex - 1]);
    } else if (filteredStations.length > 0) {
      playStation(filteredStations[filteredStations.length - 1]);
    }
  };

  const updateTunerPosition = (freq: number) => {
    if (tunerKnobRef.current && tunerContainerRef.current) {
      const containerWidth = tunerContainerRef.current.offsetWidth;
      const minFreq = 88.0;
      const maxFreq = 108.0;
      const percentage = ((freq - minFreq) / (maxFreq - minFreq)) * 100;
      tunerKnobRef.current.style.left = `${percentage}%`;
    }
  };

  const handleTunerDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!tunerContainerRef.current) return;
    
    const rect = tunerContainerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    const minFreq = 88.0;
    const maxFreq = 108.0;
    const newFreq = minFreq + (percentage / 100) * (maxFreq - minFreq);
    setFrequency(parseFloat(newFreq.toFixed(1)));
    
    if (tunerKnobRef.current) {
      tunerKnobRef.current.style.left = `${percentage}%`;
    }

    // Find nearest station
    const nearestStation = filteredStations.reduce((prev, curr) => {
      const prevDiff = Math.abs((prev.frequency || 88) - newFreq);
      const currDiff = Math.abs((curr.frequency || 88) - newFreq);
      return currDiff < prevDiff ? curr : prev;
    }, filteredStations[0]);

    if (nearestStation && Math.abs((nearestStation.frequency || 88) - newFreq) < 0.3) {
      playStation(nearestStation);
    }
  };

  return (
    <div className="radio-app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <i className="fas fa-broadcast-tower"></i>
          <h1>الزمن الجميل</h1>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="ابحث عن محطة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar - Categories */}
        <aside className="sidebar">
          <h3>التصنيفات</h3>
          <ul className="category-list">
            {CATEGORIES.map(cat => (
              <li
                key={cat.id}
                className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i className={`fas ${cat.icon}`}></i>
                <span>{cat.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Stations Area */}
        <main className="stations-area">
          {/* Frequency Display */}
          <div className="frequency-display">
            <div className="frequency-info">
              <span className="frequency-label">التردد:</span>
              <span className="frequency-value">{frequency.toFixed(1)}</span>
              <span className="frequency-unit">MHz</span>
            </div>
            <div className="station-info-display">
              <span className="station-name-display">
                {currentStation ? currentStation.name : 'اختر محطة'}
              </span>
            </div>
          </div>

          {/* Tuner Control */}
          <div className="tuner-container" ref={tunerContainerRef}>
            <div className="tuner-scale">
              {Array.from({ length: 21 }, (_, i) => {
                const freq = 88 + i;
                return (
                  <div key={freq} className="frequency-marker">
                    <span>{freq}</span>
                    <div className="marker-line"></div>
                  </div>
                );
              })}
            </div>
            <div
              className="tuner-knob"
              ref={tunerKnobRef}
              onMouseDown={(e) => {
                const handleMouseMove = (e: MouseEvent) => handleTunerDrag(e as any);
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                const handleTouchMove = (e: TouchEvent) => handleTunerDrag(e as any);
                const handleTouchEnd = () => {
                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };
                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              <div className="tuner-pointer"></div>
            </div>
          </div>

          {/* Stations Grid */}
          <div className="stations-grid">
            {isLoading ? (
              <div className="loading-message">
                <i className="fas fa-spinner fa-spin"></i>
                <p>جاري تحميل المحطات...</p>
              </div>
            ) : filteredStations.length > 0 ? (
              filteredStations.map(station => (
                <div
                  key={station.id}
                  className={`station-card ${currentStation?.id === station.id ? 'playing' : ''}`}
                  onClick={() => playStation(station)}
                >
                  <div className="station-icon">
                    {station.favicon ? (
                      <img src={station.favicon} alt={station.name} onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }} />
                    ) : null}
                    <i className={`fas ${station.tags.includes('quran') ? 'fa-quran' : 'fa-radio'} ${!station.favicon ? '' : 'hidden'}`}></i>
                  </div>
                  <div className="station-info">
                    <h4>{station.name}</h4>
                    <p>{station.country}</p>
                    <span className="frequency-badge">{station.frequency?.toFixed(1)} MHz</span>
                  </div>
                  {currentStation?.id === station.id && isPlaying && (
                    <div className="playing-indicator">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-stations">
                <i className="fas fa-inbox"></i>
                <p>لا توجد محطات في هذا التصنيف</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Player Bar */}
      <div className="player-bar">
        <div className="now-playing">
          <div className="station-art">
            {currentStation?.favicon ? (
              <img src={currentStation.favicon} alt={currentStation.name} />
            ) : (
              <i className="fas fa-broadcast-tower"></i>
            )}
          </div>
          <div className="station-details">
            <h4>{currentStation ? currentStation.name : 'لم يتم الاختيار'}</h4>
            <p>{currentStation ? currentStation.country : '-'}</p>
          </div>
        </div>

        <div className="player-controls">
          <button className="control-btn" onClick={playPrev}>
            <i className="fas fa-step-forward"></i>
          </button>
          <button className="control-btn play-btn" onClick={togglePlayPause}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          <button className="control-btn" onClick={playNext}>
            <i className="fas fa-step-backward"></i>
          </button>
        </div>

        <div className="volume-control">
          <i className="fas fa-volume-up"></i>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>

        <div className={`visualizer ${isPlaying ? 'active' : ''}`}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bar"></div>
          ))}
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="none" />
    </div>
  );
}

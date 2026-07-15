(function () {
  var tabs = document.querySelectorAll('.view-tab');
  var views = {
    folders: document.getElementById('view-folders'),
    globe: document.getElementById('view-globe'),
    all: document.getElementById('view-all')
  };
  var inited = { globe: false, all: false };
  var globeInstance = null;
  var countriesData = null;
  var riversData = null;
  var lakesData = null;

  function viewFromHash() {
    var h = location.hash.replace('#', '');
    return (h === 'globe' || h === 'all') ? h : 'folders';
  }

  function setView(view) {
    Object.keys(views).forEach(function (name) {
      views[name].hidden = name !== view;
    });
    tabs.forEach(function (t) {
      var active = t.dataset.view === view;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    if (view === 'all' && !inited.all) {
      inited.all = true;
      initAllView();
    }
    if (view === 'globe' && !inited.globe) {
      inited.globe = true;
      initGlobeView();
    }
    if (globeInstance) {
      // pause the render loop while the globe is hidden
      globeInstance.pauseAnimation();
      if (view === 'globe') globeInstance.resumeAnimation();
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var v = t.dataset.view;
      if (v === 'folders') {
        history.pushState(null, '', location.pathname + location.search);
        setView('folders');
      } else {
        location.hash = v;
      }
    });
  });

  window.addEventListener('hashchange', function () {
    setView(viewFromHash());
  });

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadCSS(href) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  /* ---------- All view: shuffle + lightbox ---------- */

  function initAllView() {
    var feed = document.getElementById('all-feed');
    var items = Array.prototype.slice.call(feed.children);
    // Fisher–Yates: a different wall every visit
    for (var i = items.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    items.forEach(function (el) { feed.appendChild(el); });

    loadCSS('/assets/vendor/glightbox/glightbox.min.css');
    loadScript('/assets/vendor/glightbox/glightbox.min.js').then(function () {
      GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        zoomable: false,
        openEffect: 'fade',
        closeEffect: 'fade'
      });
    });
  }

  /* ---------- Globe view: vintage paper map ---------- */

  var MAP_PALETTES = {
    light: {
      ocean: '#b7cdd9',
      oceanLight: '#c8dae4',
      oceanDark: '#a9c2cf',
      coastHalo: '#d6e4ec',
      land: '#f4eede',
      sand: '#e3d0a2',
      coastline: '#8a795a',
      graticule: 'rgba(92, 112, 126, 0.32)',
      label: 'rgba(84, 104, 120, 0.55)',
      labelContinent: 'rgba(120, 104, 74, 0.3)',
      labelCountry: 'rgba(122, 105, 72, 0.68)',
      labelCity: 'rgba(74, 64, 52, 0.85)',
      cityDot: 'rgba(74, 64, 52, 0.75)',
      river: 'rgba(88, 128, 152, 0.7)',
      route: 'rgba(166, 64, 47, 0.55)',
      deep: 'rgba(66, 92, 110, 0.8)',
      atmosphere: '#cfdde6'
    },
    dark: {
      ocean: '#2c3d47',
      oceanLight: '#354854',
      oceanDark: '#24333c',
      coastHalo: '#3c5260',
      land: '#494538',
      sand: '#5c5138',
      coastline: '#9c8c68',
      graticule: 'rgba(170, 185, 200, 0.18)',
      label: 'rgba(175, 190, 205, 0.4)',
      labelContinent: 'rgba(200, 188, 160, 0.18)',
      labelCountry: 'rgba(192, 180, 152, 0.45)',
      labelCity: 'rgba(210, 200, 175, 0.6)',
      cityDot: 'rgba(210, 200, 175, 0.55)',
      river: 'rgba(115, 150, 172, 0.4)',
      route: 'rgba(200, 105, 82, 0.55)',
      deep: 'rgba(160, 180, 195, 0.55)',
      atmosphere: '#22323c'
    }
  };

  // real soundings, labeled at close zoom like the depth figures on old charts
  var OCEAN_DEEPS = [
    { name: 'Mariana Deep', depth: '10 911 m', lat: 11.35, lng: 142.2 },
    { name: 'Tonga Deep', depth: '10 882 m', lat: -23.25, lng: -174.75 },
    { name: 'Philippine Deep', depth: '10 540 m', lat: 10.4, lng: 126.6 },
    { name: 'Kermadec Deep', depth: '10 047 m', lat: -31.9, lng: -177.3 },
    { name: 'Puerto Rico Trench', depth: '8 376 m', lat: 19.7, lng: -66.8 },
    { name: 'South Sandwich Trench', depth: '8 266 m', lat: -55.7, lng: -25.9 },
    { name: 'Java Trench', depth: '7 290 m', lat: -10.2, lng: 109.0 },
    { name: 'Diamantina Deep', depth: '7 079 m', lat: -33.8, lng: 101.3 }
  ];

  // the expedition track: an explicit `route:` slug list in gallery.yml wins;
  // otherwise route_order decides — journey (default) | alphabetical | file | nearest
  function routePoints() {
    var albums = (window.GALLERY_ALBUMS || []).slice();
    if (albums.length < 2) return albums;
    var explicit = window.GALLERY_ROUTE;
    if (explicit && explicit.length > 1) {
      var bySlug = {};
      albums.forEach(function (a) {
        var m = a.url.match(/\/albums\/([^/]+)\//);
        if (m) bySlug[m[1]] = a;
      });
      return explicit.map(function (s) { return bySlug[s]; }).filter(Boolean);
    }
    var mode = (window.GALLERY_CONFIG || {}).routeOrder || 'journey';
    // sequential camera numbering approximates visit chronology
    function photoNum(a) {
      var m = String(a.firstPhoto || '').match(/(\d+)/);
      return m ? parseInt(m[1], 10) : Infinity;
    }
    function sq(a, b) {
      var dLat = a.lat - b.lat;
      var dLng = (a.lng - b.lng) * Math.cos((a.lat + b.lat) / 2 * Math.PI / 180);
      return dLat * dLat + dLng * dLng;
    }
    if (mode === 'alphabetical') {
      albums.sort(function (a, b) { return a.title < b.title ? -1 : 1; });
    } else if (mode === 'nearest') {
      // greedy shortest-hop chain from the earliest-visited city
      albums.sort(function (a, b) { return photoNum(a) - photoNum(b); });
      var chain = [albums.shift()];
      while (albums.length) {
        var last = chain[chain.length - 1], bi = 0, bd = Infinity;
        albums.forEach(function (a, i) {
          var d = sq(a, last);
          if (d < bd) { bd = d; bi = i; }
        });
        chain.push(albums.splice(bi, 1)[0]);
      }
      return chain;
    } else if (mode !== 'file') {
      albums.sort(function (a, b) { return photoNum(a) - photoNum(b); });
    }
    return albums;
  }

  // sample a great-circle arc between two points (slerp on the unit sphere)
  function greatCircle(a, b, n) {
    var rad = Math.PI / 180;
    function vec(p) {
      var la = p.lat * rad, lo = p.lng * rad;
      return [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
    }
    var v1 = vec(a), v2 = vec(b);
    var dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
    var d = Math.acos(dot);
    if (d < 1e-6) return [a, b];
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n;
      var k1 = Math.sin((1 - t) * d) / Math.sin(d);
      var k2 = Math.sin(t * d) / Math.sin(d);
      var x = k1 * v1[0] + k2 * v2[0];
      var y = k1 * v1[1] + k2 * v2[1];
      var z = k1 * v1[2] + k2 * v2[2];
      pts.push({ lat: Math.asin(z) / rad, lng: Math.atan2(y, x) / rad });
    }
    return pts;
  }

  var OCEAN_LABELS = [
    { text: 'PACIFIC OCEAN', lat: -2, lng: -142, size: 46 },
    { text: 'ATLANTIC', lat: 25, lng: -42, size: 40 },
    { text: 'OCEAN', lat: 18, lng: -42, size: 40 },
    { text: 'INDIAN OCEAN', lat: -22, lng: 78, size: 42 },
    { text: 'SOUTHERN OCEAN', lat: -60, lng: -80, size: 38 },
    { text: 'SOUTHERN OCEAN', lat: -60, lng: 90, size: 38 }
  ];

  // spanDeg caps each name to roughly its landmass's width
  var CONTINENT_LABELS = [
    { text: 'NORTH AMERICA', lat: 46, lng: -101, spanDeg: 50 },
    { text: 'SOUTH AMERICA', lat: -14, lng: -60, spanDeg: 26 },
    { text: 'AFRICA', lat: 9, lng: 18, spanDeg: 38 },
    { text: 'EUROPE', lat: 54, lng: 22, spanDeg: 24 },
    { text: 'ASIA', lat: 52, lng: 95, spanDeg: 55 },
    { text: 'AUSTRALIA', lat: -25.5, lng: 134, spanDeg: 24 }
  ];

  var CITY_LABELS = [
    { text: 'London', lat: 51.51, lng: -0.13 },
    { text: 'Paris', lat: 48.86, lng: 2.35 },
    { text: 'Madrid', lat: 40.42, lng: -3.7 },
    { text: 'Rome', lat: 41.9, lng: 12.5 },
    { text: 'Berlin', lat: 52.52, lng: 13.4 },
    { text: 'Istanbul', lat: 41.01, lng: 28.98 },
    { text: 'Moscow', lat: 55.76, lng: 37.62 },
    { text: 'Cairo', lat: 30.04, lng: 31.24 },
    { text: 'Lagos', lat: 6.52, lng: 3.38 },
    { text: 'Nairobi', lat: -1.29, lng: 36.82 },
    { text: 'Cape Town', lat: -33.92, lng: 18.42 },
    { text: 'Dubai', lat: 25.2, lng: 55.27 },
    { text: 'Mumbai', lat: 19.08, lng: 72.88 },
    { text: 'Delhi', lat: 28.61, lng: 77.21 },
    { text: 'Singapore', lat: 1.35, lng: 103.82 },
    { text: 'Hong Kong', lat: 22.32, lng: 114.17 },
    { text: 'Shanghai', lat: 31.23, lng: 121.47 },
    { text: 'Beijing', lat: 39.9, lng: 116.41 },
    { text: 'Tokyo', lat: 35.68, lng: 139.69 },
    { text: 'Sydney', lat: -33.87, lng: 151.21 },
    { text: 'New York', lat: 40.71, lng: -74.01 },
    { text: 'Chicago', lat: 41.88, lng: -87.63 },
    { text: 'Toronto', lat: 43.65, lng: -79.38 },
    { text: 'San Francisco', lat: 37.77, lng: -122.42 },
    { text: 'Los Angeles', lat: 34.05, lng: -118.24 },
    { text: 'Mexico City', lat: 19.43, lng: -99.13 },
    { text: 'Rio de Janeiro', lat: -22.91, lng: -43.17 },
    { text: 'Buenos Aires', lat: -34.6, lng: -58.38 }
  ];

  // ne_110m NAME values that read awkwardly on a map
  var COUNTRY_RENAMES = {
    'United States of America': 'United States',
    'Dem. Rep. Congo': 'D.R. Congo',
    'Central African Rep.': 'C. African Rep.',
    'Bosnia and Herz.': 'Bosnia',
    'Dominican Rep.': 'Dominican Rep.',
    'Papua New Guinea': 'Papua N. Guinea',
    'United Arab Emirates': 'U.A.E.'
  };

  // label spot for each sizeable country: centroid of its largest polygon ring,
  // plus that ring's longitude span so the type can be fitted to the country
  var countryLabelCache = null;
  function countryLabels(countries) {
    if (countryLabelCache) return countryLabelCache;
    var labels = [];
    countries.features.forEach(function (f) {
      var props = f.properties || {};
      if (props.CONTINENT === 'Antarctica' || props.CONTINENT === 'Seven seas (open ocean)') return;
      var geom = f.geometry;
      if (!geom) return;
      var polys = geom.type === 'Polygon' ? [geom.coordinates]
        : geom.type === 'MultiPolygon' ? geom.coordinates : [];
      var best = null;
      polys.forEach(function (rings) {
        var ring = rings[0];
        if (!ring || ring.length < 4) return;
        var area2 = 0, cx = 0, cy = 0;
        var minLng = Infinity, maxLng = -Infinity;
        for (var i = 0; i < ring.length - 1; i++) {
          area2 += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
          cx += ring[i][0];
          cy += ring[i][1];
          if (ring[i][0] < minLng) minLng = ring[i][0];
          if (ring[i][0] > maxLng) maxLng = ring[i][0];
        }
        cx /= (ring.length - 1);
        cy /= (ring.length - 1);
        var area = Math.abs(area2 / 2) * Math.cos(cy * Math.PI / 180);
        if (!best || area > best.area) best = { area: area, lat: cy, lng: cx, lngSpan: maxLng - minLng };
      });
      if (!best) return;
      var name = COUNTRY_RENAMES[props.NAME] || props.NAME || '';
      if (name) labels.push({ text: name.toUpperCase(), lat: best.lat, lng: best.lng, area: best.area, lngSpan: best.lngSpan });
    });
    labels.sort(function (a, b) { return b.area - a.area; });
    countryLabelCache = labels.slice(0, 60);
    return countryLabelCache;
  }

  function isDarkTheme() {
    return document.body.classList.contains('theme-dark');
  }

  // tier: 'far' (continents only), 'mid' (+ countries), 'close' (+ cities)
  function buildMapTexture(countries, dark, tier) {
    var W = 4096, H = 2048;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    var P = dark ? MAP_PALETTES.dark : MAP_PALETTES.light;
    var px = function (lng) { return (lng + 180) / 360 * W; };
    var py = function (lat) { return (90 - lat) / 180 * H; };

    // ocean wash
    ctx.fillStyle = P.ocean;
    ctx.fillRect(0, 0, W, H);

    // watercolor mottling: soft random blots of lighter/darker wash
    for (var i = 0; i < 260; i++) {
      var bx = Math.random() * W;
      var by = Math.random() * H;
      var br = 60 + Math.random() * 220;
      var g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      var tone = Math.random() < 0.5 ? P.oceanLight : P.oceanDark;
      g.addColorStop(0, tone);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.05 + Math.random() * 0.06;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // land path (all rings; evenodd handles holes)
    var land = new Path2D();
    countries.features.forEach(function (f) {
      var geom = f.geometry;
      if (!geom) return;
      var polys = geom.type === 'Polygon' ? [geom.coordinates]
        : geom.type === 'MultiPolygon' ? geom.coordinates : [];
      polys.forEach(function (rings) {
        rings.forEach(function (ring) {
          ring.forEach(function (pt, k) {
            var X = px(pt[0]), Y = py(pt[1]);
            if (k === 0) land.moveTo(X, Y); else land.lineTo(X, Y);
          });
          land.closePath();
        });
      });
    });

    // coastal halo — the lightened water band hugging the shorelines
    ctx.lineJoin = 'round';
    ctx.strokeStyle = P.coastHalo;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 26;
    ctx.stroke(land);
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 12;
    ctx.stroke(land);
    ctx.globalAlpha = 1;

    // graticule under the land? vintage maps show it over water and land alike — draw under land fill, then a faint pass on top
    ctx.strokeStyle = P.graticule;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (var lng = -180; lng <= 180; lng += 15) {
      ctx.moveTo(px(lng), 0);
      ctx.lineTo(px(lng), H);
    }
    for (var lat = -75; lat <= 75; lat += 15) {
      ctx.moveTo(0, py(lat));
      ctx.lineTo(W, py(lat));
    }
    ctx.stroke();

    // land: cream fill, sand inner edge, fine sepia coastline
    ctx.fillStyle = P.land;
    ctx.fill(land, 'evenodd');
    ctx.save();
    ctx.clip(land, 'evenodd');
    ctx.strokeStyle = P.sand;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 10;
    ctx.stroke(land);
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = P.coastline;
    ctx.lineWidth = 2;
    ctx.stroke(land);

    // faint graticule pass over land so the grid reads continuously
    ctx.save();
    ctx.clip(land, 'evenodd');
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = P.graticule;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (lng = -180; lng <= 180; lng += 15) {
      ctx.moveTo(px(lng), 0);
      ctx.lineTo(px(lng), H);
    }
    for (lat = -75; lat <= 75; lat += 15) {
      ctx.moveTo(0, py(lat));
      ctx.lineTo(W, py(lat));
    }
    ctx.stroke();
    ctx.restore();

    if (tier !== 'far') {
      // lakes: little pools of the ocean colour with a fine coast line
      if (lakesData) {
        var lakes = new Path2D();
        lakesData.features.forEach(function (f) {
          var g = f.geometry;
          var polys = g.type === 'Polygon' ? [g.coordinates]
            : g.type === 'MultiPolygon' ? g.coordinates : [];
          polys.forEach(function (rings) {
            rings.forEach(function (ring) {
              for (var k = 0; k < ring.length; k++) {
                var X = px(ring[k][0]), Y = py(ring[k][1]);
                if (k === 0) lakes.moveTo(X, Y); else lakes.lineTo(X, Y);
              }
              lakes.closePath();
            });
          });
        });
        ctx.fillStyle = P.ocean;
        ctx.fill(lakes, 'evenodd');
        ctx.strokeStyle = P.coastline;
        ctx.lineWidth = 1.2;
        ctx.stroke(lakes, 'evenodd');
      }

      // rivers: fine blue threads across the land
      if (riversData) {
        ctx.strokeStyle = P.river;
        ctx.lineWidth = 1.7;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        riversData.features.forEach(function (f) {
          var g = f.geometry;
          var lines = g.type === 'LineString' ? [g.coordinates]
            : g.type === 'MultiLineString' ? g.coordinates : [];
          lines.forEach(function (line) {
            var prevX = null;
            for (var k = 0; k < line.length; k++) {
              var X = px(line[k][0]), Y = py(line[k][1]);
              if (k === 0 || (prevX !== null && Math.abs(X - prevX) > W / 2)) ctx.moveTo(X, Y);
              else ctx.lineTo(X, Y);
              prevX = X;
            }
          });
        });
        ctx.stroke();
      }
    }

    // letterspaced serif ocean labels
    ctx.fillStyle = P.label;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    OCEAN_LABELS.forEach(function (l) {
      ctx.font = 'italic ' + l.size + 'px Georgia, "Times New Roman", serif';
      ctx.fillText(l.text.split('').join('  '), px(l.lng), py(l.lat));
    });

    // continent names, fitted to their landmass; once cities appear they retire
    if (tier !== 'close') {
      ctx.fillStyle = P.labelContinent;
      CONTINENT_LABELS.forEach(function (l) {
        var spaced = l.text.split('').join('  ');
        ctx.font = '100px Georgia, "Times New Roman", serif';
        var w100 = ctx.measureText(spaced).width;
        var size = Math.floor(Math.min(100 * (l.spanDeg * (W / 360) * 0.95) / w100, 72));
        ctx.font = size + 'px Georgia, "Times New Roman", serif';
        ctx.fillText(spaced, px(l.lng), py(l.lat));
      });
    }

    if (tier === 'mid' || tier === 'close') {
      // country names, fitted: type is sized so the name spans no more than
      // its country's own footprint; names that can't fit are left off
      var degPx = W / 360;
      ctx.fillStyle = P.labelCountry;
      // labels go down in area order; anything that would overprint an
      // already-placed name is dropped, so big neighbours win
      var placed = [];
      countryLabels(countries).forEach(function (l) {
        var spaced = l.text.split('').join(' ');
        ctx.font = '100px Georgia, "Times New Roman", serif';
        var w100 = ctx.measureText(spaced).width;
        var maxWidth = l.lngSpan * degPx * 0.85;
        var areaSize = 16 + 1.6 * Math.sqrt(l.area);
        var size = Math.floor(Math.min(areaSize, 100 * maxWidth / w100, 38));
        if (size < 14) return;
        var tw = w100 * size / 100;
        var pad = 8;
        var box = {
          x0: px(l.lng) - tw / 2 - pad, x1: px(l.lng) + tw / 2 + pad,
          y0: py(l.lat) - size / 2 - pad, y1: py(l.lat) + size / 2 + pad
        };
        var collides = placed.some(function (b) {
          return box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0;
        });
        if (collides) return;
        placed.push(box);
        ctx.font = size + 'px Georgia, "Times New Roman", serif';
        ctx.fillText(spaced, px(l.lng), py(l.lat));
      });

      // your places: every album location is named on the map in the voyage's
      // vermilion. Bigger collections win when places crowd together at mid
      // zoom; by close zoom they have room and all of them print.
      var albumLabels = (window.GALLERY_ALBUMS || []).slice().sort(function (a, b) {
        return (b.photoCount || 0) - (a.photoCount || 0);
      });
      ctx.textAlign = 'left';
      ctx.fillStyle = P.route.replace(/[\d.]+\)$/, '0.95)');
      var placedAlbums = [];
      albumLabels.forEach(function (a) {
        var name = a.title.replace(/(^|\s|-)\S/g, function (c) { return c.toUpperCase(); });
        var size = tier === 'close' ? 22 : 26;
        ctx.font = 'italic ' + size + 'px Georgia, "Times New Roman", serif';
        var tw = ctx.measureText(name).width;
        var X = px(a.lng) + 12, Y = py(a.lat);
        var box = { x0: X - 4, x1: X + tw + 4, y0: Y - size / 2 - 4, y1: Y + size / 2 + 4 };
        var collides = placedAlbums.some(function (b) {
          return box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0;
        });
        if (collides) return;
        placedAlbums.push(box);
        ctx.fillText(name, X, Y);
      });
      ctx.textAlign = 'center';
    }

    if (tier === 'close') {
      // cities: a small dot and fine roman type — the lean-in tier.
      // cities that already carry an album pin are redundant and skipped,
      // so this list adapts as albums are added
      ctx.textAlign = 'left';
      var pinned = window.GALLERY_ALBUMS || [];
      CITY_LABELS.forEach(function (l) {
        var redundant = pinned.some(function (a) {
          var dLat = a.lat - l.lat;
          var dLng = (a.lng - l.lng) * Math.cos(l.lat * Math.PI / 180);
          return dLat * dLat + dLng * dLng < 6.25; // within ~2.5°
        });
        if (redundant) return;
        var X = px(l.lng), Y = py(l.lat);
        ctx.fillStyle = P.cityDot;
        ctx.beginPath();
        ctx.arc(X, Y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = P.labelCity;
        ctx.font = '19px Georgia, "Times New Roman", serif';
        ctx.fillText(l.text, X + 8, Y - 1);
      });

      // ocean deeps: real soundings in fine italic, like an old bathymetric chart
      ctx.textAlign = 'center';
      ctx.fillStyle = P.deep;
      OCEAN_DEEPS.forEach(function (d) {
        var X = px(d.lng), Y = py(d.lat);
        ctx.font = '16px Georgia, "Times New Roman", serif';
        ctx.fillText('+', X, Y);
        ctx.font = 'italic 17px Georgia, "Times New Roman", serif';
        ctx.fillText(d.name, X, Y + 18);
        ctx.fillText(d.depth, X, Y + 36);
      });
    }

    // the voyage: a dashed expedition track through every album city, at every zoom
    var stops = routeVisible ? routePoints() : [];
    if (stops.length > 1) {
      ctx.strokeStyle = P.route;
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 9]);
      ctx.lineJoin = 'round';
      ctx.beginPath();
      for (var s = 0; s < stops.length - 1; s++) {
        var arc = greatCircle(stops[s], stops[s + 1], 48);
        var prevAX = null;
        arc.forEach(function (pt, k) {
          var X = px(pt.lng), Y = py(pt.lat);
          if (k === 0 || (prevAX !== null && Math.abs(X - prevAX) > W / 2)) ctx.moveTo(X, Y);
          else ctx.lineTo(X, Y);
          prevAX = X;
        });
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    return canvas.toDataURL('image/jpeg', 0.92);
  }

  // rotation controls, assigned once the globe exists (pins pause the spin while hovered)
  var rotPause = null;
  var rotResume = null;

  function makePin(album) {
    var el = document.createElement('a');
    el.className = 'globe-pin';
    el.href = album.url;
    el.innerHTML =
      '<span class="globe-pin-dot"></span>' +
      '<span class="globe-pin-card">' +
      '<img src="' + album.cover + '" alt="" loading="lazy">' +
      '<span class="globe-pin-label">' + album.title + '</span>' +
      '</span>';
    el.style.pointerEvents = 'auto';
    el.addEventListener('mouseenter', function () { if (rotPause) rotPause(); });
    el.addEventListener('mouseleave', function () { if (rotResume) rotResume(1500); });
    return el;
  }

  var plateCache = {};
  var currentTier = 'far';
  var routeVisible = true;

  function setPlate() {
    if (!globeInstance || !countriesData) return;
    var key = (isDarkTheme() ? 'dark-' : 'light-') + currentTier + (routeVisible ? '-route' : '');
    if (!plateCache[key]) plateCache[key] = buildMapTexture(countriesData, isDarkTheme(), currentTier);
    globeInstance.globeImageUrl(plateCache[key]);
  }

  // label tiers by camera altitude, with hysteresis so plates don't flicker at a boundary
  function tierFor(alt, prev) {
    var t = alt > 1.5 ? 'far' : alt > 0.95 ? 'mid' : 'close';
    if (prev === 'mid' && t === 'far' && alt < 1.6) t = 'mid';
    if (prev === 'close' && t === 'mid' && alt < 1.05) t = 'close';
    return t;
  }

  function applyGlobeTheme() {
    if (!globeInstance) return;
    setPlate();
    globeInstance.atmosphereColor(isDarkTheme() ? MAP_PALETTES.dark.atmosphere : MAP_PALETTES.light.atmosphere);
  }

  function initGlobeView() {
    var container = document.getElementById('globe-container');
    var albums = window.GALLERY_ALBUMS || [];
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    Promise.all([
      loadScript('/assets/vendor/globe.gl.min.js'),
      fetch('/assets/vendor/ne_110m_admin_0_countries.geojson').then(function (r) { return r.json(); }),
      // detail layers are optional — the globe still renders if they fail
      fetch('/assets/vendor/ne_50m_rivers.geojson').then(function (r) { return r.json(); }).catch(function () { return null; }),
      fetch('/assets/vendor/ne_50m_lakes.geojson').then(function (r) { return r.json(); }).catch(function () { return null; })
    ]).then(function (results) {
      countriesData = results[1];
      riversData = results[2];
      lakesData = results[3];
      var dark = isDarkTheme();
      var P = dark ? MAP_PALETTES.dark : MAP_PALETTES.light;
      container.innerHTML = '';

      var width = container.clientWidth;
      var height = Math.max(420, Math.min(640, Math.round(window.innerHeight * 0.7)));

      globeInstance = Globe()(container)
        .width(width)
        .height(height)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor(P.atmosphere)
        .atmosphereAltitude(0.16)
        .htmlElementsData(albums)
        .htmlLat(function (d) { return d.lat; })
        .htmlLng(function (d) { return d.lng; })
        .htmlAltitude(0.02)
        .htmlElement(makePin)
        .htmlElementVisibilityModifier(function (el, isVisible) {
          el.style.opacity = isVisible ? '1' : '0';
          el.style.pointerEvents = isVisible ? 'auto' : 'none';
        });

      // start over the Atlantic so both the US and Europe pins are in view
      globeInstance.pointOfView({ lat: 35, lng: -40, altitude: 2.2 }, 0);
      currentTier = 'far';
      setPlate();

      // swap in the finer-labeled plate as the visitor zooms
      globeInstance.onZoom(function (pov) {
        var t = tierFor(pov.altitude, currentTier);
        if (t !== currentTier) {
          currentTier = t;
          setPlate();
        }
      });

      var controls = globeInstance.controls();
      controls.autoRotate = !reducedMotion;
      controls.autoRotateSpeed = 0.6;
      controls.enableDamping = true;
      // globe radius is 100; stop zooming while city type is still crisp,
      // and before the globe shrinks to a coin
      controls.minDistance = 165;
      controls.maxDistance = 400;

      // keep the globe slowly turning: pause while grabbed (or hovering a pin),
      // resume a moment after the visitor lets go
      var rotateTimer = null;
      rotPause = function () {
        controls.autoRotate = false;
        if (rotateTimer) clearTimeout(rotateTimer);
        rotateTimer = null;
      };
      rotResume = function (delay) {
        if (reducedMotion) return;
        if (rotateTimer) clearTimeout(rotateTimer);
        rotateTimer = setTimeout(function () { controls.autoRotate = true; }, delay);
      };
      controls.addEventListener('start', rotPause);
      controls.addEventListener('end', function () { rotResume(3000); });

      // route on/off toggle
      var routeBtn = document.getElementById('route-toggle');
      if (routeBtn) {
        routeBtn.hidden = false;
        routeBtn.addEventListener('click', function () {
          routeVisible = !routeVisible;
          routeBtn.setAttribute('aria-pressed', String(routeVisible));
          routeBtn.classList.toggle('is-off', !routeVisible);
          setPlate();
        });
      }

      // track the container across window resizes and orientation changes
      function fitGlobe() {
        globeInstance
          .width(container.clientWidth)
          .height(Math.max(360, Math.min(640, Math.round(window.innerHeight * 0.7))));
      }
      if (window.ResizeObserver) {
        new ResizeObserver(fitGlobe).observe(container);
      } else {
        window.addEventListener('resize', fitGlobe);
      }

      // keep the map plate in sync with the site theme toggle
      var wasDark = dark;
      new MutationObserver(function () {
        if (isDarkTheme() !== wasDark) {
          wasDark = isDarkTheme();
          applyGlobeTheme();
        }
      }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }).catch(function (err) {
      container.innerHTML = '<p class="globe-loading">could not load the globe.</p>';
      console.error('Globe failed to load', err);
    });
  }

  setView(viewFromHash());
})();

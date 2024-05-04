

mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    // choose from mapbox's core styles , or make yourmown style withnmapbox studio
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});


// console.log(coordinates);

// to create by default map marker
const marker = new mapboxgl.Marker({color : "red"})
 .setLngLat(listing.geometry.coordinates)  //listing.geometry.coordinates
 .setPopup(new mapboxgl.Popup({offset:25})
 .setHTML(` <h4>${listing.title}</h4><p>exact location will be provided after booking</p>`))
 .addTo(map);
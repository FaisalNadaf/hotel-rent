maptilersdk.config.apiKey = maptoken;
    const map = new maptilersdk.Map({
      container: 'map', // container's id or the HTML element in which the SDK will render the map
      style: maptilersdk.MapStyle.STREETS,
      center: [ 74.498703,15.852792], // starting position [lng, lat]
      zoom: 10 // starting zoom
    });
 

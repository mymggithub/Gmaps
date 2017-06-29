var map;
var bounds;
var infowindow;
var markerList = {};

function initialize(locations) {
    locations = [
        ['Bondi Beach', -33.890542, 151.274856, 'Bondi Beach'],
        ['Coogee Beach', -33.923036, 151.259052, 'Coogee Beach'],
        ['Cronulla Beach', -34.028249, 151.157507, 'Cronulla Beach'],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 'Manly Beach'],
        ['Maroubra Beach', -33.950198, 151.259302, 'Maroubra Beach']
    ];

	/*<div id="map" style="width:100%;height:380px;"></div>*/
    map = new google.maps.Map(document.getElementById("map"), {
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
        },
        /*zoom: 9,*/
        mapTypeId: google.maps.MapTypeId.ROADMAP

    });

    infowindow = new google.maps.InfoWindow();

    bounds = new google.maps.LatLngBounds();
    loadMarkers();
}

function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDY0kkJiTPVd2U7aTOAwhc9ySH6oHxOIYM&sensor=true' + '&callback=initialize'; //initialize the function here
    document.body.appendChild(script);
}

function loadMarkers(){
    $.getJSON('feed/?_=map'+location.search.replace("?","&").replace("&mode=map","")+'&mode=map', function(data) {
        $.each(data, function(i, item) {
            loadMarker(item,i);
        });
        map.fitBounds(bounds);
        var listener = google.maps.event.addListener(map, "idle", function () {
            google.maps.event.removeListener(listener);
        });
    });
}

function loadMarker(item,i){
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(item[1], item[2]),
        title: item[3],
        icon: 'images/home1.small.png',
        map: map
    });
    bounds.extend(marker.position);
    google.maps.event.addListener(marker, 'click', (
        function (marker, i) {
            return function () {
                infowindow.setContent((item[0]));
                infowindow.open(map, marker);
            };
        })(marker, i)
    );
    google.maps.event.addListener(marker, 'dblclick', (
        function (marker, i) {
            return function () {
                map.setZoom(19);
                map.setCenter(marker.getPosition());
                infowindow.setContent(item[0]);
                infowindow.open(map, marker);
            };
        })(marker, i)
    );
}
function createInfoBox(item){
    date = $("<img>",{
        href:"images/date.png",
        width:15,
        height:15,
        alt:"date"
    }).wrap('<div/>').wrap('<div/>').parent().html();
    time = $("<img>",{
        href:'images/time.png',
        width:15,
        height:15,
        alt:"time"
    }).wrap('<div/>').parent().html();
    return date+"On "+time+"Hours @ ";
}
window.onload = loadScript;
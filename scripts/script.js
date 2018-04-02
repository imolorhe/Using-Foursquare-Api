const HOST = "https://api.foursquare.com/v2";
const CLIENT_ID = "C0TLC3WLVTWCDY34FEXLSHXP3OTECVYAOWIIZGMD1HEP3A1I";
const CLIENT_SECRET = "1BRA5ZO1U1CJB0OJNE1MLSH0VIVZ4SVYRJRGZ5M31GLAK0AO";


$(document).ready(function() {
    const $venues = $(".venue");
    const $photos = $(".icon");



    function initAutocomplete() {
      // Create the search box and link it to the UI element.
      let input = $('.address-box');

      console.log("i got the box:" + input);

      let searchBox = new google.maps.places.SearchBox(input);

      console.log("Now Searchbox o:" + searchBox);

      searchBox.addListener('places_changed', function() {

          let places = searchBox.getPlaces();

          if (places.length == 0) {
              return;
          }

          console.log(places);


          // For each place, get the icon, name and location.
          let bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
              if (!place.geometry) {
                  console.log("Returned place contains no geometry");
                  return;
              }
          });
      });
    }

    $("#searchform").submit(event => {
        const entry = $("#query").val();
        const radius = $("#radius").val();

        event.preventDefault();
        $.ajax({
                url: `${HOST}/venues/explore?near=${entry}&radius=${radius}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180328`,
                method: "GET"
            })
            .done(res => {
                console.log(res.response.groups[0].items);

                const { response: { groups } } = res;

                groups[0].items.forEach(place => {
                    let icon =
                        place.venue.categories[0].icon.prefix +
                        "64" +
                        place.venue.categories[0].icon.suffix;

                    //console.log(res.response.groups[0].items[0].venue.categories[0].icon)

                    $venues.append(
                        `
                        <div class="venue-place">
                          <div class="image" style="background: #300">
                            <img src=${icon} alt=${place.venue.categories[0].name} />
                          </div>

                          <div class="details">
                            <h4>${place.venue.name}</h4>
                            <div class="rating">
                              ${place.venue.rating ? place.venue.rating : ""}
                            </div>
                            <div class="address">
                              ${place.venue.location.address ? place.venue.location.address : ""}
                            </div>
                            <div class="type">
                              ${place.venue.categories[0].name}
                            </div>
                            <div class="contact">
                              ${place.venue.contact.phone ? place.venue.contact.phone : ""}
                            </div>
                          </div>
                          
                        </div>  
                      `
                    );
                });
            })
            .fail(err => console.log(err));
    });

    /*
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        $.ajax({
          url: `${HOST}/venues/explore?ll=${lat},${long}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180328`,
          method: "GET"
        }).done(response => {
          const location = response.response.headerLocation;
          $('#venue').append(location);
        });
      });
    } else {
      console.log("This browser doesn't support location services");
    }
    */
});


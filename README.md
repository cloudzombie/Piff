# Piff
This is a web based application fuctioning on client side only. The user interfaces with a map object provided by
google maps API and queries for cannabis strains, in states where it is legal, and the cannabis reports API
returns positions of dispensaries which sell that strain. A marker is placed on each lat and lng.

There is on input field for text; type the strain you want and click the leaf. Or type a location and click the phone. The API 
is still being developed so the sucess of the queries is location dependent.

Features I want to add:

A button to toggle querying for extracts instead of strains
Styling
An accordion button which brings the user to a new view which lists divs containing results from a strain query; 
each div has the name, address, phone, etc of the dispensary and the dispensaries are ordered by distance from user

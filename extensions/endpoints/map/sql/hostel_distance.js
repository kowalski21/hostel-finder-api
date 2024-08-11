exports.hostelDistanceSql = `

WITH reference_point AS (
    SELECT ll_to_earth(?, ?) AS ref_point
)
SELECT *,
       earth_distance(
           ref_point,
           ll_to_earth(lat, lng)
       ) AS distance_in_meters
FROM hostel, reference_point
 WHERE earth_distance(
   ref_point,
  ll_to_earth(lat, lng)
 ) <= ?;

`;

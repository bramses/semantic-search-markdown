import axios from "axios";

// create collection
/*
curl -X PUT 'http://localhost:6333/collections/test_collection' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "vector_size": 4,
        "distance": "Dot"
    }'
*/
export async function createCollection(
  collectionName: string,
  vectorSize: number,
  distance: string
) {
  const url = `http://localhost:6333/collections/${collectionName}`;
  const data = {
    vector_size: vectorSize,
    distance: distance,
  };
  const response = await axios.put(url, data);
  return response.data;
}

// test if collection exists
/*
curl 'http://localhost:6333/collections/test_collection'
*/

export async function collectionExists(collectionName: string) {
  try {
    const url = `http://localhost:6333/collections/${collectionName}`;
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return true;
  } catch (err: any) {
    if (err.response.status == 404) {
      return false;
    }
  }
}

// add points to collection
/*
curl -L -X PUT 'http://localhost:6333/collections/test_collection/points?wait=true' \
    -H 'Content-Type: application/json' \
    --data-raw '{
        "points": [
          {"id": 1, "vector": [0.05, 0.61, 0.76, 0.74], "payload": {"city": "Berlin" }},
          {"id": 2, "vector": [0.19, 0.81, 0.75, 0.11], "payload": {"city": ["Berlin", "London"] }},
          {"id": 3, "vector": [0.36, 0.55, 0.47, 0.94], "payload": {"city": ["Berlin", "Moscow"] }},
          {"id": 4, "vector": [0.18, 0.01, 0.85, 0.80], "payload": {"city": ["London", "Moscow"] }},
          {"id": 5, "vector": [0.24, 0.18, 0.22, 0.44], "payload": {"count": [0] }},
          {"id": 6, "vector": [0.35, 0.08, 0.11, 0.44]}
        ] 
    }'
*/
export async function addPoints(collectionName: string, points: any[]) {
  const url = `http://localhost:6333/collections/${collectionName}/points?wait=true`;
  const data = {
    points: points,
  };
  const response = await axios.put(url, data);
  return response.data;
}

// search points with query and an optional filter
/*
curl -L -X POST 'http://localhost:6333/collections/test_collection/points/search' \
    -H 'Content-Type: application/json' \
    --data-raw '{
      "filter": {
          "should": [
              {
                  "key": "city",
                  "match": {
                      "value": "London"
                  }
              }
          ]
      },
      "vector": [0.2, 0.1, 0.9, 0.7],
      "top": 3
  }'
*/
export async function searchPoints(
  collectionName: string,
  vector: number[],
  top: number,
  filter?: any
) {
  const url = `http://localhost:6333/collections/${collectionName}/points/search`;
  const data: any = {
    vector: vector,
    top: top,
    with_vector: true,
    with_payload: true,
  };
  if (filter) {
    data["filter"] = filter;
  }
  const response = await axios.post(url, data);
  return response.data;
}


// scroll collection for filename
/*
POST /collections/{collection_name}/points/scroll

{
    "filter": {
        "must": [
            { "key": "city", "match": { "value": "London" } },
            { "key": "color", "match": { "value": "red" } }
        ]
    }
  ...
}
*/
export async function scrollPoints(collectionName: string, filename: string) {
  const url = `http://localhost:6333/collections/${collectionName}/points/scroll`;
  const data: any = {
    with_vector: true,
    with_payload: true,
    filter: {
        must: [
            { "key": "filename", "match": { "value": filename } },
        ]
    }
  };
  
  const response = await axios.post(url, data);
  return response.data;
}
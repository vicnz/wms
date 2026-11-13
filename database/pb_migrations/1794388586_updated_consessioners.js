/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "authToken": {
      "duration": 28800
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "authToken": {
      "duration": 432000
    }
  }, collection)

  return app.save(collection)
})

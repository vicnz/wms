/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update collection data
  unmarshal({
    "name": "readings"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update collection data
  unmarshal({
    "name": "records"
  }, collection)

  return app.save(collection)
})

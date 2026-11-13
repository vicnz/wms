/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"users\" && @request.auth.role = \"admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"users\""
  }, collection)

  return app.save(collection)
})

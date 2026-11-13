/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"users\"",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"users\"",
    "listRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"users\"",
    "updateRule": "@request.auth.id != \"\" && @request.auth.collectionName = \"users\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})

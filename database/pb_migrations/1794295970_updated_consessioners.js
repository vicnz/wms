/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "authRule": "@request.auth.id != \"\" && verified = true\n",
    "viewRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3251011402")

  // update collection data
  unmarshal({
    "authRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
})

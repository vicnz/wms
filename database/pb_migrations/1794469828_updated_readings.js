/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3017429457",
    "help": "",
    "hidden": false,
    "id": "relation1577127086",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "meter",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // update field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3017429457",
    "help": "",
    "hidden": false,
    "id": "relation1577127086",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "meter",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})

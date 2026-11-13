/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_784330245")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\""
  }, collection)

  // remove field
  collection.fields.removeById("_clone_aSkO")

  // remove field
  collection.fields.removeById("_clone_0gmg")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2324088501",
    "help": "",
    "hidden": false,
    "id": "_clone_hdQn",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "account_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_aVb3",
    "max": "",
    "min": "",
    "name": "billing_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_784330245")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2324088501",
    "help": "",
    "hidden": false,
    "id": "_clone_aSkO",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "account_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "_clone_0gmg",
    "max": "",
    "min": "",
    "name": "billing_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("_clone_hdQn")

  // remove field
  collection.fields.removeById("_clone_aVb3")

  return app.save(collection)
})

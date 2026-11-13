/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1140330741",
    "max": 0,
    "min": 0,
    "name": "account_no",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
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

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "json3268033821",
    "maxSize": 0,
    "name": "service_address",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "json1717625942",
    "maxSize": 0,
    "name": "billing_address",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 0,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "residential",
      "commercial",
      "institutional"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2324088501")

  // remove field
  collection.fields.removeById("text1140330741")

  // remove field
  collection.fields.removeById("relation1577127086")

  // remove field
  collection.fields.removeById("json3268033821")

  // remove field
  collection.fields.removeById("json1717625942")

  // remove field
  collection.fields.removeById("select2363381545")

  return app.save(collection)
})

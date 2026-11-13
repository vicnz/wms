/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // add field
  collection.fields.addAt(5, new Field({
    "help": "Start of Billing Date",
    "hidden": false,
    "id": "date3105530224",
    "max": "",
    "min": "",
    "name": "from",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "help": "End of Billing Date",
    "hidden": false,
    "id": "date3616002756",
    "max": "",
    "min": "",
    "name": "to",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_231614380")

  // remove field
  collection.fields.removeById("date3105530224")

  // remove field
  collection.fields.removeById("date3616002756")

  return app.save(collection)
})

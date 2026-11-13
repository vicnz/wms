/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3912360763")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2324088501",
    "help": "",
    "hidden": false,
    "id": "relation2100713124",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "account",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_231614380",
    "help": "",
    "hidden": false,
    "id": "relation3239771201",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "reading",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "help": "",
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "help": "",
    "hidden": false,
    "id": "date3742343818",
    "max": "",
    "min": "",
    "name": "due",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "help": "",
    "hidden": false,
    "id": "number1024146525",
    "max": null,
    "min": null,
    "name": "base_charge",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "help": "",
    "hidden": false,
    "id": "number3322740063",
    "max": null,
    "min": null,
    "name": "consumption_charge",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "help": "",
    "hidden": false,
    "id": "number2390866550",
    "max": null,
    "min": null,
    "name": "tax",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "help": "Compute on Filter",
    "hidden": false,
    "id": "number1994449543",
    "max": null,
    "min": null,
    "name": "total_due",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3912360763")

  // remove field
  collection.fields.removeById("relation2100713124")

  // remove field
  collection.fields.removeById("relation3239771201")

  // remove field
  collection.fields.removeById("date2862495610")

  // remove field
  collection.fields.removeById("date3742343818")

  // remove field
  collection.fields.removeById("number1024146525")

  // remove field
  collection.fields.removeById("number3322740063")

  // remove field
  collection.fields.removeById("number2390866550")

  // remove field
  collection.fields.removeById("number1994449543")

  return app.save(collection)
})

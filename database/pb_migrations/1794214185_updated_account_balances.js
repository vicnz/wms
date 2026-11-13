/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1665010914")

  // update collection data
  unmarshal({
    "viewQuery": "\nSELECT \n    a.id AS id, -- PocketBase requires a unique string/text/id column mapped as 'id'\n    a.id AS account_id,\n    a.user AS user_id, -- Handy for filtering by the logged-in PocketBase user\n    a.account_no AS account_number,\n    IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) AS total_billed,\n    IFNULL(SUM(p.amount), 0) AS total_paid,\n    (IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) - IFNULL(SUM(p.amount), 0)) AS remaining_balance\nFROM accounts a\nLEFT JOIN bills b ON a.id = b.account\nLEFT JOIN payments p ON b.id = p.bill\nGROUP BY a.id;\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_DKsL")

  // remove field
  collection.fields.removeById("_clone_aByU")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3251011402",
    "help": "",
    "hidden": false,
    "id": "_clone_XnTn",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "user_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_GrsS",
    "max": 0,
    "min": 0,
    "name": "account_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1665010914")

  // update collection data
  unmarshal({
    "viewQuery": "\nSELECT \n    a.id AS id, -- PocketBase requires a unique string/text/id column mapped as 'id'\n    a.id AS account_id,\n    a.owner AS user_id, -- Handy for filtering by the logged-in PocketBase user\n    a.account_no AS account_number,\n    IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) AS total_billed,\n    IFNULL(SUM(p.amount), 0) AS total_paid,\n    (IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) - IFNULL(SUM(p.amount), 0)) AS remaining_balance\nFROM accounts a\nLEFT JOIN bills b ON a.id = b.account\nLEFT JOIN payments p ON b.id = p.bill\nGROUP BY a.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "help": "",
    "hidden": false,
    "id": "_clone_DKsL",
    "maxSelect": 0,
    "minSelect": 0,
    "name": "user_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "_clone_aByU",
    "max": 0,
    "min": 0,
    "name": "account_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("_clone_XnTn")

  // remove field
  collection.fields.removeById("_clone_GrsS")

  return app.save(collection)
})

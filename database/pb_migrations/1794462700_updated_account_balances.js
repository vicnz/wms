/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1665010914")

  // update collection data
  unmarshal({
    "viewQuery": "WITH account_bills AS (\n    SELECT \n        account AS account_id,\n        SUM(base_charge + consumption_charge + tax) AS total_billed\n    FROM bills\n    GROUP BY account\n),\naccount_payments AS (\n    SELECT \n        b.account AS account_id,\n        SUM(p.amount) AS total_paid\n    FROM payments p\n    JOIN bills b ON p.bill = b.id\n    GROUP BY b.account\n)\nSELECT \n    a.id AS id, -- PocketBase requires a unique string/text/id column mapped as 'id'\n    a.id AS account_id,\n    a.user AS user_id, -- Handy for filtering by the logged-in PocketBase user\n    a.account_no AS account_number,\n    IFNULL(b.total_billed, 0) AS total_billed,\n    IFNULL(p.total_paid, 0) AS total_paid,\n    (IFNULL(b.total_billed, 0) - IFNULL(p.total_paid, 0)) AS remaining_balance\nFROM accounts a\nLEFT JOIN account_bills b ON a.id = b.account_id\nLEFT JOIN account_payments p ON a.id = p.account_id;\n"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_hfBc")

  // remove field
  collection.fields.removeById("_clone_MP0C")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3251011402",
    "help": "",
    "hidden": false,
    "id": "_clone_Z8uX",
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
    "id": "_clone_93m9",
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
    "viewQuery": "\nSELECT \n    a.id AS id, -- PocketBase requires a unique string/text/id column mapped as 'id'\n    a.id AS account_id,\n    a.user AS user_id, -- Handy for filtering by the logged-in PocketBase user\n    a.account_no AS account_number,\n    IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) AS total_billed,\n    IFNULL(SUM(p.amount), 0) AS total_paid,\n    (IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) - IFNULL(SUM(p.amount), 0)) AS remaining_balance\nFROM accounts a\nLEFT JOIN bills b ON a.id = b.account\nLEFT JOIN payments p ON b.id = p.bill\nGROUP BY a.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3251011402",
    "help": "",
    "hidden": false,
    "id": "_clone_hfBc",
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
    "id": "_clone_MP0C",
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
  collection.fields.removeById("_clone_Z8uX")

  // remove field
  collection.fields.removeById("_clone_93m9")

  return app.save(collection)
})

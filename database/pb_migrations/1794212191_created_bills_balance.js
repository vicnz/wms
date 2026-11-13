/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "help": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_3912360763",
        "help": "",
        "hidden": false,
        "id": "relation445387509",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "bill_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
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
      },
      {
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
      },
      {
        "help": "",
        "hidden": false,
        "id": "json3722269586",
        "maxSize": 1,
        "name": "original_amount",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json2911591090",
        "maxSize": 1,
        "name": "total_paid_to_date",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json605555508",
        "maxSize": 1,
        "name": "remaining_bill_balance",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_784330245",
    "indexes": [],
    "listRule": null,
    "name": "bills_balance",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "\nSELECT \n    b.id AS id, -- pocketbase view collection requirement\n    b.id AS bill_id,\n    b.account AS account_id,\n    b.date AS billing_date,\n    (b.base_charge + b.consumption_charge + tax) AS original_amount,\n    IFNULL(SUM(p.amount), 0) AS total_paid_to_date,\n    ((b.base_charge + b.consumption_charge + tax) - IFNULL(SUM(p.amount), 0)) AS remaining_bill_balance\nFROM bills b\nLEFT JOIN payments p ON b.id = p.bill\nGROUP BY b.id;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_784330245");

  return app.delete(collection);
})

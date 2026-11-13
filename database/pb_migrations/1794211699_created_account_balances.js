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
        "collectionId": "pbc_2324088501",
        "help": "",
        "hidden": false,
        "id": "relation2607505338",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "account_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
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
      },
      {
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
      },
      {
        "help": "",
        "hidden": false,
        "id": "json3399514500",
        "maxSize": 1,
        "name": "total_billed",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json2207660229",
        "maxSize": 1,
        "name": "total_paid",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "help": "",
        "hidden": false,
        "id": "json3165886577",
        "maxSize": 1,
        "name": "remaining_balance",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_1665010914",
    "indexes": [],
    "listRule": null,
    "name": "account_balances",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "\nSELECT \n    a.id AS id, -- PocketBase requires a unique string/text/id column mapped as 'id'\n    a.id AS account_id,\n    a.owner AS user_id, -- Handy for filtering by the logged-in PocketBase user\n    a.account_no AS account_number,\n    IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) AS total_billed,\n    IFNULL(SUM(p.amount), 0) AS total_paid,\n    (IFNULL(SUM(b.base_charge + b.consumption_charge + b.tax), 0) - IFNULL(SUM(p.amount), 0)) AS remaining_balance\nFROM accounts a\nLEFT JOIN bills b ON a.id = b.account\nLEFT JOIN payments p ON b.id = p.bill\nGROUP BY a.id;\n",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1665010914");

  return app.delete(collection);
})

export const data = {
  "models": {
    "2": {
      "name": "AccountModel",
      "properties": {
        "id": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" },
            { "name": "pending_activation", "value": "Pending Activation" }]
        },
        "guid": { "type": "varchar" },
        "address": { "type": null },
        "email": { "type": "varchar" },
        "firstName": { "type": "varchar" },
        "lastName": { "type": "varchar" },
        "phone": { "type": "varchar" },
        "name": { "type": "varchar" },
        "createDate": { "type": "datetime" },
        "signinDate": { "type": "datetime" },
        "imageType": { "type": "varchar" },
        "image": { "type": null },
        "activateEmailDate": { "type": "datetime" },
        "activateEmailMessage": { "type": "varchar" },
        "activateDate": { "type": "datetime" },
        "passwordChange": { "type": "tinyint" },
        "aclRoles": { "type": "AclRoleModel[]" },
        "digestDate": { "type": "datetime" },
        "digestFrequency": { "type": "int" },
        "timezone": { "type": "varchar" },
        "apiKey": { "type": "varchar" },
        "apiSecret": { "type": "varchar" },
        "type": {
          "type": "varchar",
          "values": [{ "name": "person", "value": "Person" },
            { "name": "api", "value": "Api Key" }]
        },
        "aclEntries": { "type": "AclEntryModel[]" }
      }
    },
    "4": {
      "name": "AccountRecentProjectModel",
      "properties": {
        "accountId": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "modifyDate": { "type": "datetime" }
      }
    },
    "6": {
      "name": "AccountRequestObjectModel",
      "properties": {
        "id": { "type": "int" },
        "accountRequestId": { "type": "int" },
        "aclRoleId": { "type": "int" },
        "objectId": { "type": "bigint" },
        "aclRole": { "type": "AclRoleModel" }
      }
    },
    "8": {
      "name": "AclEntryModel",
      "properties": {
        "id": { "type": "bigint" },
        "aclRoleId": { "type": "int" },
        "accountId": { "type": "bigint" },
        "objectId": { "type": "bigint" },
        "environmentId": { "type": "bigint" },
        "account": { "type": "AccountModel" },
        "environment": { "type": "EnvironmentModel" },
        "aclRole": { "type": "AclRoleModel" },
        "object": { "type": "ObjectModel" }
      }
    },
    "10": {
      "name": "AclPermissionModel",
      "properties": {
        "id": { "type": "int" },
        "aclRoleId": { "type": "int" },
        "permission": { "type": "varchar" },
        "access": { "type": "int" }
      }
    },
    "12": {
      "name": "AclRoleConfigModel",
      "properties": {
        "id": { "type": "int" },
        "aclRoleId": { "type": "int" },
        "value": { "type": "varchar" },
        "data": { "type": "object" }
      }
    },
    "13": {
      "name": "AclRoleModel",
      "properties": {
        "id": { "type": "int" },
        "environmentId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "aclPermissions": { "type": null },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "level": {
          "type": "varchar",
          "values": [{ "name": "app", "value": "App" },
            { "name": "workspace", "value": "Workspace" },
            { "name": "project", "value": "Project" }]
        },
        "allPermissions": { "type": "tinyint" },
        "protected": { "type": "tinyint" },
        "permissions": { "type": null },
        "aclRoleConfigs": { "type": null }
      }
    },
    "14": {
      "name": "AddressModel",
      "properties": {
        "id": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "street": { "type": "varchar" },
        "address2": { "type": "varchar" },
        "city": { "type": "varchar" },
        "region": { "type": "varchar" },
        "zip": { "type": "varchar" },
        "name": { "type": "varchar" },
        "country": { "type": "varchar" },
        "lat": { "type": "decimal" },
        "lng": { "type": "decimal" },
        "createDate": { "type": "datetime" },
        "modifyDate": { "type": "datetime" },
        "guid": { "type": "varchar" }
      }
    },
    "15": {
      "name": "ApiLogModel",
      "properties": {
        "id": { "type": "int" },
        "createDate": { "type": "datetime" },
        "url": { "type": "varchar" },
        "code": { "type": "int" },
        "direction": { "type": "varchar" },
        "reference": { "type": "varchar" },
        "message": { "type": "varchar" },
        "method": { "type": "varchar" },
        "type": { "type": "varchar" },
        "length": { "type": "int" },
        "state": { "type": "varchar" },
        "request": { "type": "text" },
        "response": { "type": "text" },
        "headers": { "type": "text" }
      }
    },
    "16": {
      "name": "AssetModel",
      "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "creatorAccountId": { "type": "bigint" },
        "modifierAccountId": { "type": "bigint" },
        "fileId": { "type": "bigint" },
        "typeId": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "number": { "type": "int" },
        "tags": { "type": null },
        "order": { "type": "int" },
        "modifyDate": { "type": "datetime" },
        "name": { "type": "varchar" },
        "sectionId": { "type": "int" },
        "class": {
          "type": "varchar",
          "values": [{ "name": "asset_image", "value": "Image" },
            { "name": "asset_video", "value": "Video" },
            { "name": "asset_file", "value": "File" }]
        },
        "description": { "type": null },
        "file": { "type": "FileModel" },
        "section": { "type": null },
        "creatorAccount": { "type": null },
        "project": { "type": null },
        "modifierAccount": { "type": null },
        "statusId": { "type": "bigint" },
        "status": { "type": null },
        "identifier": { "type": null },
        "objectVersionId": { "type": "int" },
        "objectVersion": { "type": null }
      }
    },
    "17": {
      "name": "AttributeModel",
      "properties": {
        "id": { "type": "bigint" },
        "parentAttributeId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "class": { "type": "varchar" },
        "backgroundColor": { "type": "varchar" },
        "guid": { "type": "varchar" },
        "imageTime": { "type": "int" },
        "configs": { "type": "varchar" },
        "projectId": { "type": "bigint" },
        "order": { "type": "int" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "image": { "type": null }
      }
    },
    "18": {
      "name": "AuditMetaModel",
      "properties": {
        "id": { "type": "int" },
        "auditId": { "type": "bigint" },
        "objectId": { "type": "bigint" },
        "objectClass": { "type": "varchar" },
        "action": { "type": "varchar" },
        "name": { "type": "varchar" },
        "property": { "type": "varchar" },
        "value": { "type": "mediumtext" },
        "subject": { "type": "varchar" },
        "valueObjectId": { "type": "bigint" },
        "valueType": { "type": "varchar" }
      }
    },
    "19": {
      "name": "AuditModel",
      "properties": {
        "id": { "type": "bigint" },
        "actorAccountId": { "type": "bigint" },
        "subjectObjectId": { "type": "bigint" },
        "date": { "type": "datetime" },
        "actorAccount": { "type": null },
        "subjectObject": { "type": null },
        "auditMetas": { "type": null },
        "state": { "type": "varchar" },
        "auditActions": { "type": null }
      }
    },
    "20": { "name": "AuditRelatedObjectModel", "properties": { "id": { "type": "bigint" } } },
    "22": {
      "name": "CommentModel",
      "properties": {
        "id": { "type": "bigint" },
        "accountId": { "type": "bigint" },
        "objectId": { "type": "bigint" },
        "parentObjectId": { "type": "bigint" },
        "content": { "type": "text" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "createDate": { "type": "datetime" }
      }
    },
    "23": {
      "name": "CommitModel",
      "properties": {
        "id": { "type": "int" },
        "integrationId": { "type": "int" },
        "message": { "type": "varchar" },
        "createDate": { "type": "datetime" },
        "authorName": { "type": "varchar" },
        "authorUsername": { "type": "varchar" },
        "authorIdentifier": { "type": "varchar" },
        "url": { "type": "varchar" },
        "identifier": { "type": "varchar" },
        "additions": { "type": "int" },
        "deletions": { "type": "int" },
        "files": { "type": "int" },
        "added": { "type": "int" },
        "removed": { "type": "int" },
        "modified": { "type": "int" },
        "repoIdentifier": { "type": "varchar" },
        "repoName": { "type": "varchar" },
        "repoUrl": { "type": "varchar" }
      }
    },
    "26": {
      "name": "DataIndexModel",
      "properties": {
        "id": { "type": "int" },
        "dataObjectId": { "type": "bigint" },
        "tableDataObject": { "type": null },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }, { "name": "draft", "value": "Draft" }]
        },
        "type": {
          "type": "varchar",
          "values": [{ "name": "index", "value": "Index" },
            { "name": "unique", "value": "Unique" }, { "name": "spatial", "value": "Spatial" },
            { "name": "full_text", "value": "Full Text" }]
        },
        "description": { "type": "varchar" },
        "dataObjects": { "type": null },
        "dataObjectCount": { "type": null }
      }
    },
    "27": {
      "name": "DataIndexObjectModel",
      "properties": {
        "id": { "type": "int" },
        "dataObjectId": { "type": "bigint" },
        "dataIndexId": { "type": "int" },
        "order": { "type": "int" }
      }
    },
    "28": {
      "name": "DataModel",
      "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "project": { "type": null },
        "dataObjects": { "type": null }
      }
    },
    "29": {
      "name": "DataObjectModel",
      "properties": {
        "id": { "type": "bigint" },
        "dataId": { "type": "bigint" },
        "parentDataObjectId": { "type": "bigint" },
        "referenceDataObjectId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "guid": { "type": "varchar" },
        "type": {
          "type": "varchar",
          "values": [{ "name": "table", "value": "Table" },
            { "name": "column", "value": "Column" }]
        },
        "configs": { "type": "varchar" },
        "description": { "type": "varchar" },
        "order": { "type": "int" },
        "x1": { "type": "int" },
        "y1": { "type": "int" },
        "dataObjects": { "type": null },
        "dataIndexes": { "type": null },
        "parentDataObject": { "type": null },
        "referenceDataObject": { "type": null },
        "dataType": { "type": "varchar" },
        "dataLength": { "type": "varchar" },
        "notNull": { "type": "tinyint" },
        "increment": { "type": "tinyint" },
        "key": { "type": "tinyint" },
        "class": { "type": null },
        "number": { "type": null },
        "identifier": { "type": null },
        "data": { "type": null },
        "project": { "type": null }
      }
    },
    "30": {
      "name": "DocModel",
      "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "creatorAccountId": { "type": "bigint" },
        "modifierAccountId": { "type": "bigint" },
        "typeId": { "type": "bigint" },
        "type": { "type": null },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "number": { "type": "int" },
        "name": { "type": "varchar" },
        "modifyDate": { "type": "datetime" },
        "createDate": { "type": "datetime" },
        "project": { "type": null },
        "statusId": { "type": "bigint" },
        "status": { "type": null },
        "tags": { "type": null },
        "modifierAccount": { "type": null },
        "creatorAccount": { "type": null },
        "class": { "type": null },
        "objectVersionId": { "type": "int" },
        "objectVersion": { "type": null },
        "identifier": { "type": null }
      }
    },
    "33": {
      "name": "EnvironmentAccountModel",
      "properties": {
        "id": { "type": "int" },
        "accountId": { "type": "bigint" },
        "environmentId": { "type": "bigint" },
        "signinDate": { "type": "datetime" },
        "createDate": { "type": "datetime" },
        "account": { "type": null },
        "aclRoles": { "type": null },
        "aclEntries": { "type": null }
      }
    },
    "36": {
      "name": "FieldModel",
      "properties": {
        "id": { "type": "int" },
        "label": { "type": "varchar" },
        "state": {
          "type": "char",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "type": {
          "type": "varchar",
          "values": [{ "name": "heading", "value": "Heading" },
            { "name": "content", "value": "Content" },
            { "name": "dropdown", "value": "Dropdown" },
            { "name": "shorttext", "value": "Short Text" },
            { "name": "longtext", "value": "Long Text" },
            { "name": "richtext", "value": "Rich Text" }, { "name": "name", "value": "Name" },
            { "name": "choice", "value": "Choice" }, { "name": "phone", "value": "Phone" },
            { "name": "email", "value": "Email" }, { "name": "time", "value": "Time" },
            { "name": "checkbox", "value": "Checkbox" }, { "name": "date", "value": "Date" },
            { "name": "address", "value": "Address" }, { "name": "gender", "value": "Gender" },
            { "name": "file", "value": "File" }]
        },
        "fieldOptions": { "type": null },
        "guid": { "type": "varchar" },
        "other": { "type": "tinyint" },
        "configs": { "type": "varchar" },
        "description": { "type": "varchar" }
      }
    },
    "37": {
      "name": "FieldOptionModel",
      "properties": {
        "id": { "type": "int" },
        "name": { "type": "varchar" },
        "state": {
          "type": "char",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "value": { "type": "varchar" }
      }
    },
    "38": {
      "name": "FieldValueModel",
      "properties": {
        "id": { "type": "int" },
        "fieldId": { "type": "int" },
        "objectId": { "type": "bigint" },
        "value": { "type": "mediumtext" },
        "guid": { "type": "varchar" },
        "objectVersionId": { "type": "int" },
        "fieldValueOptions": { "type": null }
      }
    },
    "39": {
      "name": "FieldValueOptionModel",
      "properties": {
        "id": { "type": "int" },
        "fieldId": { "type": "int" },
        "fieldOptionId": { "type": "int" },
        "fieldValueId": { "type": "int" }
      }
    },
    "40": {
      "name": "FileModel",
      "properties": {
        "id": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "guid": { "type": "varchar" },
        "createDate": { "type": "datetime" },
        "modifyDate": { "type": "datetime" },
        "name": { "type": "varchar" },
        "type": { "type": "varchar" },
        "size": { "type": "bigint" },
        "extension": { "type": "varchar" },
        "preview": { "type": null }
      }
    },
    "44": {
      "name": "IntegrationModel",
      "properties": {
        "id": { "type": "int" },
        "environmentId": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }, { "name": "draft", "value": "Draft" }]
        },
        "guid": { "type": "varchar" },
        "name": { "type": "varchar" },
        "metas": { "type": "object" },
        "createDate": { "type": "datetime" },
        "identifier": { "type": "varchar" },
        "type": { "type": "varchar" }
      }
    },
    "46": {
      "name": "KbModel",
      "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        }
      }
    },
    "47": {
      "name": "KbNodeModel",
      "properties": {
        "id": { "type": "int" },
        "kbId": { "type": "bigint" },
        "parentKbNodeId": { "type": "int" },
        "objectId": { "type": "bigint" },
        "type": { "type": "varchar" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "object": { "type": null }
      }
    },
    "50": {
      "name": "NotificationModel",
      "properties": {
        "id": { "type": "bigint" },
        "accountId": { "type": "bigint" },
        "auditId": { "type": "bigint" },
        "objectId": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "creatorAccountId": { "type": "bigint" },
        "createDate": { "type": "datetime" },
        "readDate": { "type": "datetime" },
        "object": { "type": null },
        "project": { "type": null },
        "read": { "type": "tinyint" },
        "reference": { "type": "varchar" },
        "section": { "type": "varchar" },
        "type": { "type": "varchar" },
        "message": { "type": "varchar" },
        "environmentId": { "type": "bigint" }
      }
    },
    "51": {
      "name": "ObjectAssetModel",
      "properties": { "id": { "type": "bigint" }, "order": { "type": "int" } }
    },
    "52": { "name": "ObjectAttributeModel", "properties": { "id": { "type": "bigint" } } },
    "54": {
      "name": "ObjectConfigModel",
      "properties": {
        "objectId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "value": { "type": "varchar" }
      }
    },
    "55": {
      "name": "ObjectContentModel",
      "properties": {
        "id": { "type": "bigint" },
        "type": { "type": "varchar" },
        "content": { "type": "mediumtext" }
      }
    },
    "56": {
      "name": "ObjectFieldModel",
      "properties": {
        "id": { "type": "int" },
        "fieldId": { "type": "int" },
        "objectId": { "type": "bigint" },
        "fieldSectionId": { "type": "int" },
        "order": { "type": "int" },
        "field": { "type": null }
      }
    },
    "57": { "name": "ObjectFileModel", "properties": { "id": { "type": "bigint" } } },
    "60": {
      "name": "ObjectMetaModel",
      "properties": {
        "id": { "type": "int" },
        "objectId": { "type": "bigint" },
        "text": { "type": "varchar" },
        "json": { "type": "varchar" },
        "number": { "type": "float" },
        "date": { "type": "datetime" },
        "name": { "type": "varchar" }
      }
    },
    "61": {
      "name": "ObjectModel", "properties": {
        "id": { "type": "bigint" },
        "class": {
          "type": "varchar",
          "values": [{ "name": "account", "value": "Account" },
            { "name": "project", "value": "Project" }, { "name": "type", "value": "Type" },
            { "name": "status", "value": "Status" }, { "name": "task", "value": "Task" },
            { "name": "address", "value": "Address" },
            { "name": "asset_image", "value": "Mockup" },
            { "name": "asset_video", "value": "Video" },
            { "name": "asset_file", "value": "Asset File" }, { "name": "file", "value": "File" },
            { "name": "doc", "value": "Doc" }, { "name": "comment", "value": "Comment" },
            { "name": "time_entry", "value": "Time Entry" },
            { "name": "attribute", "value": "Attribute" }, { "name": "data", "value": "Data" },
            { "name": "data_object_table", "value": "Data Table" },
            { "name": "data_object_column", "value": "Data Column" },
            { "name": "scenario", "value": "Scenario" }, { "name": "plan", "value": "Plan" },
            { "name": "component", "value": "Component" },
            { "name": "project_role", "value": "Project Role" },
            { "name": "kb", "value": "Knowledge Base" }, { "name": "pdf", "value": "PDF" },
            { "name": "environment", "value": "Environment" },
            { "name": "event", "value": "Event" }]
        },
        "subclass": { "type": "varchar" },
        "className": { "type": null },
        "name": { "type": "varchar" },
        "imageUrl": { "type": "varchar" },
        "modifyDate": { "type": "datetime" },
        "createDate": { "type": "datetime" },
        "state": { "type": "varchar" },
        "meta": { "type": "object" },
        "objects": { "type": null },
        "environmentId": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "planId": { "type": "bigint" },
        "project": { "type": null },
        "plan": { "type": null },
        "parentObject": { "type": null },
        "parentObjectId": { "type": "bigint" },
        "modifierAccount": { "type": null },
        "identifier": { "type": "varchar" },
        "parentIdentifierObjectId": { "type": "bigint" }
      }
    },
    "62": {
      "name": "ObjectObjectModel",
      "properties": {
        "parentObjectId": { "type": "bigint" },
        "childObjectId": { "type": "bigint" }
      }
    },
    "63": { "name": "ObjectSubscriptionModel", "properties": { "id": { "type": "bigint" } } },
    "64": {
      "name": "ObjectVersionModel",
      "properties": {
        "id": { "type": "int" },
        "objectId": { "type": "bigint" },
        "accountId": { "type": "bigint" },
        "statusId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "date": { "type": "datetime" },
        "content": { "type": "mediumtext" },
        "number": { "type": "int" },
        "account": { "type": null },
        "status": { "type": null }
      }
    },
    "65": {
      "name": "PdfBlockModel",
      "properties": {
        "id": { "type": "int" },
        "pdfPageId": { "type": "int" },
        "configs": { "type": "object" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        }
      }
    },
    "66": {
      "name": "PdfModel",
      "properties": {
        "id": { "type": "bigint" },
        "environmentId": { "type": "bigint" },
        "headerPdfPageId": { "type": "int" },
        "footerPdfPageId": { "type": "int" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "type": { "type": "varchar" },
        "name": { "type": "varchar" },
        "width": { "type": "decimal" },
        "height": { "type": "decimal" },
        "styles": { "type": "varchar" },
        "marginTop": { "type": "decimal" },
        "marginLeft": { "type": "decimal" },
        "marginBottom": { "type": "decimal" },
        "marginRight": { "type": "decimal" },
        "footerPdfPage": { "type": null },
        "headerPdfPage": { "type": null }
      }
    },
    "67": {
      "name": "PdfPageModel",
      "properties": {
        "id": { "type": "int" },
        "pdfId": { "type": "bigint" },
        "width": { "type": "decimal" },
        "height": { "type": "decimal" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "type": { "type": "varchar" },
        "reference": { "type": "varchar" },
        "order": { "type": "smallint" },
        "name": { "type": "varchar" },
        "header": { "type": "tinyint" },
        "footer": { "type": "tinyint" },
        "guid": { "type": "varchar" },
        "pdf": { "type": null },
        "marginTop": { "type": "decimal" },
        "marginLeft": { "type": "decimal" },
        "marginBottom": { "type": "decimal" },
        "marginRight": { "type": "decimal" }
      }
    },
    "68": {
      "name": "PlanModel",
      "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "statusId": { "type": "bigint" },
        "identifier": { "type": null },
        "number": { "type": "int" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "workComplete": { "type": null },
        "version": { "type": "varchar" },
        "endDate": { "type": "date" },
        "startDate": { "type": "date" },
        "description": { "type": null },
        "status": { "type": null },
        "project": { "type": null },
        "totalComponentEstimateMin": { "type": null },
        "totalComponentEstimateMax": { "type": null },
        "componentTaskMinutes": { "type": null },
        "planTaskMinutes": { "type": null },
        "componentMinutes": { "type": null },
        "planMinutes": { "type": null },
        "totalTaskEstimateMax": { "type": null },
        "totalTaskEstimateMin": { "type": null },
        "taskStatuses": { "type": null },
        "estimateProjectRoles": { "type": null },
        "actualProjectRoles": { "type": null },
        "workLeftMin": { "type": null },
        "workLeftMax": { "type": null }
      }
    },
    "70": {
      "name": "ProjectAccountModel",
      "properties": {
        "id": { "type": "int" },
        "projectId": { "type": "bigint" },
        "accountId": { "type": "bigint" },
        "account": { "type": null }
      }
    },
    "71": {
      "name": "ProjectModel",
      "properties": {
        "id": { "type": "bigint" },
        "statusId": { "type": "bigint" },
        "status": { "type": null },
        "name": { "type": "varchar" },
        "guid": { "type": "varchar" },
        "state": { "type": "varchar" },
        "abr": { "type": "varchar" },
        "imageType": { "type": "varchar" },
        "image": { "type": null },
        "environmentId": { "type": "bigint" }
      }
    },
    "72": {
      "name": "ProjectRoleModel",
      "properties": {
        "id": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "name": { "type": "varchar" },
        "color": { "type": "varchar" }
      }
    },
    "73": {
      "name": "RelatedObjectModel",
      "properties": {
        "objectAId": { "type": "bigint" },
        "objectBId": { "type": "bigint" },
        "highlightObjectA": { "type": "tinyint" },
        "highlightObjectB": { "type": "tinyint" }
      }
    },
    "74": {
      "name": "ScenarioEnvironmentModel",
      "properties": {
        "id": { "type": "int" },
        "projectId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "apiUrl": { "type": "varchar" },
        "wadlUrl": { "type": "varchar" },
        "variables": { "type": "varchar" }
      }
    },
    "75": {
      "name": "ScenarioEnvironmentVariableModel",
      "properties": {
        "id": { "type": "int" },
        "scenarioEnvironmentId": { "type": "int" },
        "name": { "type": "varchar" },
        "value": { "type": "varchar" }
      }
    },
    "76": {
      "name": "ScenarioFileModel",
      "properties": {
        "id": { "type": "int" },
        "scenarioId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "filename": { "type": "varchar" },
        "guid": { "type": "varchar" },
        "modifyDate": { "type": "datetime" },
        "url": { "type": null }
      }
    },
    "77": {
      "name": "ScenarioModel",
      "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "modifierAccountId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "description": { "type": "varchar" },
        "modifyDate": { "type": "datetime" },
        "createDate": { "type": "datetime" },
        "guid": { "type": "varchar" },
        "defaultPreScript": { "type": "varchar" },
        "defaultPostScript": { "type": "varchar" },
        "requestDurationThreshold": { "type": "int" },
        "requestSizeThreshold": { "type": "int" },
        "number": { "type": "int" },
        "scenarioRequests": { "type": null },
        "project": { "type": null },
        "modifierAccount": { "type": null },
        "class": { "type": null },
        "identifier": { "type": null }
      }
    },
    "78": {
      "name": "ScenarioRequestModel",
      "properties": {
        "id": { "type": "int" },
        "scenarioId": { "type": "bigint" },
        "method": { "type": "varchar" },
        "preScript": { "type": "varchar" },
        "postScript": { "type": "varchar" },
        "path": { "type": "varchar" },
        "description": { "type": "varchar" },
        "disabled": { "type": "tinyint" },
        "order": { "type": "int" },
        "requestDurationThreshold": { "type": "int" },
        "requestSizeThreshold": { "type": "int" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        }
      }
    },
    "80": {
      "name": "SectionModel",
      "properties": {
        "id": { "type": "int" },
        "projectId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "order": { "type": "int" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "assets": { "type": null }
      }
    },
    "81": {
      "name": "SessionModel",
      "properties": {
        "id": { "type": "int" },
        "accountId": { "type": "bigint" },
        "account": { "type": null },
        "data": { "type": "text" },
        "expiryDate": { "type": "datetime" },
        "ipAddress": { "type": "varchar" },
        "maskedIp": { "type": "varchar" },
        "key": { "type": "varchar" },
        "state": { "type": "varchar" },
        "createDate": { "type": "datetime" },
        "userAgent": { "type": "varchar" },
        "environment": { "type": null },
        "environmentId": { "type": "bigint" }
      }
    },
    "86": {
      "name": "SocialAccountModel",
      "properties": {
        "id": { "type": "int" },
        "accountId": { "type": "bigint" },
        "externalReference": { "type": "varchar" },
        "type": {
          "type": "varchar",
          "values": [{ "name": "facebook", "value": "Facebook" },
            { "name": "google", "value": "Google" }]
        },
        "siginDate": { "type": null },
        "email": { "type": "varchar" }
      }
    },
    "88": {
      "name": "StatusGroupModel",
      "properties": {
        "id": { "type": "int" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "order": { "type": "int" },
        "environmentId": { "type": "bigint" },
        "statuses": { "type": null }
      }
    },
    "89": { "name": "StatusGroupStatusModel", "properties": { "id": { "type": "bigint" } } },
    "90": {
      "name": "StatusModel",
      "properties": {
        "id": { "type": "bigint" },
        "environmentId": { "type": "bigint" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "class": {
          "type": "varchar",
          "values": [{ "name": "doc", "value": "Doc" }, { "name": "task", "value": "Task" },
            { "name": "project", "value": "Project" }, { "name": "plan", "value": "Plan" },
            { "name": "asset_image", "value": "Image" },
            { "name": "component", "value": "Component" }]
        },
        "color": { "type": "varchar" },
        "default": { "type": "tinyint" }
      }
    },
    "91": {
      "name": "TaskCommitModel",
      "properties": {
        "id": { "type": "int" },
        "taskId": { "type": "bigint" },
        "commitId": { "type": "int" }
      }
    },
    "92": {
      "name": "TaskModel", "properties": {
        "id": { "type": "bigint" },
        "projectId": { "type": "bigint" },
        "creatorAccountId": { "type": "bigint" },
        "modifierAccountId": { "type": "bigint" },
        "statusId": { "type": "bigint" },
        "priority": {
          "type": "int",
          "values": [{ "name": 0, "value": "Lowest" }, { "name": 10, "value": "Low" },
            { "name": 20, "value": "Normal" }, { "name": 30, "value": "High" },
            { "name": 40, "value": "Critical" }]
        },
        "typeId": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "number": { "type": "int" },
        "workComplete": { "type": null },
        "assignedAccountId": { "type": "bigint" },
        "createDate": { "type": "datetime" },
        "modifyDate": { "type": "datetime" },
        "dueDate": { "type": "date" },
        "name": { "type": "varchar" },
        "project": { "type": null },
        "status": { "type": null },
        "tags": { "type": null },
        "modifierAccount": { "type": null },
        "creatorAccount": { "type": null },
        "assignedAccount": { "type": null },
        "type": { "type": null },
        "plan": { "type": null },
        "componentTask": { "type": null },
        "class": { "type": "varchar" },
        "description": { "type": null },
        "notes": { "type": "mediumtext" },
        "workflowTaskId": { "type": "int" },
        "workflowId": { "type": "int" },
        "objectVersionId": { "type": "int" },
        "objectVersion": { "type": null },
        "workflowStepId": { "type": null },
        "currentStatusDue": { "type": null },
        "planId": { "type": "bigint" },
        "componentTaskId": { "type": "bigint" },
        "projectRoleId": { "type": "bigint" },
        "projectRole": { "type": null },
        "parentTaskId": { "type": "bigint" },
        "duration": { "type": null },
        "identifier": { "type": null },
        "taskMinutes": { "type": null },
        "workflow": { "type": null }
      }
    },
    "93": {
      "name": "TaskProjectRoleModel",
      "properties": {
        "id": { "type": "int" },
        "taskId": { "type": "bigint" },
        "projectRoleId": { "type": "bigint" },
        "estimateMin": { "type": "int" },
        "estimateMax": { "type": "int" },
        "projectRole": { "type": null }
      }
    },
    "95": {
      "name": "TimeEntryModel",
      "properties": {
        "id": { "type": "bigint" },
        "accountId": { "type": "bigint" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }, { "name": "running", "value": "Running" }]
        },
        "startDate": { "type": "datetime" },
        "endDate": { "type": "datetime" },
        "timezone": { "type": "varchar" },
        "createDate": { "type": "datetime" },
        "date": { "type": "date" },
        "type": {
          "type": "varchar",
          "values": [{ "name": "timer", "value": "Timer" },
            { "name": "manual", "value": "Manual" }]
        },
        "minutes": { "type": "int" },
        "description": { "type": "varchar" },
        "account": { "type": null },
        "project": { "type": null },
        "objectId": { "type": "bigint" },
        "tags": { "type": null },
        "object": { "type": null },
        "projectRole": { "type": null },
        "projectRoleId": { "type": "bigint" },
        "plan": { "type": null }
      }
    },
    "96": {
      "name": "TimezoneModel",
      "properties": {
        "id": { "type": "varchar" },
        "utcOffset": { "type": "int" },
        "dstOffset": { "type": "int" },
        "zoneCode": { "type": "varchar" },
        "zoneDstCode": { "type": "varchar" },
        "zoneName": { "type": "varchar" },
        "countryCode": { "type": "varchar" },
        "countryName": { "type": "varchar" },
        "city": { "type": "varchar" }
      }
    },
    "97": {
      "name": "TypeModel",
      "properties": {
        "id": { "type": "bigint" },
        "workflowId": { "type": "int" },
        "name": { "type": "varchar" },
        "workflow": { "type": null },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "class": {
          "type": "varchar",
          "values": [{ "name": "doc", "value": "Doc" }, { "name": "task", "value": "Task" }]
        },
        "instructions": { "type": "varchar" },
        "nameTemplate": { "type": "varchar" },
        "configs": { "type": "varchar" },
        "objectFields": { "type": null },
        "icon": { "type": "varchar" },
        "color": { "type": "varchar" },
        "content": { "type": "varchar" }
      }
    },
    "99": {
      "name": "WorkflowActionModel",
      "properties": {
        "id": { "type": "int" },
        "workflowPathId": { "type": "int" },
        "targetWorkflowTaskId": { "type": "int" },
        "targetWorkflowTask": { "type": null },
        "targetObjectId": { "type": "bigint" },
        "type": {
          "type": "varchar",
          "values": [{ "name": "comment", "value": "Comment" },
            { "name": "account_assignment", "value": "Account Assignment" },
            { "name": "add_subscriber", "value": "Add Subscriber" }]
        },
        "configs": { "type": "varchar" },
        "order": { "type": "int" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "assignAccount": { "type": null },
        "subscriberAccounts": { "type": null }
      }
    },
    "100": {
      "name": "WorkflowModel",
      "properties": {
        "id": { "type": "int" },
        "defaultWorkflowStepId": { "type": "int" },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "default": { "type": "tinyint" },
        "environmentId": { "type": "bigint" },
        "workflowTasks": { "type": null }
      }
    },
    "101": {
      "name": "WorkflowPathModel",
      "properties": {
        "id": { "type": "int" },
        "sourceWorkflowStepId": { "type": "int" },
        "targetWorkflowStepId": { "type": "int" },
        "targetWorkflowStep": { "type": null },
        "name": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "order": { "type": "smallint" },
        "configs": { "type": "varchar" },
        "workflowActions": { "type": null }
      }
    },
    "102": {
      "name": "WorkflowStepModel",
      "properties": {
        "id": { "type": "int" },
        "workflowId": { "type": "int" },
        "statusId": { "type": "bigint" },
        "x1": { "type": "int" },
        "y1": { "type": "int" },
        "name": { "type": "varchar" },
        "workflowTaskId": { "type": "int" },
        "workflowPaths": { "type": null },
        "workflowTask": { "type": null },
        "status": { "type": null },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        },
        "type": {
          "type": "varchar",
          "values": [{ "name": "start", "value": "Start" }, { "name": "task", "value": "Task" }]
        },
        "configs": { "type": "varchar" },
        "workbackTime": { "type": "int" }
      }
    },
    "103": {
      "name": "WorkflowTaskModel",
      "properties": {
        "id": { "type": "int" },
        "workflowId": { "type": "int" },
        "name": { "type": "varchar" },
        "configs": { "type": "varchar" },
        "nameTemplate": { "type": "varchar" },
        "typeId": { "type": "bigint" },
        "type": { "type": null },
        "color": { "type": "varchar" },
        "state": {
          "type": "varchar",
          "values": [{ "name": "active", "value": "Active" },
            { "name": "deleted", "value": "Deleted" }]
        }
      }
    }
  }
};

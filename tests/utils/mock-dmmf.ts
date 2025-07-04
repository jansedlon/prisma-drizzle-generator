
// Simplified mock DMMF utility for testing
export interface MockModel {
  name: string;
  fields: MockField[];
  primaryKey?: {
    fields: string[];
  };
  uniqueIndexes?: Array<{
    name?: string;
    fields: string[];
  }>;
  documentation?: string;
}

export interface MockField {
  name: string;
  type: string;
  isId?: boolean;
  isUnique?: boolean;
  isOptional?: boolean;
  isList?: boolean;
  isUpdatedAt?: boolean;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
  relationOnDelete?: string;
  relationOnUpdate?: string;
  default?: {
    name: string;
    args?: any[];
  };
  documentation?: string;
}

export interface MockEnum {
  name: string;
  values: Array<{
    name: string;
    dbName?: string;
  }>;
}

export interface MockDMMFOptions {
  models?: MockModel[];
  enums?: MockEnum[];
}

export function createMockDMMF(options: MockDMMFOptions = {}): any {
  const { models = [], enums = [] } = options;

  return {
    datamodel: {
      models: models.map(mockModel => createMockModel(mockModel)),
      enums: enums.map(mockEnum => createMockEnum(mockEnum)),
      types: [],
      indexes: []
    },
    schema: {
      inputObjectTypes: {
        prisma: [],
        model: null
      },
      outputObjectTypes: {
        prisma: [],
        model: []
      },
      enumTypes: {
        prisma: [],
        model: null
      },
      fieldRefTypes: {
        prisma: []
      }
    },
    mappings: {
      modelOperations: models.map(model => ({
        model: model.name,
        plural: `${model.name.toLowerCase()}s`,
        findUnique: `findUnique${model.name}`,
        findUniqueOrThrow: `findUnique${model.name}OrThrow`,
        findFirst: `findFirst${model.name}`,
        findFirstOrThrow: `findFirst${model.name}OrThrow`,
        findMany: `findMany${model.name}`,
        create: `createOne${model.name}`,
        createMany: `createMany${model.name}`,
        update: `updateOne${model.name}`,
        updateMany: `updateMany${model.name}`,
        upsert: `upsertOne${model.name}`,
        delete: `deleteOne${model.name}`,
        deleteMany: `deleteMany${model.name}`,
        aggregate: `aggregate${model.name}`,
        groupBy: `groupBy${model.name}`,
        count: `count${model.name}`
      })),
      otherOperations: {
        read: [],
        write: []
      }
    }
  };
}

function createMockModel(mockModel: MockModel): any {
  return {
    name: mockModel.name,
    dbName: null,
    schema: null,
    fields: mockModel.fields.map(field => createMockField(field)),
    primaryKey: mockModel.primaryKey ? {
      name: null,
      fields: mockModel.primaryKey.fields
    } : null,
    uniqueFields: mockModel.uniqueIndexes?.filter(idx => !idx.name).map(idx => idx.fields) || [],
    uniqueIndexes: mockModel.uniqueIndexes?.filter(idx => idx.name).map(idx => ({
      name: idx.name!,
      fields: idx.fields
    })) || [],
    documentation: mockModel.documentation,
    isGenerated: false
  };
}

function createMockField(mockField: MockField): any {
  const field: any = {
    name: mockField.name,
    kind: mockField.relationName ? 'object' : 'scalar',
    isList: mockField.isList || false,
    isRequired: !mockField.isOptional,
    isUnique: mockField.isUnique || false,
    isId: mockField.isId || false,
    isReadOnly: false,
    hasDefaultValue: !!mockField.default,
    type: mockField.type,
    documentation: mockField.documentation,
    isGenerated: false,
    isUpdatedAt: mockField.isUpdatedAt || false
  };

  if (mockField.default) {
    field.default = mockField.default;
  }

  if (mockField.relationName) {
    field.relationName = mockField.relationName;
    field.relationFromFields = mockField.relationFromFields || [];
    field.relationToFields = mockField.relationToFields || [];
    
    if (mockField.relationOnDelete) {
      field.relationOnDelete = mockField.relationOnDelete;
    }
    
    if (mockField.relationOnUpdate) {
      field.relationOnUpdate = mockField.relationOnUpdate;
    }
  }

  return field;
}

function createMockEnum(mockEnum: MockEnum): any {
  return {
    name: mockEnum.name,
    values: mockEnum.values.map(value => ({
      name: value.name,
      dbName: value.dbName || null
    })),
    dbName: null,
    documentation: undefined
  };
}

// Preset mock schemas for common testing scenarios
export const MOCK_SCHEMAS = {
  // Basic User-Post relationship
  userPost: () => createMockDMMF({
    models: [
      {
        name: 'User',
        fields: [
          { name: 'id', type: 'String', isId: true },
          { name: 'email', type: 'String', isUnique: true },
          { name: 'name', type: 'String', isOptional: true },
          { 
            name: 'posts', 
            type: 'Post', 
            isList: true, 
            relationName: 'UserToPosts' 
          }
        ]
      },
      {
        name: 'Post',
        fields: [
          { name: 'id', type: 'String', isId: true },
          { name: 'title', type: 'String' },
          { name: 'content', type: 'String', isOptional: true },
          { name: 'authorId', type: 'String' },
          { 
            name: 'author', 
            type: 'User', 
            relationName: 'UserToPosts',
            relationFromFields: ['authorId'],
            relationToFields: ['id']
          }
        ]
      }
    ]
  }),

  // Simple model for basic testing
  simple: () => createMockDMMF({
    models: [
      {
        name: 'User',
        fields: [
          { name: 'id', type: 'String', isId: true },
          { name: 'email', type: 'String', isUnique: true },
          { name: 'name', type: 'String', isOptional: true }
        ]
      }
    ]
  })
};
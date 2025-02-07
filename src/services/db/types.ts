export interface DatabaseCollection {
  findOne(query: any): Promise<any>;
  find(query: any): Promise<any[]>;
  insertOne(document: any): Promise<any>;
  updateOne(query: any, update: any, options?: any): Promise<any>;
  deleteOne(query: any): Promise<any>;
}

export interface DatabaseConnection {
  collection(name: string): DatabaseCollection;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export interface IDBService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getCollection(name: string): DatabaseCollection;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface QueryOptions {
  limit?: number;
  skip?: number;
  sort?: Record<string, 1 | -1>;
}

export interface BulkOperation {
  insertOne?: { document: any };
  updateOne?: {
    filter: any;
    update: any;
    upsert?: boolean;
  };
  deleteOne?: { filter: any };
}

export interface BulkWriteResult {
  ok: number;
  nInserted: number;
  nUpdated: number;
  nRemoved: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastError?: string;
  reconnectAttempts?: number;
}

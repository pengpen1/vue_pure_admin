enum StorageType {
  LOCAL_STORAGE = "localStorage",
  SESSION_STORAGE = "sessionStorage",
  COOKIES = "cookies"
}

class Cache {
  type: StorageType;

  constructor(type: StorageType) {
    this.type = type;
  }

  setItem(keyName: string, value: string, type?: StorageType) {
    switch (this.setType(type)) {
      case StorageType.LOCAL_STORAGE:
        localStorage.setItem(keyName, value);
        break;
      case StorageType.SESSION_STORAGE:
        sessionStorage.setItem(keyName, value);
        break;
      case StorageType.COOKIES:
        break;
      default:
        sessionStorage.setItem(keyName, value);
        break;
    }
  }

  getItem(keyName: string, type?: StorageType): string | null {
    switch (this.setType(type)) {
      case StorageType.LOCAL_STORAGE:
        return localStorage.getItem(keyName);
      case StorageType.SESSION_STORAGE:
        return sessionStorage.getItem(keyName);
      case StorageType.COOKIES:
      default:
        return sessionStorage.getItem(keyName);
    }
  }

  removeItem(keyName: string, type?: StorageType) {
    switch (this.setType(type)) {
      case StorageType.LOCAL_STORAGE:
        localStorage.removeItem(keyName);
        break;
      case StorageType.SESSION_STORAGE:
        sessionStorage.removeItem(keyName);
        break;
      case StorageType.COOKIES:
        break;
      default:
        sessionStorage.removeItem(keyName);
        break;
    }
  }

  clear(type?: StorageType) {
    switch (this.setType(type)) {
      case StorageType.LOCAL_STORAGE:
        localStorage.clear();
        break;
      case StorageType.SESSION_STORAGE:
        sessionStorage.clear();
        break;
      case StorageType.COOKIES:
        break;
      default:
        sessionStorage.clear();
        break;
    }
  }

  setType(type?: StorageType): StorageType {
    if (!type) {
      return this.type;
    } else {
      return type;
    }
  }

  // 静态方法
  private static instance: Cache;
  static getInstance(type: StorageType): Cache {
    if (!this.instance) {
      this.instance = new Cache(type);
    }
    return this.instance;
  }
}

export default Cache.getInstance(StorageType.LOCAL_STORAGE);

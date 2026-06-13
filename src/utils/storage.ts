type StorageValue = unknown;

const writeQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

const processQueue = async (): Promise<void> => {
  if (isProcessingQueue) {
    return;
  }

  isProcessingQueue = true;

  try {
    while (writeQueue.length > 0) {
      const task = writeQueue.shift();
      if (task) {
        await task();
      }
    }
  } finally {
    isProcessingQueue = false;
  }
};

const _set = <T = StorageValue>(key: string, value: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    writeQueue.push(
      () =>
        new Promise<void>((taskResolve, taskReject) => {
          chrome.storage.local.set({ [key]: value }, () => {
            const error = chrome.runtime.lastError;

            if (error) {
              reject(error);
              taskReject(error);
              return;
            }

            resolve();
            taskResolve();
          });
        })
    );

    void processQueue();
  });
};

const _get = <T = StorageValue>(key: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      const error = chrome.runtime.lastError;

      if (error) {
        reject(error);
        return;
      }

      resolve(result?.[key] as T | undefined);
    });
  });
};

export function set<T = StorageValue>(
  key: string,
  value: T
): Promise<void> {
  return _set(key, value);
}

export function get<T = StorageValue>(
  key: string
): Promise<T | undefined> {
  return _get<T>(key);
}

export async function addItemToArr<T>(
  arrKey: string,
  value: T
): Promise<T[]> {
  const arr = (await _get<T[]>(arrKey)) ?? [];
  const nextArr = [...arr, value];

  await _set(arrKey, nextArr);

  return nextArr;
}

export async function delItemFromArr<T>(
  arrKey: string,
  value: string,
  valueKey?: keyof T
): Promise<T[]> {
  const arr = (await _get<T[]>(arrKey)) ?? [];

  const nextArr = arr.filter((item) =>
    valueKey
      ? String((item as Record<string, unknown>)?.[valueKey as string]) !==
        value
      : String(item) !== value
  );

  if (nextArr.length !== arr.length) {
    await _set(arrKey, nextArr);
  }

  return nextArr;
}

const _operArrItem = async <T>(
  arrKey: string,
  itemKey: keyof T,
  itemValue: string,
  operation: (item: T) => T
): Promise<T[]> => {
  const arr = (await _get<T[]>(arrKey)) ?? [];

  const index = arr.findIndex(
    (item) =>
      String((item as Record<string, unknown>)?.[itemKey as string]) ===
      itemValue
  );

  if (index === -1) {
    return arr;
  }

  const nextArr = [...arr];
  nextArr[index] = operation(nextArr[index]);

  await _set(arrKey, nextArr);

  return nextArr;
};

export async function updateArrItemProperty<
  T extends Record<string, unknown>
>(
  arrKey: string,
  itemKey: keyof T,
  itemValue: string,
  propertyKey: keyof T,
  value: T[keyof T]
): Promise<T[]> {
  return _operArrItem<T>(
    arrKey,
    itemKey,
    itemValue,
    (item) => ({
      ...item,
      [propertyKey]: value,
    })
  );
}

export async function addItemToArrProperty<
  T extends Record<string, unknown>,
  V
>(
  arrKey: string,
  itemKey: keyof T,
  itemValue: string,
  arrPropKey: keyof T,
  value: V,
  checkDuplicate = true
): Promise<T[]> {
  return _operArrItem<T>(
    arrKey,
    itemKey,
    itemValue,
    (item) => {
      const currentArr = Array.isArray(item[arrPropKey])
        ? ([...(item[arrPropKey] as V[])] as V[])
        : [];

      if (!checkDuplicate || !currentArr.includes(value)) {
        currentArr.push(value);
      }

      return {
        ...item,
        [arrPropKey]: currentArr,
      };
    }
  );
}

export async function delItemFromArrProperty<
  T extends Record<string, unknown>,
  V
>(
  arrKey: string,
  itemKey: keyof T,
  itemValue: string,
  arrPropKey: keyof T,
  value: V,
  valueKey?: string
): Promise<T[]> {
  return _operArrItem<T>(
    arrKey,
    itemKey,
    itemValue,
    (item) => {
      const currentArr = Array.isArray(item[arrPropKey])
        ? ([...(item[arrPropKey] as V[])] as V[])
        : [];

      const nextArr = currentArr.filter((entry) =>
        valueKey
          ? (entry as Record<string, unknown>)?.[valueKey] !== value
          : entry !== value
      );

      return {
        ...item,
        [arrPropKey]: nextArr,
      };
    }
  );
}

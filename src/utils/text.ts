import pinyin, { STYLE_NORMAL } from "pinyin";
import isChinese from "is-chinese";

type SearchableItem = Record<string, unknown> | string;

const getValue = (item: SearchableItem, key?: string): string => {
  const value =
    key && typeof item === "object" && item !== null
      ? item[key]
      : item;

  return typeof value === "string" ? value : String(value ?? "");
};

const getChinesePart = (text: string): string => {
  return text.replace(/[A-Za-z]/g, "");
};

const toPinyinString = (text: string): string => {
  return pinyin(text, {
    style: STYLE_NORMAL,
  })
    .flat()
    .join("");
};

export function filterArrBySearchText<T extends SearchableItem>(
  arr: T[],
  key = "",
  text = "",
  ignoreCase = true
): T[] {
  if (!text) {
    return arr;
  }

  const chinesePart = getChinesePart(text);
  const containsChinese = chinesePart.length > 0 && isChinese(chinesePart);

  if (containsChinese) {
    return arr.filter((element) => {
      const item = getValue(element, key);
      return item.includes(chinesePart);
    });
  }

  const normalizedSearchText = ignoreCase
    ? text.toLowerCase()
    : text;

  return arr.filter((element) => {
    const item = getValue(element, key);

    let pinyinText = toPinyinString(item);

    if (ignoreCase) {
      pinyinText = pinyinText.toLowerCase();
    }

    return pinyinText.includes(normalizedSearchText);
  });
}

export function transArrInfoLetterMap<T extends SearchableItem>(
  arr: T[],
  key: string
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (const element of arr) {
    const item = getValue(element, key);

    if (!item) {
      continue;
    }

    const parts = pinyin(item, {
      style: STYLE_NORMAL,
    });

    if (!parts.length) {
      continue;
    }

    let firstLetter = parts[0]?.[0]?.[0]?.toUpperCase() ?? "_";

    if (!/^[A-Z]$/.test(firstLetter)) {
      firstLetter = "_";
    }

    (result[firstLetter] ??= []).push(element);
  }

  return result;
}

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
  const match = text.match(/[\u4E00-\u9FFF]+/g);
  return match?.join("") ?? "";
};

const toPinyinString = (text: string): string =>
  pinyin(text, {
    style: STYLE_NORMAL,
  })
    .flat()
    .join("");

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
  const containsChinese =
    chinesePart.length > 0 && isChinese(chinesePart);

  if (containsChinese) {
    return arr.filter((element) =>
      getValue(element, key).includes(chinesePart)
    );
  }

  const normalizedSearchText = ignoreCase
    ? text.toLowerCase()
    : text;

  return arr.filter((element) => {
    const item = getValue(element, key);

    const pinyinText = ignoreCase
      ? toPinyinString(item).toLowerCase()
      : toPinyinString(item);

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

    const firstLetter =
      toPinyinString(item).charAt(0).toUpperCase() || "_";

    (result[/^[A-Z]$/.test(firstLetter) ? firstLetter : "_"] ??= []).push(
      element
    );
  }

  return result;
}

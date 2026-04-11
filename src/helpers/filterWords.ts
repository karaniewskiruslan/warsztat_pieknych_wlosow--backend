const wordSplitter = (str: string) => {
  return str.split('').reduce((acc: string[], _, i, arr) => {
    if (i + 2 >= arr.length) return acc;

    const a = arr[i];
    const b = arr[i + 1];
    const c = arr[i + 2];

    if (a && b && c) acc.push(a + b + c);

    return acc;
  }, []);
};

export const filterWords = <T extends Record<string, any>>(query: string, arr: T[], key: keyof T) => {
  if (!query) return arr;

  const normalize = (v: any) => String(v).toLowerCase();
  const q = query.toLowerCase();

  if (q.length < 3) {
    return arr.filter((el) => normalize(el[key]).includes(q));
  }

  const queryArray = wordSplitter(q).filter(Boolean);

  return arr.filter((el) => queryArray.some((qw) => normalize(el[key]).includes(qw)));
};

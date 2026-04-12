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

export const filterWords = <T extends Record<string, unknown>>(query: string, arr: T[], key: keyof T): T[] => {
  if (!query) return arr;

  const normalize = (v: unknown) => String(v).toLowerCase();
  const q = query.toLowerCase();

  if (q.length < 3) {
    return arr.filter((el) => normalize(el[key]).includes(q));
  }

  const queryArray = wordSplitter(q).filter(Boolean);
  if (!queryArray.length) return arr;

  return arr
    .map((el) => {
      const value = normalize(el[key]);
      const words = value.split(/\s+/);

      const matchCount = queryArray.filter((qw) => value.includes(qw)).length;
      const wordSimilarity = matchCount / queryArray.length;

      const maxPositionScore = words.reduce((acc, _word, index) => acc + 1 / (index + 1), 0);

      const positionScore = words.reduce((acc, word, index) => {
        const hasMatch = queryArray.some((qw) => word.includes(qw) || qw.includes(word));
        return hasMatch ? acc + 1 / (index + 1) : acc;
      }, 0);

      const normalizedPosition = maxPositionScore > 0 ? positionScore / maxPositionScore : 0;

      const similarity = wordSimilarity * 0.7 + normalizedPosition * 0.3;

      return { el, similarity };
    })
    .filter(({ similarity }) => similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .map(({ el }) => el);
};

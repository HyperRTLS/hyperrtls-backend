// Proceed with caution: https://www.amazon.com/s?k=rope

/* eslint-disable prettier/prettier */
const matchTopicPatternRegex  = /^(?:(?:[^\/\+#]*?|[\+][^\W\/\+#]*?)\/)*?(?:[^\/\+#]*?|[\+#][^\W\/\+#]*?)?$/;
const matchSegmentsRegex      = /(?<=\/|^)([^\/\+#].*?)(?=\/|$)/g;
const matchUnnamedParamsRegex = /([\+#])(?=\/|$)/g;
const matchNamedParamsRegex   = /([\+#])(\w+?)(?=\/|$)/g;
const matchParamsRegex        = /([\+#])(\w*?)(?=\/|$)/g;
const escapeRegex             = /[.*?^${}()|[\]\\]/g;
/* eslint-enable prettier/prettier */

export interface ParsedTopic {
  raw: string;
  all: string[];
  named: { [key: string]: string };
}

/**
 * Validates pattern.
 *
 * @param pattern pattern to validate
 * @returns true if pattern is valid
 */
export function validatePattern(pattern: string): boolean {
  return matchTopicPatternRegex.test(pattern);
}

/**
 * Transforms pattern to subcription topic.
 *
 * @param pattern pattern to transform
 * @returns subscription topic›
 */
export function transformPatternToSubscriptionTopic(pattern: string): string {
  // Trim params names leaving only wildcards
  return pattern.replaceAll(matchNamedParamsRegex, '$1');
}

export function createPatternMatcher(pattern: string) {
  const regexString = pattern
    // Escape characters of regular segments
    // [a-zA-Z0-9_] is preferable and does not require escaping, however, MQTT spec allows other characters in topics
    .replaceAll(matchSegmentsRegex, (segment) =>
      segment.replace(escapeRegex, '\\$&'),
    )
    // Replace + params with match any till the next segment
    // Replace # params with match any till the end of the topic
    .replaceAll(matchParamsRegex, (wildcard) =>
      wildcard === '+' ? '[^/]*?' : '.*',
    );
  const regex = new RegExp(`^${regexString}$`);

  return (topic: string): boolean => regex.test(topic);
}

export function createTopicParser(pattern: string) {
  const regexString = pattern
    // Replace regular segments with .*? so we do not need to escape them
    // We do not do that for params as they do not contain characters requiring escaping
    // We can replace them without any issues as at this stage we know that topic certainly matches pattern
    .replaceAll(matchSegmentsRegex, '.*?')
    // Replace unnamed params with unnamed capture groups
    .replaceAll(matchUnnamedParamsRegex, '(.*?)')
    // Replace named params with named capture groups
    .replaceAll(matchNamedParamsRegex, '(?<$2>.*?)');
  const regex = new RegExp(`^${regexString}$`);

  return (topic: string): ParsedTopic => {
    const result = regex.exec(topic)!;
    const [_, ...all] = result;
    const named = result.groups || {};
    return { raw: topic, all, named };
  };
}

export function getMinimalPatternSubset(patterns: string[]): string[] {
  const compareFn = (toCompare: string) => (toCompareAgainst: string) =>
    createPatternMatcher(toCompareAgainst)(toCompare);

  return patterns.reduce<string[]>((minimalPatternSubset, pattern, idx) => {
    const compareAgainst = [
      ...minimalPatternSubset,
      ...patterns.slice(idx + 1),
    ];

    // .some() === false mimics .none() behaviour
    if (compareAgainst.some(compareFn(pattern)) === false) {
      minimalPatternSubset.push(pattern);
    }

    return minimalPatternSubset;
  }, []);
}

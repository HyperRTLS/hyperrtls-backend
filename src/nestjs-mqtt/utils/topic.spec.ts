import {
  validatePattern,
  transformPatternToSubscriptionTopic,
  createPatternMatcher,
  createTopicParser,
  getMinimalPatternSubset,
} from './topic';

describe('validatePattern', () => {
  it('should return true for valid pattern', () => {
    expect(validatePattern('')).toBe(true);
    expect(validatePattern('/')).toBe(true);
    expect(validatePattern('topic')).toBe(true);
    expect(validatePattern('.*?^${}()|[]\\')).toBe(true);
    expect(validatePattern('+')).toBe(true);
    expect(validatePattern('#')).toBe(true);
    expect(validatePattern('+/#')).toBe(true);
    expect(validatePattern('+id/#rest')).toBe(true);
  });

  it('should return false if segment contains + or # not at the beginning', () => {
    expect(validatePattern('to+pic')).toBe(false);
    expect(validatePattern('to#pic')).toBe(false);
  });

  it('should return false if segment with # is not last', () => {
    expect(validatePattern('#/')).toBe(false);
  });

  it('should return false if param name contains illegal characters (\\W)', () => {
    expect(validatePattern('+to pic')).toBe(false);
  });
});

describe('transformPatternToSubscriptionTopic', () => {
  it('should replace all named params', () => {
    const actual = transformPatternToSubscriptionTopic('/segment/+/+id/#rest');
    const expected = '/segment/+/+/#';

    expect(actual).toEqual(expected);
  });
});

describe('createPatternMatcher', () => {
  it('should match', () => {
    expect(createPatternMatcher('')('')).toBe(true);
    expect(createPatternMatcher('/')('/')).toBe(true);
    expect(createPatternMatcher('topic')('topic')).toBe(true);
    expect(createPatternMatcher('.*?^${}()|[]\\')('.*?^${}()|[]\\')).toBe(true);
    expect(createPatternMatcher('+')('')).toBe(true);
    expect(createPatternMatcher('#')('')).toBe(true);
    expect(createPatternMatcher('+/#')('part1/part2/part3')).toBe(true);
    expect(createPatternMatcher('+id/#rest')('part1/part2/part3')).toBe(true);
  });

  it('should not match', () => {
    expect(createPatternMatcher('')('/')).toBe(false);
    expect(createPatternMatcher('topic1')('topic2')).toBe(false);
    expect(createPatternMatcher('+')('/')).toBe(false);
    expect(createPatternMatcher('/+')('')).toBe(false);
    expect(createPatternMatcher('/#')('')).toBe(false);
  });
});

describe('createTopicParser', () => {
  it('should correctly parse topic without params', () => {
    expect(createTopicParser('part1/part2/part3')('part1/part2/part3')).toEqual(
      {
        raw: 'part1/part2/part3',
        all: [],
        named: {},
      },
    );
  });

  it('should correctly parse topic with unnamed params', () => {
    expect(createTopicParser('+/#')('part1/part2/part3')).toEqual({
      raw: 'part1/part2/part3',
      all: ['part1', 'part2/part3'],
      named: {},
    });
  });

  it('should correctly parse topic with named params', () => {
    expect(createTopicParser('+param1/#param2')('part1/part2/part3')).toEqual({
      raw: 'part1/part2/part3',
      all: ['part1', 'part2/part3'],
      named: {
        param1: 'part1',
        param2: 'part2/part3',
      },
    });
  });

  it('should correctly parse topic with both unnamed and named params', () => {
    expect(createTopicParser('+param1/#')('part1/part2/part3')).toEqual({
      raw: 'part1/part2/part3',
      all: ['part1', 'part2/part3'],
      named: {
        param1: 'part1',
      },
    });
  });
});

describe('getMinimalPatternSubset', () => {
  it('should extract minimal pattern subset', () => {
    expect(
      getMinimalPatternSubset([
        'part1/part2/part3',
        'part1/+/part3',
        'part1/part2/+',
        'part1/#',
        'part2/part3',
      ]),
    ).toEqual(['part1/#', 'part2/part3']);
  });
});

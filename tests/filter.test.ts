import { FilterOption } from "@/lib/interfaces";
import { parseFilterExp } from "@/lib/tweet-utils";

test("Filter Expression Parser - Single Filter", () => {
  expect(parseFilterExp("r>3")).toStrictEqual({
    rt: {
      count: 3,
      lessThan: false,
    },
  } as FilterOption);
  
  expect(parseFilterExp("l<40")).toStrictEqual({
    like: {
      count: 40,
      lessThan: true,
    },
  } as FilterOption);
  
  expect(parseFilterExp("m")).toStrictEqual({
    media: {
      exist: true,
    },
  } as FilterOption);
});

test("Filter Expression Parser - Double Filters", () => {
  expect(parseFilterExp("r>3,l>5")).toStrictEqual({
    rt: {
      count: 3,
      lessThan: false,
    },
    like: {
      count: 5,
      lessThan: false,
    },
  } as FilterOption);
  
  expect(parseFilterExp("l>64,m")).toStrictEqual({
    like: {
      count: 64,
      lessThan: false,
    },
    media: {
      exist: true,
    },
  } as FilterOption);
  
  expect(parseFilterExp("m,r<128")).toStrictEqual({
    rt: {
      count: 128,
      lessThan: true,
    },
    media: {
      exist: true,
    },
  } as FilterOption);
});

test("Filter Expression Parser - Multiple Filters", () => {
  expect(parseFilterExp("r<2,l>9,m")).toStrictEqual({
    rt: {
      count: 2,
      lessThan: true,
    },
    like: {
      count: 9,
      lessThan: false,
    },
    media: {
      exist: true,
    },
  } as FilterOption);
  
  expect(parseFilterExp("r>128,m,l<256")).toStrictEqual({
    rt: {
      count: 128,
      lessThan: false,
    },
    like: {
      count: 256,
      lessThan: true,
    },
    media: {
      exist: true,
    },
  } as FilterOption);
});

test("Filter Expression Parser - Duplicated Filters", () => {
  // Parser will use last one when duplicated
  expect(parseFilterExp("r>2,r>4")).toStrictEqual({
    rt: {
      count: 4,
      lessThan: false,
    },
  } as FilterOption);
  
  expect(parseFilterExp("l>85,l<98")).toStrictEqual({
    like: {
      count: 98,
      lessThan: true,
    },
  } as FilterOption);
  
  expect(parseFilterExp("r>4,l<98,r<256,l>999")).toStrictEqual({
    rt: {
      count: 256,
      lessThan: true,
    },
    like: {
      count: 999,
      lessThan: false,
    },
  } as FilterOption);
  
  expect(parseFilterExp("m,m,l>1,m,m")).toStrictEqual({
    like: {
      count: 1,
      lessThan: false,
    },
    media: {
      exist: true,
    },
  } as FilterOption);
});

test("Filter Expression Parser - Invalid Filters", () => {
  // Invalid count number (must be >= 0)
  expect(parseFilterExp("r<-1")).toBeNull();
  
  // Invalid operator
  expect(parseFilterExp("l=0")).toBeNull();
  
  // Invalid syntax for media existance filter
  expect(parseFilterExp("m2")).toBeNull();
  
  // Invalid filter syntax
  expect(parseFilterExp("rl>3")).toBeNull();

  // Invalid filter separator
  expect(parseFilterExp("r>3|l<2&m")).toBeNull();

  // Invalid multiple filters
  expect(parseFilterExp("r>234,l=452,m1")).toBeNull();
});

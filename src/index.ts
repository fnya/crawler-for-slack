/**
 * 1つのJavaScripにまとめたいTypeScriptを定義する
 */
import sum from "./sum";
import test from "./test";

// globalの型定義
declare const global: {
  [x: string]: unknown;
};

// 公開したい関数を定義
global.sum = sum;
global.test = test;

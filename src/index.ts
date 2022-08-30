import 'reflect-metadata';
/**
 * 1つのJavaScripにまとめたいTypeScriptを定義する
 */
import test from './test';
import { crawlChannels } from './crawlChannels';
import { crawlMembers } from './crawlMembers';
import { crawlMessages } from './crawlMessages';

// globalの型定義
declare const global: {
  [x: string]: unknown;
};

// 公開したい関数を定義
global.test = test;
global.crawlChannels = crawlChannels;
global.crawlMembers = crawlMembers;
global.crawlMessages = crawlMessages;

import { container } from './inversify.config';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import { SpreadSheetType } from '../../common-lib-for-slack/dist/lib/types/SpreadSheetType';
import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';
import { SpreadSheetManager } from '../../common-lib-for-slack/dist/lib/util/SpreadSheetManager';
import { PropertyUtil } from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';
import { Member } from '../../common-lib-for-slack/dist/lib/entity/Member';
import { GoogleDrive } from '../../common-lib-for-slack/dist/lib/util/GoogleDrive';
import { FolderType } from '../../common-lib-for-slack/dist/lib/types/FolderType';
import { Reply } from '../../common-lib-for-slack/dist/lib/entity/Reply';

/**
 * Replies をクロールする関数
 */
export const crawlReplies = () => {
  console.log('start get replies.');

  // 初期化
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  const slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  const propertyUtil = container.get<PropertyUtil>(Types.PropertyUtil);
  const googleDrive = container.get<GoogleDrive>(Types.GoogleDrive);
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // チャンネルID
  const channelId = '';

  // messages フォルダ取得
  const messagesFolderId = googleDrive.getFolderId(
    propertyUtil.getProperty(PropertyType.MembersFolerId),
    FolderType.Messages
  );

  // Channels フォルダ取得
  const channelsFolderId = googleDrive.getFolderId(messagesFolderId, channelId);

  // Members をロード
  const arrayMessages = spreadSheetManager.load(
    channelsFolderId,
    SpreadSheetType.Messages
  );

  // Messages をプログラムで扱える型に変換
  const messages = slackTranslator.translateArraysToMessages(arrayMessages);

  // Replies のある Messages を取得
  const repliesMessages = messages.filter((message) => message.replyCount > 0);

  // Members を配列に格納
  const members = [...getMembers()];

  // Repliesの保存先を作成
  const bufferReplies: Reply[] = [];

  // Replies取得
  for (const repliesMessage of repliesMessages) {
    const json = JSON.parse(repliesMessage.json);
    const responseReplies = slackApiClient.getReplies(channelId, json.ts);

    const replies = slackTranslator.translateToReplies(
      responseReplies,
      members
    );

    for (const reply of replies) {
      bufferReplies.push(reply);
    }
  }

  // Repliesを２次元配列に変換
  const arrayReplies = slackTranslator.translateRepliesToArrays(bufferReplies);

  // Replies用スプレッドシート準備
  spreadSheetManager.createIfDoesNotExist(
    channelsFolderId,
    SpreadSheetType.Replies
  );

  // Replies保存
  spreadSheetManager.save(
    channelsFolderId,
    SpreadSheetType.Replies,
    arrayReplies
  );

  // ダウンロード先フォルダ作成
  const fileFolderId = googleDrive.createFolderOrGetFolderId(
    channelsFolderId,
    FolderType.Files
  );

  // ファイルダウンロード
  bufferReplies.forEach((reply) => {
    if (reply.files) {
      const files = JSON.parse(reply.files);
      for (const file of files) {
        if (file.downloadUrl && file.downloadUrl !== '') {
          console.log(`ダウンロード ${file.id}`);
          slackApiClient.downloadFile(fileFolderId, file.downloadUrl, file.id);
        }
      }
    }
  });

  console.log('end get replies.');
};

/**
 * メンバー一覧をロードする
 *
 * @returns メンバー一覧
 */
const getMembers = (): Member[] => {
  // 初期化
  const slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  const propertyUtil = container.get<PropertyUtil>(Types.PropertyUtil);
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // メンバーフォルダIDを取得
  const memberFolderId = propertyUtil.getProperty(PropertyType.MembersFolerId);

  // メンバー一覧をロード
  const arrayMembers = spreadSheetManager.load(
    memberFolderId,
    SpreadSheetType.Members
  );

  // メンバー一覧を変換してリターン
  return slackTranslator.translateArraysToMembers(arrayMembers);
};

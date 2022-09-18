/* eslint-disable no-unused-vars */
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
import { JsonUtil } from '../../common-lib-for-slack/dist/lib/util/JsonUtil';
import { DateUtil } from '../../common-lib-for-slack/dist/lib/util/DateUtil';
import { ChannelUtil } from '../../common-lib-for-slack/dist/lib/util/ChannelUtil';

/**
 * Messages をクロールする関数
 */
export const crawlMessages = () => {
  console.log('start get messages.');

  // 初期化
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  const slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );
  const googleDrive = container.get<GoogleDrive>(Types.GoogleDrive);
  const propertyUtil = container.get<PropertyUtil>(Types.PropertyUtil);
  const jsonUtil = container.get<JsonUtil>(Types.JsonUtil);
  const dateUtil = container.get<DateUtil>(Types.DateUtil);
  const channelUtil = container.get<ChannelUtil>(Types.ChannelUtil);

  // 処理対象チャンネルIDを取得
  const channelId = channelUtil.getMemberTargetChannelId();

  console.log(`target channelId: ${channelId}`);

  // チャンネルIDがない場合は処理対象なし
  if (channelId === '') {
    console.log('対象のチャンネルがありません');
    return;
  }

  /** フォルダの準備 */

  // Messages 保存先作成
  const messagesFolderId = googleDrive.createFolderOrGetFolderId(
    propertyUtil.getProperty(PropertyType.MembersFolerId),
    FolderType.Messages
  );

  // Channels フォルダ取得
  const channelsFolderId = googleDrive.createFolderOrGetFolderId(
    messagesFolderId,
    channelId
  );

  // ダウンロード先フォルダ作成
  const fileFolderId = googleDrive.createFolderOrGetFolderId(
    channelsFolderId,
    FolderType.Files
  );

  // jsonフォルダ作成
  const jsonFolderId = googleDrive.createFolderOrGetFolderId(
    fileFolderId,
    FolderType.Json
  );

  /** スプレッドシート準備 */
  spreadSheetManager.createIfDoesNotExist(
    channelsFolderId,
    SpreadSheetType.Messages
  );

  // ファイルバックアップ
  googleDrive.backupFile(channelsFolderId, SpreadSheetType.Messages);

  /** TS の設定 */
  const currentTs = dateUtil.getCurrentTs();
  const currentDateTime = dateUtil.createDateTimeString(currentTs);
  const tsBefore90days = dateUtil.getTsBefore90Days();
  const latestTs = spreadSheetManager.getLatestTs(
    channelsFolderId,
    SpreadSheetType.Messages
  );

  // Slack API から Messages 取得
  const responseMessages = slackApiClient.getMessages(
    channelId,
    tsBefore90days
  );

  // JSON を保存
  const json = JSON.stringify(responseMessages, null, '\t');
  const currentDate = dateUtil.getCurrentDateString();
  jsonUtil.save(jsonFolderId, currentDate, json);

  // Messages を変換
  const messages = slackTranslator.translateToMessages(
    responseMessages,
    getMembers()
  );

  // 更新対象抽出
  const updatedMessages = messages.filter(
    (message) =>
      Number(message.ts) > Number(latestTs) ||
      (message.isEdited && Number(message.editedTs) > Number(latestTs)) ||
      (message.replyCount =
        0 && Number(message.latestReplyTs) > Number(latestTs))
  );

  // 保存形式に変換
  const arrayMessages =
    slackTranslator.translateMessagesToArrays(updatedMessages);

  // Messages 保存
  spreadSheetManager.update(
    channelsFolderId,
    SpreadSheetType.Messages,
    arrayMessages
  );

  // ファイルダウンロード
  updatedMessages.forEach((message) => {
    if (message.files) {
      const files = JSON.parse(message.files);
      for (const file of files) {
        if (file.downloadUrl && file.downloadUrl !== '') {
          slackApiClient.downloadFile(fileFolderId, file.downloadUrl, file.id);
        }
      }
    }
  });

  // messeses の実行時間をステータスに保存する
  spreadSheetManager.update(
    propertyUtil.getProperty(PropertyType.SystemFolerId),
    SpreadSheetType.MessageStatus,
    [[channelId, currentTs, currentDateTime]]
  );

  console.log('end get messages.');
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

  // SpreadSheetManager のインスタンス取得
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

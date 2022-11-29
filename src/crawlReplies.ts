import { ChannelUtil } from '@fnya/common-lib-for-slack/lib/util/ChannelUtil';
import { container } from './inversify.config';
import { DateUtil } from '@fnya/common-lib-for-slack/lib/util/DateUtil';
import { FolderType } from '@fnya/common-lib-for-slack/lib/types/FolderType';
import { GoogleDrive } from '@fnya/common-lib-for-slack/lib/util/GoogleDrive';
import { Member } from '@fnya/common-lib-for-slack/lib/entity/Member';
import { Message } from '@fnya/common-lib-for-slack/lib/entity/Message';
import { PropertyUtil } from '@fnya/common-lib-for-slack/lib/util/PropertyUtil';
import { Reply } from '@fnya/common-lib-for-slack/lib/entity/Reply';
import { SlackApiClient } from '@fnya/common-lib-for-slack/lib/util/SlackApiClient';
import { SlackTranslator } from '@fnya/common-lib-for-slack/lib/util/SlackTranslator';
import { SpreadSheetManager } from '@fnya/common-lib-for-slack/lib/util/SpreadSheetManager';
import { SpreadSheetType } from '@fnya/common-lib-for-slack/lib/types/SpreadSheetType';
import PropertyType from '@fnya/common-lib-for-slack/lib/types/PropertyType';
import Types from '@fnya/common-lib-for-slack/lib/types/Types';

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
  const dateUtil = container.get<DateUtil>(Types.DateUtil);
  const channelUtil = container.get<ChannelUtil>(Types.ChannelUtil);

  // 処理対象チャンネルIDを取得
  const channelId = channelUtil.getReplyTargetChannelId();

  console.log(`target channelId: ${channelId}`);

  // チャンネルIDがない場合は処理対象なし
  if (channelId === '') {
    console.log('対象のチャンネルがありません');
    return;
  }

  /** フォルダの準備 */

  // messages フォルダ取得
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
    SpreadSheetType.Replies
  );

  /** TS の設定 */
  const currentTs = dateUtil.getCurrentTs();
  const currentDateTime = dateUtil.createDateTimeString(currentTs);
  const latestTs = spreadSheetManager.getLatestTs(
    channelsFolderId,
    SpreadSheetType.Replies
  );

  // members 取得
  const members = getMembers();

  // members が読み込めない場合は処理終了
  if (members.length === 0) {
    console.log('no members.');
    console.log('finish get replies.');
    return;
  }

  // ファイルバックアップ
  googleDrive.backupFile(channelsFolderId, SpreadSheetType.Replies);

  // replies 保存先
  const bufferReplies: Reply[] = [];

  // replies 対象 messages をロード
  const messages = getMessages(channelsFolderId, latestTs);

  for (const message of messages) {
    // replies 取得
    const responseReplies = slackApiClient.getReplies(channelId, message.ts);

    const replies = slackTranslator.translateToReplies(
      responseReplies,
      members
    );

    const updatedReplies = replies.filter(
      (upadatedReply) =>
        Number(upadatedReply.ts) >= Number(latestTs) ||
        (upadatedReply.isEdited ? Number(upadatedReply.editedTs) : 0) >=
          Number(latestTs)
    );

    for (const reply of updatedReplies) {
      bufferReplies.push(reply);
    }
  }

  // JSON を保存
  const json = JSON.stringify(bufferReplies, null, '\t');
  const currentDate = dateUtil.getCurrentDateString();
  googleDrive.savaBlobFromString(jsonFolderId, currentDate + '_replies', json);

  // Repliesを２次元配列に変換
  const arrayReplies = slackTranslator.translateRepliesToArrays(bufferReplies);

  // Replies保存

  spreadSheetManager.update(
    channelsFolderId,
    SpreadSheetType.Replies,
    arrayReplies
  );

  // ファイルダウンロード
  bufferReplies.forEach((reply) => {
    if (reply.files) {
      const files = JSON.parse(reply.files);
      for (const file of files) {
        if (file.downloadUrl && file.downloadUrl !== '') {
          slackApiClient.downloadFile(fileFolderId, file.downloadUrl, file.id);
        }
      }
    }
  });

  // replies の実行時間をステータスに保存する
  spreadSheetManager.update(
    propertyUtil.getProperty(PropertyType.SystemFolerId),
    SpreadSheetType.RepliesStatus,
    [[channelId, currentTs, currentDateTime]]
  );

  console.log('finish get replies.');
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

  // members スプレッドシートが存在しない場合は空配列を返す
  if (!spreadSheetManager.exists(memberFolderId, SpreadSheetType.Members)) {
    return [];
  }

  // メンバー一覧をロード
  const arrayMembers = spreadSheetManager.load(
    memberFolderId,
    SpreadSheetType.Members
  );

  // メンバー一覧を変換してリターン
  return slackTranslator.translateArraysToMembers(arrayMembers);
};

const getMessages = (channelsFolderId: string, latestTs: string): Message[] => {
  // 初期化
  const slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // messages をロード
  const arrayMessages = spreadSheetManager.load(
    channelsFolderId,
    SpreadSheetType.Messages
  );

  // messages をプログラムで扱える型に変換
  const messages = slackTranslator.translateArraysToMessages(arrayMessages);

  // replies のある messages を取得
  const repliesMessages = messages.filter(
    (message) =>
      message.replyCount > 0 &&
      (Number(message.ts) >= Number(latestTs) ||
        (message.latestReplyTs === ''
          ? 0
          : Number(message.latestReplyTs) >= Number(latestTs)))
  );

  return repliesMessages;
};

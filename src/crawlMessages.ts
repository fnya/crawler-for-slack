import { container } from './inversify.config';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import { SpreadSheetType } from '../../common-lib-for-slack/dist/lib/types/SpreadSheetType';
import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';
import { SpreadSheetManager } from '../../common-lib-for-slack/dist/lib/util/SpreadSheetManager';
import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
import { PropertyUtil } from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';
import { Member } from '../../common-lib-for-slack/dist/lib/entity/Member';
import { GoogleDrive } from '../../common-lib-for-slack/dist/lib/util/GoogleDrive';
import { FolderType } from '../../common-lib-for-slack/dist/lib/types/FolderType';

export const crawlMessages = () => {
  console.log('start get messages.');

  // 初期化
  const slackTranslator = new SlackTranslator();
  const iPropertyUtil: IPropertyUtil = new PropertyUtil();
  // SlackApiClient のインスタンス取得
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  // SpreadSheetManager のインスタンス取得
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );
  // GoogleDrive のインスタンス取得
  const googleDrive = container.get<GoogleDrive>(Types.GoogleDrive);

  const channelId = 'G019E90NVPH';

  // Slack API からMessages取得
  const responseMessages = slackApiClient.getMessages(channelId);

  const messages = slackTranslator.translateToMessages(
    responseMessages,
    getMembers()
  );

  // 保存先準備
  const messagesFolderId = googleDrive.createFolderOrGetFolderId(
    iPropertyUtil.getProperty(PropertyType.MembersFolerId),
    FolderType.Messages
  );
  const channelsFolderId = googleDrive.createFolderOrGetFolderId(
    messagesFolderId,
    channelId
  );

  // Messagesを保存形式に変換
  const arrayMessages = slackTranslator.translateMessagesToArrays(messages);

  // Messages用スプレッドシート準備
  spreadSheetManager.createIfSpreadSheetDoesNotExist(
    channelsFolderId,
    SpreadSheetType.Messages
  );

  // Messages保存
  spreadSheetManager.saveMessages(
    channelsFolderId,
    SpreadSheetType.Messages,
    arrayMessages
  );

  // ダウンロード先フォルダ作成
  const fileFolderId = googleDrive.createFolderOrGetFolderId(
    channelsFolderId,
    FolderType.Files
  );

  // ファイルダウンロード
  messages.forEach((message) => {
    if (message.files) {
      const files = JSON.parse(message.files);
      for (const file of files) {
        if (file.downloadUrl && file.downloadUrl !== '') {
          slackApiClient.downloadFile(fileFolderId, file.downloadUrl, file.id);
        }
      }
    }
  });

  console.log('end get messages.');
};

const getMembers = (): Member[] => {
  // 初期化
  const iPropertyUtil: IPropertyUtil = new PropertyUtil();
  const slackTranslator = new SlackTranslator();
  // SpreadSheetManager のインスタンス取得
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  const memberFolderId = iPropertyUtil.getProperty(PropertyType.MembersFolerId);

  const arrayMembers = spreadSheetManager.loadSpreadSheet(
    memberFolderId,
    SpreadSheetType.Members
  );

  return slackTranslator.translateArraysToMembers(arrayMembers);
};

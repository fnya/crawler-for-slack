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

// TODO ここの定義はよくない
const slackTranslator = new SlackTranslator();
const iPropertyUtil: IPropertyUtil = new PropertyUtil();

export const crawlMessages = () => {
  console.log('start get messages.');

  // MS 部
  const channelId = 'C01152A36RZ';

  // SlackApiClient のインスタンス取得
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);

  // Slack API からMessages取得
  const responseMessages = slackApiClient.getMessages(channelId);

  const messages = slackTranslator.translateToMessages(
    responseMessages,
    getMembers()
  );
  // console.log(JSON.stringify(messages, null, '\t'));

  const messagesFolderId = createMessagesFolderOrGetFolderId();

  const channelsFolderId = createChannelsFolderOrGetFolderId(
    messagesFolderId,
    channelId
  );

  // console.log(channelsFolderId);

  // Messagesを保存形式に変換
  const arrayMessages = slackTranslator.translateMessagesToArrays(messages);

  // SpreadSheetManager のインスタンス取得
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // Messages用スプレッドシート準備
  if (
    !spreadSheetManager.existsSpreadSheet(
      channelsFolderId,
      SpreadSheetType.Messages
    )
  ) {
    spreadSheetManager.createSpreadSheet(
      channelsFolderId,
      SpreadSheetType.Messages
    );
  }

  // Messages保存
  spreadSheetManager.saveMessages(
    channelsFolderId,
    SpreadSheetType.Messages,
    arrayMessages
  );

  console.log('end get messages.');
};

const createMessagesFolderOrGetFolderId = (): string => {
  // GoogleDrive のインスタンス取得
  const googleDrive = container.get<GoogleDrive>(Types.GoogleDrive);

  let messagesFolderId: string;

  if (
    googleDrive.existFolder(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      FolderType.Messages
    )
  ) {
    messagesFolderId = googleDrive.getFolderId(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      FolderType.Messages
    );
  } else {
    messagesFolderId = googleDrive.createFolder(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      FolderType.Messages
    );
  }

  return messagesFolderId;
};

const createChannelsFolderOrGetFolderId = (
  messagesFolderId: string,
  channelId: string
): string => {
  // GoogleDrive のインスタンス取得
  const googleDrive = container.get<GoogleDrive>(Types.GoogleDrive);

  let channelsFolderId: string;

  if (googleDrive.existFolder(messagesFolderId, channelId)) {
    channelsFolderId = googleDrive.getFolderId(messagesFolderId, channelId);
  } else {
    channelsFolderId = googleDrive.createFolder(messagesFolderId, channelId);
  }

  return channelsFolderId;
};

const getMembers = (): Member[] => {
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

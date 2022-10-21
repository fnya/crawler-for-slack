/* eslint-disable no-unused-vars */
import { container } from './inversify.config';
import Types from '@common-lib-for-slack/lib/types/Types';
import { PropertyUtil } from '@common-lib-for-slack/lib/util/PropertyUtil';
import PropertyType from '@common-lib-for-slack/lib/types/PropertyType';
import { GoogleDrive } from '@common-lib-for-slack/lib/util/GoogleDrive';
import { FolderType } from '@common-lib-for-slack/lib/types/FolderType';

/**
 * Crawer for Slack の初期化を行う
 */
export function initialize() {
  console.log('start initialize.');

  // 初期化
  const googleDrive = container.get<GoogleDrive>(Types.GoogleDrive);
  const propertyUtil = container.get<PropertyUtil>(Types.PropertyUtil);

  // slack フォルダ作成
  let slackFolderId: string;
  if (googleDrive.existFolderInRoot(FolderType.Slack)) {
    slackFolderId = googleDrive.getFolderIdInRoot(FolderType.Slack);
  } else {
    slackFolderId = googleDrive.createFolderInRoot(FolderType.Slack);
  }

  // members フォルダ作成
  let membersFolderId: string;
  if (googleDrive.existFolder(slackFolderId, FolderType.Members)) {
    membersFolderId = googleDrive.getFolderId(
      slackFolderId,
      FolderType.Members
    );
  } else {
    membersFolderId = googleDrive.createFolder(
      slackFolderId,
      FolderType.Members
    );
  }

  // admin フォルダ作成
  let adminFolderId: string;
  if (googleDrive.existFolder(slackFolderId, FolderType.Admin)) {
    adminFolderId = googleDrive.getFolderId(slackFolderId, FolderType.Admin);
  } else {
    adminFolderId = googleDrive.createFolder(slackFolderId, FolderType.Admin);
  }

  // system フォルダ作成
  let systemFolderId: string;
  if (googleDrive.existFolder(slackFolderId, FolderType.System)) {
    systemFolderId = googleDrive.getFolderId(slackFolderId, FolderType.System);
  } else {
    systemFolderId = googleDrive.createFolder(slackFolderId, FolderType.System);
  }

  // logs フォルダ作成
  let logsFolderId: string;
  if (googleDrive.existFolder(systemFolderId, FolderType.Logs)) {
    logsFolderId = googleDrive.getFolderId(systemFolderId, FolderType.Logs);
  } else {
    logsFolderId = googleDrive.createFolder(systemFolderId, FolderType.Logs);
  }

  // script property 作成
  propertyUtil.setProperty(PropertyType.SlackFolerId, slackFolderId);
  propertyUtil.setProperty(PropertyType.MembersFolerId, membersFolderId);
  propertyUtil.setProperty(PropertyType.AdminFolerId, adminFolderId);
  propertyUtil.setProperty(PropertyType.SystemFolerId, systemFolderId);
  propertyUtil.setProperty(PropertyType.LogFolerId, logsFolderId);
  propertyUtil.setProperty(PropertyType.SlackApiToken, '');

  console.log(
    'スクリプトプロパティの SlackApiToken は空のため、Slack API からトークンを取得して設定してください。'
  );

  console.log('finish initialize.');
}

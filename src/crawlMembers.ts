import { container } from './inversify.config';
import Types from '@common-lib-for-slack/lib/types/Types';
import { SpreadSheetType } from '@common-lib-for-slack/lib/types/SpreadSheetType';
import { SlackTranslator } from '@common-lib-for-slack/lib/util/SlackTranslator';
import { SlackApiClient } from '@common-lib-for-slack/lib/util/SlackApiClient';
import { SpreadSheetManager } from '@common-lib-for-slack/lib/util/SpreadSheetManager';
import { PropertyUtil } from '@common-lib-for-slack/lib/util/PropertyUtil';
import PropertyType from '@common-lib-for-slack/lib/types/PropertyType';

export const crawlMembers = () => {
  console.log('start get members.');

  // 初期化
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  const slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  const propertyUtil = container.get<PropertyUtil>(Types.PropertyUtil);

  // Slack API からMembers取得
  const responseMembers = slackApiClient.getMembers();

  // Membersを保存形式に変換
  const members = slackTranslator.translateToMembers(responseMembers);
  const arrayMembers = slackTranslator.translateMembersToArrays(members);

  // SpreadSheetManager のインスタンス取得
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // Members用スプレッドシート準備
  if (
    !spreadSheetManager.exists(
      propertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Members
    )
  ) {
    spreadSheetManager.create(
      propertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Members
    );
  }

  // Members保存
  spreadSheetManager.save(
    propertyUtil.getProperty(PropertyType.MembersFolerId),
    SpreadSheetType.Members,
    arrayMembers
  );

  console.log('end get members.');
};

import { container } from './inversify.config';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import { SpreadSheetType } from '../../common-lib-for-slack/dist/lib/types/SpreadSheetType';
import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';
import { SpreadSheetManager } from '../../common-lib-for-slack/dist/lib/util/SpreadSheetManager';
import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
import { PropertyUtil } from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';

export const crawlMembers = () => {
  console.log('start get members.');

  // SlackApiClient のインスタンス取得
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);

  // Slack API からMembers取得
  const responseMembers = slackApiClient.getMembers();

  // Membersを保存形式に変換
  const slackTranslator = new SlackTranslator();
  const members = slackTranslator.translateToMembers(responseMembers);
  const arrayMembers = slackTranslator.translateMembersToArrays(members);

  // SpreadSheetManager のインスタンス取得
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // Members用スプレッドシート準備
  const iPropertyUtil: IPropertyUtil = new PropertyUtil();
  if (
    !spreadSheetManager.existsSpreadSheet(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Members
    )
  ) {
    spreadSheetManager.createSpreadSheet(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Members
    );
  }

  // Members保存
  spreadSheetManager.saveMembers(
    iPropertyUtil.getProperty(PropertyType.MembersFolerId),
    SpreadSheetType.Members,
    arrayMembers
  );

  console.log('end get members.');
};

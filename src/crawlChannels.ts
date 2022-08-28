import { container } from './inversify.config';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import { SpreadSheetType } from '../../common-lib-for-slack/dist/lib/types/SpreadSheetType';
import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';
import { SpreadSheetManager } from '../../common-lib-for-slack/dist/lib/util/SpreadSheetManager';
import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
import { PropertyUtil } from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';

export const crawlChannels = () => {
  console.log('start get channels.');

  // SlackApiClient のインスタンス取得
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);

  // Slack API からChannels取得
  const responseChannels = slackApiClient.getChannels();

  // Channelsを保存形式に変換
  const slackTranslator = new SlackTranslator();
  const channels = slackTranslator.translateToChannels(responseChannels);
  const arrayChannels = slackTranslator.translateChannelsToArrays(channels);

  // SpreadSheetManager のインスタンス取得
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );

  // Channel用スプレッドシート準備
  const iPropertyUtil: IPropertyUtil = new PropertyUtil();
  if (
    !spreadSheetManager.existsSpreadSheet(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    )
  ) {
    spreadSheetManager.createSpreadSheet(
      iPropertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    );
  }

  // Channels保存
  spreadSheetManager.saveChannels(
    iPropertyUtil.getProperty(PropertyType.MembersFolerId),
    SpreadSheetType.Channels,
    arrayChannels
  );

  console.log('end get channels.');
};

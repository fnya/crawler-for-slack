import { container } from './inversify.config';
import { PermissionTypes } from '../../common-lib-for-slack/dist/lib/types/PermissionTypes';
import { PropertyUtil } from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';
import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
import { SpreadSheetManager } from '../../common-lib-for-slack/dist/lib/util/SpreadSheetManager';
import { SpreadSheetType } from '../../common-lib-for-slack/dist/lib/types/SpreadSheetType';
import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';

export const crawlChannels = () => {
  console.log('start get channels.');

  // 初期化
  const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  const slackTranslator = container.get<SlackTranslator>(Types.SlackTranslator);
  const spreadSheetManager = container.get<SpreadSheetManager>(
    Types.SpreadSheetManager
  );
  const propertyUtil = container.get<PropertyUtil>(Types.PropertyUtil);

  // Slack API からChannels取得
  const permissions = [
    PermissionTypes.PrivateChannel,
    PermissionTypes.PublicChannel,
  ];
  const responseChannels = slackApiClient.getChannels(permissions);

  // Channelsを保存形式に変換
  const channels = slackTranslator.translateToChannels(responseChannels);
  const arrayChannels = slackTranslator.translateChannelsToArrays(channels);

  // Channels用スプレッドシート準備
  if (
    !spreadSheetManager.exists(
      propertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    )
  ) {
    spreadSheetManager.create(
      propertyUtil.getProperty(PropertyType.MembersFolerId),
      SpreadSheetType.Channels
    );
  }

  // Channels保存
  spreadSheetManager.save(
    propertyUtil.getProperty(PropertyType.MembersFolerId),
    SpreadSheetType.Channels,
    arrayChannels
  );

  console.log('end get channels.');
};

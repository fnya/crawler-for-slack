import { container } from './inversify.config';
import { PermissionTypes } from '@fnya/common-lib-for-slack/lib/types/PermissionTypes';
import { PropertyUtil } from '@fnya/common-lib-for-slack/lib/util/PropertyUtil';
import { SlackApiClient } from '@fnya/common-lib-for-slack/lib/util/SlackApiClient';
import { SlackTranslator } from '@fnya/common-lib-for-slack/lib/util/SlackTranslator';
import { SpreadSheetManager } from '@fnya/common-lib-for-slack/lib/util/SpreadSheetManager';
import { SpreadSheetType } from '@fnya/common-lib-for-slack/lib/types/SpreadSheetType';
import PropertyType from '@fnya/common-lib-for-slack/lib/types/PropertyType';
import Types from '@fnya/common-lib-for-slack/lib/types/Types';

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

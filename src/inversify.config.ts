import { Container } from 'inversify';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';

// インターフェース
import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
import { IDateUtil } from '../../common-lib-for-slack/dist/lib/interface/IDateUtil';
import { IGoogleDrive } from '../../common-lib-for-slack/dist/lib/interface/IGoogleDrive';
import { ISpreadSheetManager } from '../../common-lib-for-slack/dist/lib/interface/ISpreadSheetManager';
import { ISlackTranslator } from '../../common-lib-for-slack/dist/lib/interface/ISlackTranslator';

// 実装
import PropertyUtil from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';
import { GoogleDrive } from '../../common-lib-for-slack/dist/lib/util/GoogleDrive';
import { SpreadSheetManager } from '../../common-lib-for-slack/dist/lib/util/SpreadSheetManager';
import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
import { DateUtil } from '../../common-lib-for-slack/dist/lib/util/DateUtil';
import { JsonUtil } from '../../common-lib-for-slack/dist/lib/util/JsonUtil';
import { ChannelUtil } from '../../common-lib-for-slack/dist/lib/util/ChannelUtil';

export const container = new Container();

// for SlackApiClient
container.bind<SlackApiClient>(Types.SlackApiClient).to(SlackApiClient);
container.bind<IPropertyUtil>(Types.IPropertyUtil).to(PropertyUtil);
container.bind<IGoogleDrive>(Types.IGoogleDrive).to(GoogleDrive);

// for SpreadSheetManager
container
  .bind<SpreadSheetManager>(Types.SpreadSheetManager)
  .to(SpreadSheetManager);

// for GoogleDrive
container.bind<GoogleDrive>(Types.GoogleDrive).to(GoogleDrive);

// for SlackTranslator
container.bind<SlackTranslator>(Types.SlackTranslator).to(SlackTranslator);
container.bind<IDateUtil>(Types.IDateUtil).to(DateUtil);

// for DateUtil
container.bind<DateUtil>(Types.DateUtil).to(DateUtil);

// for JsonUtil
container.bind<JsonUtil>(Types.JsonUtil).to(JsonUtil);

// for PropertyUtil
container.bind<PropertyUtil>(Types.PropertyUtil).to(PropertyUtil);

// for ChannelUtil
container
  .bind<ISpreadSheetManager>(Types.ISpreadSheetManager)
  .to(SpreadSheetManager);
container.bind<ISlackTranslator>(Types.ISlackTranslator).to(SlackTranslator);
container.bind<ChannelUtil>(Types.ChannelUtil).to(ChannelUtil);

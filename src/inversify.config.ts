import { Container } from 'inversify';
import { ChannelUtil } from '@fnya/common-lib-for-slack/lib/util/ChannelUtil';
import { DateUtil } from '@fnya/common-lib-for-slack/lib/util/DateUtil';
import { GoogleDrive } from '@fnya/common-lib-for-slack/lib/util/GoogleDrive';
import { SlackApiClient } from '@fnya/common-lib-for-slack/lib/util/SlackApiClient';
import { SlackTranslator } from '@fnya/common-lib-for-slack/lib/util/SlackTranslator';
import { SpreadSheetManager } from '@fnya/common-lib-for-slack/lib/util/SpreadSheetManager';
import PropertyUtil from '@fnya/common-lib-for-slack/lib/util/PropertyUtil';
import Types from '@fnya/common-lib-for-slack/lib/types/Types';

export const container = new Container();

// for SlackApiClient
container.bind<SlackApiClient>(Types.SlackApiClient).to(SlackApiClient);
container.bind<PropertyUtil>(Types.PropertyUtil).to(PropertyUtil);
container.bind<GoogleDrive>(Types.GoogleDrive).to(GoogleDrive);

// for SpreadSheetManager
container
  .bind<SpreadSheetManager>(Types.SpreadSheetManager)
  .to(SpreadSheetManager);

// for GoogleDrive
container.bind<GoogleDrive>(Types.GoogleDrive).to(GoogleDrive);

// for SlackTranslator
container.bind<SlackTranslator>(Types.SlackTranslator).to(SlackTranslator);
container.bind<DateUtil>(Types.DateUtil).to(DateUtil);

// for DateUtil
container.bind<DateUtil>(Types.DateUtil).to(DateUtil);

// for PropertyUtil
container.bind<PropertyUtil>(Types.PropertyUtil).to(PropertyUtil);

// for ChannelUtil
container
  .bind<SpreadSheetManager>(Types.SpreadSheetManager)
  .to(SpreadSheetManager);
container.bind<SlackTranslator>(Types.SlackTranslator).to(SlackTranslator);
container.bind<ChannelUtil>(Types.ChannelUtil).to(ChannelUtil);

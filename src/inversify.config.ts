import { Container } from 'inversify';
import { ChannelUtil } from '@fnya/common-lib-for-slack/lib/util/ChannelUtil';
import { DateUtil } from '@fnya/common-lib-for-slack/lib/util/DateUtil';
import { GoogleDrive } from '@fnya/common-lib-for-slack/lib/util/GoogleDrive';
import { SlackApiClient } from '@fnya/common-lib-for-slack/lib/util/SlackApiClient';
import { SlackTranslator } from '@fnya/common-lib-for-slack/lib/util/SlackTranslator';
import { SpreadSheetManager } from '@fnya/common-lib-for-slack/lib/util/SpreadSheetManager';
import { UrlFetchAppUtil } from '@fnya/common-lib-for-slack/lib/util/UrlFetchAppUtil';
import PropertyUtil from '@fnya/common-lib-for-slack/lib/util/PropertyUtil';
import Types from '@fnya/common-lib-for-slack/lib/types/Types';

export const container = new Container();

container.bind<ChannelUtil>(Types.ChannelUtil).to(ChannelUtil);
container.bind<DateUtil>(Types.DateUtil).to(DateUtil);
container.bind<GoogleDrive>(Types.GoogleDrive).to(GoogleDrive);
container.bind<PropertyUtil>(Types.PropertyUtil).to(PropertyUtil);
container.bind<SlackApiClient>(Types.SlackApiClient).to(SlackApiClient);
container.bind<SlackTranslator>(Types.SlackTranslator).to(SlackTranslator);
container.bind<UrlFetchAppUtil>(Types.UrlFetchAppUtil).to(UrlFetchAppUtil);
container
  .bind<SpreadSheetManager>(Types.SpreadSheetManager)
  .to(SpreadSheetManager);

import { Container } from 'inversify';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
import PropertyUtil from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';

export const container = new Container();

// for SlackApiClient
container.bind<SlackApiClient>(Types.SlackApiClient).to(SlackApiClient);
container.bind<IPropertyUtil>(Types.IPropertyUtil).to(PropertyUtil);

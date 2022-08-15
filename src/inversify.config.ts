import { Container } from 'inversify';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import { IPropertyUtil } from '../../common-lib-for-slack/dist/lib/interface/IPropertyUtil';
import { ISlackApiClient } from '../../common-lib-for-slack/dist/lib/interface/ISlackApiClient';
import PropertyUtil from '../../common-lib-for-slack/dist/lib/util/PropertyUtil';
import SlackApiClient from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';

export const container = new Container();
container.bind<IPropertyUtil>(Types.IPropertyUtil).to(PropertyUtil);
container.bind<ISlackApiClient>(Types.ISlackApiClient).to(SlackApiClient);

import { container } from './inversify.config';
import Types from '../../common-lib-for-slack/dist/lib/types/Types';
import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';
import { ISlackApiClient } from '../../common-lib-for-slack/dist/lib/interface/ISlackApiClient';

export default function test() {
  const slackApiClient = container.get<ISlackApiClient>(Types.ISlackApiClient);
  const adminFolerId = slackApiClient.getProperty(PropertyType.AdminFolerId);

  console.log(adminFolerId);
}

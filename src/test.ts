// import { container } from './inversify.config';
// import Types from '../../common-lib-for-slack/dist/lib/types/Types';
// import { SlackApiType } from '../../common-lib-for-slack/dist/lib/types/SlackApiType';
// import { SlackTranslator } from '../../common-lib-for-slack/dist/lib/util/SlackTranslator';
// import PropertyType from '../../common-lib-for-slack/dist/lib/types/PropertyType';
// import { SlackApiClient } from '../../common-lib-for-slack/dist/lib/util/SlackApiClient';

export default function test() {
  console.log('test');
  // const slackApiClient = container.get<SlackApiClient>(Types.SlackApiClient);
  // const messages = slackApiClient.getMessages('C01152A36RZ');
  // for (const m of messages) {
  //   const date = new Date(Number(m.ts) * 1000);
  //   console.log(date.toLocaleString() + ':' + m.text);
  // }
  // const replies = slackApiClient.getReplies(
  //   'C01152A36RZ',
  //   '1661481538.065389'
  // );
  // for (const m of replies) {
  //   const date = new Date(Number(m.ts) * 1000);
  //   console.log(date.toLocaleString() + ':' + m.text);
  // }
}
